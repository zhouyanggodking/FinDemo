<template>
  <div class="company-brief-container">
    <div class="section">
      <company-brief v-if="data['公司简介']" :data="data['公司简介']"></company-brief>
    </div>
    <div class="section">
      <main-business v-if="data['主营构成']" :data="data['主营构成']"></main-business>
    </div>
    <div class="section">
      <finance-brief v-if="data['财务摘要']" :data="data['财务摘要']"></finance-brief>
    </div>
    <div class="section">
      <stock-estimation v-if="data['历史估值']" :data="data['历史估值']"></stock-estimation>
    </div>
    <div class="section">
      <company-board :data="boardData"></company-board>
    </div>
  </div>
</template>

<script>
import CompanyBoard from '@/components/company/CompanyBoard';
import CompanyBrief from '@/components/company/CompanyBrief';
import FinanceBrief from '@/components/company/FinanceBrief';
import MainBusiness from '@/components/company/MainBusiness';
import StockEstimation from '@/components/company/StockEstimation';

export default {
  name: 'companySummary',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    boardData() {
      return {
        董事会与高管: this.data['董事会与高管'],
        十大股东: this.data['十大股东'],
        十大流通股股东: this.data['十大流通股股东']
      };
    }
  },
  components: {
    CompanyBoard,
    CompanyBrief,
    FinanceBrief,
    MainBusiness,
    StockEstimation
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';

.company-brief-container{
  & /deep/ {
    .section-header{
      display: flex;
      align-items: center;
      .title{
        flex-shrink: 0;
        flex-grow:0;
      }
      .divider{
        flex-grow: 9999;
        margin-left: 1.125rem;
        border-top: solid 0.0625rem #f0f4f7;
      }
    }
  }
}
</style>
