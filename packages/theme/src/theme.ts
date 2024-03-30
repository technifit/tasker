import { z } from 'zod';

const defaultTheme: Theme = {
  accentColor: '240 4.8% 95.9%',
  accentForegroundColor: '240 5.9% 10%',
  backgroundColor: '0 0% 100%',
  borderColor: '240 5.9% 90%',
  cardColor: '0 0% 100%',
  cardForegroundColor: '240 10% 3.9%',
  destructiveColor: '0 84.2% 60.2%',
  destructiveForegroundColor: '0 0% 98%',
  foregroundColor: '240 10% 3.9%',
  inputColor: '240 5.9% 90%',
  mutedColor: '240 4.8% 95.9%',
  mutedForegroundColor: '240 3.8% 46.1%',
  popoverColor: '0 0% 100%',
  popoverForegroundColor: '240 10% 3.9%',
  primaryColor: '346.8 77.2% 49.8%',
  primaryForegroundColor: '355.7 100% 97.3%',
  radius: '0.5rem',
  ringColor: '346.8 77.2% 49.8%',
  secondaryColor: '142.1 76.2% 36.3%',
  secondaryForegroundColor: '355.7 100% 97.3%',
};

interface Theme {
  accentColor: string;
  accentForegroundColor: string;
  backgroundColor: string;
  borderColor: string;
  cardColor: string;
  cardForegroundColor: string;
  destructiveColor: string;
  destructiveForegroundColor: string;
  foregroundColor: string;
  inputColor: string;
  mutedColor: string;
  mutedForegroundColor: string;
  popoverColor: string;
  popoverForegroundColor: string;
  primaryColor: string;
  primaryForegroundColor: string;
  radius: string;
  ringColor: string;
  secondaryColor: string;
  secondaryForegroundColor: string;
}

const themeSchema = z.object({
  accentColor: z.string().default(defaultTheme.accentColor),
  accentForegroundColor: z.string().default(defaultTheme.accentForegroundColor),
  backgroundColor: z.string().default(defaultTheme.backgroundColor),
  borderColor: z.string().default(defaultTheme.borderColor),
  cardColor: z.string().default(defaultTheme.cardColor),
  cardForegroundColor: z.string().default(defaultTheme.cardForegroundColor),
  destructiveColor: z.string().default(defaultTheme.destructiveColor),
  destructiveForegroundColor: z.string().default(defaultTheme.destructiveForegroundColor),
  foregroundColor: z.string().default(defaultTheme.foregroundColor),
  inputColor: z.string().default(defaultTheme.inputColor),
  mutedColor: z.string().default(defaultTheme.mutedColor),
  mutedForegroundColor: z.string().default(defaultTheme.mutedForegroundColor),
  popoverColor: z.string().default(defaultTheme.popoverColor),
  popoverForegroundColor: z.string().default(defaultTheme.popoverForegroundColor),
  primaryColor: z.string().default(defaultTheme.primaryColor),
  primaryForegroundColor: z.string().default(defaultTheme.primaryForegroundColor),
  radius: z.string().default(defaultTheme.radius),
  ringColor: z.string().default(defaultTheme.ringColor),
  secondaryColor: z.string().default(defaultTheme.secondaryColor),
  secondaryForegroundColor: z.string().default(defaultTheme.secondaryForegroundColor),
});

export type { Theme };
export { themeSchema, defaultTheme };
