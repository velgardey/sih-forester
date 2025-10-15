'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import UploadInterface from '@/components/upload/UploadInterface';
import DocumentLibrary from '@/components/upload/DocumentLibrary';
import DocumentPreview from '@/components/upload/DocumentPreview';
import { CheckCircle, Upload as UploadIcon, Library } from 'lucide-react';
import { Document } from '@/types/document';
import { useToast, ToastContainer } from '@/components/shared/Toast';

export default function UploadPage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toasts, removeToast, success } = useToast();

  const handleViewDetails = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDocument(null);
  };

  const handleUploadComplete = async (uploadData: any) => {
    setIsUploading(true);
    setUploadProgress(0);
    setShowSuccess(false);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create new document entry
    const newDocument = {
      id: `doc_${Date.now()}`,
      name: uploadData.file.name,
      type: uploadData.documentType,
      state: uploadData.state,
      district: uploadData.district,
      village: uploadData.village,
      date: uploadData.date,
      description: uploadData.description,
      fileType: uploadData.file.type.split('/')[1].toUpperCase() || 'PDF',
      fileSize: `${(uploadData.file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: 'Current User',
      uploadedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setUploadedDocuments(prev => [newDocument, ...prev]);
    setIsUploading(false);
    setUploadProgress(0);
    setShowSuccess(true);

    // Show success toast
    success('Upload Successful!', 'Your document has been added to the library.');

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header activeView="upload" />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 p-3 rounded-lg">
                <UploadIcon className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">Document Management</h1>
                <p className="mt-1 text-black">
                  Upload FRA documents and manage your digital library
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-center space-x-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Upload Successful!</p>
                <p className="text-sm text-green-700">Your document has been added to the library.</p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-blue-900">Uploading document...</p>
                <span className="text-sm font-medium text-blue-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <div className="flex items-center space-x-2 mb-6">
                  <UploadIcon className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
                </div>
                <UploadInterface onUploadComplete={handleUploadComplete} />
              </div>
            </div>

            {/* Document Library Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Library className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Document Library</h2>
                </div>
                <DocumentLibrary 
                  newDocuments={uploadedDocuments}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </div>
          </div>

          {/* Document Preview Modal */}
          <DocumentPreview
            document={selectedDocument}
            isOpen={isPreviewOpen}
            onClose={handleClosePreview}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
