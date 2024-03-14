// React
import React, {useState} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
// Components
import TextInputComponent from '@components/inputs/TextInputComponent';
// Styles
import TagSelector from '@components/inputs/TagSelector';
import {SearchFuncResponse, SearchResults} from './Types';

export interface SearchComponentProps {
  initialFilters: Record<string, Array<any>>;
  initialSearchResults: Array<SearchResults>;
  searchFunction: (
    searchString: string,
    filters?: any, // TODO:
  ) => Promise<SearchFuncResponse | null>;
}

const SearchComponent: React.FC<SearchComponentProps> = (
  props: SearchComponentProps,
): React.ReactElement<SearchComponentProps> => {
  const searchFilters = props.initialFilters as Record<string, Array<any>>;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setselectedFilters] = useState(
    {} as Record<string, Array<any>>,
  );
  const [searchResults, setSearchResults] = useState(
    props.initialSearchResults as SearchResults[],
  );

  const onSelectFilter = async (filterName: string, selectedFilter: string) => {
    setselectedFilters(prevFilters => {
      const updatedFilters = {...prevFilters};
      if (
        prevFilters[filterName] &&
        prevFilters[filterName].includes(selectedFilter)
      ) {
        updatedFilters[filterName] = prevFilters[filterName].filter(
          (value: string) => value !== selectedFilter,
        );
        if (updatedFilters[filterName].length === 0) {
          delete updatedFilters[filterName];
        }
      } else {
        updatedFilters[filterName] = [
          ...(prevFilters[filterName] || []),
          selectedFilter,
        ];
      }
      performSearch(searchQuery, updatedFilters);
      return updatedFilters;
    });
  };

  const performSearch = async (
    text: string,
    filters: Record<string, Array<any>>,
  ) => {
    const response = await props.searchFunction(text, filters);
    if (response !== null) {
      setSearchResults(response.searchResults);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <TextInputComponent
          placeholder="Search Exercises"
          value={searchQuery}
          onChangeText={async (text: string) => {
            setSearchQuery(text);
            performSearch(text, searchFilters);
          }}
          iconName="magnifying-glass"
        />
      </View>

      {Object.entries(searchFilters).map(
        (value: [string, any[]], index: number) => {
          const filterName = value[0];
          const filters = value[1];
          return (
            <TagSelector
              key={index}
              tags={filters.map(item => {
                return {label: item};
              })}
              tagSelectorLabel={filterName}
              selectedTags={selectedFilters[filterName] || []}
              onTagSelect={(selectedFilter: string) => {
                onSelectFilter(filterName, selectedFilter);
              }}
            />
          );
        },
      )}

      <FlatList
        data={searchResults}
        renderItem={({item}) => <Text>{item.itemName}</Text>}
        keyExtractor={item => item.itemId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '90%',
  },
  headerContainer: {},
});

export default SearchComponent;
