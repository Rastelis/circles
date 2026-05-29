import type { Vector2 } from '../types';
import type { Line } from './line';

export type TrailConfig = {
  color: string;
  width: number;
};

export type Trail =
  | {
      draw: true;
      path: Vector2[];
      start: Vector2;
      complete: boolean;
      trailConfig?: Partial<TrailConfig>;
    }
  | {
      draw: false;
    };

export type DotConfig = {
  color: string;
  radius: number;
  trail: Trail;
};

export class Dot {
  vector: Vector2;
  link: Line;

  config: DotConfig;

  constructor(vector: Vector2, link: Line, config?: Partial<DotConfig>) {
    this.vector = vector;
    this.link = link;

    this.config = normalizeDotConfig(config);

    if (this.config.trail.draw) {
      this.config.trail.path = [{ ...vector }];
      this.config.trail.start = { ...vector };
      this.config.trail.complete = false;
    }
  }
  update(): void {
    if (this.link) {
      this.vector = { ...this.link.end };
      if (this.config.trail.draw && !this.config.trail.complete) {
        const distance = Math.hypot(
          this.vector.x - this.config.trail.start.x,
          this.vector.y - this.config.trail.start.y,
        );
        // console.log(distance);
        if (this.config.trail.path.length > 200 && distance < 5) {
          console.log('complete');
          console.log(this.config.trail.path.length);
          this.config.trail.complete = true;
          return;
        }
        this.config.trail.path.push({ ...this.vector });
      }
    }
  }
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.config.trail.draw) {
      ctx.strokeStyle =
        this.config.trail.trailConfig?.color ?? this.config.color;
      ctx.lineWidth = this.config.trail.trailConfig?.width ?? 1;

      ctx.beginPath();

      for (let i = 0; i < this.config.trail.path.length; i++) {
        const point = this.config.trail.path[i];

        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
        if (
          this.config.trail.complete &&
          i === this.config.trail.path.length - 1
        ) {
          ctx.lineTo(this.config.trail.path[0].x, this.config.trail.path[0].y);
        }
      }
      ctx.stroke();
    }

    ctx.fillStyle = this.config.color;
    ctx.beginPath();
    ctx.arc(this.vector.x, this.vector.y, this.config.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function normalizeDotConfig(config?: Partial<DotConfig>): DotConfig {
  return {
    color: config?.color ?? 'red',
    radius: config?.radius ?? 2,
    trail: config?.trail ?? { draw: false },
  };
}
