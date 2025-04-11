import * as THREE from 'three';
import FaceMask from './faceMask';
import { Ball } from './ball';
import { EyeGlasses } from './eyeGlass';

export class SceneManager {
    constructor() {
        this.canvas = document.getElementById('myCanvas');
        this.scene = new THREE.Scene();

        this.video = document.getElementById('webcam');
        this.aspectRatio = this.video.srcObject.getVideoTracks()[0].getSettings().aspectRatio;

        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.handleResize();    
        this.addFaceMask();
        this.addEyeGlasses();
        this.addBall();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, (window.innerHeight * this.aspectRatio) / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(window.innerHeight * this.aspectRatio, window.innerHeight);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.canvas.style.width = window.innerHeight * this.aspectRatio + "px";
            this.canvas.style.height = window.innerHeight + "px";

            this.canvas.width = this.video.videoWidth; 
            this.canvas.height = this.video.videoHeight;

            this.renderer.setSize(window.innerHeight * this.aspectRatio, window.innerHeight);
            this.camera.aspect = (window.innerHeight * this.aspectRatio) / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    addFaceMask() {
        this.faceMask = new FaceMask(this.scene, this.camera, this.aspectRatio);
    }

    addEyeGlasses() {
        this.eyeGlasses = new EyeGlasses(this.scene, this.camera, this.aspectRatio);
    }

    addBall() {
        this.ball = new Ball(this.scene, this.camera, this.aspectRatio);
    }

    update(landmarks) {
        if(landmarks) {
            this.faceMask.update(landmarks);
            this.eyeGlasses.update(landmarks);
            this.ball.update(landmarks);
            this.renderer.render(this.scene, this.camera);     
        }
    }
}