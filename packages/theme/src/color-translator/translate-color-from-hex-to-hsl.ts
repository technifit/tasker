import { ColorTranslator } from 'colortranslator';

const translateColorFromHexToHsl = (hex: string): string => {
  const colortranslator = new ColorTranslator(hex);
  const hsla = colortranslator.HSLAObject;

  return `${hsla.H}deg ${hsla.S}% ${hsla.L}%`;
};

export { translateColorFromHexToHsl };
