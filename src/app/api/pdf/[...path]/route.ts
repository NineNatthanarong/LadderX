import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const params = await props.params;
  const pathParams = params.path;
  const filePath = path.join(process.cwd(), 'data', ...pathParams);

  // Security check: Ensure we don't escape the data directory
  const dataDir = path.join(process.cwd(), 'data');
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(dataDir)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File Not Found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': stats.size.toString(),
      // 'Content-Disposition': `inline; filename="${path.basename(filePath)}"` // Optional
    },
  });
}
