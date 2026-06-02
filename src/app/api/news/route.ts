import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'news.json');

// Initialize if it doesn't exist
async function initFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify([]), 'utf8');
  }
}

export async function GET() {
  try {
    await initFile();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const news = JSON.parse(fileContents);
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const newNews = await request.json();
    await initFile();
    await fs.writeFile(dataFilePath, JSON.stringify(newNews, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}
