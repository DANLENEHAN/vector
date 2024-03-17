// React
import React, {useState, useCallback} from 'react';
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
  bodyTextStyles,
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
import logger from '@utils/Logger';

interface SearchComponentProps<FilterKeys extends PropertyKey> {
  initialFilters: Record<FilterKeys, SearchFilters>;
  initialSearchResults: Array<SearchResults>;
  searchFunction: (
    searchString: string,
    filters?: Partial<Record<FilterKeys, Array<string>>>,
  ) => Promise<SearchFuncResponse | null>;
  onClickBack: () => void;
}

const SearchComponent = <FilterKeys extends PropertyKey>({
  initialFilters,
  initialSearchResults,
  searchFunction,
  onClickBack,
}: SearchComponentProps<FilterKeys>): React.ReactElement => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const [showFilters, setShowFilters] = useState(false);
  const searchFilters = initialFilters;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<FilterKeys, Array<string>>>
  >({});
  const [searchResults, setSearchResults] =
    useState<SearchResults[]>(initialSearchResults);

  const performSearch = useCallback(
    async (
      text: string,
      filters: Partial<Record<FilterKeys, Array<string>>>,
    ) => {
      try {
        const response = await searchFunction(text, filters);
        if (response !== null) {
          setSearchResults(response.searchResults);
        }
      } catch (error) {
        logger.error('Failed to perform search:', error);
      }
    },
    [searchFunction],
  );

  const onSelectFilter = useCallback(
    async (filterName: FilterKeys, selectedFilter: string) => {
      setSelectedFilters(prevFilters => {
        const updatedFilters = {...prevFilters};
        const currentFilter = prevFilters[filterName] || [];
        const isFilterSelected = currentFilter.includes(selectedFilter);

        if (isFilterSelected) {
          updatedFilters[filterName] = currentFilter.filter(
            value => value !== selectedFilter,
          );
          if (updatedFilters[filterName]!.length === 0) {
            delete updatedFilters[filterName];
          }
        } else {
          updatedFilters[filterName] = [...currentFilter, selectedFilter];
        }

        performSearch(searchQuery, updatedFilters);
        return updatedFilters;
      });
    },
    [performSearch, searchQuery],
  );

  const SearchResultItem = React.memo(({itemName}: Partial<SearchResults>) => {
    return (
      <View
        style={[
          styles.searchResult,
          {
            borderColor: currentTheme.borders,
            backgroundColor: currentTheme.secondaryBackground,
          },
        ]}>
        <Text style={[styles.searchResultText, {color: currentTheme.text}]}>
          {itemName}
        </Text>
      </View>
    );
  });

  return (
    <View style={styles.screenContainer}>
      <View style={styles.searchHeader}>
        <HeaderBackButton onClick={onClickBack} style={styles.backButton} />
        <TextInputComponent
          placeholder="Search Exercises"
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            performSearch(text, selectedFilters);
          }}
          iconName="magnifying-glass"
          iconSize={iconSizes.large}
          style={styles.searchBar}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Icon
            name="filter"
            size={iconSizes.large}
            color={currentTheme.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBody}>
        {showFilters && (
          <View
            style={[styles.filterContainer, {borderColor: currentTheme.text}]}>
            <Text style={[styles.filterTitle, {color: currentTheme.text}]}>
              Filters
            </Text>
            {Object.entries(searchFilters).map(
              (value: [string, any], index: number) => {
                const filterKey = value[0] as FilterKeys;
                const filterLabel = value[1].label as string;
                const filters = value[1].values as Array<string>;
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
                    onTagSelect={selectedFilter => {
                      onSelectFilter(filterKey, selectedFilter);
                    }}
                  />
                );
              },
            )}
            <TouchableOpacity
              onPress={() => {
                setSelectedFilters({});
                performSearch(searchQuery, {});
              }}>
              <Text
                style={[styles.clearFilterTitle, {color: currentTheme.text}]}>
                Clear filters
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={searchResults}
          renderItem={({item}) => <SearchResultItem itemName={item.itemName} />}
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
    borderWidth: borderWidth.xSmall,
    padding: paddingSizes.small,
    ...layoutStyles.centerVertically,
    marginBottom: marginSizes.large,
  },
  filterTitle: {
    marginBottom: marginSizes.small,
    ...headingTextStyles.xSmall,
  },
  clearFilterTitle: {
    ...ctaTextStyles.xSmall,
  },
  filterSelector: {
    maxHeight: 125,
    minWidth: '100%',
    marginBottom: marginSizes.small,
  },
  searchResult: {
    flex: 1,
    borderWidth: borderWidth.xSmall,
    minWidth: '95%',
    padding: paddingSizes.small,
    marginVertical: marginSizes.small,
    borderRadius: borderRadius.medium,
  },
  searchResultText: {
    ...bodyTextStyles.small,
    textAlign: 'center',
  },
});

export default SearchComponent;
