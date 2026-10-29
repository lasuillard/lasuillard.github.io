export interface MermaidViewportOptions {
  minScale?: number;
  maxScale?: number;
  zoomStep?: number;
  panStep?: number;
}

/**
 * Controller managing pan and zoom state and pointer/wheel interactions for a Mermaid diagram viewport.
 */
export class MermaidViewportController {
  public minScale: number;
  public maxScale: number;
  public zoomStep: number;
  public panStep: number;

  public scale = $state(1);
  public translateX = $state(0);
  public translateY = $state(0);
  public isDragging = $state(false);

  public transform = $derived(
    `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`,
  );

  private dragStartX = 0;
  private dragStartY = 0;

  constructor(options: MermaidViewportOptions = {}) {
    this.minScale = options.minScale ?? 0.5;
    this.maxScale = options.maxScale ?? 4;
    this.zoomStep = options.zoomStep ?? 0.25;
    this.panStep = options.panStep ?? 50;
  }

  zoomIn = () => {
    this.scale = Math.min(
      this.maxScale,
      +(this.scale + this.zoomStep).toFixed(2),
    );
  };

  zoomOut = () => {
    this.scale = Math.max(
      this.minScale,
      +(this.scale - this.zoomStep).toFixed(2),
    );
  };

  pan = (dx: number, dy: number) => {
    this.translateX += dx;
    this.translateY += dy;
  };

  panUp = () => {
    this.pan(0, this.panStep);
  };

  panDown = () => {
    this.pan(0, -this.panStep);
  };

  panLeft = () => {
    this.pan(this.panStep, 0);
  };

  panRight = () => {
    this.pan(-this.panStep, 0);
  };

  reset = () => {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  };

  handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.currentTarget as HTMLElement | null;
    target?.setPointerCapture?.(e.pointerId);
    this.isDragging = true;
    this.dragStartX = e.clientX - this.translateX;
    this.dragStartY = e.clientY - this.translateY;
  };

  handlePointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    this.translateX = e.clientX - this.dragStartX;
    this.translateY = e.clientY - this.dragStartY;
  };

  handlePointerUp = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement | null;
    if (target?.hasPointerCapture?.(e.pointerId)) {
      target.releasePointerCapture?.(e.pointerId);
    }
    this.isDragging = false;
  };

  handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      this.zoomIn();
    } else if (e.deltaY > 0) {
      this.zoomOut();
    }
  };
}
