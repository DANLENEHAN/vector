/**
 * Capitalizes the first letter of a given string.
 * @param {string} str - The input string to be capitalized.
 * @returns {string} - The input string with the first letter capitalized.
 */
export const capitalizeString = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Retrieves a subset of the given object with key-value pairs starting after a specified key.
 * If the specified start key is null, the function returns all key-value pairs from the object.
 * If the specified start key is found, retrieval starts from the key immediately following it.
 *
 * @param {Object} revisionObject - The object from which to retrieve key-value pairs.
 * @param {string | null} startKey - The key after which to start retrieval. If null, retrieval includes all key-value pairs.
 * @returns {Object} An object containing key-value pairs after the specified start key,
 *                   or all pairs if startKey is null.
 */
export const getValuesAfterSpecifiedKey = (
  revisionObject: {[key: string]: string[]},
  startKey: string | null,
): {[key: string]: string[]} => {
  // If startKey is null, return the entire object
  if (startKey === null) {
    return revisionObject;
  }

  let startKeyFound = false;
  return Object.entries(revisionObject).reduce((result, [key, value]) => {
    if (startKeyFound) {
      result[key] = value;
    }

    // Sets startKeyFound to true for the key immediately after the matching startKey
    if (startKey === key) {
      startKeyFound = true;
    }

    return result;
  }, {} as {[key: string]: string[]});
};
