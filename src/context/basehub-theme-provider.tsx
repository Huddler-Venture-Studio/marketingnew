import { Pump } from "basehub/react-pump";
import { fragmentOn } from "basehub";
import colors from "tailwindcss/colors";
import { oklch, rgb } from "culori";

export const themeFragment = fragmentOn("Theme", { accent: true, grayScale: true });

export type BaseHubTheme = fragmentOn.infer<typeof themeFragment>;

const CONTRAST_WARNING_COLORS: (keyof typeof colors)[] = [
  "amber",
  "cyan",
  "green",
  "lime",
  "yellow",
];

function anyColorToRgb(color: string) {
  const parsed = oklch(color); // or use parse() for any format
  const converted = rgb(parsed);
  if (!converted) throw new Error(`Invalid color format: ${color}`);
  return {
    r: Math.round(converted.r * 255),
    g: Math.round(converted.g * 255),
    b: Math.round(converted.b * 255),
  };
}

export function BaseHubThemeProvider() {
  return (
    <>
      {/* Fallback theme that loads immediately */}
      <style>{`
        :root {
          --accent-50: #f0f9ff;
          --accent-100: #e0f2fe;
          --accent-200: #bae6fd;
          --accent-300: #7dd3fc;
          --accent-400: #38bdf8;
          --accent-500: #0ea5e9;
          --accent-600: #0284c7;
          --accent-700: #0369a1;
          --accent-800: #075985;
          --accent-900: #0c4a6e;
          --accent-950: #082f49;
          --accent-rgb-50: 240, 249, 255;
          --accent-rgb-500: 14, 165, 233;
          --accent-rgb-950: 8, 47, 73;
          
          --grayscale-50: #f9fafb;
          --grayscale-100: #f3f4f6;
          --grayscale-200: #e5e7eb;
          --grayscale-300: #d1d5db;
          --grayscale-400: #9ca3af;
          --grayscale-500: #6b7280;
          --grayscale-600: #4b5563;
          --grayscale-700: #374151;
          --grayscale-800: #1f2937;
          --grayscale-900: #111827;
          --grayscale-950: #030712;
          --grayscale-rgb-50: 249, 250, 251;
          --grayscale-rgb-500: 107, 114, 128;
          --grayscale-rgb-950: 3, 7, 18;
          
          --text-on-accent: #ffffff;
        }
      `}</style>
      
      <Pump queries={[{ site: { settings: { theme: themeFragment } } }]}>
        {async ([data]) => {
          "use server";
          
          try {
            const accent = colors[data.site.settings.theme.accent] || colors.blue;
            const grayScale = colors[data.site.settings.theme.grayScale] || colors.gray;

            const css = Object.entries(accent).map(([key, value]) => {
              const rgb = anyColorToRgb(value);
              return `--accent-${key}: ${value}; --accent-rgb-${key}: ${rgb.r}, ${rgb.g}, ${rgb.b};`;
            });

            Object.entries(grayScale).forEach(([key, value]) => {
              const rgb = anyColorToRgb(value);
              css.push(
                `--grayscale-${key}: ${value}; --grayscale-rgb-${key}: ${rgb.r}, ${rgb.g}, ${rgb.b};`,
              );
            });
            
            if (CONTRAST_WARNING_COLORS.includes(data.site.settings.theme.accent)) {
              css.push(`--text-on-accent: ${colors.gray[950]};`);
            }

            return (
              <style>{`
            :root {
              ${css.join("\n")}
            }
            `}</style>
            );
          } catch {
            // If BaseHub fails, the fallback theme above will be used
            console.warn("BaseHub theme loading failed, using fallback theme");
            return null;
          }
        }}
      </Pump>
    </>
  );
}
