import { X, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

interface SavedSketch {
  id: string;
  name: string;
  dataURL: string;
  date: string;
}

interface SavedSketchesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sketches: SavedSketch[];
  onLoad: (dataURL: string) => void;
  onDelete: (id: string) => void;
}

const SavedSketchesDrawer: React.FC<SavedSketchesDrawerProps> = ({
  isOpen,
  onClose,
  sketches,
  onLoad,
  onDelete
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 z-30 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">Saved Sketches</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X size={20} />
          </Button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          {sketches.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No saved sketches yet.
            </p>
          ) : (
            <div className="space-y-4">
              {sketches.map((sketch) => (
                <div 
                  key={sketch.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img 
                      src={sketch.dataURL} 
                      alt={sketch.name}
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-medium dark:text-white">{sketch.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(sketch.date)}
                    </p>
                    
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => onLoad(sketch.dataURL)}
                        className="flex-1"
                      >
                        Load
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDelete(sketch.id)}
                        className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedSketchesDrawer;