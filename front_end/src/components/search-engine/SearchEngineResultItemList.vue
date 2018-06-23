<template>
  <div class="search-engine-result-item-list">
    <div class="header">
      <span class="highlight">{{data.question}}</span><span>的相关信息</span>
    </div>
    <div class="content">
      <search-engine-result-item class="content-item" v-for="(item, index) in data['page-items']" :key="index" :highlight="data.highlight" :data="item"></search-engine-result-item>
    </div>
    <div class="pager">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </div>    
  </div>
</template>

<script>
import QuestionQuery from '@/rest/questionQuery';
import SearchEngineResultItem from '@/components/search-engine/SearchEngineResultItem';

export default {
  name: 'searchEngineResultItemList',
  props: {
    data: {
      type: Object,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1,
      totalCount: 0,
      dataItemList: []
    };
  },
  methods: {
    handleCurrentChange(currPage) {
      this.currentPage = currPage;
      this.requestForPage(this.data.question, this.pageSize, this.currentPage);
    },
    requestForPage(searchText, pageSize, pageNum) {
      QuestionQuery.getSearchResult(searchText, pageSize, pageNum).then(res => {        
        const result = res.data['search-result'] || [];
        this.dataItemList = result['page-items'];
      }, () => {
        this.dataItemList = [];
      });
    }
  },
  mounted() {
    this.totalCount = this.data['total-count'] || 0; 
    this.dataItemList = this.data['page-items'];
  },
  components: {
    SearchEngineResultItem
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
.search-engine-result-item-list {
  & > .header {
    padding: 0 1.5rem;
    height: 3rem;
    font-size: 1rem;
    background-color: #eff4f8;
    box-shadow: 0 0.125rem 0.25rem 0 rgba(6, 94, 114, 0.1);
    border-radius: 0.5rem;
    border: solid 0.0625rem #ffffff;
    line-height: 3rem;
  }

  .content-item {
    margin-top: 1rem;
  }

  & > .pager{
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
</style>
