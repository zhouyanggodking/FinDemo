<template>
  <div class="chart-item">    
    <bar-chart v-if="config.data && config.type === 'bar-chart'" :data="config.data" :showHeader="showHeader" :title="title || config.title" :description="description || config.description"></bar-chart> 
    <dagre-chart v-else-if="config.data && config.type === 'dagre-chart'" :data="config.data" :showHeader="showHeader" :title="title || config.title" :description="description || config.description"></dagre-chart>
    <line-chart v-else-if="config.data && config.type === 'line-chart'" :data="config.data" :showSlider="showSlider" :showHeader="showHeader" :title="title || config.title" :description="description || config.description"></line-chart>
    <line-bar-chart v-else-if="config.data && config.type ==='line-bar-chart'" :data="config.data" :showSlider="showSlider" :showHeader="showHeader" :title="title || config.title" :description="description || config.description"></line-bar-chart>
    <pie-chart v-else-if="config.data && config.type === 'pie-chart'" :data="config.data" :showHeader="showHeader" :title="title || config.title" :description="description || config.description"></pie-chart>
    <stock-chart v-else-if="config.data && config.type === 'stock-chart'" :data="config.data" :showHeader="showHeader" :title="title || config.title" :description="description || config.description"></stock-chart>
  </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart';
import DagreChart from '@/components/charts/DagreChart';
import LineChart from '@/components/charts/LineChart';
import LineBarChart from '@/components/charts/LineBarChart';
import PieChart from '@/components/charts/PieChart';
import StockChart from '@/components/charts/StockChart';

export default {
  name: 'chart-item',
  props: {
    config: {
      type: Object,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showSlider: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    BarChart,
    DagreChart,
    LineChart,
    LineBarChart,
    PieChart,
    StockChart
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/mixin.scss';

div.chart-item /deep/ {
  .chart{
    @include cardStyle;
  }

  .header{
    justify-content: space-between;
    .data-source {
      padding: 0 1rem;
      line-height: 3rem;
    }
  } 
}  

</style>

