/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} str - The input string to be capitalized.
 * @returns {string} - The input string with the first letter capitalized.
 *
 * @example
 * const originalString = "hello";
 * const capitalizedString = capitalizeString(originalString);
 * logger.info(capitalizedString); // Output: "Hello"
 */
export const capitalizeString = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
