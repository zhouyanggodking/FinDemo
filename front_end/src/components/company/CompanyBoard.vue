<template>
  <div class="company-board-container">
    <div class="row section-header" v-if="data['董事会与高管']">
      <h2 class="title">董事会与高管</h2>
      <div class="divider"></div>
    </div>
    <table-grid v-if="data['董事会与高管']" :data="data['董事会与高管']" :showHeader="false"></table-grid>
    <div class="row section-header" v-if="data['十大股东']">
      <h2 class="title">十大股东和十大流通股股东</h2>
      <div class="divider"></div>
    </div>
    <table-grid v-if="data['十大股东']" :data="data['十大股东']" title="十大股东" description=""></table-grid>
    <div class="public-shareholders">
      <table-grid v-if="data['十大流通股股东']" :data="data['十大流通股股东']" title="十大流通股股东" description=""></table-grid>
    </div>    
  </div>
</template>

<script>
import TableGrid from '@/components/charts/TableGrid';

export default {
  name: 'companyBoard',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    TableGrid
  }
};
</script>

<style lang="scss" scoped>
.company-board-container{
  .public-shareholders{
    margin-top: 1rem;
  }
}
</style>
