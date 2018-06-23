<template>
  <div class="result-item-container">       
    <company-summary v-if="config.data && config.type === 'company-summary'" :data="config.data"></company-summary>
    <chart-item v-else-if="config.type.indexOf('chart') > -1" :config="config"></chart-item>
    <table-grid v-else-if="config.data && config.type === 'table'" :data="config.data" :title="config.title" :description="config.description"></table-grid>
    <person-resume v-else-if="config.data && config.type === 'resume'" :data="config.data" :title="config.title" :description="config.description"></person-resume>
    <search-engine-result-item-list v-else-if="config.data && config.type === 'search-engine-result'" :data="config.data"></search-engine-result-item-list>
    <not-found v-else-if="config.type === 'exception'"></not-found>
    <network-error v-else-if="config.type === 'network-error'"></network-error>
  </div>
</template>

<script>
import ChartItem from '@/components/charts/ChartItem';
import CompanySummary from '@/components/company/CompanySummary';
import NetworkError from '@/components/common/NetworkError';
import NotFound from '@/components/common/NotFound';
import PersonResume from '@/components/charts/PersonResume';
import SearchEngineResultItemList from '@/components/search-engine/SearchEngineResultItemList';
import TableGrid from '@/components/charts/TableGrid';

export default {
  name: 'resultList',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  components: {
    ChartItem,
    CompanySummary,
    NetworkError,
    NotFound,
    PersonResume,
    SearchEngineResultItemList,
    TableGrid   
  }
};
</script>

<style lang="scss">

</style>
