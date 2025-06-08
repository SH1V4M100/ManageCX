import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import axios from 'axios';
import FormData from 'form-data';

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(options);

  if (!session || session.user?.role === 'read') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || !file.name.endsWith('.xlsx')) {
      return NextResponse.json({ message: 'Invalid file format' }, { status: 400 });
    }

    // Convert file (Web API) to Node.js Readable stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadForm = new FormData();
    uploadForm.append('file', buffer, file.name);

    const response = await axios.post(
      'http://localhost:8000/api/rosters/upload-roster',
      uploadForm,
      {
        headers: {
          ...uploadForm.getHeaders(),
          'x-user-email': session.user.email, // Optional if FastAPI expects this
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Upload failed:', error.response?.data || error.message);
    return NextResponse.json(
      {
        message: 'Roster upload failed',
        detail: error.response?.data?.detail || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
};
