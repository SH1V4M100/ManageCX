'use client';
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
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setErrorMessage('Please upload an Excel file (.xlsx, .xls, .csv)');
      setUploadState('error');
      return false;
    }

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
      await res.json();
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
        <p className="text-sm text-gray-600">
          Upload an Excel file containing employee data. The file should include employee ID, name, email, department, and position.
        </p>

        {uploadState === 'idle' || uploadState === 'error' ? (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
              ${isDragging
                  ? 'border-[#0033a0] bg-[#e6ecf8]'
                  : uploadState === 'error'
                    ? 'border-[#dc3545] bg-[#f8d7da]'
                    : 'border-gray-300 hover:border-[#0033a0] hover:bg-gray-50'
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
                <div className={`mb-2 p-2 rounded-full mx-auto w-12 h-12 flex items-center justify-center
                  ${uploadState === 'error' ? 'bg-[#f8d7da] text-[#dc3545]' : 'bg-[#e6ecf8] text-[#0033a0]'}`}>
                  {uploadState === 'error' ? <AlertCircle size={24} /> : <Upload size={24} />}
                </div>

                <p className="font-medium text-gray-700">
                  {file ? file.name : 'Drag and drop your file or click to browse'}
                </p>

                <p className="mt-1 text-xs text-gray-500">Supported formats: XLSX, XLS</p>

                {uploadState === 'error' && (
                  <p className="mt-2 text-sm text-[#dc3545]">{errorMessage}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-5 py-2.5 border border-gray-400 text-black text-sm font-semibold rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0033a0] focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpload}
                disabled={!file}
              >
                Upload
              </button>
            </div>
          </>
        ) : uploadState === 'uploading' ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 border-4 border-[#e6ecf8] border-t-[#0033a0] rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-gray-700">Uploading file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-2 p-2 rounded-full bg-[#d4edda] text-[#28a745] mx-auto w-12 h-12 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <p className="text-lg font-medium text-gray-700">Upload Complete!</p>
            <p className="mt-1 text-sm text-gray-500">
              The employee data has been successfully uploaded.
            </p>
            <button
              className="mt-3 px-5 py-2.5 border border-gray-400 text-black text-sm font-semibold rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0033a0] focus:ring-offset-2 transition"
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
