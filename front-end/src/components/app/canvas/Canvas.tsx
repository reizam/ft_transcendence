import { forwardRef } from 'react';

const Canvas = forwardRef<HTMLCanvasElement>((props, ref): JSX.Element => {
  return <canvas ref={ref} {...props} />;
});
Canvas.displayName = 'Canvas';

export default Canvas;
