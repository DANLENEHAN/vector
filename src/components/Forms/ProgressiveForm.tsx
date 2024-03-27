// React
import React, {useState} from 'react';
// Components
import FormProgressWrapper from '@components/layout/FormProgressWrapper';

export interface ProgressiveFormPage {
  updatePageValidation: (isValid: boolean) => void;
  //   updateStateVars: () => void;
}

interface ProgressiveFormProps {
  progressiveFormPages: Record<number, React.ReactElement<ProgressiveFormPage>>;
  onInitalBack: () => void;
}

const ProgressiveForm: React.FC<ProgressiveFormProps> = ({
  progressiveFormPages,
  onInitalBack,
}: ProgressiveFormProps): React.ReactElement<ProgressiveFormProps> => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  const getCurrentPageComponent = () => {
    return progressiveFormPages[pageNumber];
  };

  return (
    <FormProgressWrapper
      onInitalBack={onInitalBack}
      onPageChange={(pageNumber: number) => handlePageChange(pageNumber)}
      numberPages={Object.keys(progressiveFormPages).length - 1}
      canContinue={true}>
      {getCurrentPageComponent()}
    </FormProgressWrapper>
  );
};

export default ProgressiveForm;
