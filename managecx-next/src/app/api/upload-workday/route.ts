import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import axios from 'axios';
import FormData from 'form-data';

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(options);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || !file.name.endsWith('.xlsx')) {
      return NextResponse.json({ message: 'Invalid file format' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadForm = new FormData();
    uploadForm.append('file', buffer, file.name);

    const response = await axios.post(
      'http://localhost:8000/api/employees/upload', // change to your actual FastAPI endpoint
      uploadForm,
      {
        headers: {
          ...uploadForm.getHeaders(),
          'user-id': session.user.id, // or use email if needed
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Upload failed:', error.response?.data || error.message);
    return NextResponse.json(
      {
        message: 'Upload failed',
        detail: error.response?.data?.detail || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
};
