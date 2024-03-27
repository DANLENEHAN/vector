// React
import React, {useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
// Components
import ScreenWrapper from '@components/layout/ScreenWrapper';
import * as Progress from 'react-native-progress';
// Types
import Header from '@components/navbar/Header';
import ButtonComponent from '@components/buttons/ButtonComponent';
import {layoutStyles, paddingSizes} from '@styles/Main';

interface FormProgressWrapperProps {
  onInitalBack: () => void;
  onPageChange: (pageNumber: number) => void;
  numberPages: number;
  canContinue: boolean;
  children: React.ReactNode;
}

const FormProgressWrapper: React.FC<FormProgressWrapperProps> = ({
  onInitalBack,
  onPageChange,
  numberPages,
  canContinue,
  children,
}: FormProgressWrapperProps): React.ReactElement<FormProgressWrapperProps> => {
  const progressBarWidth = (Dimensions.get('window').width / 100) * 93;
  const [pageNumber, setPageNumber] = useState<number>(0);

  const pageNumberChange = (pageClicked: number) => {
    let newPageNumber = pageClicked;
    if (pageClicked > numberPages - 1) {
      newPageNumber = numberPages - 1;
    } else if (pageClicked < 0) {
      newPageNumber = 0;
      onInitalBack();
    }
    setPageNumber(newPageNumber);
    onPageChange(newPageNumber);
  };

  return (
    <ScreenWrapper>
      <Header
        onClick={() => pageNumberChange(pageNumber - 1)}
        label="Create an Exercise"
      />
      <View style={styles.pageContainer}>
        <Progress.Bar
          progress={pageNumber / (numberPages - 1)}
          width={progressBarWidth}
          animationConfig={{bounciness: 10}}
          animationType={'timing'}
        />
        {children}
        <ButtonComponent
          onPress={() => pageNumberChange(pageNumber + 1)}
          text={pageNumber < numberPages - 1 ? 'Continue' : 'Complete'}
          disabled={!canContinue}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    ...layoutStyles.spaceBetweenVertical,
    paddingVertical: paddingSizes.large,
  },
});

export default FormProgressWrapper;
