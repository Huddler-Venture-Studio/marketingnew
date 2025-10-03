"use client";

import { useState } from "react";

interface Update {
  _id: string;
  _title: string;
  date?: string;
  day?: string;
  stuff?: {
    plainText?: string;
  };
}

interface UpdatesListProps {
  updates: Update[];
  accentColor?: string;
}

export default function UpdatesList({ updates }: UpdatesListProps) {
  // Initialize all updates as open by default
  const [openUpdates, setOpenUpdates] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    updates.forEach(update => {
      initialState[update._id] = true;
    });
    return initialState;
  });

  const toggleUpdate = (id: string) => {
    setOpenUpdates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-2">
      {updates.map((update) => {
        const isOpen = openUpdates[update._id];

        return (
          <article key={update._id}>
            <button
              onClick={() => toggleUpdate(update._id)}
              className="flex w-full items-center gap-2 text-left hover:opacity-80 transition-opacity"
              style={{ fontSize: '16px' }}
            >
              <svg
                className={`h-4 w-4 text-white transition-transform ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-white font-bold">
                {update.date || update._title}
              </span>
            </button>

            {isOpen && update.stuff?.plainText && (
              <div className="ml-6 mt-4 space-y-4 text-gray-300">
                {(() => {
                  const content = update.stuff.plainText!.trim();
                  const lines = content.split('\n').filter(line => line.trim());

                  // Group lines into sections based on structure
                  const sections: { header: string; subSections: { title: string; items: string[] }[] }[] = [];

                  let currentSection: { header: string; subSections: { title: string; items: string[] }[] } | null = null;
                  let currentSubSection: { title: string; items: string[] } | null = null;

                  lines.forEach((line, idx) => {
                    const trimmed = line.trim();

                    // First section uses day field as header
                    if (idx === 0 && update.day) {
                      currentSection = { header: update.day, subSections: [] };
                      sections.push(currentSection);

                      // First line becomes a sub-section header
                      currentSubSection = { title: trimmed, items: [] };
                      currentSection.subSections.push(currentSubSection);
                    } else if (idx === 0 && !update.day) {
                      // No day field, first line is main header
                      currentSection = { header: trimmed, subSections: [] };
                      sections.push(currentSection);
                    } else {
                      // Check if this line is a sub-section header or an item
                      // A line is a sub-section header if it's not indented and next line exists
                      const nextLine = lines[idx + 1];
                      const isSubHeader = nextLine && !trimmed.startsWith('*') && !trimmed.startsWith('-');

                      if (isSubHeader && currentSection) {
                        // New sub-section
                        currentSubSection = { title: trimmed, items: [] };
                        currentSection.subSections.push(currentSubSection);
                      } else if (currentSubSection) {
                        // Item in current sub-section
                        currentSubSection.items.push(trimmed);
                      }
                    }
                  });

                  return sections.map((section, sectionIdx) => (
                    <div key={sectionIdx}>
                      <h3 className="mb-2 font-bold" style={{ fontSize: '16px' }}>
                        {section.header}
                      </h3>
                      {section.subSections.map((subSection, subIdx) => (
                        <div key={subIdx} className="ml-4 mb-3">
                          <h4 className="mb-1 text-gray-300" style={{ fontSize: '14px' }}>
                            {subSection.title}
                          </h4>
                          {subSection.items.length > 0 && (
                            <div className="ml-4">
                              {subSection.items.map((item, itemIdx) => {
                                // Check if line starts with a bullet character
                                const bulletMatch = item.match(/^([\*\-\•])\s*/);
                                const hasBullet = bulletMatch !== null;
                                const bulletChar = hasBullet ? bulletMatch[1] : '';
                                const textContent = hasBullet ? item.replace(/^[\*\-\•]\s*/, '') : item;

                                return (
                                  <div
                                    key={itemIdx}
                                    className="text-gray-400"
                                    style={{
                                      lineHeight: '1.5',
                                      marginBottom: '0.25rem',
                                      fontSize: '14px',
                                      display: 'flex',
                                      alignItems: 'flex-start'
                                    }}
                                  >
                                    {hasBullet && (
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          width: '1.5ch',
                                          flexShrink: 0,
                                          marginRight: '0.5rem',
                                          paddingTop: '4px'
                                        }}
                                      >
                                        {bulletChar}
                                      </span>
                                    )}
                                    <span style={{ flex: 1 }}>{textContent}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
