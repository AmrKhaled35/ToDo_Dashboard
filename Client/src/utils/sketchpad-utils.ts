export const loadSketchData = () => {
    try {
      const sketchesData = localStorage.getItem('sketches');
      if (sketchesData) {
        return JSON.parse(sketchesData);
      }
      return [];
    } catch (error) {
      console.error('Failed to load sketches data', error);
      return [];
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const saveSketchData = (sketches: any[]) => {
    try {
      localStorage.setItem('sketches', JSON.stringify(sketches));
      return true;
    } catch (error) {
      console.error('Failed to save sketches data', error);
      return false;
    }
  };
  
  export const calculatePointerPosition = (
    clientX: number, 
    clientY: number, 
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };
  
  export const drawArrow = (
    context: CanvasRenderingContext2D, 
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    headLength: number = 10
  ) => {
    const angle = Math.atan2(endY - startY, endX - startX);
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(
      endX - headLength * Math.cos(angle - Math.PI/6),
      endY - headLength * Math.sin(angle - Math.PI/6)
    );
    context.lineTo(
      endX - headLength * Math.cos(angle + Math.PI/6),
      endY - headLength * Math.sin(angle + Math.PI/6)
    );
    context.closePath();
    context.fill();
  };
  
  export const drawRectangle = (
    context: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    fill: boolean = false
  ) => {
    const width = endX - startX;
    const height = endY - startY;
    
    context.beginPath();
    context.rect(startX, startY, width, height);
    
    if (fill) {
      context.fill();
    } else {
      context.stroke();
    }
  };