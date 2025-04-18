export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and _ with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
};
