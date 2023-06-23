let video = document.getElementById("video");
let gifCanvas = document.getElementById("gifCanvas");
let photoCanvas = document.getElementById("photoCanvas");
let snap = document.getElementById("snap");
let retake = document.getElementById("retake");
let downloadBtn = document.getElementById("download");

let context = photoCanvas.getContext("2d");
window.addEventListener("resize", handleResize);



function drawFrame(ctx) {
  let relativeFrameThickness = frameThickness * (window.innerWidth / photoCanvas.width);
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, ctx.canvas.width, relativeFrameThickness); // Top border
  ctx.fillRect(0, ctx.canvas.height - relativeFrameThickness, ctx.canvas.width, relativeFrameThickness); // Bottom border
  ctx.fillRect(0, 0, relativeFrameThickness, ctx.canvas.height); // Left border
  ctx.fillRect(ctx.canvas.width - relativeFrameThickness, 0, relativeFrameThickness, ctx.canvas.height); // Right border
}

function handleResize() {


  // Redraw the frames
  drawFrame(context, frameThickness, frameColor); // For photoCanvas
  gifler("./fish.gif").frames(
    gifCanvas,
    function (ctx, frame) {
      ctx.drawImage(frame.buffer, 0, 0, gifCanvas.width, gifCanvas.height);
      drawFrame(ctx, frameThickness, frameColor); // For gifCanvas
    },
    true
  );
}

// Get access to the camera
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
    });
}

video.addEventListener("loadedmetadata", function () {
  let dpr = window.devicePixelRatio || 1;
  photoCanvas.width = video.videoWidth * dpr;
  photoCanvas.height = video.videoHeight * dpr;

  context = photoCanvas.getContext("2d");
  context.scale(dpr, dpr);
});


// Handle gif overlay with gifler
gifler("./fish.gif").frames(
  gifCanvas,
  function (ctx, frame) {
    ctx.drawImage(frame.buffer, 0, 0, gifCanvas.width, gifCanvas.height);

    // Draw the Polaroid frame
    let frameThickness = 50; // Adjust as needed
    let frameColor = "#ffffff"; // Adjust as needed
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, gifCanvas.width, frameThickness); // Top border
    ctx.fillRect(
      0,
      gifCanvas.height - frameThickness,
      gifCanvas.width,
      frameThickness
    ); // Bottom border
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
  // Add Polaroid frame
  let frameThickness = 50; // Adjust as needed
  let frameColor = "#ffffff"; // Adjust as needed
  context.fillStyle = frameColor;
  context.fillRect(0, 0, photoCanvas.width, frameThickness); // Top border
  context.fillRect(
    0,
    photoCanvas.height - frameThickness,
    photoCanvas.width,
    frameThickness
  ); // Bottom border
  context.fillRect(0, 0, frameThickness, photoCanvas.height); // Left border
  context.fillRect(
    photoCanvas.width - frameThickness,
    0,
    frameThickness,
    photoCanvas.height
  ); // Right border

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

