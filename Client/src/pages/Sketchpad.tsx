import React, { useState, useRef } from 'react';
import SketchpadToolbar, { ToolType } from '../components/sketchpad/SketchpadToolbar';
import Canvas from '../components/sketchpad/Canvas';
import Button from '../components/ui/Button';
import { Save, FileDown, Folder } from 'lucide-react';
import SavedSketchesDrawer from '../components/sketchpad/SavedSketchesDrawer';
import { loadSketchData, saveSketchData } from '../utils/sketchpad-utils';
import toast from 'react-hot-toast';

interface SavedSketch {
  id: string;
  name: string;
  dataURL: string;
  date: string;
}

const Sketchpad: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [penSize, setPenSize] = useState(3);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sketches, setSketches] = useState<SavedSketch[]>(() => loadSketchData());
  const canvasRef = useRef<{ clear: () => void; getCanvas: () => HTMLCanvasElement | null }>(null);

  const handleClear = () => {
    toast((t) => (
      <div className="flex items-center gap-4">
        <span>Are you sure you want to clear the canvas?</span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => {
              canvasRef.current?.clear();
              toast.dismiss(t.id);
            }}
          >
            Yes
          </button>
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    
    toast((t) => (
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter sketch name"
          className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const name = e.currentTarget.value.trim();
              if (name) {
                const newSketch = {
                  id: Date.now().toString(),
                  name,
                  dataURL,
                  date: new Date().toISOString()
                };

                const updatedSketches = [...sketches, newSketch];
                setSketches(updatedSketches);
                saveSketchData(updatedSketches);

                toast.success('Sketch saved successfully!');
                toast.dismiss(t.id);
              }
            }
          }}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
    });
  };

  const handleExport = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'sketch.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    import('jspdf').then(({ jsPDF }) => {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        canvas.width,
        canvas.height
      );

      pdf.save('sketch.pdf');
    }).catch(() => {
      alert('Failed to export as PDF.');
    });
  };

  const handleLoadSketch = (dataURL: string) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.onload = () => {
      canvasRef.current?.clear();
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = dataURL;

    setIsDrawerOpen(false);
  };

  const handleDeleteSketch = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span>Are you sure you want to delete this sketch?</span>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => {
              const updatedSketches = sketches.filter(sketch => sketch.id !== id);
              setSketches(updatedSketches);
              saveSketchData(updatedSketches);
              toast.success('Sketch deleted successfully!');
              toast.dismiss(t.id);
            }}
          >
            Yes
          </button>
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };
  

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sketchpad</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Folder size={16} />}
              onClick={() => setIsDrawerOpen(true)}
              className="dark:text-white dark:border-gray-700"
            >
              My Sketches
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Save size={16} />}
              onClick={handleSave}
              className="dark:text-white dark:border-gray-700"
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FileDown size={16} />}
              onClick={handleExport}
              className="dark:text-white dark:border-gray-700"
            >
              Export as PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        <SketchpadToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          penSize={penSize}
          setPenSize={setPenSize}
          onClear={handleClear}
          onSave={handleSave}
          onExport={handleExport}
        />

        <Canvas
          ref={canvasRef}
          activeTool={activeTool}
          currentColor={currentColor}
          penSize={penSize}
        />
      </div>

      <SavedSketchesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sketches={sketches}
        onLoad={handleLoadSketch}
        onDelete={handleDeleteSketch}
      />
    </div>
  );
};

export default Sketchpad;
