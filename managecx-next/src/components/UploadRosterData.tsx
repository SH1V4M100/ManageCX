'use client';
import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import AdminCard from './ui/admin-card';

const TEAMS = [
  { id: 'team-1', name: 'Customer Support' },
  { id: 'team-2', name: 'Sales' },
  { id: 'team-3', name: 'Technical Support' },
  { id: 'team-4', name: 'Back Office' },
  { id: 'team-5', name: 'Quality Assurance' },
];

const UploadRosterData: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) setFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && validateFile(selected)) setFile(selected);
  };

  const validateFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(extension)) {
      setErrorMessage('Please upload an Excel file (.xlsx, .xls, .csv)');
      setUploadState('error');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-roster', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Upload failed');
      }

      setUploadState('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Upload failed');
      setUploadState('error');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setSelectedTeam('');
    setUploadState('idle');
    setErrorMessage('');
  };

  return (
    <AdminCard title="Upload Roster Data" icon={<Calendar size={18} color="black" />}>
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Upload a roster schedule for a specific team. The file should include shift times, breaks, and employee assignments.
        </p>

        {uploadState === 'idle' || uploadState === 'error' ? (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-yellow-400 bg-yellow-50'
                  : uploadState === 'error'
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-300 hover:border-yellow-400 hover:bg-slate-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('roster-file-upload')?.click()}
            >
              <input
                type="file"
                id="roster-file-upload"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />

              <div className="text-center">
                {uploadState === 'error' ? (
                  <div className="mb-2 p-2 rounded-full bg-red-100 text-red-600 mx-auto w-12 h-12 flex items-center justify-center">
                    <AlertCircle size={24} />
                  </div>
                ) : (
                  <div className="mb-2 p-2 rounded-full bg-yellow-100 text-yellow-600 mx-auto w-12 h-12 flex items-center justify-center">
                    <Upload size={24} />
                  </div>
                )}
                <p className="font-medium text-slate-700">
                  {file ? file.name : 'Drag and drop your file or click to browse'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Supported formats: XLSX, XLS, CSV
                </p>
                {uploadState === 'error' && (
                  <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-5 py-2.5 border border-slate-400 text-black text-sm font-semibold rounded-md bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpload}
                disabled={!file}
              >
                Upload
              </button>
            </div>
          </>
        ) : uploadState === 'uploading' ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 border-4 border-yellow-100 border-t-yellow-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-slate-700">Uploading roster...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-2 p-2 rounded-full bg-green-100 text-green-600 mx-auto w-12 h-12 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <p className="text-lg font-medium text-slate-700">Upload Complete!</p>
            <p className="mt-1 text-sm text-slate-500">
              The roster data has been successfully uploaded.
            </p>
            <button
              className="mt-4 px-5 py-2.5 border border-slate-400 text-black text-sm font-semibold rounded-md bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition"
              onClick={resetUpload}
            >
              Upload Another Roster
            </button>
          </div>
        )}
      </div>
    </AdminCard>
  );
};

export default UploadRosterData;
