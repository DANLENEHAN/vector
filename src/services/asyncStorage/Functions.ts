/*
	This file contains utility functions that are used throughout the application.
*/
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Gets the user details from AsyncStorage.
 *
 * @param {string} field_name - The name of the field to retrieve.
 * @returns {Promise<string>} A promise that resolves with the value of the field.
 * @throws {string} Throws an error with a message describing the issue if the operation fails.
 * @example
 * // Example usage:
 * const field_name = 'username';
 * await getUserDetails(field_name);
 * // Returns the value of the username field.
 **/
export async function getUserDetails(field_name: string): Promise<any> {
  try {
    const user_details = await AsyncStorage.getItem('user-details-key');
    if (user_details) {
      const user_details_json = JSON.parse(user_details);
      if (field_name in user_details_json) {
        return user_details_json[field_name];
      } else {
        throw `Field ${field_name} not found in user details`;
      }
    } else {
      throw 'User details not found in AsyncStorage';
    }
  } catch (error) {
    return Promise.reject(new Error(`Error retrieving user details: ${error}`));
  }
}
