<template>
  <div class="search-input-container" @click.stop>
    <div class="search-input">
      <input type="text" :placeholder="placeholder" v-model.trim="searchText" @focus="onSearchInputFocus()" @keypress.enter="onSearch()">
      <ul class="suggestion-list" :class="[{ active: isSuggestionPanelActive && suggestionList.length}]">
        <li class="suggestion-item" v-for="item in suggestionList" :key="item.index">
          <div :class="{'icon-clock': !item.isServerQuestion, 'icon-fire': item.isServerQuestion}"></div>
          <div class="item-value" @click="onSuggestionItemClick(item.question)">{{item.question}}</div>
          <div class="item-remove" v-show="!item.isServerQuestion" @click="onSuggestionItemRemoveClick(item.question)"></div>
        </li>
      </ul>
      <el-button type="primary" @click="onSearch()"><i class="icon-search"></i></el-button>
    </div>
  </div>
</template>

<script>
/**
 * description: bing.com or baidu.com alike search functionality
 * input: keyword, tell the query displayed in the textbox when initilizing component
 * output: change event, it will emit current search text, focus event
 */

import arrayHelper from '@/helpers/arrayHelper';
import funcHelper from '@/helpers/funcHelper';
import questionQuery from '@/rest/questionQuery';
import searchHistoryHelper from '@/helpers/searchHistoryHelper';
import searchHistoryEvent from '@/events/searchHistoryEvent';

const MAX_SUGGESTION_COUNT = 5;

