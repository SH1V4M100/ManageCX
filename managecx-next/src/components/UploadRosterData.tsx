'use client'
import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import AdminCard from './ui/admin-card';

// Hardcoded team values as per requirements
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
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };
  
  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
  };
  
  const validateFile = (file: File): boolean => {
    // Check if it's an Excel file
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setErrorMessage('Please upload an Excel file (.xlsx, .xls, .csv)');
      setUploadState('error');
      return false;
    }
    
    // Reset error state if file is valid
    setErrorMessage('');
    return true;
  };
  
  const handleUpload = async () => {
  if (!file || !selectedTeam) {
    if (!selectedTeam) {
      setErrorMessage('Please select a team');
    }
    setUploadState('error');
    return;
  }

  setUploadState('uploading');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload-roster', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Upload failed');
    }

    setUploadState('success');
    setErrorMessage('');
  } catch (error: any) {
    console.error('Upload error:', error);
    setUploadState('error');
    setErrorMessage(error.message);
  }
};
  
  const resetUpload = () => {
    setFile(null);
    setSelectedTeam('');
    setUploadState('idle');
    setErrorMessage('');
  };
  
  return (
    <AdminCard title="Upload Roster Data" icon={<Calendar size={18} color="black"/>}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Upload a roster schedule for a specific team. The file should include shift times, breaks, and employee assignments.
        </p>
        
        {uploadState === 'idle' || uploadState === 'error' ? (
          <>
            <div className="space-y-4">
            <div>
              <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Team
              </label>
              <select
                id="team-select"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-800"
                value={selectedTeam}
                onChange={handleTeamChange}
              >
                <option value="">Dropdown Menu</option>
                {TEAMS.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : uploadState === 'error'
                    ? 'border-error-300 bg-error-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
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
                    <div className="mb-2 p-2 rounded-full bg-error-100 text-error-500 mx-auto w-12 h-12 flex items-center justify-center">
                      <AlertCircle size={24} />
                    </div>
                  ) : (
                    <div className="mb-2 p-2 rounded-full bg-primary-100 text-primary-500 mx-auto w-12 h-12 flex items-center justify-center">
                      <Upload size={24} />
                    </div>
                  )}
                  
                  <p className="font-medium text-gray-700">
                    {file ? file.name : 'Drag and drop your file or click to browse'}
                  </p>
                  
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: XLSX, XLS, CSV
                  </p>
                  
                  {uploadState === 'error' && (
                    <p className="mt-2 text-sm text-error-500">{errorMessage}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="px-5 py-2.5 border border-gray-400 text-black text-sm font-semibold rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpload}
                disabled={!file || !selectedTeam}
              >
                Upload
              </button>
            </div>
          </>
        ) : uploadState === 'uploading' ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-gray-700">Uploading roster...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-2 p-2 rounded-full bg-success-100 text-success-500 mx-auto w-12 h-12 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <p className="text-lg font-medium text-gray-700">Upload Complete!</p>
            <p className="mt-1 text-sm text-gray-500">
              The roster data for {TEAMS.find(t => t.id === selectedTeam)?.name} has been successfully uploaded.
            </p>
            <button
              className="px-5 py-2.5 border border-gray-400 text-black text-sm font-semibold rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
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