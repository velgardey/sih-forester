'use client';

import { useCallback, useRef, useState } from 'react';
import { MapPin, Filter, UploadCloud, X } from 'lucide-react';
import { clsx } from 'clsx';

// Import JSON data
import forestsData from '@/data/forests.json';

interface SidebarProps {
  selectedForest: number | null;
  setSelectedForest: (forestId: number | null) => void;
}

interface ProcessingFile {
  id: string;
  name: string;
  progress: number;
  status: 'processing' | 'completed' | 'failed';
}

export function Sidebar({ selectedForest, setSelectedForest }: SidebarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUploadingFile, setCurrentUploadingFile] = useState<ProcessingFile | null>(null);
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const forests = forestsData;

  const getFireLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleFileDrop = useCallback((event: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let files: FileList | null = null;

    if ('dataTransfer' in event) {
      files = event.dataTransfer.files;
    } else if ('files' in event.target) {
      files = event.target.files;
    }

    if (files) {
      const newFiles = Array.from(files);
      setDroppedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitUpload = () => {
    if (droppedFiles.length > 0) {
      const fileToProcess = droppedFiles[0];
      const newProcessingFile: ProcessingFile = {
        id: `${fileToProcess.name}-${Date.now()}`,
        name: fileToProcess.name,
        progress: 20,
        status: 'processing',
      };
      setCurrentUploadingFile(newProcessingFile);
      setShowUploadModal(true);
      setProcessingFiles((prev) => [...prev, newProcessingFile]);
      setDroppedFiles((prev) => prev.slice(1));

      console.log('Submitting file for processing:', fileToProcess.name);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setCurrentUploadingFile(null);
  };

  return (
    <aside className="w-80 pb-10 bg-gray-100 rounded-lg p-[10px] border-r border-gray-200flex flex-col overflow-y-auto z-[2000]">
      {/* Forest Selection */}
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Forests</h3>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Filter options would go here</p>
          </div>
        )}

        <div className="space-y-2">
          {forests.map((forest) => (
            <button
              key={forest.id}
              onClick={() => setSelectedForest(forest.id === selectedForest ? null : forest.id)}
              className={clsx(
                'w-full text-left p-4 rounded-lg border transition-colors',
                selectedForest === forest.id
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{forest.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    FRA Coverage: {forest.fra.coverage}, Households: {forest.community.households}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={clsx('w-2 h-2 rounded-full', getFireLevelColor(forest.risk.fireLevel))} />
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Processing Files Section */}
        {processingFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Processing Files</h4>
            <div className="space-y-2">
              {processingFiles.map((file) => (
                <div key={file.id} className="w-full p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-between text-sm text-yellow-800">
                  <span>{file.name}</span>
                  <span className="font-medium">{file.status === 'processing' ? 'Processing...' : file.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drag and Drop Field for new files */}
        <div
          className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onClick={handleFileInputClick}
        >
          <UploadCloud className="mb-2 h-10 w-10" />
          <p className="mb-1 text-sm">Drag and drop new files here</p>
          <p className="text-xs">or click to upload</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileDrop}
            multiple
          />
        </div>

        {droppedFiles.length > 0 && (
          <button
            onClick={handleSubmitUpload}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Upload ({droppedFiles.length} file{droppedFiles.length > 1 ? 's' : ''})
          </button>
        )}

      </div>

      {/* Upload Progress Modal */}
      {showUploadModal && currentUploadingFile && (
        <div className="fixed inset-0 backdrop-blur-2xl flex h-screen w-screen items-center justify-center z-[2000]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Uploading File</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-4">{currentUploadingFile.name}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${currentUploadingFile.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">Progress: {currentUploadingFile.progress}%</p>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
