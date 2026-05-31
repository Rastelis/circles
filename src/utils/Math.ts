import type { Vector2 } from '../types';

export function getCanvasCenter(width: number, height: number) {
  return {
    x: width / 2,
    y: height / 2,
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
