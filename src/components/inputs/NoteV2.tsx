// React Import
import React, {useState} from 'react';
// Components
import {View, TextInput, ScrollView, Text, StyleSheet} from 'react-native';
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
import RichEditor, {RichToolbar} from 'react-native-pell-rich-editor';



export interface NoteProps {
  titlePlaceholder?: string;
  notePlaceholder?: string;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  existingTitle?: string;
  showTitle?: boolean;
  maxNoteLength?: number;
  maxTitleLength?: number;
}

const Note: React.FC<NoteProps> = ({
  notePlaceholder,
  titlePlaceholder,
  content,
  setContent,
  existingTitle,
  maxNoteLength,
  maxTitleLength,
  showTitle = false,
}) => {
  // State for the content of the note
  const [cursorPosition, setCursorPosition] = useState(0);
  const [atMaxLen, setAtMaxLen] = useState(false);
  const [title, setTitle] = useState(existingTitle ? existingTitle : '');
  const [scrollViewHeight, setScrollViewHeight] = useState(0); // State to store the height

  const handleLayoutChange = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setScrollViewHeight(height); // Update state with the new height
  };

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

    // Variables for bullet point handling
    const lastAddedChar = getLastAddedChar(note, cursorPosition);
    const currentLine = getCurrentLine(note, cursorPosition);
    const bulletPointRegex = /^([*-])\s/;
    const validBulletChars = [bulletPoint, '-'];

    // If the user types "*" or "-" at the start of a new line,
    if (bulletPointRegex.test(currentLine)) {
      // Evaluate if bullet point is "-" or "*"
      const bulletChar = currentLine.match(bulletPointRegex)![1];
      newContent = replaceBulletPointCharacter(
        note,
        cursorPosition,
        bulletChar,
      );
    }

    // Handling bullet point addition and line continuation
    if (lastAddedChar === '\n') {
      const trimmedCurrentLine = currentLine.trim();
      // Continuation of bullet points
      if (validBulletChars.includes(trimmedCurrentLine.charAt(0))) {
        // Check if content is empty after bullet point
        if (trimmedCurrentLine.length === 1) {
          newContent = terminateBulletPoint(note, cursorPosition);
        } else {
          const bulletChar = trimmedCurrentLine.charAt(0);
          newContent = continueBulletPoint(note, cursorPosition, bulletChar);
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
  const replaceBulletPointCharacter = (
    text: string,
    cursorPos: number,
    bulletChar: string,
  ) => {
    const startOfLine = text.substring(0, cursorPos).lastIndexOf('\n') + 1;
    const contentBefore = text.substring(0, startOfLine);
    const contentAfter = text.substring(cursorPos);

    if (bulletChar === '*') {
      return `${contentBefore}${tabSpace}${bulletPoint} ${contentAfter}`;
    } else {
      return `${contentBefore}${tabSpace}${bulletChar} ${contentAfter}`;
    }
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
  const continueBulletPoint = (
    text: string,
    cursorPos: number,
    bulletChar: string,
  ) => {
    const contentBeforeNewLine = text.substring(0, cursorPos);
    const contentAfterNewLine = text.substring(cursorPos + 1);

    const usedChar = bulletChar === '*' ? bulletPoint : bulletChar;

    return `${contentBeforeNewLine}\n${tabSpace}${usedChar} ${contentAfterNewLine}`;
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
        {
          backgroundColor: currentTheme.secondaryBackground,
          borderColor: atMaxLen ? currentTheme.error : currentTheme.borders,
        },
        styles.noteContainer,
      ]}>
      {showTitle && (
        <View>
          <TextInput
            style={[
              styles.title,
              {
                color: currentTheme.text,
              },
            ]}
            placeholder={titlePlaceholder ? titlePlaceholder : 'Title'}
            placeholderTextColor={currentTheme.lightText}
            value={title}
            onChangeText={handleTitleChange}
          />

          <View
            style={[
              styles.titleBottomBorder,
              {
                borderBottomColor: currentTheme.borders,
              },
            ]}
          />
        </View>
      )}
      <ScrollView style={styles.bodyContainer} onLayout={handleLayoutChange}>
      <RichEditor
        ref={editorRef}
        style={[styles.editor, {backgroundColor: currentTheme.secondaryBackground}]}
        onChange={setContent}
        placeholder="Start typing..."
      />
      <RichToolbar
        style={styles.toolbar}
        editor={editorRef}
        selectedIconTint={currentTheme.primary}
        iconTint={currentTheme.text}
        actions={['bold', 'italic', 'underline', 'strikethrough', 'bullet', 'ordered']}
      />
      </ScrollView>
      {atMaxLen && (
        <Text style={{color: currentTheme.error}}>Max length reached</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    flex: 1,
    padding: paddingSizes.small,
    borderRadius: borderRadius.small,
    borderWidth: borderWidth.xSmall,
    width: '100%',
  },
  title: {
    ...headingTextStyles.xSmall,
  },
  titleBottomBorder: {
    borderBottomWidth: borderWidth.xSmall,
    marginVertical: marginSizes.medium,
    left: '2.5%',
    width: '95%',
  },
  bodyContainer: {
    flex: 1,
  },
  bodyText: {
    textAlignVertical: 'top',
    ...bodyTextStyles.small,
  },
});

export default Note;
