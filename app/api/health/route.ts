import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    const version = process.env.npm_package_version || '0.2.0';

    return NextResponse.json({
      status: 'ok',
      version,
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      version: process.env.npm_package_version || '0.2.0',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
