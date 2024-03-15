export interface SearchResults {
  itemId: string;
  itemName: string;
}

export interface SearchFilters {
  label: string;
  values: Array<string>;
}

export interface SearchFuncResponse {
  searchResults: SearchResults[];
  filters: Record<string, SearchFilters>;
}
