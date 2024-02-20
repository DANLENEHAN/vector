import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {lightThemeColors} from '@styles/Main';
import TagSelector from '@components/inputs/TagSelector';

jest.mock('@context/SystemContext', () => ({
  useSystem: jest.fn(() => ({theme: 'light'})),
}));

describe('TagSelector', () => {
  it('Should render when open', () => {
    // Arrange
    const {getByText} = render(
      <TagSelector
        tagSelectorLabel="Tag Group"
        tags={[
          {
            label: 'Happy',
            icon: 'meh',
            color: 'yellow',
          },
          {
            label: 'Sad',
            icon: 'frown',
            color: 'yellow',
          },
        ]}
      />,
    );
    // Act
    const tagGroup = getByText('Tag Group');
    const tag1 = getByText('Happy');
    const tag2 = getByText('Sad');

    // Assert
    expect(tagGroup).toBeTruthy();
    expect(tag1).toBeTruthy();
    expect(tag2).toBeTruthy();
  });

  it('Should hide tags when collapsed', () => {
    // Arrange
    const {getByText, getByTestId} = render(
      <TagSelector
        tagSelectorLabel="Tag Group"
        tags={[
          {
            label: 'Happy',
            icon: 'meh',
            color: 'yellow',
          },
          {
            label: 'Sad',
            icon: 'frown',
            color: 'yellow',
          },
        ]}
      />,
    );
    // Act
    let tagGroup = getByText('Tag Group');
    let tag1 = getByTestId('tagSelectorTag_Happy');
    let tag2 = getByTestId('tagSelectorTag_Sad');
    expect(tagGroup).toBeTruthy();
    expect(tag1).toBeTruthy();
    expect(tag2).toBeTruthy();
    // Collapse
    const collapseButton = getByTestId('tagSelectorCollapseButton');
    fireEvent.press(collapseButton);

    // Assert
    tagGroup = getByText('Tag Group');
    expect(tagGroup).toBeTruthy();
    expect(() => getByTestId('tagSelectorTag_Happy')).toThrow();
    expect(() => getByTestId('tagSelectorTag_Sad')).toThrow();
  });

  it('Should show tags when expanded', () => {
    // Arrange
    const {getByText, getByTestId} = render(
      <TagSelector
        tagSelectorLabel="Tag Group"
        tags={[
          {
            label: 'Happy',
            icon: 'meh',
            color: 'yellow',
          },
          {
            label: 'Sad',
            icon: 'frown',
            color: 'yellow',
          },
        ]}
      />,
    );
    // Act
    let tagGroup = getByText('Tag Group');
    let tag1 = getByTestId('tagSelectorTag_Happy');
    let tag2 = getByTestId('tagSelectorTag_Sad');
    expect(tagGroup).toBeTruthy();
    expect(tag1).toBeTruthy();
    expect(tag2).toBeTruthy();
    // Collapse
    const collapseButton = getByTestId('tagSelectorCollapseButton');
    fireEvent.press(collapseButton);
    // Expand
    fireEvent.press(collapseButton);

    // Assert
    tagGroup = getByText('Tag Group');
    tag1 = getByTestId('tagSelectorTag_Happy');
    tag2 = getByTestId('tagSelectorTag_Sad');
    expect(tagGroup).toBeTruthy();
    expect(tag1).toBeTruthy();
    expect(tag2).toBeTruthy();
  });

  it('Should select and unselect a tag', () => {
    // Arrange
    const {getByTestId} = render(
      <TagSelector
        tagSelectorLabel="Tag Group"
        tags={[
          {
            label: 'Happy',
            icon: 'meh',
            color: 'yellow',
          },
          {
            label: 'Sad',
            icon: 'frown',
            color: 'yellow',
          },
        ]}
      />,
    );
    // Act
    let tag1 = getByTestId('tagSelectorTag_Happy');
    expect(tag1).toHaveStyle({backgroundColor: lightThemeColors.background});
    fireEvent.press(tag1);
    // Assert
    tag1 = getByTestId('tagSelectorTag_Happy');
    expect(tag1).toHaveStyle({backgroundColor: 'yellow'});
    fireEvent.press(tag1);
    tag1 = getByTestId('tagSelectorTag_Happy');
    expect(tag1).toHaveStyle({backgroundColor: lightThemeColors.background});
  });

  it('Should show number of selected tags when collapsed', () => {
    // Arrange
    const {getByText, getByTestId} = render(
      <TagSelector
        tagSelectorLabel="Tag Group"
        tags={[
          {
            label: 'Happy',
            icon: 'meh',
            color: 'yellow',
          },
          {
            label: 'Sad',
            icon: 'frown',
            color: 'yellow',
          },
        ]}
      />,
    );
    // Act
    let tagGroup = getByText('Tag Group');
    let tag1 = getByTestId('tagSelectorTag_Happy');
    let tag2 = getByTestId('tagSelectorTag_Sad');
    expect(tagGroup).toBeTruthy();
    expect(tag1).toBeTruthy();
    expect(tag2).toBeTruthy();
    // Select
    fireEvent.press(tag1);
    // Collapse
    let collapseButton = getByTestId('tagSelectorCollapseButton');
    fireEvent.press(collapseButton);

    // Assert
    tagGroup = getByText('Tag Group');
    expect(tagGroup).toBeTruthy();
    const selectedTags = getByTestId('tagSelectorSelectedCount');
    expect(selectedTags).toHaveTextContent('1 Selected');

    // Expand and unselect
    fireEvent.press(collapseButton);
    tag1 = getByTestId('tagSelectorTag_Happy');
    fireEvent.press(tag1);
    // Collapse again and check if the selected tag count is gone
    fireEvent.press(collapseButton);
    expect(() => getByTestId('tagSelectorSelectedCount')).toThrow();
  });
});
