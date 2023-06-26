let video = document.getElementById("video");
let gifCanvas = document.getElementById("gifCanvas");
let photoCanvas = document.getElementById("photoCanvas");
let snap = document.getElementById("snap");
let retake = document.getElementById("retake");
let downloadBtn = document.getElementById("download");
let frameThickness = 10;
let frameColor = "#ffffff";

let context = photoCanvas.getContext("2d");
window.addEventListener("resize", handleResize);

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
      // switchCamera();
    });
}

let currentCamera = 'user'; // Start with the user-facing camera

document.getElementById("switchCamera").addEventListener("click", function () {
    if (currentCamera === 'user') {
        currentCamera = 'environment';
    } else {
        currentCamera = 'user';
    }
    switchCamera();
});


  
  function switchCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Only stop tracks if a stream exists
        // if(video.srcObject) {
        //     // Stop all video streams.
        //     video.srcObject.getTracks().forEach(track => track.stop());
        // }

        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: currentCamera
                }
            })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            });
    }

}

// Call switchCamera once at the start to initialise the video.


console.log("connected");

function drawFrame(ctx) {
  let relativeFrameThickness = frameThickness;
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, ctx.canvas.width, relativeFrameThickness); // Top border
  ctx.fillRect(
    0,
    ctx.canvas.height - relativeFrameThickness,
    ctx.canvas.width,
    relativeFrameThickness + 100
  ); // Bottom border
  ctx.fillRect(0, 0, relativeFrameThickness, ctx.canvas.height); // Left border
  ctx.fillRect(
    ctx.canvas.width - relativeFrameThickness,
    0,
    relativeFrameThickness,
    ctx.canvas.height
  ); // Right border
}

function handleResize() {
  // Redraw the frames
  drawFrame(context); // Redraw the frames for photoCanvas
  // gifler("fish.gif").frames(
  //   gifCanvas,
  //   function (ctx, frame) {
  //     ctx.drawImage(frame.buffer, 0, 0, gifCanvas.width, gifCanvas.height);
  //     drawFrame(ctx); // For gifCanvas
  //   },
  //   true
  // );
}

// Get access to the camera


video.addEventListener("loadedmetadata", function () {
  let dpr = window.devicePixelRatio || 1;
  
  // get dimensions from parent container
  const container = video.parentElement;
  photoCanvas.width = container.offsetWidth * dpr;
  photoCanvas.height = container.offsetHeight * dpr;
  gifCanvas.width = container.offsetWidth * dpr;
  gifCanvas.height = container.offsetHeight * dpr;
  
  context = photoCanvas.getContext("2d");
  context.scale(dpr, dpr);
  handleResize()
});

// Handle gif overlay with gifler
gifler("fish.gif").frames(
  gifCanvas,
  function (ctx, frame) {
    ctx.canvas.width = gifCanvas.width;
    ctx.canvas.height = gifCanvas.height;
    ctx.drawImage(frame.buffer, 0, 0, gifCanvas.width, gifCanvas.height);
    // Draw the Polaroid frame
    let frameThickness = 10; // Adjust as needed
    let frameColor = "#ffffff"; // Adjust as needed
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, gifCanvas.width, frameThickness); // Top border
    ctx.fillRect(0, gifCanvas.height - 400, gifCanvas.width, 400); // Bottom border
    ctx.fillRect(0, 0, frameThickness, gifCanvas.height); // Left border
    ctx.fillRect(
      gifCanvas.width - frameThickness,
      0,
      frameThickness,
      gifCanvas.height
    ); // Right border
  },
  true
);
// Trigger photo take
snap.addEventListener("click", function () {
  photoCanvas.width = video.videoWidth;
  photoCanvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
  context.drawImage(gifCanvas, 0, 0, photoCanvas.width, photoCanvas.height);


  photoCanvas.style.display = "block";
  container.classList.add("scale-down");
  video.style.display = "none";
  gifCanvas.style.display = "none";
  snap.style.display = "none";
  retake.style.display = "block";
  downloadBtn.style.display = "block";
});

retake.addEventListener("click", function () {
  video.style.display = "block";
  gifCanvas.style.display = "block";
  photoCanvas.style.display = "none";
  snap.style.display = "block";
  retake.style.display = "none";
  downloadBtn.style.display = "none";
  container.classList.remove("scale-down");
});

downloadBtn.addEventListener("click", function () {
  let downloadUrl = photoCanvas.toDataURL("image/png");
  let link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "image.png";
  link.click();
});
