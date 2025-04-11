
import * as THREE from 'three';

export class Ball {
    constructor(scene, camera, aspectRatio) {
        this.scene = scene;
        this.camera = camera;
        this.aspectRatio = aspectRatio;
        
        // Create a ball
        const geometry = new THREE.SphereGeometry(0.05, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        
        this.ball = new THREE.Mesh(geometry, material);
        this.ball.position.set(0, 0, 4); 
        this.scene.add(this.ball);
    }

    updateBallPosition(landmarks) {
        const [x, y] = this.convertNormalizedToScreen(landmarks[1].x, landmarks[1].y); // Use the nose landmark for position
        this.ball.position.set(x, y, 4); // Set the ball's position in 3D space
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
        this.updateBallPosition(landmarks);
    }
}