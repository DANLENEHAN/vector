import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
// Functions
import {useSystem} from '@context/SystemContext';
// Styling
import {
  darkThemeColors,
  lightThemeColors,
  marginSizes,
  borderRadius,
  buttonStyles,
  layoutStyles,
} from '@styles/Main';
// Components
import ButtonComponent from '@components/buttons/ButtonComponent';
import Note from '@components/inputs/Note';

/**
 * Interface for the NotePopup Component
 *
 * @interface NotePopupProps
 *
 * @param {boolean} visible - The visibility state of the popup
 * @param {string} message - The message for the popup
 * @param {() => void} onClose - The function to be called when the popup is closed
 * @param {string} content - The content for the note
 * @param {React.Dispatch<React.SetStateAction<string>>} setContent - The function to set the content for the note
 * @param {number} maxLength - The maximum length for the note
 */
interface NotePopupProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  content: string;
  maxLength?: number;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * NotePopup Component
 *
 * @param {NotePopupProps} props - Component NotePopup Props
 * @returns {React.FC<NotePopupProps>} - React Component
 */
const NotePopup: React.FC<NotePopupProps> = ({
  visible,
  message,
  onClose,
  content,
  setContent,
  maxLength,
}): React.ReactElement<NotePopupProps> => {
  const {theme} = useSystem();

  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const buttonStyle = {
    //backgroundColor: currentTheme.primary,
    ...buttonStyles.medium,
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={[
          styles.modalContainer,
          {backgroundColor: currentTheme.lowOpacityBackground},
        ]}>
        <View
          style={[
            styles.popupContainer,
            {backgroundColor: currentTheme.background},
          ]}>
          <View style={styles.noteContainer}>
            <Note
              notePlaceholder={message}
              content={content}
              setContent={setContent}
              maxNoteLength={maxLength}
            />
          </View>
          <View style={styles.buttonContainer}>
            <ButtonComponent
              style={buttonStyle}
              onPress={onClose}
              text={'Close'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  popupContainer: {
    flex: 1,
    borderRadius: borderRadius.medium,
    maxHeight: '90%',
    width: '90%',
    ...layoutStyles.centerVertically,
  },
  noteContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: marginSizes.large,
    marginTop: marginSizes.large,
  },
  buttonContainer: {
    ...layoutStyles.centerHorizontally,
    marginVertical: marginSizes.large,
  },
});

export default NotePopup;
