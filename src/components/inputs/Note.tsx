// React Import
import React, {useState} from 'react';
// Components
import {View, TextInput, ScrollView, Text} from 'react-native';
// Styling
import {
  paddingSizes,
  marginSizes,
  borderRadius,
  borderWidth,
  darkThemeColors,
  lightThemeColors,
  bodyTextStyles,
  headingTextStyles,
} from '@styles/Main';
import {useSystem} from '@context/SystemContext';

export interface NoteProps {
  titlePlaceholder?: string;
  notePlaceholder?: string;
  existingNote?: string;
  existingTitle?: string;
  showTitle?: boolean;
  maxNoteLength?: number;
  maxTitleLength?: number;
}

const Note: React.FC<NoteProps> = ({
  notePlaceholder,
  titlePlaceholder,
  existingNote,
  existingTitle,
  maxNoteLength,
  maxTitleLength,
  showTitle = false,
}) => {
  // State for the content of the note
  const [content, setContent] = useState(existingNote ? existingNote : '');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [atMaxLen, setAtMaxLen] = useState(false);
  const [title, setTitle] = useState(existingTitle ? existingTitle : '');

  // Get the current theme
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Constants for bullet point handling
  const bulletPoint = '\u2022'; // Unicode character for a bullet point
  const tabSpace = '   '; // 3 spaces for a tab

  /**
   * Function to handle the change in the note content,
   * and update the state accordingly
   *
   * @param note The note content
   */
  const handleInputChange = (note: string) => {
    let newContent = note;

    if (maxNoteLength && note.length > maxNoteLength) {
      setAtMaxLen(true);
      return;
    } else {
      if (atMaxLen && maxNoteLength && note.length < maxNoteLength) {
        setAtMaxLen(false);
      }
      if (atMaxLen && !maxNoteLength) {
        setAtMaxLen(false);
      }
    }

    const lastAddedChar = getLastAddedChar(note, cursorPosition);
    const currentLine = getCurrentLine(note, cursorPosition);
    const bulletPointRegex = /^([*-])\s/;

    // If the user types "*" or "-" at the start of a new line,
    if (bulletPointRegex.test(currentLine)) {
      newContent = replaceBulletPointCharacter(note, cursorPosition);
    }

    // Handling bullet point addition and line continuation
    if (lastAddedChar === '\n') {
      const trimmedCurrentLine = currentLine.trim();
      // Continuation of bullet points
      if (trimmedCurrentLine.charAt(0) === bulletPoint) {
        // Check if content is empty after bullet point
        if (trimmedCurrentLine.length === 1) {
          newContent = terminateBulletPoint(note, cursorPosition);
        } else {
          newContent = continueBulletPoint(note, cursorPosition);
        }
      }
    }
    setContent(newContent);
  };

  /**
   * Function to handle title input
   *
   * @param title The title of the note
   */
  const handleTitleChange = (title: string) => {
    if (maxTitleLength && title.length > maxTitleLength) {
      return;
    }
    setTitle(title);
  };

  // Utility functions for bullet point handling

  /**
   *  Replaces the bullet point character at the start of a new line
   *  with a tab character and the bullet point character
   *
   * @param {string} text the text in the note
   * @param {number} cursorPos the position of the cursor in the text
   * @returns {string} the updated text with the bullet point character replaced
   *
   */
  const replaceBulletPointCharacter = (text: string, cursorPos: number) => {
    const startOfLine = text.substring(0, cursorPos).lastIndexOf('\n') + 1;
    const contentBefore = text.substring(0, startOfLine);
    const contentAfter = text.substring(cursorPos);
    return `${contentBefore}${tabSpace}${bulletPoint} ${contentAfter}`;
  };

  /**
   *  Adds a bullet point character and a tab character at the start of a new line
   *  to continue a bullet point list
   *
   * @param {string} text the text in the note
   * @param {number} cursorPos the position of the cursor in the text
   * @returns {string} the updated text with the bullet point character added
   *
   */
  const continueBulletPoint = (text: string, cursorPos: number) => {
    const contentBeforeNewLine = text.substring(0, cursorPos);
    const contentAfterNewLine = text.substring(cursorPos + 1);
    return `${contentBeforeNewLine}\n${tabSpace}${bulletPoint} ${contentAfterNewLine}`;
  };

  /**
   * If the user types a newline character after a bullet point, this function
   * removes the bullet point and the newline character to terminate the bullet point
   *
   * @param text The text in the note
   * @param cursorPos The position of the cursor in the text
   * @returns The text with the bullet point terminated (removed)
   */
  const terminateBulletPoint = (text: string, cursorPos: number) => {
    const endOfPreviousLine =
      text.substring(0, cursorPos - 1).lastIndexOf('\n') + 1;
    // Get the content before the bullet point
    const contentBefore = text.substring(0, endOfPreviousLine);
    // Remove the bullet point character and the newline character
    const contentAfter = text.substring(cursorPos + 1);
    return `${contentBefore}${contentAfter}`;
  };

  /**
   * Handles the change in the cursor position
   *
   * @param event The event object
   *
   * @returns void
   */
  const handleSelectionChange = (event: any) => {
    const cursorPosition = event.nativeEvent.selection.start;
    setCursorPosition(cursorPosition);
  };

  /**
   * Gets the current line in the note the cursor is on
   *
   * @param text The text in the note
   * @param cursorPos  The position of the cursor in the text
   * @returns The current line in the note the cursor is on
   */
  const getCurrentLine = (text: string, cursorPos: number) => {
    // Find the start of the current line
    const startOfLine = text.substring(0, cursorPos).lastIndexOf('\n') + 1;
    // Find the end of the current line
    const endOfLine = text.indexOf('\n', cursorPos);
    // Extract the current line based on start and end positions
    const currentLine =
      endOfLine !== -1
        ? text.substring(startOfLine, endOfLine)
        : text.substring(startOfLine);
    return currentLine;
  };

  /**
   * Gets the last added character in the note
   *
   * @param text The text in the note
   * @param cursorPos The position of the cursor in the text
   * @returns The last added character in the note
   */
  const getLastAddedChar = (text: string, cursorPos: number) => {
    return text.charAt(cursorPos);
  };

  return (
    <View
      style={[
        styles.noteContainer,
        {
          width: '100%',
          backgroundColor: currentTheme.background,
          borderColor: atMaxLen ? currentTheme.error : currentTheme.borders,
        },
      ]}>
      {showTitle && (
        <>
          <TextInput
            style={[
              styles.title,
              {
                color: currentTheme.text,
              },
            ]}
            placeholder={titlePlaceholder ? titlePlaceholder : 'Title'}
            value={title}
            onChangeText={handleTitleChange}
          />

          <View
            style={[
              styles.titleBottomBorder,
              {
                borderBottomColor: currentTheme.borders,
                width: '95%',
                left: '2.5%',
              },
            ]}
          />
        </>
      )}
      <ScrollView style={styles.bodyContainer}>
        <TextInput
          style={[
            styles.bodyText,
            {
              color: currentTheme.text,
            },
          ]}
          placeholder={notePlaceholder ? notePlaceholder : 'Note'}
          multiline={true}
          value={content}
          onChangeText={handleInputChange}
          onSelectionChange={handleSelectionChange}
        />
      </ScrollView>
      {atMaxLen && (
        <Text style={{color: currentTheme.error}}>Max length reached</Text>
      )}
    </View>
  );
};

const styles = {
  noteContainer: {
    flex: 1,
    padding: paddingSizes.small,
    borderRadius: borderRadius.small,
    borderWidth: borderWidth.xSmall,
  },
  title: {
    ...headingTextStyles.xSmall,
  },
  titleBottomBorder: {
    borderBottomWidth: borderWidth.xSmall,
    marginVertical: marginSizes.medium,
  },
  bodyContainer: {
    flex: 1,
  },
  bodyText: {
    ...bodyTextStyles.small,
  },
};

export default Note;
