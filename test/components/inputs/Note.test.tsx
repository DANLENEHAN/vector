import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';

import Note from '@components/inputs/Note';

jest.mock('@context/SystemContext', () => ({
  useSystem: jest.fn(() => ({theme: 'light'})),
}));

describe('Note', () => {
  const mockSetContent = jest.fn();

  it('It renders correctly without title', () => {
    // Arrange
    const content = 'This is a test note';
    const {getByPlaceholderText} = render(
      <Note content={content} setContent={mockSetContent} />,
    );
    // Act
    const note = getByPlaceholderText('Note');

    // Assert
    expect(note).toBeTruthy();
    expect(() => getByPlaceholderText('Title')).toThrow();
  });
  it('It renders correctly with title', () => {
    // Arrange
    const content = 'This is a test note';
    const {getByPlaceholderText} = render(
      <Note showTitle={true} content={content} setContent={mockSetContent} />,
    );
    // Act
    const note = getByPlaceholderText('Note');

    // Assert
    //expect(title).toBeTruthy();
    expect(note).toBeTruthy();
  });
  it('Lets users type in the note', () => {
    // Arrange
    const {getByPlaceholderText} = render(
      <Note content="" setContent={mockSetContent} />,
    );
    // Act
    const note = getByPlaceholderText('Note');
    fireEvent.changeText(note, 'This is a test note');

    // Assert
    expect(mockSetContent).toHaveBeenCalledWith('This is a test note');
  });
  it('Lets users type in the title', () => {
    // Arrange
    const {getByPlaceholderText} = render(
      <Note showTitle={true} content="" setContent={mockSetContent} />,
    );
    // Act
    const title = getByPlaceholderText('Title');
    fireEvent.changeText(title, 'This is a test title');

    // Assert
    expect(title.props.value).toBe('This is a test title');
  });
});
