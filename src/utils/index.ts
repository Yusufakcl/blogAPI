export const genUsername=():string =>{
    const userNamePrefix='user-';
    const randomChars=Math.random().toString(36).slice(2);

    const username=userNamePrefix+randomChars;

    return username;
}

/**
 * Generate a random slug from a title (e.g. my-title-abc123)
 * @param title The title to generate a slug from
 * @returns A random slug
 */
export const genSlug = (title: string): string => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]\s-/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  
    const randomChars = Math.random().toString(36).slice(2);
    const uniqueSlug = `${slug}-${randomChars}`;
  
    return uniqueSlug;
  };