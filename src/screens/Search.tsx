// React
import React, {useEffect, useState, useCallback} from 'react';
// Components
import ScreenWrapper from '@components/layout/ScreenWrapper';
import SearchComponent from '@components/search/Search';
import {exerciseSearch} from '@services/db/exercise/Functions';
import {SearchResults} from '@components/search/Types';

const SearchScreen: React.FC = () => {
  const [searchResults, setSearchResults] = useState(
    null as SearchResults[] | null,
  );
  const [filters, setFilters] = useState(
    null as Record<string, Array<any>> | null,
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
        <SearchComponent
          initialSearchResults={searchResults}
          initialFilters={filters}
          searchFunction={exerciseSearch}
        />
      )}
    </ScreenWrapper>
  );
};

export default SearchScreen;
