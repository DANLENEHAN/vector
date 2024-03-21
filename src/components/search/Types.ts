/**
 * Interface for individual search result items.
 *
 * This interface represents a single item in the list of search results, providing a structure
 * for essential item details used in search interfaces or components.
 *
 * @param {string} itemId - Unique identifier for the item. This is typically used for tracking
 *                          or selection purposes in a list of search results.
 * @param {string} itemName - The name or title of the item. This is the primary text displayed
 *                            to describe the item in search results.
 */
export interface SearchResults {
  itemId: string;
  itemName: string;
}

/**
 * Interface for search filter configurations.
 *
 * This interface outlines the structure for search filters, which are used to refine and
 * narrow down search results based on specific criteria. Each filter consists of a label
 * and a set of values that users can select from.
 *
 * @param {string} label - The display label for the filter, which describes the criterion
 *                         that the filter applies to (e.g., "Category", "Price Range").
 * @param {Array<string>} values - An array of strings representing the available options
 *                                 within the filter. Each string is a selectable value that
 *                                 users can apply to refine their search results.
 */
export interface SearchFilters {
  label: string;
  values: Array<string>;
}

/**
 * Interface for the response from a search function.
 *
 * This interface describes the structure of the response returned by a search function,
 * encompassing both the list of search results and the applicable filters for refining the search.
 * It is typically used in functions that perform search queries and need to return a structured
 * set of results along with dynamic filters based on the query.
 *
 * @param {SearchResults[]} searchResults - An array of SearchResults, representing the items
 *                                          found matching the search criteria. Each item in the array
 *                                          adheres to the SearchResults interface.
 * @param {Record<string, SearchFilters>} filters - A record (object) where each key is a string
 *                                                  representing a filter name, and each value is a
 *                                                  SearchFilters object. This structure provides a
 *                                                  dynamic way to present filters based on the search
 *                                                  results, allowing users to further refine the results
 *                                                  based on available filter options.
 */
export interface SearchFuncResponse {
  searchResults: SearchResults[];
  filters: Record<string, SearchFilters>;
}
