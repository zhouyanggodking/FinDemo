<template>
  <div class="search-result-container">
    <div class="search-box">
      <router-link to="/" class="logo">
        <img class="logo" src="../../assets/img/logo.svg" alt="shannon logo"/>
      </router-link>
      <search-input class="search-input" @change="change" :keyword="searchText" :loading="isLoading"></search-input>
    </div>
    <div class="loading" v-loading="isLoading">
      <div :class="{'result-panel': true, 'has-filter': hasFilter, 'has-pager': hasPager}">
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
          <result-item-list v-if="rerender"
            :contentConfig="contentConfig"
            :filter="filter"
            :hasFilter="hasFilter">
          </result-item-list>
        </div>              
        <div class="pager" v-if="this.hasPager">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import ResultItemList from '@/components/result/ResultItemList';
import SearchInput from '@/components/common/SearchInput';

export default {
  name: 'demoPage',
  data() {
    return {
      contentConfig: [],
      isLoading: false,
      options: {},
      rerender: false,
      searchText: '',
      filter: {},

      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  methods: {
    change(searchText) {
      this.search(searchText);
    },
    filterChange() {
      this.filter = Object.assign({}, this.filter);// to trigger ui update
    },
    generateLineChartData(dataCount = 1000) {
      const fields = [];
      let startDate = new Date('1990-01-01');
      const copyDate = new Date('1990-01-01');
      for (let index = 1; index <= dataCount; ++index) {
        fields.push(new Date(startDate.setDate(index)).toISOString().slice(0, 10));
        startDate = new Date(copyDate);
      }
      const series = [];
      const obj = {};
      const obj1 = {};
      const obj2 = {};
      obj.name = 'king';
      obj1.name = 'king1';
      obj2.name = 'king2';
      fields.forEach(item => {
        obj[item] = Math.floor(Math.random() * 100);
        obj1[item] = Math.floor(Math.random() * 100);
        obj2[item] = Math.floor(Math.random() * 100);
      });
      series.push(obj);
      series.push(obj1);
      series.push(obj2);
      return {
        fields,
        series
      };
    },
    generateLineBarChartData(dataCount = 1000) {
      const fields = [];
      let startDate = new Date('1990-01-01');
      const copyDate = new Date('1990-01-01');
      for (let index = 1; index <= dataCount; ++index) {
        fields.push(new Date(startDate.setDate(index)).toISOString().slice(0, 10));
        startDate = new Date(copyDate);
      }
      const series = {};
      const obj = {};
      const obj1 = {};
      obj.name = 'king';
      obj1.name = 'king1';
      fields.forEach(item => {
        obj[item] = Math.floor(Math.random() * 100);
        obj1[item] = Math.floor(Math.random() * 100);
      });
      series.line = obj;
      series.bar = obj1;
      return {
        fields,
        series
      };
    },
    getData(query) {
      let promise;
      if (query.indexOf('company-summary') !== -1) { // company summary demo page
        promise = axios.get('/static/mock/company-brief.json');
      } else if (query.indexOf('filter') !== -1) { // demo page with filter
        promise = axios.get('/static/mock/suv.json');
      } else if (query.indexOf('search-engine') !== -1) { // show result of search engine        
        promise = axios.get('/static/mock/search-engine-result.1.json');
      } else { // load default chart demo page
        const res = {
          'search-result': []
        };
        const promiseArr = [];
        promiseArr.push(axios.get('/static/mock/table.json').then((response) => {
          res['search-result'].push({
            type: 'table',
            data: response.data
          });
        }));
        promiseArr.push(axios.get('/static/mock/bar-chart-multiple.json').then((response) => {
          res['search-result'].push({
            title: 'bar chart title',
            type: 'bar-chart',
            data: response.data
          });
        }));
        promiseArr.push(axios.get('/static/mock/line-chart-multiple.json').then((response) => {
          res['search-result'].push({
            description: 'NT',
            type: 'line-chart',
            data: response.data
          });
        }));
        promiseArr.push(axios.get('/static/mock/line-bar-chart-mulitple.json').then((response) => {
          res['search-result'].push({
            type: 'line-bar-chart',
            data: response.data
          });
        }));
        promiseArr.push(axios.get('/static/mock/bar-chart.json').then((response) => {
          res['search-result'].push({
            type: 'pie-chart',
            data: response.data
          });
        }));
        promiseArr.push(axios.get('/static/mock/stock.json').then((response) => {
          res['search-result'].push({
            type: 'stock-chart',
            data: response.data
          });
        }));
        promiseArr.push(axios.get('/static/mock/dagre-chart.json').then((response) => {
          res['search-result'].push({
            type: 'dagre-chart',
            data: response.data
          });
        }));
        promiseArr.push(axios.get('/static/mock/resume.json').then((response) => {
          res['search-result'].push({
            type: 'resume',
            data: response.data
          });
        }));
        promise = axios.all(promiseArr).then(() => {
          res['search-result'].push({
            type: 'exception',
            data: {
              title: '异常',
              description: '系统暂无相关数据'
            }
          });
          return {
            data: res
          };
        });
      }
      promise.then((response) => {
        this.isLoading = false;
        this.rerender = false;
        this.$nextTick(() => this.rerender = true);
        const data = response.data;
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
      });
    },
    handleCurrentChange(currPage) {
      this.currentPage = currPage;
      this.requestForPage(this.pageSize, this.currentPage);
    },    
    initialize(searchText) {
      if (searchText) {
        this.search(searchText);
      } else {
        this.searchText = 'chart';
        this.search(this.searchText);
      }
    },
    requestForPage(pageSize, pageNum) {
      let promise;
      if (pageNum === 1) {
        promise = axios.get('/static/mock/search-engine-result.1.json');
      } else if (pageNum === 2) {
        promise = axios.get('/static/mock/search-engine-result.2.json');
      } else if (pageNum === 3) {
        promise = axios.get('/static/mock/search-engine-result.3.json');
      }
      promise.then((response) => {
        this.isLoading = false;
        this.rerender = false;
        this.$nextTick(() => this.rerender = true);
        const data = response.data;
        this.contentConfig = data['search-result'] || [];
        this.totalCount = this.contentConfig[0].data['total-count'];
      });
    },
    search(searchText) {
      this.isLoading = true;
      this.getData(searchText);
    }
  },
  computed: {
    hasFilter() {
      return !!this.options.filter;
    },
    hasPager() {
      const searchEngineResult = this.contentConfig.filter(item => item.type === 'search-engine-result');
      return searchEngineResult.length > 0;
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
    SearchInput
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
.search-result-container{
  height: 100%;
  // min-width: 60rem;
  background-color: #e1ecf1;
  .search-box{
    display: flex;
    align-items: center;
    width: 100%;
    height: 5rem;
    padding: 1rem 1rem 1rem 3rem;
    box-shadow: 0 0.75rem 1.875rem 0 rgba(0, 0, 0, 0.05);
    z-index: 1000;

    .logo{
      width: 3rem;
      height: 3rem;
    }

    & > .search-input{
      width: calc(80% - 8.5rem);
      height: 3.5rem;
      margin-left: 1.5rem;
      min-width: 18.75rem;
      max-width: 37.5rem;
    }
  }
  .loading{
    height: calc(100% - 5rem);
    .result-panel{
      padding: 1rem 2rem;
      overflow: auto;
      height: 100%;
      width: 100%;
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
      .pager{
        justify-content: space-between;
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: $secondaryBackgroundColor;
        border-radius: 0.5rem;
        border: solid 0.0625rem white; 
        & /deep/ {
          .el-pagination{
            .el-pager li{
              margin: 0 0.125rem;
              border: solid 0.0625rem #ffffff;
              border-radius: 0.25rem;
              background-color: $secondaryBackgroundColor;
              &.active{
                background-color: #ffffff;
              }
            }
            .el-input__inner{
              border: 0.0625rem solid white;
              &:focus{
                border: 0.0625rem solid $primaryColor;
              }
            }
            .btn-prev, .btn-next {
              border: solid 0.0625rem #ffffff;
              background-color: $secondaryBackgroundColor;
            }
          }
        }
      }
    }
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
