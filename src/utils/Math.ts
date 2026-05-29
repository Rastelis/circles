import type { Vector2 } from '../types';

export function getCanvasCenter(canvas: HTMLCanvasElement) {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
}

export function getEndVector(
  start: Vector2,
  length: number,
  angle: number,
): Vector2 {
  return {
    x: start.x + Math.cos(angle) * length,
    y: start.y + Math.sin(angle) * length,
  };
}
