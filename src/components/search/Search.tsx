// React
import React, {useState} from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
// Components
import TextInputComponent from '@components/inputs/TextInputComponent';
import Icon from 'react-native-vector-icons/FontAwesome6';
// Styles
import {
  iconSizes,
  darkThemeColors,
  lightThemeColors,
  layoutStyles,
  marginSizes,
  ctaTextStyles,
  borderRadius,
  paddingSizes,
  borderWidth,
  headingTextStyles,
} from '@styles/Main';
import TagSelector from '@components/inputs/TagSelector';
import {
  SearchFilters,
  SearchFuncResponse,
  SearchResults,
} from '@components/search/Types';
import HeaderBackButton from '@components/buttons/HeaderBackButton';
// Services
import {useSystem} from '@context/SystemContext';

export interface SearchComponentProps {
  initialFilters: Record<string, SearchFilters>;
  initialSearchResults: Array<SearchResults>;
  searchFunction: (
    searchString: string,
    filters?: any, // TODO: Fix any typing
  ) => Promise<SearchFuncResponse | null>;
  onClickBack: CallableFunction;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  initialFilters,
  initialSearchResults,
  searchFunction,
  onClickBack,
}: SearchComponentProps): React.ReactElement<SearchComponentProps> => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const [showFilters, setShowFilters] = useState(false);
  const searchFilters = initialFilters;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setselectedFilters] = useState(
    {} as Record<string, Array<string>>,
  );
  const [searchResults, setSearchResults] = useState(
    initialSearchResults as SearchResults[],
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
    filters: Record<string, Array<string>>,
  ) => {
    const response = await searchFunction(text, filters);
    if (response !== null) {
      setSearchResults(response.searchResults);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.searchHeader}>
        <HeaderBackButton
          onClick={() => onClickBack()}
          style={styles.backButton}
        />
        <TextInputComponent
          placeholder="Search Exercises"
          value={searchQuery}
          onChangeText={async (text: string) => {
            setSearchQuery(text);
            performSearch(text, selectedFilters);
          }}
          iconName="magnifying-glass"
          iconSize={iconSizes.large}
          style={styles.searchBar}
        />
        <Icon
          name="filter"
          size={iconSizes.large}
          color={currentTheme.text}
          onPress={() => setShowFilters(!showFilters)}
        />
      </View>

      <View style={styles.searchBody}>
        {showFilters && (
          <View
            style={[styles.filterContainer, {borderColor: currentTheme.text}]}>
            <Text style={styles.filterTitle}>Filters</Text>
            {Object.entries(searchFilters).map(
              (value: [string, SearchFilters], index: number) => {
                const filterKey = value[0];
                const filterLabel = value[1].label;
                const filters = value[1].values;
                return (
                  <TagSelector
                    style={styles.filterSelector}
                    key={index}
                    tags={filters.map(item => {
                      return {
                        label: item,
                        color: currentTheme.borders,
                      };
                    })}
                    tagSelectorLabel={filterLabel}
                    selectedTags={selectedFilters[filterKey] || []}
                    onTagSelect={(selectedFilter: string) => {
                      onSelectFilter(filterKey, selectedFilter);
                    }}
                  />
                );
              },
            )}
            <TouchableOpacity
              onPress={() => {
                setselectedFilters({});
                performSearch(searchQuery, {});
              }}>
              <Text style={styles.clearFilterTitle}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={searchResults}
          renderItem={({item}) => {
            return (
              <View
                style={[
                  styles.searchResult,
                  {borderColor: currentTheme.borders},
                ]}>
                <Text
                  style={[styles.searchResultText, {color: currentTheme.text}]}>
                  {item.itemName}
                </Text>
              </View>
            );
          }}
          keyExtractor={item => item.itemId}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  backButton: {
    margin: 0,
    padding: 0,
  },
  searchBar: {
    marginBottom: 0,
    marginHorizontal: marginSizes.small,
    minWidth: 325,
  },
  searchHeader: {
    flex: 1,
    ...layoutStyles.spaceAroundHorizontal,
    width: '100%',
  },
  searchBody: {
    flex: 9,
    ...layoutStyles.centerVertically,
    width: '95%',
  },
  filterContainer: {
    borderRadius: borderRadius.large,
    borderWidth: borderWidth.small,
    padding: paddingSizes.small,
    ...layoutStyles.centerVertically,
    marginBottom: marginSizes.large,
  },
  filterTitle: {
    marginBottom: marginSizes.small,
    ...headingTextStyles.xSmall,
  },
  clearFilterTitle: {
    ...ctaTextStyles.small,
  },
  filterSelector: {
    maxHeight: 125,
    minWidth: '100%',
    marginBottom: marginSizes.small,
  },
  searchResult: {
    flex: 1,
    borderWidth: borderWidth.small,
    minWidth: '95%',
    padding: paddingSizes.small,
    marginVertical: marginSizes.small,
    borderRadius: borderRadius.medium,
  },
  searchResultText: {
    ...ctaTextStyles.small,
    textAlign: 'center',
  },
});

export default SearchComponent;
