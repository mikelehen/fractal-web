import {render, move} from './mandelbrot';

import './style.css';

const selection = document.getElementById('selection') as HTMLDivElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d');

const ZOOM_FACTOR = 2;

let x1 = -1, y1 = -1;
let lastTouch: TouchEvent = null;

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

window.addEventListener('mousemove', mouseMove, false);
window.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);
window.addEventListener('touchstart', touchStart, {passive: false});
window.addEventListener('touchmove', touchMove, {passive: false});
window.addEventListener('touchend', touchEnd, {passive: false});
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
  if (x1 !== -1 && y1 !== -1) {
    // We scale coordinates into [0, 1).
    const sx1 = Math.min(x1, e.pageX) / window.innerWidth;
    const sx2 = Math.max(x1, e.pageX) / window.innerWidth;
    const sy1 = Math.min(y1, e.pageY) / window.innerHeight;
    const sy2 = Math.max(y1, e.pageY) / window.innerHeight;
    const dx = sx2 - sx1;
    const dy = sy2 - sy1;
    const d = Math.max(dx, dy);
    if (d >= 0.005) {
      move(sx1, sy1, d, d);
      render(context);
    } else {
      // just zoom in.
      zoom(e.pageX, e.pageY, 1 / ZOOM_FACTOR);
    }
    selection.style.display = 'none';
    x1 = -1;
    y1 = -1;
  }
}

function touchStart(e: TouchEvent) {
  console.log('touch down');
  lastTouch = e;
  e.preventDefault();
}

function touchMove(e: TouchEvent) {
  console.log('touch move');
  lastTouch = e;
  e.preventDefault();
}

function touchEnd(e: TouchEvent) {
  console.log('zooming from touch');
  // just zoom in.
  if (lastTouch && lastTouch.touches.length > 0) {
    const t = lastTouch.touches[0];
    zoom(t.pageX, t.pageY, 1 / ZOOM_FACTOR);
  }
  lastTouch = null;
  e.preventDefault();
}

function zoom(x: number, y: number, factor: number) {
  // zoom, centering around the mouse location.
  x = x / window.innerWidth;
  y = y / window.innerHeight;
  move(x - factor * x, y - factor * y, factor, factor);
  render(context);
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
    const factor = (e.deltaY > 0) ? ZOOM_FACTOR : (1 / ZOOM_FACTOR);
    zoom(e.pageX, e.pageY, factor);
  }
}