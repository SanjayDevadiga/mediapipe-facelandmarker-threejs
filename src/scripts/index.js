import { SceneManager } from "./three/sceneManager.js";
import { createFaceLandmarker } from "./components/initModel.js";

let webcamRunning = false;
let sceneManager = null;

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");

let faceLandmarker = await createFaceLandmarker();
enableCam();

// Enable the live webcam view and start detection.
function enableCam() {
  if (!faceLandmarker) {
      console.log("Wait! faceLandmarker not loaded yet.");
      return;
  }
  webcamRunning = true;

  // getUsermedia parameters.
  const constraints = {
      video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      sceneManager = new SceneManager();
      video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let lastFrameTime = performance.now(); 
let fpsDisplay = document.getElementById("fpsDisplay");

async function predictWebcam() {
    const ratio = video.srcObject.getVideoTracks()[0].getSettings().aspectRatio;

    canvasElement.style.width = window.innerHeight * ratio + "px";
    canvasElement.style.height = window.innerHeight + "px";

    canvasElement.width = video.clientWidth; 
    canvasElement.height = video.clientHeight;

    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        sceneManager.update(faceLandmarker.detectForVideo(video, startTimeMs).faceLandmarks[0]);

        // FPS Calculation
        let now = performance.now();
        let deltaTime = (now - lastFrameTime) / 1000; // Convert to seconds
        let fps = 1 / deltaTime;
        lastFrameTime = now;

        // Display FPS
        if (fpsDisplay) {
            fpsDisplay.innerText = `FPS: ${fps.toFixed(2)}`;
        } else {
            console.log(`FPS: ${fps.toFixed(2)}`);
        }
    }

    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}