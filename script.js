//canvas setup
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;

//should be uploading the images or just the whole sheet on export, so images don't need to be stored unless saved as a draft or exported, how could I save a draft that holds the entire canvas?
const imageLoader = document.getElementById("imageLoader");
let images = [];

imageLoader.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        images.push({
          img,
          x: 50,
          y: 50,
          width: 200,
          height: 150,
          isDragging: false,
          isResizing: false,
        });
        drawAllImages();
      };
    };
    reader.readAsDataURL(file);
  }
});

function drawAllImages() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  images.forEach((image) => {
    ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
  });
}

let selectedImage = null;
canvas.addEventListener("mousedown", (e) => {
  const { offsetX, offsetY } = e;
  selectedImage = images.find((image) => {
    return (
      offsetX >= image.x &&
      offsetX <= image.x + image.width &&
      offsetY >= image.y &&
      offsetY <= image.y + image.height
    );
  });

  if (selectedImage) {
    if (isCornerClicked(selectedImage, offsetX, offsetY)) {
      selectedImage.isResizing = true;
    } else {
      selectedImage.isDragging = true;
    }
    canvas.addEventListener("mousemove", onDragOrResize);
  }
});

canvas.addEventListener("mouseup", () => {
  if (selectedImage) {
    selectedImage.isDragging = false;
    selectedImage.isResizing = false;
  }
  canvas.removeEventListener("mousemove", onDragOrResize);
});

//should or shouldn't reverve/invert image if dragged out?
function onDragOrResize(e) {
  const { offsetX, offsetY } = e;
  if (selectedImage.isDragging) {
    selectedImage.x = offsetX - selectedImage.width / 2;
    selectedImage.y = offsetY - selectedImage.height / 2;
  } else if (selectedImage.isResizing) {
    selectedImage.width = offsetX - selectedImage.x;
    selectedImage.height = offsetY - selectedImage.y;
  }
  drawAllImages();
}

function isCornerClicked(image, mouseX, mouseY) {
  const cornerSize = 10;
  return (
    Math.abs(mouseX - (image.x + image.width)) < cornerSize &&
    Math.abs(mouseY - (image.y + image.height)) < cornerSize
  );
}