export default {
  data() {
    return {
      active: 'active',
      isSuggestionPanelActive: false,
      placeholder: '热门问题',
      searchText: undefined, // used to first time initialization
      historySuggestionList: [], // used to display on the UI
      historySuggestionSet: [], // used to store the whole suggestion list, support maximum 100: TODO
      serverSuggestionList: [],
      suggestionList: []
    };
  },
  methods: {
    onSearchInputFocus() {
      this.isSuggestionPanelActive = true;
      this.$emit('focus');
    },
    onSearchInputBlur() {
      this.isSuggestionPanelActive = false;
      this.$emit('blur');
    },
    onSearch() {
      this.addToHistorySuggestionList(this.searchText);
      this.isSuggestionPanelActive = false;
      this.$emit('change', this.searchText);
    },
    onSuggestionItemClick(text) {
      this.searchText = text;
      this.onSearch();
    },
    onSuggestionItemRemoveClick(textToBeRemoved) {
      this.deleteFromHistorySuggestionList(textToBeRemoved);
    },
    addToHistorySuggestionList(searchText) {
      if (searchText) {
        searchHistoryHelper.add(searchText);
      }
    },
    processSuggestionList(serverSuggestionList, historySuggestionList) {
      const serverSuggestions = serverSuggestionList.map(item => {
        return {
          question: item,
          isServerQuestion: true
        };
      });

      const historySuggestions = historySuggestionList.map(item => {
        return {
          question: item,
          isServerQuestion: false
        };
      });

      const suggestionSet = serverSuggestions.concat(historySuggestions);
      return arrayHelper.takeFirstNElements(suggestionSet, MAX_SUGGESTION_COUNT); // take first N element
    },
    deleteFromHistorySuggestionList(historyToBeRemoved) {
      // first remove it from suggestSet
      searchHistoryHelper.remove(historyToBeRemoved);
    },
    filterHistorySuggestionList(query = '') {
      const tmpSuggestionList = this.historySuggestionSet.filter((item) => item.indexOf(query.toLocaleLowerCase()) > -1);        
      return arrayHelper.takeFirstNElements(tmpSuggestionList, MAX_SUGGESTION_COUNT);    
    },
    searchTextChangeHandler(val) {
      // if (oldVal !== undefined) {
      //   this.isSuggestionPanelActive = true;
      // }
      questionQuery.getSuggestQuestions(val).then(response => {
        this.serverSuggestionList = response.data.result || [];
        this.historySuggestionList = this.filterHistorySuggestionList(this.searchText);
        this.suggestionList = this.processSuggestionList(this.serverSuggestionList, this.historySuggestionList);   
      }, () => {
        this.serverSuggestionList = [];
        this.historySuggestionList = this.filterHistorySuggestionList(this.searchText);   
        this.suggestionList = this.processSuggestionList(this.serverSuggestionList, this.historySuggestionList);   
      }); 
    }
  },
  mounted() {
    document.addEventListener('click', () => {
      this.onSearchInputBlur();
    });
    this.searchText = this.keyword || undefined;// to set the same value as it's just mounted
    // when first initialized, read suggestion set from local storage and take first N element
    this.historySuggestionSet = searchHistoryHelper.getAll();
    this.historySuggestionList = searchHistoryHelper.get(MAX_SUGGESTION_COUNT);
    this.suggestionList = this.processSuggestionList(this.serverSuggestionList, this.historySuggestionList);   

    eventBus.$on(searchHistoryEvent.HISTORY_CHANGE, () => {
      this.historySuggestionSet = searchHistoryHelper.getAll();      
      this.historySuggestionList = this.filterHistorySuggestionList(this.searchText);
      this.suggestionList = this.processSuggestionList(this.serverSuggestionList, this.historySuggestionList);   
    });

    this.debouncedSearchTextChangeHandler = funcHelper.debounce(this.searchTextChangeHandler, 500);
  },
  props: {
    keyword: String,
    loading: Boolean
  },
  watch: {
    searchText(val, oldVal) {
      this.debouncedSearchTextChangeHandler(val, oldVal);  
    },
    keyword(val) {
      this.searchText = val || '';
    },
    '$route'() { // (to, from)
      this.isSuggestionPanelActive = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/mixin.scss';

//this style is used for non-main page search input box
//main page has bigger size
.search-input-container{
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  .search-input{
    flex-grow: 9999;
    position: relative;
    & > input{
      display: inline-block;
      height: 100%;
      width: 100%;
      padding: 0 8.5rem 0 2rem;      
      font-size: 1.25rem;
      color: $primaryTextColor;
      background-color: $primaryBackgroundColor;
      border-radius: 0.25rem 2.125rem 0.25rem 2.125rem;
      border: solid 0.0625rem #f4f4f4;
      caret-color: $primaryColor;
      box-shadow: inset 0px 2px 1px 0px rgba(0, 0, 0, 0.1);

      &::-ms-clear {
        display: none;
      }

      &::-webkit-input-placeholder{
        color: $searchInputPlaceholderColor;
      }

      &::-moz-placeholder{
        color: $searchInputPlaceholderColor;
      }

      &::-ms-input-placeholder{
        color: $searchInputPlaceholderColor;
      }

      &:focus{
        outline: none;
        border: solid 0.0625rem $primaryColor !important;
      }
    }

    & .suggestion-list{
      display: none;
      position: absolute;
      margin: 0;
      padding: 0;
      top: 3.75rem;
      left: 0;
      width: 100%;
      padding: 0.625rem 1rem 0.625rem 2rem;
      background: white;
      list-style-type: none;
      border-radius: 2.125rem 0.25rem 2.125rem 0.25rem;
      border: solid 0.0625rem $searchInputDefaultBorderColor;
      cursor: pointer;
      box-shadow: 0 0.75rem 1.875rem 0 rgba(0, 0, 0, 0.1);
      z-index: 10000;

      .suggestion-item{
        display: flex;
        // justify-content: space-between;
        align-items: center;
        padding-right: 0.625rem;
        width: 100%;
        height: 2.25rem;
        font-size: 1.125rem;
        color: $searchInputPlaceholderColor;
        line-height: 2rem;

        .icon-clock{
          display: block;
          width: 1.375rem;
          height: 1.375rem;
          flex-shrink: 0;
          background-image: url('../../assets/icons/icon-clock.png');
          background-size: 100% 100%;
        }

        .icon-fire{
          display: block;
          width: 1.375rem;
          height: 1.375rem;
          flex-shrink: 0;
          background-image: url('../../assets/icons/fire-grey.svg');
          background-size: 100% 100%;
        }

        .item-value{
          overflow: hidden;
          width: calc(100% - 2rem);
          padding: 0 0.625rem;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .item-remove{
          width: 0.875rem;
          height: 0.875rem;
          flex-shrink: 0;
          margin-right: 1rem;
          background-image: url('../../assets/icons/icon-delete.png');
          background-size: 100% 100%;
        }
      }

      .suggestion-item:hover{
        color: $primaryColor;
      }
    }

    & .suggestion-list.active{
      display: block;
    }
  }


  & /deep/ .el-button{
    position: absolute;
    right: 1rem;
    top: 0.5rem;
    width: 5.5rem;
    height: 2.5rem;
    // padding-top: 0.625rem;
    padding: 0 !important;
    border-radius: 1.5rem;
    box-shadow: 0 0.125rem 0.25rem 0 rgba(6, 94, 114, 0.1); 
    @include buttonEffect;
    span {
      display: block;
      .icon-search{
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        background-image: url('../../assets/icons/search-icon.svg');
        background-size: 100% 100%;
      }
    }    
  }
}
</style>

