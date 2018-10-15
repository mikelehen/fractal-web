import './style.css';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d');

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render(); 
}

resizeCanvas();

function render() {
  context.fillStyle = 'green';
  context.fillRect(0, 0, canvas.width, canvas.height);
}
