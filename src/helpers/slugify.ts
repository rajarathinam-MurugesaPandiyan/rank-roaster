export const schoolSlugify = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-');
};

export const schoolUnslugify = (slug: string): string => {
  if (!slug || slug === "default-school") return "AcademicIQ School";
  // If slug is a 24-character MongoDB hex ObjectID, return default clean fallback
  if (/^[0-9a-fA-F]{24}$/.test(slug.trim())) {
    return "AcademicIQ School";
  }
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
