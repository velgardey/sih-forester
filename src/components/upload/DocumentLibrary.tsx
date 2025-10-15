'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document } from '@/types/document';
import DocumentCard from './DocumentCard';
import DocumentFilters, { FilterState, SortOption } from './DocumentFilters';
import { DocumentCardSkeleton } from '../shared/SkeletonLoader';
import { EmptyState } from '../shared/ErrorBoundary';
import { FileText } from 'lucide-react';

interface DocumentLibraryProps {
  newDocuments?: Document[];
  onViewDetails?: (document: Document) => void;
}

const ITEMS_PER_PAGE = 12;

export default function DocumentLibrary({ newDocuments = [], onViewDetails }: DocumentLibraryProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    documentType: '',
    state: '',
    district: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const prevNewDocumentsRef = useRef<Document[]>([]);

  const handleViewDetails = (document: Document) => {
    if (onViewDetails) {
      onViewDetails(document);
    }
  };

  useEffect(() => {
    // Load documents from JSON file
    const loadDocuments = async () => {
      try {
        // Import the JSON file directly instead of fetching
        const documentsModule = await import('@/data/documents.json');
        const data = documentsModule.default || documentsModule;
        // Merge initial newDocuments with loaded documents
        const loadedDocs = data.documents || [];
        const allDocs = newDocuments.length > 0 
          ? [...newDocuments, ...loadedDocs]
          : loadedDocs;
        setDocuments(allDocs);
        prevNewDocumentsRef.current = newDocuments;
      } catch (error) {
        console.error('Error loading documents:', error);
        setDocuments(newDocuments);
        prevNewDocumentsRef.current = newDocuments;
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [newDocuments]);

  // Update documents when new ones are added after initial load
  useEffect(() => {
    // Skip if still loading or if this is the initial load
    if (isLoading) return;
    
    // Only update if newDocuments has actually changed
    const hasChanged = newDocuments.length !== prevNewDocumentsRef.current.length ||
      newDocuments.some((doc, idx) => doc.id !== prevNewDocumentsRef.current[idx]?.id);
    
    if (hasChanged && newDocuments.length > 0) {
      setDocuments(prev => {
        const existingIds = new Set(prev.map(d => d.id));
        const uniqueNewDocs = newDocuments.filter(d => !existingIds.has(d.id));
        return [...uniqueNewDocs, ...prev];
      });
      prevNewDocumentsRef.current = newDocuments;
    }
  }, [newDocuments, isLoading]);

  // Filter, search, and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...documents];

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(doc =>
        doc.name.toLowerCase().includes(search) ||
        doc.description.toLowerCase().includes(search) ||
        doc.type.toLowerCase().includes(search) ||
        doc.village.toLowerCase().includes(search) ||
        doc.district.toLowerCase().includes(search) ||
        doc.state.toLowerCase().includes(search)
      );
    }

    // Apply filters
    if (filters.documentType) {
      result = result.filter(doc => doc.type === filters.documentType);
    }
    if (filters.state) {
      result = result.filter(doc => doc.state === filters.state);
    }
    if (filters.district) {
      result = result.filter(doc => doc.district === filters.district);
    }
    if (filters.dateFrom) {
      result = result.filter(doc => doc.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(doc => doc.date <= filters.dateTo);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.date.localeCompare(a.date);
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'location':
          return `${a.state}${a.district}${a.village}`.localeCompare(`${b.state}${b.district}${b.village}`);
        default:
          return 0;
      }
    });

    return result;
  }, [documents, searchTerm, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedDocuments, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <DocumentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <DocumentFilters
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        onSortChange={setSortBy}
      />

      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedDocuments.length} document{filteredAndSortedDocuments.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Grid view"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Documents display */}
      {filteredAndSortedDocuments.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {paginatedDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                viewMode={viewMode}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
