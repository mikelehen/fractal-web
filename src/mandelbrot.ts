import * as convert from 'color-convert';

const ITERATIONS = 250;

const CX_MIN = -2;
const CX_MAX = 1;
const CY_MIN = -1.2;
const CY_MAX = 1.2;

let cx_min = CX_MIN;
let cx_max = CX_MAX;
let cy_min = CY_MIN;
let cy_max = CY_MAX;

const [red, green, blue] = generatePalette();

export function render(context: CanvasRenderingContext2D) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  const cdx = (cx_max - cx_min) / width;
  const cdy = (cy_max - cy_min) / height;
  let j = 0; // data[j] index
  let cy = cy_min;
  for(let y = 0; y < height; y++) {
    let cx = cx_min;
    cy += cdy;
    for(let x = 0; x < width; x++) {
      cx += cdx;
      let zx = 0, zy = 0;
      let i = 0;
      while (zx * zx + zy + zy <= 4 && i < ITERATIONS) {
        const new_zx = zx * zx - zy * zy + cx;
        zy = 2*zx*zy + cy;
        zx = new_zx;
        i++;
      }
      data[j++] = red[i];
      data[j++] = green[i];
      data[j++] = blue[i];
      data[j++] = 255; // alpha
    }
  }

  context.putImageData(imageData, 0, 0);
}

/** All parameters are scaled from screen coordinates into the range [0, 1) */
export function move(x: number, y: number, width: number, height: number) {
  console.log(x, y, width, height);
  const dx = cx_max - cx_min;
  const dy = cy_max - cy_min;
  cx_min += dx * x;
  cy_min += dy * y;
  cx_max = cx_min + dx * width;
  cy_max = cy_min + dy * height;
}

export function zoomOut() {
  // TODO
}

function generatePalette() {
  const red = [], green = [], blue = [];
  for(let i = 0; i <= ITERATIONS; i++) {
    const [r, g, b] = convert.hsl.rgb([(i/ITERATIONS)*270, 100, 50]);
    red.push(r);
    green.push(g);
    blue.push(b);
  }
  return [red, green, blue];
}