import { NextResponse } from 'next/server';

export async function GET() {
  const hasToken = !!process.env.BASEHUB_WEEKLYUPDATE_TOKEN;
  const tokenPrefix = process.env.BASEHUB_WEEKLYUPDATE_TOKEN?.substring(0, 15) || 'not-set';

  return NextResponse.json({
    hasToken,
    tokenPrefix,
    nodeEnv: process.env.NODE_ENV,
  });
}
