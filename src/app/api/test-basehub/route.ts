import { NextResponse } from 'next/server';
import { basehub } from 'basehub';

export async function GET() {
  const weeklyUpdateClient = basehub({
    token: process.env.BASEHUB_WEEKLYUPDATE_TOKEN!,
  });

  try {
    const data = await weeklyUpdateClient.query({
      __typename: true,
      generalCopy: {
        _id: true,
        _title: true,
        name: true,
        txt1: true,
        txt2: true,
        txt1Color: {
          hex: true,
        },
        accent: {
          hex: true,
        },
      },
      days: {
        items: {
          _id: true,
          _title: true,
          date: true,
          day: true,
          stuff: {
            json: {
              content: true,
            },
            plainText: true,
          },
        },
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
