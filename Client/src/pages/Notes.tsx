import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import Masonry from 'react-masonry-css';
import { PlusCircle, X, Pin, Edit2 } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  rotation: number;
  isPinned: boolean;
}

const COLORS = [
  'from-yellow-200 to-yellow-100',
  'from-pink-200 to-pink-100',
  'from-green-200 to-green-100',
  'from-blue-200 to-blue-100',
  'from-purple-200 to-purple-100',
  'from-orange-200 to-orange-100'
];

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [noteSize, setNoteSize] = useState({ width: 250, fontSize: 16 });
  useEffect(() => {
    function updateNoteSize() {
      const width = window.innerWidth;
      if (width < 500) {
        setNoteSize({ width: 150, fontSize: 12 });
      } else if (width < 700) {
        setNoteSize({ width: 180, fontSize: 13 });
      } else if (width < 1100) {
        setNoteSize({ width: 220, fontSize: 14 });
      } else {
        setNoteSize({ width: 250, fontSize: 16 });
      }
    }
    updateNoteSize();
    window.addEventListener('resize', updateNoteSize);
    return () => window.removeEventListener('resize', updateNoteSize);
  }, []);

  const addNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent,
        color: selectedColor,
        position: { x: 0, y: 0 },
        rotation: Math.random() * 6 - 3,
        isPinned: false
      };
      setNotes([...notes, newNote]);
      setNewNoteContent('');
      setIsAdding(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Notes
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Capture your thoughts and ideas, just like sticky notes on a wall.
              </p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <PlusCircle className="mr-2" size={20} />
              Add Note
            </button>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Add New Note
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <textarea
              ref={textareaRef}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note here..."
              className={`w-full h-40 p-4 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none bg-gradient-to-b ${selectedColor} resize-none`}
            />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-b ${color} ${
                      selectedColor === color ? 'ring-2 ring-purple-600 ring-offset-2' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="relative max-w-7xl mx-auto w-full" style={{ height: '80vh' }}>
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {notes.map((note) => (
            <Draggable
              key={note.id}
              defaultPosition={note.position}
              disabled={note.isPinned}
              bounds={containerRef.current || undefined}
            >
              <div
                className="relative group mb-6"
                style={{ width: noteSize.width, fontSize: noteSize.fontSize }}
              >
                <div
                  className={`relative bg-gradient-to-b ${note.color} p-4 rounded-lg cursor-move transform transition-all duration-200`}
                  style={{
                    transform: `rotate(${note.rotation}deg)`,
                    zIndex: note.isPinned ? 10 : 1,
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <button
                        onClick={() => togglePin(note.id)}
                        className={`p-1 rounded-full ${
                          note.isPinned
                            ? 'text-red-600 bg-red-100'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Pin size={16} className={note.isPinned ? 'transform -rotate-45' : ''} />
                      </button>
                      <div className="flex space-x-2">
                        <button
                          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                          onClick={() => {
                            setNewNoteContent(note.content);
                            setSelectedColor(note.color);
                            setIsAdding(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap break-words">{note.content}</p>
                  </div>

                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-transparent to-black opacity-10 transform rotate-45"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-transparent to-black opacity-5 transform rotate-45 translate-x-1 translate-y-1"></div>
                  </div>

                  <div className="absolute -bottom-1 -right-1 w-full h-full rounded-lg bg-black opacity-10 transform skew-x-2 skew-y-2"></div>
                </div>

                <div className="absolute inset-0 rounded-lg bg-black opacity-0 group-hover:opacity-20 transform transition-opacity duration-200"></div>
              </div>
            </Draggable>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default Notes;
