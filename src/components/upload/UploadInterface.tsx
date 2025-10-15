'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface UploadInterfaceProps {
  onUploadComplete: (document: any) => void;
}

interface MetadataForm {
  documentType: string;
  state: string;
  district: string;
  village: string;
  date: string;
  description: string;
}

interface ConstantsData {
  documentTypes: string[];
  states: string[];
  districts: Record<string, string[]>;
  villages: Record<string, string[]>;
  fileTypes: {
    accepted: string[];
    extensions: string[];
  };
}

export default function UploadInterface({ onUploadComplete }: UploadInterfaceProps) {
  const [constantsData, setConstantsData] = useState<ConstantsData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableVillages, setAvailableVillages] = useState<string[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<MetadataForm>({
    defaultValues: {
      documentType: '',
      state: '',
      district: '',
      village: '',
      date: '',
      description: ''
    }
  });

  const selectedState = watch('state');
  const selectedDistrict = watch('district');

  useEffect(() => {
    async function loadConstants() {
      try {
        const constants = await import('@/data/constants.json');
        setConstantsData(constants.default);
      } catch (error) {
        console.error('Error loading constants:', error);
      }
    }
    loadConstants();
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    if (!constantsData) return false;
    
    const ACCEPTED_FILE_TYPES = constantsData.fileTypes.accepted;
    const ACCEPTED_EXTENSIONS = constantsData.fileTypes.extensions;
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!ACCEPTED_FILE_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(fileExtension)) {
      setError('Invalid file type. Please upload PDF, JPEG, PNG, or TIFF files only.');
      return false;
    }
    
    setError('');
    return true;
  }, [constantsData]);

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (validateFile(files[0])) {
        setSelectedFile(files[0]);
      }
    }
  }, [validateFile]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
  };

  // Update districts when state changes
  useEffect(() => {
    if (selectedState && constantsData) {
      setAvailableDistricts(constantsData.districts[selectedState] || []);
      setValue('district', '');
      setValue('village', '');
      setAvailableVillages([]);
    }
  }, [selectedState, setValue, constantsData]);

  // Update villages when district changes
  useEffect(() => {
    if (selectedDistrict && constantsData) {
      setAvailableVillages(constantsData.villages[selectedDistrict] || []);
      setValue('village', '');
    }
  }, [selectedDistrict, setValue, constantsData]);

  const onSubmit = (data: MetadataForm) => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    // Pass data to parent component for processing
    onUploadComplete({
      file: selectedFile,
      ...data
    });

    // Reset form
    reset();
    setSelectedFile(null);
  };

  if (!constantsData) {
    return <div className="text-center py-8">Loading upload form...</div>;
  }

  const DOCUMENT_TYPES = constantsData.documentTypes;
  const STATES = constantsData.states;
  const ACCEPTED_EXTENSIONS = constantsData.fileTypes.extensions;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Document File <span className="text-red-500">*</span>
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
            ${isDragging ? 'border-green-500 bg-green-50 scale-[1.02]' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={ACCEPTED_EXTENSIONS.join(',')}
            onChange={handleFileInputChange}
          />
          
          {!selectedFile ? (
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="w-10 h-10 mx-auto mb-3 text-green-500" />
              <p className="text-base font-semibold text-gray-700 mb-1">
                Drag and drop your document here
              </p>
              <p className="text-sm text-gray-500 mb-3">
                or click to browse files
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                <FileText className="w-3 h-3 mr-1" />
                PDF, JPEG, PNG, TIFF
              </div>
            </label>
          ) : (
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                type="button"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Metadata Form */}
      <div className="space-y-4">
        {/* Document Type */}
        <div>
          <label htmlFor="documentType" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Document Type <span className="text-red-500">*</span>
          </label>
          <select
            id="documentType"
            {...register('documentType', { required: 'Document type is required' })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="">Select document type</option>
            {DOCUMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.documentType && (
            <p className="mt-1 text-sm text-red-600">{errors.documentType.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-gray-900 mb-1.5">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            {...register('state', { required: 'State is required' })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="">Select state</option>
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label htmlFor="district" className="block text-sm font-semibold text-gray-900 mb-1.5">
            District <span className="text-red-500">*</span>
          </label>
          <select
            id="district"
            {...register('district', { required: 'District is required' })}
            disabled={!selectedState}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select district</option>
            {availableDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
          )}
        </div>

        {/* Village */}
        <div>
          <label htmlFor="village" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Village <span className="text-red-500">*</span>
          </label>
          <select
            id="village"
            {...register('village', { required: 'Village is required' })}
            disabled={!selectedDistrict}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select village</option>
            {availableVillages.map(village => (
              <option key={village} value={village}>{village}</option>
            ))}
          </select>
          {errors.village && (
            <p className="mt-1 text-sm text-red-600">{errors.village.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            {...register('date', { required: 'Date is required' })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
            placeholder="Enter document description..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-semibold shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
      >
        <Upload className="w-5 h-5" />
        <span>Upload Document</span>
      </button>
    </form>
  );
}
