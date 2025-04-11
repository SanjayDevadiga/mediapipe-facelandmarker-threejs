import * as THREE from "three";
import { FaceLandmarker } from "@mediapipe/tasks-vision"; 

export default class FaceMask {
    constructor(scene, camera, aspectRatio) {
        this.scene = scene;
        this.camera = camera;
        this.aspectRatio = aspectRatio;

        // Landmark points and lines
        this.landmarkPoints = new THREE.Group();
        this.landmarkLines = new THREE.Group();
        this.scene.add(this.landmarkPoints);
        this.scene.add(this.landmarkLines);

        // Landmark material for points and lines
        this.pointMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.01 });
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    }

    updateLandmarks(landmarks) {
        // Clear previous points and lines
        this.landmarkPoints.clear();
        this.landmarkLines.clear();
    
        // Create points for each landmark
        const pointsGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(landmarks.length * 3);
    
        landmarks.forEach((lm, i) => {
            // Use convertNormalizedToScreen to get adjusted x and y values
            const [x, y] = this.convertNormalizedToScreen(lm.x, lm.y);
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = 4; // Keep the previous depth adjustment for z
        });
    
        pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const points = new THREE.Points(pointsGeometry, this.pointMaterial);
        this.landmarkPoints.add(points);
    
        // Draw connections based on FACE_LANDMARKS_TESSELATION
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
    
        const customTessellation = Array.from(FaceLandmarker.FACE_LANDMARKS_TESSELATION);
    
        customTessellation.forEach(({ start, end }) => {
            const [x1, y1] = this.convertNormalizedToScreen(landmarks[start].x, landmarks[start].y);
            const [x2, y2] = this.convertNormalizedToScreen(landmarks[end].x, landmarks[end].y);
        
            linePositions.push
            (
                x1, y1, 4, 
                x2, y2, 4
            );
        });
    
        lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
        const lines = new THREE.LineSegments(lineGeometry, this.lineMaterial);
        this.landmarkLines.add(lines);
    }

    convertNormalizedToScreen(normX, normY) {
        let x = normX - 0.5;
        let y = -(normY - 0.5);

        if (this.camera.isOrthographicCamera) {
            const frustumSize = this.camera.frustumSize;
            x = x * frustumSize * this.aspectRatio;
            y = y * frustumSize;
        } else {
            x = x * this.aspectRatio * 2 * (this.camera.fov/100);  
            y = y * 2 * (this.camera.fov/100);
        }

        return [x, y];
    }

    update(landmarks) {
        this.updateLandmarks(landmarks);
    }
}
