import arrayHelper from '@/helpers/arrayHelper';
import localStorageHelper from '@/helpers/localStorageHelper';
import searchHistoryEvent from '@/events/searchHistoryEvent';

const SUGGESTION_LIST = 'SUGGESTION-LIST';

export default class SearchHistoryHelper {
  static add(searchQuery) {
    // updating suggestionSet: first remove existing one
    const tmpSuggestionSet = SearchHistoryHelper.getAll().filter((item) => item !== searchQuery);
    // updating suggestionSet: then add it at the beginning
    tmpSuggestionSet.unshift(searchQuery);
    // write it back and store it into localstorage
    localStorageHelper.setItem(SUGGESTION_LIST, JSON.stringify(tmpSuggestionSet));

    eventBus.$emit(searchHistoryEvent.HISTORY_CHANGE);

    return tmpSuggestionSet;
  }

  static get(maxCount = 5) {
    return arrayHelper.takeFirstNElements(SearchHistoryHelper.getAll(), maxCount);
  }

  static getAll() {
    return JSON.parse(localStorageHelper.getItem(SUGGESTION_LIST) || '[]');
  }

  static remove(searchQuery) {
    // first remove it from suggestSet
    const suggestionSet = SearchHistoryHelper.getAll().filter((item) => item !== searchQuery);
    localStorageHelper.setItem(SUGGESTION_LIST, JSON.stringify(suggestionSet)); 
    eventBus.$emit(searchHistoryEvent.HISTORY_CHANGE);  
    return suggestionSet; 
  }
}
