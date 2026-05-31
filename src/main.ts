import { Chain, type ChainConfig } from './parts/chain';
import type { TrailConfig } from './parts/dot';
import { Renderer } from './render/Renderer';
import './style.scss';

const renderer = new Renderer(1000, 800);
const length = [50, 100, 150];
const velocity = [0.00001, 0.000051, 0.000031, 0.09];

const chainConfig = {
  dots: {
    draw: 'all',
    trail: 'all',
    // trailConfig: [
    //   {
    //     color: 'lime',
    //   },
    //   {
    //     color: 'yellow',
    //   },
    //   {
    //     color: 'red',
    //   },
    // ] as Partial<TrailConfig>,
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
  let simsteps = 5000;
  while (simsteps > 0) {
    simsteps--;
    chain.lines.forEach((line) => line.update());
    chain.dots.forEach((dot) => dot.update());
  }

  chain.dots.forEach((dot) => renderer.drawDot(dot));
  chain.lines.forEach((line) => renderer.drawLine(line));

  requestAnimationFrame(draw);
}
