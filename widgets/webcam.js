const searchParams = new URLSearchParams(window.location.search);
console.log(searchParams.toString());

const source = searchParams.get("source") || "";

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
            if (device.label === source) {
              console.log("Device", deviceId, " matches");
              id = device.deviceId;
            }
          });
        let videoConstraints = true;

        //        if (source) {
        videoConstraints = {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
        };
        if (id) {
          videoConstraints.deviceId = { exact: id };
        }
        //        }
        var constraints = { audio: false, video: videoConstraints };

        console.log("Media constraints:", constraints);

        async function success(stream) {
          camera.srcObject = stream;
          camera.play();
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
