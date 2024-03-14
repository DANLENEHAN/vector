export interface SearchResults {
  itemId: string;
  itemName: string;
}

export interface SearchFuncResponse {
  searchResults: SearchResults[];
  filters: Record<string, Array<any>>;
}
