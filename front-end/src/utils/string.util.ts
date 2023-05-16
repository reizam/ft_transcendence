export const generateAcronymFromList = (list: string[], limit = 2): string =>
  list
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, limit);
