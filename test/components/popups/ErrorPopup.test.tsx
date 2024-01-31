import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ErrorPopup from '@components/popups/ErrorPopup';

jest.mock('@context/SystemContext', () => ({
  useSystem: () => ({
    theme: 'dark',
  }),
}));

describe('ErrorPopup component', () => {
  it('renders correctly when visible is true', () => {
    const {getByText} = render(
      <ErrorPopup visible={true} message="Test message" onClose={() => {}} />,
    );

    expect(getByText('Test message')).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const {queryByText} = render(
      <ErrorPopup visible={false} message="Test message" onClose={() => {}} />,
    );

    expect(queryByText('Test message')).toBeNull();
  });

  it('calls onClose when Ok button is pressed', () => {
    const onCloseMock = jest.fn();
    const {getByText} = render(
      <ErrorPopup
        visible={true}
        message="Test message"
        onClose={onCloseMock}
      />,
    );

    fireEvent.press(getByText('Ok'));

    expect(onCloseMock).toHaveBeenCalled();
  });
});
