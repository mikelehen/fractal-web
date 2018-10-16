import {render, move, zoom} from './mandelbrot';

import './style.css';

const selection = document.getElementById('selection') as HTMLDivElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d');

const ZOOM_FACTOR = 2;

let x1 = 0, y1 = 0;

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

window.addEventListener('mousemove', mouseMove, false);
window.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);
window.addEventListener('wheel', wheel, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render(context);
}

function mouseDown(e: MouseEvent) {
  if (e.buttons === 1) {
    x1 = e.pageX;
    y1 = e.pageY;
    drawSelection(x1, y1);
  }
}

function mouseMove(e: MouseEvent) {
  if (e.buttons === 1) {
    drawSelection(e.pageX, e.pageY);
  }
}

function mouseUp(e: MouseEvent) {
  // We scale coordinates into [0, 1).
  const sx1 = Math.min(x1, e.pageX) / window.innerWidth;
  const sx2 = Math.max(x1, e.pageX) / window.innerWidth;
  const sy1 = Math.min(y1, e.pageY) / window.innerHeight;
  const sy2 = Math.max(y1, e.pageY) / window.innerHeight;
  const dx = sx2 - sx1;
  const dy = sy2 - sy1;
  const d = Math.max(dx, dy);
  move(sx1, sy1, d, d);
  render(context);
  selection.style.display = 'none';
}

function drawSelection(x2: number, y2: number) {
  const x3 = Math.min(x1, x2);
  const x4 = Math.max(x1, x2);
  const y3 = Math.min(y1, y2);
  const y4 = Math.max(y1, y2);
  let dx, dy;
  if ((x4 - x3) / window.innerWidth > (y4 - y3) / window.innerHeight) {
    dx = x4 - x3;
    dy = ((x4 - x3) / window.innerWidth) * window.innerHeight;
  } else {
    dy = y4 - y3;
    dx = ((y4 - y3) / window.innerHeight) * window.innerWidth;
  }
  selection.style.left = x3 + 'px';
  selection.style.top = y3 + 'px';
  selection.style.width = dx + 'px';
  selection.style.height = dy + 'px';
  selection.style.display = 'block';
}

function wheel(e: WheelEvent) {
  if (e.deltaY !== 0) {
    // zoom in, centering around the mouse location.
    const x = e.pageX / window.innerWidth;
    const y = e.pageY / window.innerHeight;
    const zoom = (e.deltaY > 0) ? ZOOM_FACTOR : (1 / ZOOM_FACTOR);
    move(x - zoom * x, y - zoom * y, zoom, zoom);
    render(context);
  }
}