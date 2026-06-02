import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'banners.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const banners = JSON.parse(fileContents);
    return NextResponse.json(banners);
  } catch (error) {
    // Return empty array if file doesn't exist
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const newBanners = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(newBanners, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update banners' }, { status: 500 });
  }
}
