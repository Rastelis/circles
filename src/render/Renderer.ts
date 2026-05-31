import { Application, Graphics } from 'pixi.js';
import type { Dot } from '../parts/dot';
import type { Line } from '../parts/line';
import { getCanvasCenter } from '../utils/Math';
import type { Vector2 } from '../types';

export class Renderer {
  private app = new Application();
  private graphics = new Graphics();
  readonly width: number;
  readonly height: number;
  public backgroundColor: string;
  readonly centerVector: Vector2;

  constructor(
    width: number,
    height: number,
    backgroundColor: string = '#000000',
  ) {
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
    this.centerVector = getCanvasCenter(this.width, this.height);
  }

  async init(): Promise<void> {
    await this.app.init({
      width: this.width,
      height: this.height,
      background: this.backgroundColor,
      antialias: true,
    });

    document.body.appendChild(this.app.canvas);
    this.app.stage.addChild(this.graphics);
  }

  clear() {
    this.graphics.clear();
  }
  drawLine(line: Line): void {
    this.graphics
      .moveTo(line.start.x, line.start.y)
      .lineTo(line.end.x, line.end.y)
      .stroke({
        width: line.lineConfig.width,
        color: line.lineConfig.color,
      });
  }
  drawDot(dot: Dot) {
    this.drawTrail(dot);
    this.graphics
      .circle(dot.vector.x, dot.vector.y, dot.config.radius)
      .fill(dot.config.color);
  }
  drawTrail(dot: Dot) {
    if (dot.config.trail.draw && dot.config.trail.path.length >= 2) {
      const start = dot.config.trail.path[0];

      this.graphics.moveTo(start.x, start.y);

      for (let i = 0; i < dot.config.trail.path.length; i++) {
        const point = dot.config.trail.path[i];
        this.graphics.lineTo(point.x, point.y);
        if (
          dot.config.trail.complete &&
          i === dot.config.trail.path.length - 1
        ) {
          this.graphics.lineTo(start.x, start.y);
        }
      }
      this.graphics.stroke({
        color: dot.config.trail.trailConfig?.color ?? dot.config.color,
        width: dot.config.trail.trailConfig?.width ?? 1,
      });
    }
  }
}
