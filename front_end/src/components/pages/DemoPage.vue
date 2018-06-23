<template>
  <div class="search-result-container">
    <header class="row header">
      <div class="row search-box">
        <router-link to="/" class="logo">
          <img class="logo" src="../../assets/img/logo.svg" alt="shannon logo"/>
        </router-link>
        <search-input class="search-input" @change="change" :keyword="searchText" :loading="isLoading"></search-input>
      </div>
      <user-account></user-account>
    </header>
    
    <div :class="{row: true, 'result-panel': true, 'side-bar-expanded': isSideBarExpanded}">
      <div class="loading" v-loading="isLoading">
        <div :class="{'result-main': true, 'has-filter': hasFilter}">
          <div class="filter" v-if="options.filter">
            <div class="row filter-item" v-for="(item, key, index) in options.filter" :key="index">
              <div class="filter-title">{{item['title']}}: </div>
              <div>
                <el-select v-model="filter[key]" :placeholder="item['title']" filterable @change="filterChange()">
                  <el-option
                    v-for="(value, index) in item['values']"
                    :key="index"
                    :label="value || '全部'"
                    :value="value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="result-list">
            <result-item-list class="result-item" v-if="rerender"
              :contentConfig="contentConfig"
              :filter="filter"
              :hasFilter="hasFilter">
            </result-item-list>
          </div>
        </div>
      </div>
      <aside class="side-bar">
        <side-bar :questions="suggestQuestions" @expand-status="onExpandStatusChange"></side-bar>
      </aside>
    </div>
  </div>
</template>

<script>
import ResultItemList from '@/components/result/ResultItemList';
import searchHistoryHelper from '@/helpers/searchHistoryHelper';
import SearchInput from '@/components/common/SearchInput';
import SideBar from '@/components/common/SideBar';
import QuestionQuery from '@/rest/questionQuery';
import UserAccount from '@/components/common/UserAccount';

export default {
  name: 'demoPage',
  data() {
    return {
      contentConfig: [],
      filter: {},
      isLoading: false,
      isSideBarExpanded: false,
      options: {},
      rerender: false,
      searchHistory: [],
      searchText: '',
      suggestQuestions: []
    };
  },
  methods: {
    change(searchText) {
      if (searchText) {
        if (this.$route.query.q === searchText) { // if search text doesn't change at all, just send request to load data
          this.search(searchText);
        } else {
          this.$router.push({
            name: 'demo-page',
            query: {
              q: searchText
            }
          });
        }
      } else {
        this.$router.push({
          name: 'main-page'
        });
      }
    },
    filterChange() {
      this.filter = Object.assign({}, this.filter);// to trigger ui update
    },
    getSearchResult(query) {
      // update to search history
      searchHistoryHelper.add(query);

      QuestionQuery.getSearchResult(query).then((response) => {
        this.isLoading = false;
        this.rerender = false;
        this.$nextTick(() => this.rerender = true);
        const data = response.data;
        this.contentConfig = [];
        this.contentConfig = data['search-result'] || [];
        this.contentConfig = this.contentConfig.map(item => {
          item.options = item.options || {}; // force assignment
          return item;
        });
        this.options = data.options || {};
        if (this.options.filter) {
          Object.keys(this.options.filter).forEach(key => {
            this.filter[key] = this.options.filter[key].default || '';
            this.options.filter[key].values.unshift('');
          });
        }
        // process total count of pager
        if (this.hasPager) {
          this.currentPage = 1;
          this.totalCount = this.contentConfig[0].data['total-count'];
        }
      }, ({ response }) => {
        this.isLoading = false;
        this.rerender = false;
        this.$nextTick(() => this.rerender = true);
        if (response.status >= 500) {
          this.contentConfig = [{ type: 'network-error' }];
        }
      });
    },
    getSearchsuggestQuestions(query) {
      QuestionQuery.getRecommendationQuestions(query).then((response) => {
        this.suggestQuestions = response.data.result || [];
      }, () => {
        this.suggestQuestions = [];
      });
    },
    initialize(searchText) {
      if (searchText) {
        this.search(searchText);
      } else {
        this.$router.push({
          name: 'main-page'
        });
      }
    },
    onExpandStatusChange(isExpanded) {
      this.isSideBarExpanded = isExpanded;
      // Caution: perfomance issue for large result set,
      // purpose: to resolve problem that it can't listen to div width changes to repaint chart
      this.rerender = false;
      this.$nextTick(() => this.rerender = true);
    },
    search(searchText) {
      this.isLoading = true;
      this.getSearchResult(searchText);
      this.getSearchsuggestQuestions(searchText);
    }
  },
  computed: {
    hasFilter() {
      return !!this.options.filter;
    }
  },
  watch: {
    '$route'(to) { // (to, from)
      this.searchText = to.query.q || '';
      this.initialize(this.searchText);
    }
  },
  mounted() {
    this.searchText = this.$route.query.q || '';
    this.initialize(this.searchText);
  },
  components: {
    ResultItemList,
    SearchInput,
    SideBar,
    UserAccount
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';

.search-result-container{
  height: 100%;
  min-width: 70rem;
  background-color: $pageBackgroundColor;
  .header {
    justify-content: space-between;
    align-items: center;
    padding-right: 2.5rem;
    width: 100%;
    background-color: white;
    box-shadow: 0 0.75rem 1.875rem 0 rgba(0, 0, 0, 0.05);
    .search-box{
      align-items: center;
      height: 5rem;
      padding: 1rem 1rem 1rem 3rem;
      background-color: white;
      z-index: 1000;

      .logo{
        width: 3rem;
        height: 3rem;
      }

      & > .search-input{
        width: 37.5rem;
        height: 3.5rem;
        margin-left: 1.5rem;
        min-width: 18.75rem;
        max-width: 37.5rem;
      }
    }
  }
  .result-panel{
    justify-content: space-between;
    padding: 0 2rem 0 0;
    width: 100%;
    height: calc(100% - 5rem);
    .loading{
      width: calc(100% - 4rem);
      height: 100%;
      .result-main{
        overflow: auto;
        padding: 0 0.75rem 1rem 2rem;
        height: 100%;
        & > .filter{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding-bottom: 1rem;
          background-color: $secondaryBackgroundColor;
          font-size: 1rem;
          border: solid 0.0625rem #dce1e3;
          border-radius: 0.625rem;
          .filter-item{
            margin-top: 1rem;
            .filter-title{
              flex-shrink: 0;
              margin: 0 0.75rem 0 1.5rem;
              height: 2.5rem;
              line-height: 2.5rem;
            }
          }
        }        
      }
    }
    .side-bar{
      flex-shrink: 0;
      overflow: auto;      
      margin-left: 0.75rem;
      padding-top: 1rem;
      width: 2.5rem;
      height: 100%;
    }
  }

  .result-panel.side-bar-expanded {
    .loading{
      width: calc(100% - 15rem);
    }
    .side-bar{
      width: 15rem;
      // padding-top: 1rem;
    }
  }
  /deep/ .el-loading-mask {
    background-color: $pageBackgroundColor;
  }
}

@media screen and (max-width: 420px) {
  .search-result-container{
    .search-box{
      width: 100%;
    }
  }
}
</style>
