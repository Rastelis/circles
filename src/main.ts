import { Chain, type ChainConfig } from './parts/chain';
import { Renderer } from './render/Renderer';
import './style.scss';

const renderer = new Renderer(1000, 800);
const length = [200, 50, 150];
const velocity = [0.01, 0.051, 0.051, 0.09];

const chainConfig = {
  dots: {
    draw: 'all',
    trail: 'all',
  },
  lines: {
    velocity: velocity,
    length: length,
  },
} as Partial<ChainConfig>;

const chain = new Chain(3, renderer.centerVector, chainConfig);

(
  window as typeof window & {
    rederer: Renderer;
  }
).rederer = renderer;
(
  window as typeof window & {
    chain: Chain;
  }
).chain = chain;

draw();

function draw() {
  renderer.clear();

  chain.lines.forEach((line) => line.update());
  chain.dots.forEach((dot) => dot.update());

  chain.dots.forEach((dot) => renderer.drawDot(dot));
  chain.lines.forEach((line) => renderer.drawLine(line));

  requestAnimationFrame(draw);
}
