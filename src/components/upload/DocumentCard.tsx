'use client';

import { FileText, Download, Eye, Calendar, MapPin } from 'lucide-react';
import { Document } from '@/types/document';

interface DocumentCardProps {
  document: Document;
  viewMode: 'grid' | 'list';
  onViewDetails: (document: Document) => void;
}

const getDocumentIcon = () => {
  return <FileText className="w-8 h-8 text-blue-500" />;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
    case 'Issued':
    case 'Verified':
      return 'text-green-600 bg-green-50';
    case 'Pending':
    case 'Under Review':
    case 'Submitted':
      return 'text-yellow-600 bg-yellow-50';
    case 'Archived':
    case 'Processed':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-blue-600 bg-blue-50';
  }
};

export default function DocumentCard({ document, viewMode, onViewDetails }: DocumentCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate download
    alert(`Downloading: ${document.name}`);
  };

  if (viewMode === 'list') {
    return (
      <div className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-green-300 transition-all duration-200 bg-white group">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
            {getDocumentIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{document.name}</h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
                {document.type}
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                {document.village}, {document.district}, {document.state}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                {document.date}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(document.status)}`}>
                {document.status}
              </span>
              <span className="text-xs font-medium text-gray-500">{document.fileSize}</span>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-1">
            <button
              onClick={() => onViewDetails(document)}
              className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
              title="View details"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-green-300 transition-all duration-200 bg-white cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
          {getDocumentIcon()}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(document.status)}`}>
          {document.status}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors" title={document.name}>
        {document.name}
      </h3>

      <div className="space-y-1.5 text-sm text-gray-600 mb-4">
        <p className="flex items-start">
          <FileText className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-1">{document.type}</span>
        </p>
        <p className="flex items-start">
          <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-1">{document.village}, {document.district}</span>
        </p>
        <p className="flex items-center">
          <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
          {document.date}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500">{document.fileSize}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onViewDetails(document)}
            className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
