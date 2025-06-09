import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options'; // adjust path if needed

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const empId = session.user.id;

  const { searchParams } = new URL(req.url);
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');

  try {
    const response = await axios.get('http://localhost:8000/api/rosters/subtree', {
      headers: {
        'emp-id': String(empId),
      },
      params: {
        start_date,
        end_date,
      },
    });
    console.log(response.data)
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch subtree',
        detail: error.response?.data?.detail || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
