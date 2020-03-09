
window.onload = () => {
  // Create a Fabric.js canvas
  let canvas = new fabric.Canvas("c", {
    isDrawingMode: true,
    enablePointerEvents: true
  });

  // Initialize a brush
  let brush = new fabric.PSBrush(canvas);
  brush.width = 10;
  brush.color = "#000";
  canvas.freeDrawingBrush = brush;
};
