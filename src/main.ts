import { Chain } from './parts/chain';
import { Renderer } from './render/Renderer';
import './style.scss';

const renderer = new Renderer(1000, 800);

const chain = new Chain(5, renderer.centerVector, {
  dots: {
    trail: 'all',
  },
});

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

  chain.lines.forEach((line) => renderer.drawLine(line));
  chain.dots.forEach((dot) => renderer.drawDot(dot));

  requestAnimationFrame(draw);
}
