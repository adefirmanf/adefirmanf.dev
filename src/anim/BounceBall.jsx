import { useEffect, useRef } from 'react';
import { Application, Assets, Sprite } from 'pixi.js';

export default function BounceBall() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application();

    app.init({ background: '#1099bb', resizeTo: canvasRef.current }).then(async () => {
      canvasRef.current.appendChild(app.view);

      const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
      const bunny = new Sprite(texture);
      bunny.anchor.set(0.5);
      bunny.x = app.screen.width / 2;
      bunny.y = app.screen.height / 2;

      app.stage.addChild(bunny);

      app.ticker.add((time) => {
        bunny.rotation += 0.1 * time.deltaTime;
      });
    });

    return () => {
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{height: '400px', position: 'relative' }}
    />
  );
}
