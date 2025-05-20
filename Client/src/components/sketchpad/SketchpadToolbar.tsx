import { 
  Pencil, 
  Eraser, 
  Type, 
  Trash2, 
  Save, 
  FileDown,
  Palette
} from 'lucide-react';
import Button from '../ui/Button';

export type ToolType = 'pen' | 'eraser' | 'text'  | 'select';

interface SketchpadToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  penSize: number;
  setPenSize: (size: number) => void;
  onClear: () => void;
  onSave: () => void;
  onExport: () => void;
}

const colors = [
  '#000000', 
  '#e03131',
  '#2f9e44', 
  '#1971c2',
  '#f08c00', 
  '#9c36b5', 
  '#ffffff', 
];

const SketchpadToolbar: React.FC<SketchpadToolbarProps> = ({
  activeTool,
  setActiveTool,
  currentColor,
  setCurrentColor,
  penSize,
  setPenSize,
  onClear,
  onSave,
  onExport
}) => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2 shadow-sm">
      <div className="flex flex-col items-center space-y-2 mb-4">
        <Button
          variant={activeTool === 'pen' ? 'primary' : 'outline'}
          onClick={() => setActiveTool('pen')}
          className="w-10 h-10 p-2"
          title="Pen"
        >
          <Pencil size={20} />
        </Button>
        <Button
          variant={activeTool === 'eraser' ? 'primary' : 'outline'}
          onClick={() => setActiveTool('eraser')}
          className="w-10 h-10 p-2"
          title="Eraser"
        >
          <Eraser size={20} />
        </Button>
        <Button
          variant={activeTool === 'text' ? 'primary' : 'outline'}
          onClick={() => setActiveTool('text')}
          className="w-10 h-10 p-2"
          title="Text"
        >
          <Type size={20} />
        </Button>
        {/* <Button
          variant={activeTool === 'rectangle' ? 'primary' : 'outline'}
          onClick={() => setActiveTool('rectangle')}
          className="w-10 h-10 p-2"
          title="Rectangle"
        >
          <Square size={20} />
        </Button> */}
        {/* <Button
          variant={activeTool === 'arrow' ? 'primary' : 'outline'}
          onClick={() => setActiveTool('arrow')}
          className="w-10 h-10 p-2"
          title="Arrow"
        >
          <ArrowRight size={20} />
        </Button> */}
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">Color</div>
        <div className="grid grid-cols-4 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full ${
                color === currentColor ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' : ''
              }`}
              style={{ 
                backgroundColor: color,
                border: color === '#ffffff' ? '1px solid #e2e8f0' : 'none' 
              }}
              onClick={() => setCurrentColor(color)}
              title={`Color: ${color}`}
            />
          ))}
          <button 
            className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full"
            title="More colors"
          >
            <Palette size={14} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">Size</div>
        <input
          type="range"
          min="1"
          max="20"
          value={penSize}
          onChange={(e) => setPenSize(parseInt(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div className="mt-auto flex flex-col space-y-2">
        <Button
          variant="outline"
          onClick={onClear}
          className="w-10 h-10 p-2 mx-auto"
          title="Clear Canvas"
        >
          <Trash2 size={20} className="text-red-500" />
        </Button>
        <Button
          variant="outline"
          onClick={onSave}
          className="w-10 h-10 p-2 mx-auto"
          title="Save Canvas"
        >
          <Save size={20} className="text-indigo-500" />
        </Button>
        <Button
          variant="outline"
          onClick={onExport}
          className="w-10 h-10 p-2 mx-auto"
          title="Export as PDF"
        >
          <FileDown size={20} className="text-green-500" />
        </Button>
      </div>
    </div>
  );
};

export default SketchpadToolbar;