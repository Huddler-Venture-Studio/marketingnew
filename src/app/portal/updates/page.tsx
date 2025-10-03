import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { basehub } from "basehub";
import { draftMode } from "next/headers";
import UpdatesList from "./updates-list";

export const metadata: Metadata = {
  title: "Updates - Portal",
  description: "Latest updates and announcements from Huddler",
};

// Create a separate BaseHub client for the weeklyupdate repository
const weeklyUpdateClient = basehub({
  token: process.env.BASEHUB_WEEKLYUPDATE_TOKEN!,
});

export default async function UpdatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  await draftMode();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates = (data as any).days.items;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generalCopy = (data as any).generalCopy;

  return (
    <div className="min-h-screen bg-black font-mono text-white">
      {/* Top banner */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '100%',
          height: '240px',
          background: 'linear-gradient(to top, #f3f4f6, #ffffff)',
          backgroundImage: 'linear-gradient(to top, #111827, #1f2937)'
        }}
      >
        <div
          className="flex flex-col justify-center"
          style={{
            width: '500.64px',
            height: 'auto',
            alignItems: 'normal'
          }}
        >
          {generalCopy?.txt1 && (
            <h1
              className="font-bold mb-2"
              style={{
                fontSize: '14px',
                color: generalCopy?.txt1Color?.hex || '#ffffff'
              }}
            >
              {generalCopy.txt1}
            </h1>
          )}
          {generalCopy?.txt2 && (
            <p className="text-gray-400" style={{ fontSize: '14px' }}>
              {generalCopy.txt2}
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pb-16" style={{ paddingTop: '16px' }}>
        {/* Header */}
        <div className="mb-12">
          <p className="text-gray-400">
            a weekly log of what{' '}
            <span style={{ color: generalCopy?.accent?.hex || '#ef4444' }}>
              {generalCopy?.name}
            </span>
            {' '}got done this week.
          </p>
        </div>

        {/* Updates */}
        {!updates || updates.length === 0 ? (
          <div className="p-12">
            <p className="text-gray-400">No updates available yet.</p>
          </div>
        ) : (
          <UpdatesList updates={updates} accentColor={generalCopy?.accent?.hex} />
        )}
      </div>
    </div>
  );
}
