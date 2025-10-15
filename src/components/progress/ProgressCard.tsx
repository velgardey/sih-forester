'use client';

import React from 'react';
import { ProgressSummary } from '@/types/claim';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface ProgressCardProps {
  data: ProgressSummary;
  level: 'village' | 'block' | 'district' | 'state';
  name: string;
}

export default function ProgressCard({ data, level, name }: ProgressCardProps) {
  const { totalClaims, grantedClaims, pendingClaims, rejectedClaims, coverage, households } = data;
  
  const underReviewClaims = totalClaims - grantedClaims - pendingClaims - rejectedClaims;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      case 'review':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 70) return 'bg-green-500';
    if (coverage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">{level} Progress</h3>
        <p className="text-sm text-gray-600">{name}</p>
      </div>

      {/* Coverage Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">FRA Coverage</span>
          <span className="text-sm font-bold text-gray-900">{coverage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${getCoverageColor(coverage)} h-3 rounded-full transition-all duration-300`}
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      {/* Claims Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Claims</p>
          <p className="text-2xl font-bold text-gray-900">{totalClaims}</p>
        </div>
        {households && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Households</p>
            <p className="text-2xl font-bold text-gray-900">{households.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Status Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-5 h-5 ${getStatusColor('granted')}`} />
            <span className="text-sm text-gray-700">Granted</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{grantedClaims}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${getStatusColor('pending')}`} />
            <span className="text-sm text-gray-700">Pending</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{pendingClaims}</span>
        </div>

        {underReviewClaims > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${getStatusColor('review')}`} />
              <span className="text-sm text-gray-700">Under Review</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{underReviewClaims}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className={`w-5 h-5 ${getStatusColor('rejected')}`} />
            <span className="text-sm text-gray-700">Rejected</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{rejectedClaims}</span>
        </div>
      </div>

      {/* Success Rate */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Success Rate</span>
          <span className="text-sm font-bold text-green-600">
            {totalClaims > 0 ? Math.round((grantedClaims / totalClaims) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}
