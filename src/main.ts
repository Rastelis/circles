import { Chain, type ChainConfig } from './parts/chain';
// import type { TrailConfig } from './parts/dot';
import { Renderer } from './render/Renderer';
import './style.scss';

const renderer = new Renderer(1000, 800);

const length = [50, 100, 150];
const velocity = [0.01, 0.051, 0.031, 0.09];
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

await renderer.init();

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

loop();

function loop() {
  let i = 5;
  while (i > 0) {
    i--;
    chain.update();
  }

  renderer.clear();
  chain.draw(renderer);

  requestAnimationFrame(loop);
}
