import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;
    const businessSlug = formData.get('businessSlug') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!businessSlug) {
      return NextResponse.json(
        { error: 'Business slug is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG and PNG files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine file extension
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    const filename = `${businessSlug}_logo.${ext}`;

    // Resize image to max height 200px maintaining aspect ratio
    const resizedBuffer = await sharp(buffer)
      .resize({
        height: 200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(ext === 'png' ? 'png' : 'jpeg')
      .toBuffer();

    // Save to public/uploads
    const filepath = join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, resizedBuffer);

    const logoUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, logoUrl });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
