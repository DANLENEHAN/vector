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
  bodyTextStyles,
} from '@styles/Main';
import TagSelector from '@components/inputs/TagSelector';
import Header from '@components/navbar/Header';
// Types
import {
  SearchFilters,
  SearchFuncResponse,
  SearchResults,
} from '@components/search/Types';
import {themeColors} from '@styles/Types';
// Services
import {useSystem} from '@context/SystemContext';
import logger from '@utils/Logger';
import {SortOrders} from '@shared/Constants';

interface SearchComponentProps<FilterKeys extends PropertyKey> {
  initialFilters: Record<FilterKeys, SearchFilters>;
  initialSearchResults: Array<SearchResults>;
  searchFunction: (
    searchString: string,
    filters?: Partial<Record<FilterKeys, Array<string>>>,
    resultsSortOrder?: SortOrders,
  ) => Promise<SearchFuncResponse | null>;
  onClickBack: () => void;
}

interface SearchResultItemProps {
  itemName: string;
  currentTheme: themeColors;
}

const SearchResultItem = React.memo(
  ({itemName, currentTheme}: SearchResultItemProps) => {
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
  },
);

const SearchComponent = <FilterKeys extends PropertyKey>({
  initialFilters,
  initialSearchResults,
  searchFunction,
  onClickBack,
}: SearchComponentProps<FilterKeys>): React.ReactElement => {
  const {theme} = useSystem();
  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const [showFilters, setShowFilters] = useState(false);
  const [resultsSortOrder, setResultsSortOrder] = useState(SortOrders.ASC);
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
      sortOrder: SortOrders,
    ) => {
      try {
        const response = await searchFunction(text, filters, sortOrder);
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

        performSearch(searchQuery, updatedFilters, resultsSortOrder);
        return updatedFilters;
      });
    },
    [performSearch, searchQuery, resultsSortOrder],
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header onClick={onClickBack} label="Exercise Search" />
      </View>

      <View style={[styles.searchBarContainer]}>
        <TextInputComponent
          placeholder="Search Exercises"
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            performSearch(text, selectedFilters, resultsSortOrder);
          }}
          iconName="magnifying-glass"
          iconSize={iconSizes.medium}
          style={styles.searchBar}
        />
        <View style={styles.configContainer}>
          <TouchableOpacity
            style={styles.filterSortButton}
            onPress={() => setShowFilters(!showFilters)}
            testID="filterButton">
            <Text
              style={[styles.filterSortButtonText, {color: currentTheme.text}]}>
              Filters
            </Text>
            <Icon
              name="filter"
              size={iconSizes.small}
              color={
                Object.keys(selectedFilters).length !== 0
                  ? currentTheme.primary
                  : currentTheme.text
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterSortButton}
            onPress={() => {
              setResultsSortOrder(prevSortOrder => {
                const newSortOrder =
                  prevSortOrder === SortOrders.ASC
                    ? SortOrders.DESC
                    : SortOrders.ASC;
                performSearch(searchQuery, selectedFilters, newSortOrder);
                return newSortOrder;
              });
            }}
            testID="sortButton">
            <Text
              style={[styles.filterSortButtonText, {color: currentTheme.text}]}>
              Sort Results
            </Text>
            <Icon
              name={
                resultsSortOrder === SortOrders.ASC
                  ? 'arrow-up-a-z'
                  : 'arrow-up-z-a'
              }
              size={iconSizes.small}
              color={currentTheme.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBody}>
        {showFilters && (
          <View
            style={[styles.filterContainer, {borderColor: currentTheme.text}]}>
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
                performSearch(searchQuery, {}, resultsSortOrder);
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
          renderItem={({item}) => (
            <SearchResultItem
              itemName={item.itemName}
              currentTheme={currentTheme}
            />
          )}
          keyExtractor={item => item.itemId}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    ...layoutStyles.centerVertically,
  },
  headerContainer: {
    flex: 1,
    width: '100%',
  },
  searchBarContainer: {
    flex: 2,
    width: '95%',
    ...layoutStyles.centerVertically,
  },
  configContainer: {
    flex: 1,
    width: '95%',
    paddingHorizontal: paddingSizes.small,
    ...layoutStyles.spaceBetweenHorizontal,
  },
  searchBody: {
    flex: 12,
    ...layoutStyles.centerVertically,
    width: '95%',
  },

  // Search Bar
  searchBar: {
    flex: 1,
    marginBottom: 0,
  },
  filterSortButton: {
    ...layoutStyles.spaceBetweenHorizontal,
  },
  filterSortButtonText: {
    ...ctaTextStyles.small,
    marginRight: marginSizes.small,
  },

  // Filters
  filterContainer: {
    borderRadius: borderRadius.large,
    borderWidth: borderWidth.xSmall,
    padding: paddingSizes.small,
    ...layoutStyles.centerVertically,
    marginBottom: marginSizes.large,
  },
  clearFilterTitle: {
    ...ctaTextStyles.xSmall,
  },
  filterSelector: {
    maxHeight: 125,
    minWidth: '100%',
    marginBottom: marginSizes.small,
  },

  // Search Results
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
