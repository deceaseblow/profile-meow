export const fuzzyMatch = (str, query) => {
  if (!str || !query) return false;
  str = str.toLowerCase();
  query = query.toLowerCase();
  return [...query].every((char) => str.includes(char));
};
