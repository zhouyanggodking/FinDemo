<template>
  <div class="stock-estimation-container">
    <div class="row section-header">
      <h2 class="title">历史估值</h2>
      <div class="divider"></div>
    </div>
    <chart-item :config="data" :showHeader="false" title="历史估值"></chart-item>
  </div>
</template>

<script>
import ChartItem from '@/components/charts/ChartItem';

export default {
  name: 'stockEstimation',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    ChartItem
  }
};
</script>
