import type { Vector2 } from '../types';
import { getEndVector } from '../utils/Math';

export type LineConfig = {
  color: string;
  width: number;
};

export class Line {
  public start: Vector2;
  public end: Vector2;
  private length: number;
  private velocity: number;
  public angle: number;
  private link?: Line;

  public lineConfig: LineConfig;

  constructor(
    start: Vector2,
    length: number,
    velocity: number,
    link?: Line,
    config?: Partial<LineConfig>,
  ) {
    this.start = start;
    this.length = length;
    this.velocity = velocity;
    this.angle = 0;
    this.link = link;
    this.end = getEndVector(this.start, this.length, this.angle);

    this.lineConfig = normalizeLineConfig(config);
  }
  update(): void {
    if (this.link) {
      this.start = { ...this.link.end };
    }
    this.angle += this.velocity;
    this.end = getEndVector(this.start, this.length, this.angle);
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.lineConfig.color;
    ctx.lineWidth = this.lineConfig.width;

    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
  }
}

function normalizeLineConfig(config?: Partial<LineConfig>): LineConfig {
  return {
    color: config?.color ?? 'white',
    width: config?.width ?? 2,
  };
}
