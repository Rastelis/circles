import type { Renderer } from '../render/Renderer';
import type { Vector2 } from '../types';
import { Dot, type DotConfig, type TrailConfig } from './dot';
import { Line, type LineConfig } from './line';

export type ChainConfig = {
  dots: {
    /** Where to draw dots on line ends */
    draw: 'all' | 'last' | 'none';
    /** Where to draw trail on dots */
    trail: 'all' | 'last' | 'none';
    dotConfig?: Partial<DotConfig>[];
    trailConfig?: Partial<TrailConfig>[];
  };
  lines: {
    velocity: number[];
    length: number[];
    lineConfig?: Partial<LineConfig>[];
  };
};

export class Chain {
  readonly lines: Line[];
  readonly dots: Dot[];
  private config: ChainConfig;

  constructor(
    lineCount: number,
    centerVector: Vector2,
    config?: Partial<ChainConfig>,
  ) {
    this.lines = [];
    this.dots = [];
    this.config = normalizeChainConfig(lineCount, config);

    for (let i = 0; i < lineCount; i++) {
      this.lines.push(
        this.createLine(
          centerVector,
          this.config.lines.length[i],
          this.config.lines.velocity[i],
          this.lines[i - 1],
          this.config.lines.lineConfig?.[i],
        ),
      );

      if (this.config.dots.draw === 'all') {
        const isTrail =
          this.config.dots.trail === 'all' ||
          (this.config.dots.trail === 'last' && i === lineCount - 1);

        this.dots.push(
          this.createDot(
            this.lines[i],
            isTrail,
            this.config.dots.dotConfig?.[i],
            this.config.dots.trailConfig?.[i],
          ),
        );
      }
      if (this.config.dots.draw === 'last' && i === lineCount - 1) {
        const isTrail = this.config.dots.trail === 'last';
        this.dots.push(
          this.createDot(
            this.lines[i],
            isTrail,
            this.config.dots?.dotConfig?.[i],
            this.config.dots?.trailConfig?.[i],
          ),
        );
      }
    }
  }
  createLine(
    centerVector: Vector2,
    length: number,
    velocity: number,
    link?: Line,
    lineConfig?: Partial<LineConfig>,
  ) {
    return new Line(
      link?.end ?? centerVector,
      length,
      velocity,
      link,
      lineConfig,
    );
  }
  createDot(
    line: Line,
    isTrail: boolean = false,
    dotConfig?: Partial<DotConfig>,
    trailConfig?: Partial<TrailConfig>,
  ) {
    const config = {
      ...dotConfig,
      trail: {
        draw: isTrail,
        trailConfig,
      },
    } as DotConfig;
    return new Dot(line.end, line, config);
  }
  update() {
    this.lines.forEach((line) => line.update());
    this.dots.forEach((dot) => dot.update());
  }
  draw(renderer: Renderer) {
    this.dots.forEach((dot) => renderer.drawDot(dot));
    this.lines.forEach((line) => renderer.drawLine(line));
  }
}

function normalizeChainConfig(
  lineCount: number,
  config?: Partial<ChainConfig>,
): ChainConfig {
  return {
    dots: {
      draw: config?.dots?.draw ?? 'last',
      trail: config?.dots?.trail ?? 'last',
      dotConfig: config?.dots?.dotConfig,
      trailConfig: config?.dots?.trailConfig,
    },
    lines: {
      velocity: config?.lines?.velocity ?? fillVelocities(lineCount),
      length: config?.lines?.length ?? fillLengths(lineCount),
      lineConfig: config?.lines?.lineConfig,
    },
  };
}

function fillLengths(lineCount: number) {
  const length = [150];

  for (let i = 1; i < lineCount; i++) {
    length.push(length[i - 1] / 2);
  }

  return length;
}
function fillVelocities(lineCount: number) {
  const velocity = [0.01];

  for (let i = 1; i < lineCount; i++) {
    velocity.push(velocity[i - 1] + 0.01);
  }

  return velocity;
}
