<template>
  <div class="top-list-container">
    <table-grid v-if="data" :data="data" title="今日龙虎榜" description=""></table-grid>
  </div>
</template>

<script>
import TableGrid from '@/components/charts/TableGrid';
import FinDataQuery from '@/rest/finDataQuery';

export default {
  name: 'demoPage',
  data() {
    return {
      data: null,
      render: false
    };
  },
  methods: {
    getTopList() {
      FinDataQuery.getTopLatestList().then(res => {
        this.data = res.data;
      }, () => {
        this.data = {
          header: [],
          body: []
        };
      });
    }
  },
  mounted() {
    this.getTopList();
  },
  components: {
    TableGrid
  }
};
</script>

