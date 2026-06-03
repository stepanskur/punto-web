import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'partners.json');

const DEFAULT_DATA = {
  primaryCompanyId: 17643,
  partners: [{ id: 17643, name: 'Punto Fly', imageUrl: '' }]
};

// Initialize if it doesn't exist
async function initFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    // Save default
    await fs.writeFile(dataFilePath, JSON.stringify(DEFAULT_DATA), 'utf8');
  }
}

export async function GET() {
  try {
    await initFile();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    // Migration for old array format
    if (Array.isArray(data)) {
      return NextResponse.json({ primaryCompanyId: 17643, partners: data });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(DEFAULT_DATA);
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    await initFile();
    await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update partners' }, { status: 500 });
  }
}
