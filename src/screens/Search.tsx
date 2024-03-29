// React
import React, {useEffect, useState, useCallback} from 'react';
// Components
import ScreenWrapper from '@components/layout/ScreenWrapper';
import SearchComponent from '@components/search/Search';
import {exerciseSearch} from '@services/db/exercise/Functions';
import {SearchFilters, SearchResults} from '@components/search/Types';
// Types
import {ScreenProps} from '@screens/Types';
import {ExerciseSearchFilters} from '@services/db/exercise/Types';

const SearchScreen: React.FC<ScreenProps> = ({
  navigation,
}: ScreenProps): React.ReactElement<ScreenProps> => {
  const [searchResults, setSearchResults] = useState(
    null as SearchResults[] | null,
  );
  const [filters, setFilters] = useState(
    null as Record<string, SearchFilters> | null,
  );

  const runInitialExerciseSearch = useCallback(async () => {
    const response = await exerciseSearch();
    if (response !== null) {
      setSearchResults(response.searchResults);
      setFilters(response.filters);
    }
  }, []);

  useEffect(() => {
    runInitialExerciseSearch();
  }, [runInitialExerciseSearch]);

  return (
    <ScreenWrapper>
      {filters && searchResults && (
        <SearchComponent<ExerciseSearchFilters>
          initialSearchResults={searchResults}
          initialFilters={filters}
          searchFunction={exerciseSearch}
          onClickBack={navigation.goBack}
        />
      )}
    </ScreenWrapper>
  );
};

export default SearchScreen;
