const { ipcRenderer, desktopCapturer } = require("electron");

const searchParams = new URLSearchParams(window.location.search);
console.log(searchParams.toString());

const deviceId = searchParams.get("deviceId") || "";
const size = searchParams.get("size") || "s";

console.log(deviceId);
console.log(size);

let model;
async function frameLandmarks() {
  const predictions = await model.estimateHands(camera, true);
  if (predictions.length > 0) {
    const indexFinger = predictions[0].annotations.indexFinger;
    const coordinates = indexFinger[indexFinger.length - 1];
    ipcRenderer.send("indexFinger", indexFinger);
  }
  requestAnimationFrame(frameLandmarks);
}

window.addEventListener(
  "load",
  async function () {
    navigator.mediaDevices
      .enumerateDevices()
      .then(async (devices) => {
        let id = "";
        devices
          .filter((device) => device.kind === "videoinput")
          .forEach((device) => {
            console.log(device);
            console.log(
              `${device.kind}: ${device.label} id = ${device.deviceId}`
            );
            if (device.label === deviceId) {
              console.log("Device", deviceId, " matches");
              id = device.deviceId;
            }
          });
        let videoConstraints = true;

        if (deviceId) {
          videoConstraints = {
            deviceId: { exact: id },
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          };
        }
        var constraints = { audio: false, video: videoConstraints };

        console.log("Media constraints:", constraints);

        async function success(stream) {
          camera.srcObject = stream;
          camera.play();

//          model = await handpose.load();
//          console.log("model", model);
//          frameLandmarks();
        }

        function failure(error) {
          console.error(error);
        }

        if (navigator.getUserMedia) {
          navigator.getUserMedia(constraints, success, failure);
        } else {
          console.error("Your browser does not support getUserMedia()");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  false
);
