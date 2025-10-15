'use client';

import { X, Download, FileText, MapPin, Calendar, User, Clock } from 'lucide-react';
import { Document } from '@/types/document';

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentPreview({ document, isOpen, onClose }: DocumentPreviewProps) {
  if (!isOpen || !document) return null;

  const handleDownload = () => {
    alert(`Downloading: ${document.name}`);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{document.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center bg-white px-2 py-1 rounded-lg">
                <FileText className="w-4 h-4 mr-1.5 text-green-600" />
                {document.type}
              </span>
              <span className="flex items-center bg-white px-2 py-1 rounded-lg">
                <Calendar className="w-4 h-4 mr-1.5 text-green-600" />
                {document.date}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Document Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                <p className="flex items-start text-gray-900">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{document.village}, {document.district}, {document.state}</span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  document.status === 'Approved' || document.status === 'Issued' || document.status === 'Verified'
                    ? 'bg-green-100 text-green-800'
                    : document.status === 'Pending' || document.status === 'Under Review' || document.status === 'Submitted'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {document.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Uploaded By</h3>
                <p className="flex items-center text-gray-900">
                  <User className="w-4 h-4 mr-2" />
                  {document.uploadedBy}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Upload Date</h3>
                <p className="flex items-center text-gray-900">
                  <Clock className="w-4 h-4 mr-2" />
                  {document.uploadedDate}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">File Type</h3>
                <p className="text-gray-900">{document.fileType}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">File Size</h3>
                <p className="text-gray-900">{document.fileSize}</p>
              </div>

              {document.claimants && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Claimants</h3>
                  <p className="text-gray-900">{document.claimants} households</p>
                </div>
              )}

              {document.landArea && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Land Area</h3>
                  <p className="text-gray-900">{document.landArea}</p>
                </div>
              )}

              {document.attendees && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Attendees</h3>
                  <p className="text-gray-900">{document.attendees} people</p>
                </div>
              )}

              {document.validUntil && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Valid Until</h3>
                  <p className="text-gray-900">{document.validUntil}</p>
                </div>
              )}

              {document.scale && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Scale</h3>
                  <p className="text-gray-900">{document.scale}</p>
                </div>
              )}

              {document.witnesses && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Witnesses</h3>
                  <p className="text-gray-900">{document.witnesses} people</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-900 leading-relaxed">{document.description}</p>
            </div>

            {/* Preview Area */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Document Preview</h3>
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Preview not available</p>
                <p className="text-sm text-gray-500">
                  Download the document to view its contents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-semibold shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
