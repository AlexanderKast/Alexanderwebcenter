import { NextRequest, NextResponse } from 'next/server';
import { brandIntakeSchema } from '@/lib/clientes/form-schema';
import { uploadToGoogleDrive } from '@/lib/clientes/google-drive';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = brandIntakeSchema.parse(body);

    const result = await uploadToGoogleDrive({
      ...validated,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Submit error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
