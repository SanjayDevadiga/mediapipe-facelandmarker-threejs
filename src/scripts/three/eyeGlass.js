import * as THREE from 'three';
import { loadModel } from '../helper/utils';

export class EyeGlasses {
    constructor(scene, camera, aspectRatio) {
        this.scene = scene;
        this.camera = camera;
        this.aspectRatio = aspectRatio;
        this.loadGlasses();
    }

    async loadGlasses() {
        this.glassObject = await loadModel("models/black-glasses/scene.gltf");
        
        const bbox = new THREE.Box3().setFromObject(this.glassObject);
        const size = bbox.getSize(new THREE.Vector3());
        this.scaleFactor = size.x;

        this.glassObject.name = 'glasses';
        this.scene.add(this.glassObject);
    }

    updateGlassCoordinates(landmarks) {
        if (!this.glassObject) return;
    
        // Reference points
        const midEyes = landmarks[168];
        const leftEyeInnerCorner = landmarks[463];
        const rightEyeInnerCorner = landmarks[243];
        const noseBottom = landmarks[2];
        const leftEyeUpper1 = landmarks[264];
        const rightEyeUpper1 = landmarks[34];
    
        // Scale based on distance between the eyes
        const eyeDist = Math.sqrt(
            Math.pow(leftEyeUpper1.x - rightEyeUpper1.x, 2) +
            Math.pow(leftEyeUpper1.y - rightEyeUpper1.y, 2) +
            Math.pow(leftEyeUpper1.z - rightEyeUpper1.z, 2)
        );
        const scale = eyeDist / this.scaleFactor;

        const scaleUp = 2.2;
        this.glassObject.scale.set(scale * scaleUp, scale * scaleUp, scale * scaleUp);

        const [x, y] = this.convertNormalizedToScreen(midEyes.x, midEyes.y);
        this.glassObject.position.set(x, y-0.02, 4);
    
        // Rotation setup with vertical and horizontal vectors
        let upVector = new THREE.Vector3(
            midEyes.x - noseBottom.x,
            midEyes.y - noseBottom.y,
            midEyes.z - noseBottom.z
        ).normalize();
    
        let sideVector = new THREE.Vector3(
            leftEyeInnerCorner.x - rightEyeInnerCorner.x,
            leftEyeInnerCorner.y - rightEyeInnerCorner.y,
            leftEyeInnerCorner.z - rightEyeInnerCorner.z
        ).normalize();
    
        // Calculate rotation around z-axis
        let zRot = (new THREE.Vector3(1, 0, 0)).angleTo(
            upVector.clone().projectOnPlane(new THREE.Vector3(0, 0, 1))
        ) - Math.PI / 2;
    
        // Calculate rotation around x-axis
        let xRot = Math.PI / 2 - (new THREE.Vector3(0, 0, 1)).angleTo(
            upVector.clone().projectOnPlane(new THREE.Vector3(1, 0, 0))
        );
    
        // Calculate rotation around y-axis
        let yRot = (new THREE.Vector3(sideVector.x, 0, sideVector.z))
            .angleTo(new THREE.Vector3(0, 0, 1)) - Math.PI / 2;
    
        // Set rotations
        this.glassObject.rotation.set(-xRot, -yRot, zRot);
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
        this.updateGlassCoordinates(landmarks);
    }
}