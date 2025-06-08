'use client'
import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import AdminCard from './ui/admin-card';

const UploadEmployeeData: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
  if (!file) return;

  setUploadState('uploading');
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/upload-workday', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    console.log('Success:', data);
    setUploadState('success');
  } catch (error) {
    console.error(error);
    setUploadState('error');
  }
};
  
  const resetUpload = () => {
    setFile(null);
    setUploadState('idle');
    setErrorMessage('');
  };
  
  return (
    <AdminCard title="Upload Employee Data" icon={<FileSpreadsheet size={18} color="black" />}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Upload an Excel file containing employee data. The file should include employee ID, name, email, department, and position.
        </p>
        
        {uploadState === 'idle' || uploadState === 'error' ? (
          <>
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
              onClick={() => document.getElementById('employee-file-upload')?.click()}
            >
              <input
                type="file"
                id="employee-file-upload"
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
            
            <div className="flex justify-end">
              <button
                className="px-5 py-2.5 border border-gray-400 text-black text-sm font-semibold rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpload}
                disabled={!file}
              >
                Upload
              </button>
            </div>
          </>
        ) : uploadState === 'uploading' ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-gray-700">Uploading file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-2 p-2 rounded-full bg-success-100 text-success-500 mx-auto w-12 h-12 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <p className="text-lg font-medium text-gray-700">Upload Complete!</p>
            <p className="mt-1 text-sm text-gray-500">
              The employee data has been successfully uploaded.
            </p>
            <button
              className="px-5 py-2.5 border border-gray-400 text-black text-sm font-semibold rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={resetUpload}
            >
              Upload Another File
            </button>
          </div>
        )}
      </div>
    </AdminCard>
  );
};

export default UploadEmployeeData;