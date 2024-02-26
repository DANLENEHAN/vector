
import {View, StyleSheet} from 'react-native';
import {SystemProvider} from '../../../../src/context/SystemContext';
import {layoutStyles} from '../../../../src/styles/Main';

import React from "react";
import { Text, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView } from "react-native";
//Font Awesome
import  Icon  from 'react-native-vector-icons/FontAwesome6';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import { borderWidth, borderRadius, paddingSizes } from "../../../../src/styles/Main";


const handleHead = ({tintColor}) => <Icon name="header" size={24} color={tintColor} />;
const bullet = ({tintColor}) => <Icon name="list-ul" size={24} color={tintColor} />;
// assets/fonts/Lato-Regular.ttf
const TempScreen = () => {
	const richText = React.useRef();
  
  const fontSrc = 'file:///assets/fonts/Lato-Regular.ttf';
  const customFontCSS = `
  @font-face {
    font-family: 'Lato-Regular';
    src: url(${fontSrc}) format('truetype'); 

  }
  body {
    font-family: 'Lato-Regular';
    font-size: 15px;
  }
  `;

	return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.editorContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}	style={styles.editor}>
          <Text>Description:</Text>
          <View style={{flex: 1, backgroundColor: "pink", padding: paddingSizes.large}}>
          <RichEditor
              ref={richText}
              editorStyle={{ cssText: customFontCSS }}
              onChange={ descriptionText => {
                  console.log("descriptionText:", descriptionText);
              }}
              style={styles.editor}
              placeholder='Description'
          />
          </View>
        </KeyboardAvoidingView>

      </ScrollView>

      <RichToolbar
        editor={richText}
        actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1, actions.insertBulletsList, actions.insertOrderedList]}
        iconMap={{ [actions.heading1]: handleHead , [actions.insertBulletsList]: bullet, [actions.insertOrderedList]: bullet}}
      />
    </SafeAreaView>
  );
};


// Define your story
export default {
  title: 'components/inputs/NoteEditor',
  component: TempScreen,
};

// Define your template
const Template = (args) => (
  <SystemProvider>
    <View style={{flex: 1, ...layoutStyles.centerVertically}}>
      <TempScreen {...args} />
    </View>
  </SystemProvider>
);

// Create your stories
export const Default = Template.bind({});
Default.args = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: paddingSizes.small,
    borderRadius: borderRadius.small,
    borderWidth: borderWidth.xSmall,
    width: '100%',
    backgroundColor: "red"
  },
  editorContainer: {
    flex:1,
    width: '90%',
    
    marginTop: 20,
    marginBottom: 20,
    borderColor: '#000000',
    borderWidth: 1,
    backgroundColor: 'blue', // Consider adding padding as needed
  },
  editor: {
    flex: 1,
    backgroundColor: 'green', // Consider adding padding as needed
  },
  toolbar: {
    // Style your toolbar as needed
  },
});

