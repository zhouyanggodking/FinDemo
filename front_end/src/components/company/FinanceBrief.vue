<template>
  <div class="finance-brief-container">
    <div class="row section-header">
      <h2 class="title">财务摘要</h2>
      <div class="divider"></div>
    </div>
    <div class="table-data">
      <table-grid v-if="data['data']" :data="data['data']" :showHeader="false"></table-grid>
    </div>
    <div class="row charts">
       <chart-Item
          class="col-6 chart"
          :height="300"
          v-if="data['营业总收入']"
          :config="data['营业总收入']"
          :showSlider="false"
          title="营业总收入">
       </chart-Item>
       <chart-Item
          class="col-6 chart" :height="300"
          v-if="data['净利润']"
          :config="data['净利润']"
          :showSlider="false"
          title="净利润">
       </chart-Item>       
    </div>
    <div class="row charts">
      <chart-Item
          class="col-6 chart"
          :height="300"
          v-if="data['扣非净利润']"
          :config="data['扣非净利润']"
          :showSlider="false"
          title="扣非净利润">
       </chart-Item>
       <chart-Item
          class="col-6 chart"
          :height="300"
          v-if="data['roe']"
          :config="data['roe']"
          :showSlider="false"
          title="ROE">
       </chart-Item>
    </div>
  </div>
</template>

<script>
import ChartItem from '@/components/charts/ChartItem';
import TableGrid from '@/components/charts/TableGrid';

export default {
  name: 'financeBrief',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    ChartItem,
    TableGrid
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';

.finance-brief-container{
  .table-data{
    width: 100%;
  }

  .charts {
    margin-top: 1rem;
  }

  .chart:nth-of-type(2){
    padding: 0 0.625rem;
  }
}
</style>
