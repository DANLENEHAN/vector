import {getUserDetails} from '@services/asyncStorage/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mocking AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('getUserDetails', () => {
  it('Gets value when present', async () => {
    // Arrange
    const fieldName = 'username';
    const fieldValue = 'johndoe';
    const user_details = JSON.stringify({[fieldName]: fieldValue});

    // AsyncStorage mock to return user details
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(user_details);

    // Act
    const result = await getUserDetails(fieldName);

    // Assert
    expect(result).toBe(fieldValue);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user-details-key');
  });

  it('Throws error when field not present', async () => {
    // Arrange
    const fieldName = 'username';
    const fieldValue = 'johndoe';
    const user_details = JSON.stringify({[fieldName]: fieldValue});
    const target_field = 'email';

    // AsyncStorage mock to return user details
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(user_details);

    // Act and Assert
    //getUserDetails(target_field)
    await expect(getUserDetails(target_field)).rejects.toThrow(
      'Error retrieving user details: Field email not found in user details',
    );
  });

  it('Throws error when user details not present', async () => {
    // Arrange
    const target_field = 'email';

    // AsyncStorage mock to return user details
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    // Act and Assert
    //getUserDetails(target_field)
    await expect(getUserDetails(target_field)).rejects.toThrow(
      'Error retrieving user details: User details not found in AsyncStorage',
    );
  });
});
