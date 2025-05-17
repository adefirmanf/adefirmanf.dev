import { useEffect, useState, useRef, type FC } from 'react';
import { Application, Graphics, Ticker, } from 'pixi.js';
import { useStore } from '@nanostores/react';
import { isDark } from "../store/theme.ts";

interface Shape {
  render(): Graphics
  update(app: Application): void
  animate(app: Application): void
  hasAnimated: boolean
}


class Square implements Shape {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  animated = false;
  gfx: Graphics

  constructor({ animated }: { animated: boolean }) {
    this.animated = animated
    const obj = new Graphics()
      .rect(this.x, this.y, this.width, this.height)
      .fill("#FFA09E")
    this.gfx = obj;
  }

  update(app: Application) {
    this.gfx.x = app.screen.width / 2.5;
    this.gfx.y = app.screen.height / 3;
  }

  animate(app: Application): void {
    app.ticker.add(() => {
      if (this.gfx.destroyed) return
      this.gfx.x += 1;
      this.releaseMemory(app);
    })
  }


  private releaseMemory(app: Application) {
    if (this.gfx.x >= app.screen.width || this.gfx.y >= app.screen.height || this.gfx.x < 0 || this.gfx.y < 0) {
      app.ticker.stop();
    }
  }

  get hasAnimated() {
    return this.animated
  }

  render(): Graphics {
    return this.gfx
  }
}

const Render: FC<{ graphics: Shape[] }> = ({ graphics }) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const $isDark = useStore(isDark);

  const handleRefresh = () => {
    const app = appRef.current!;
    appRef.current?.stage.children[0].position.set(app.screen.width / 2.5, app.screen.height / 3)
    console.log(appRef.current?.ticker.started)
    if (appRef.current?.ticker.started !== true) appRef.current?.ticker.start()
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application();
    appRef.current = app;

    const bgColor = $isDark ? '#18181B' : '#FFFFFF';

    app.init({ background: bgColor, resizeTo: canvasRef.current }).then(() => {
      canvasRef.current!.appendChild(app.view);

      graphics.forEach(shape => {
        shape.update(app);
        const gfx = shape.render();

        app.stage.addChild(gfx)
        if (shape.hasAnimated) shape.animate(app)
      })
    });

    return () => {
      //app.destroy(true, { children: true });
      //appRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (appRef.current?.renderer) {
      appRef.current.renderer.background.color = $isDark ? '#18181B' : '#FFFFFF';
    }
  }, [$isDark]);

  return (
    <div>
      <div>
        <button onClick={handleRefresh} style={{ border: '1px solid', padding: 5, borderRadius: '4px' }}>Refresh</button>
      </div>
      <div
        ref={canvasRef}
        style={{
          height: '200px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export const BasicShape = () => {
  const graphics = [new Square({ animated: false })];
  return <Render graphics={graphics} />
};

export const AnimatedShape = () => {
  const graphics = [new Square({ animated: true })];
  return <Render graphics={graphics} />
};

