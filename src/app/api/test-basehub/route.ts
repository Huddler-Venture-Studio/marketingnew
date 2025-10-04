import { NextResponse } from 'next/server';
import { basehub } from 'basehub';

export async function GET() {
  const weeklyUpdateClient = basehub({
    token: process.env.BASEHUB_WEEKLYUPDATE_TOKEN!,
  });

  try {
    // Try different naming conventions
    const data = await weeklyUpdateClient.query({
      __typename: true,
      _sys: {
        id: true,
        title: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetails: error,
    }, { status: 500 });
  }
}
