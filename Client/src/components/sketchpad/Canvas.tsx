import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { ToolType } from './SketchpadToolbar';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { calculatePointerPosition, drawArrow, drawRectangle } from '../../utils/sketchpad-utils'

interface Point {
  x: number;
  y: number;
}

interface TextElement {
  x: number;
  y: number;
  value: string;
  color: string;
  id: string;
}

interface CanvasProps {
  activeTool: ToolType;
  currentColor: string;
  penSize: number;
}

type StartPoint = {
  x: number;
  y: number;
} | null;

const Canvas = forwardRef<
  { clear: () => void; getCanvas: () => HTMLCanvasElement | null },
  CanvasProps
>(({ activeTool, currentColor, penSize }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [textInputPosition, setTextInputPosition] = useState<Point | null>(null);
  const [currentText, setCurrentText] = useState('');
  const lastPointRef = useRef<Point | null>(null);
  const startPointRef = useRef<StartPoint>(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clear: () => {
      clearCanvas();
    },
    getCanvas: () => canvasRef.current,
  }));

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    setTextElements([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Setup canvas
    const setupCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
      
      context.scale(pixelRatio, pixelRatio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = currentColor;
      context.lineWidth = penSize;

      // Redraw all text elements
      textElements.forEach(drawTextElement);
    };

    setupCanvas();

    const handleResize = () => {
      // Save the existing drawing
      const existingDrawing = canvas.toDataURL();
      const img = new Image();
      img.onload = () => {
        setupCanvas();
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = existingDrawing;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [textElements, currentColor, penSize]);

  // Update canvas styles when tool changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.strokeStyle = currentColor;
    context.fillStyle = currentColor;
    context.lineWidth = penSize;
  }, [currentColor, penSize, activeTool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling when drawing on touch devices
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const point = getCoordinates(e);
    
    // Store start point for shapes
    startPointRef.current = point;
    
    if (activeTool === 'text') {
      setTextInputPosition(point);
      return;
    }
    
    setIsDrawing(true);
    lastPointRef.current = point;
    
    // For single dots (when clicking without dragging)
    if (activeTool === 'pen') {
      context.strokeStyle = currentColor;
      context.fillStyle = currentColor;
      context.lineWidth = penSize;
      context.beginPath();
      context.arc(point.x, point.y, penSize / 2, 0, Math.PI * 2);
      context.fill();
    } else if (activeTool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(point.x, point.y, penSize * 2, 0, Math.PI * 2);
      context.fill();
      context.globalCompositeOperation = 'source-over';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling when drawing on touch devices
    
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const currentPoint = getCoordinates(e);
    
    // Handle different tools
    if (activeTool === 'pen') {
      context.strokeStyle = currentColor;
      context.lineWidth = penSize;
      context.globalCompositeOperation = 'source-over';
      
      if (lastPointRef.current) {
        context.beginPath();
        context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        context.lineTo(currentPoint.x, currentPoint.y);
        context.stroke();
      }
    } else if (activeTool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = penSize * 2;
      
      if (lastPointRef.current) {
        context.beginPath();
        context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        context.lineTo(currentPoint.x, currentPoint.y);
        context.stroke();
      }
    } else if (activeTool === 'rectangle' && startPointRef.current) {
      // For live preview of rectangle, we need to clear and redraw
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(imageData, 0, 0);
      
      context.strokeStyle = currentColor;
      context.lineWidth = penSize;
      context.globalCompositeOperation = 'source-over';
      
      drawRectangle(
        context,
        startPointRef.current.x,
        startPointRef.current.y,
        currentPoint.x,
        currentPoint.y
      );
    } else if (activeTool === 'arrow' && startPointRef.current) {
      // For live preview of arrow, we need to clear and redraw
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(imageData, 0, 0);
      
      context.strokeStyle = currentColor;
      context.fillStyle = currentColor;
      context.lineWidth = penSize;
      context.globalCompositeOperation = 'source-over';
      
      drawArrow(
        context,
        startPointRef.current.x,
        startPointRef.current.y,
        currentPoint.x,
        currentPoint.y,
        10 + penSize
      );
    }
    
    lastPointRef.current = currentPoint;
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    lastPointRef.current = null;
    startPointRef.current = null;
    
    // Reset composite operation
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.globalCompositeOperation = 'source-over';
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentText(e.target.value);
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentText.trim() && textInputPosition) {
      const newTextElement = {
        x: textInputPosition.x,
        y: textInputPosition.y,
        value: currentText,
        color: currentColor,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      setTextElements([...textElements, newTextElement]);
      drawTextElement(newTextElement);
      
      setCurrentText('');
      setTextInputPosition(null);
    } else if (e.key === 'Escape') {
      setCurrentText('');
      setTextInputPosition(null);
    }
  };

  const drawTextElement = (textElement: TextElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.font = '16px sans-serif';
    context.fillStyle = textElement.color;
    context.fillText(textElement.value, textElement.x, textElement.y);
  };

  // Return appropriate cursor based on active tool
  const getCursorStyle = () => {
    switch (activeTool) {
      case 'pen':
        return 'crosshair';
      case 'eraser':
        return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23000000\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M20 20H7L3 16c-1.5-1.5-1.5-3.9 0-5.4L16 3c1.5-1.5 3.9-1.5 5.4 0s1.5 3.9 0 5.4L10 20\'/%3E%3C/svg%3E") 0 20, auto';
      case 'text':
        return 'text';
      case 'rectangle':
      case 'arrow':
        return 'crosshair';
      default:
        return 'default';
    }
  };

  return (
    <div className="relative flex-grow h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair touch-none"
        style={{ cursor: getCursorStyle() }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {textInputPosition && (
        <input
          type="text"
          className="absolute px-2 py-1 border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-white dark:border-indigo-700"
          style={{
            left: `${textInputPosition.x}px`,
            top: `${textInputPosition.y - 20}px`,
            color: currentColor
          }}
          value={currentText}
          onChange={handleTextInputChange}
          onKeyDown={handleTextInputKeyDown}
          autoFocus
        />
      )}
    </div>
  );
});

export default Canvas;