<template>
  <div class="container">
    <el-select v-model="kType">
      <el-option v-for="(item, index) in kTypes" :key="index" :value="item" :label="item"></el-option>
    </el-select>
    <el-select v-model="sector" @change="onSectorChange">
      <el-option v-for="(item, index) in sectors" :key="index" :value="item" :label="item"></el-option>
    </el-select>
    <div class="row k-charts">
      <div v-for="(item, index) in stockList" :key="index" class="item">
        <div class="ticker">{{item.name}}</div>
        <img :src="item[kType]" alt="">
      </div>
    </div>    
  </div>
</template>

<script>
import stockRest from '../rest/stock_rest';
import kHelper from '../helpers/k_helper';

export default {
  data() {
    return {
      kType: 'dailyK',
      kTypes: ['minK', 'dailyK', 'weeklyK', 'monthlyK'],
      stockList: [],
      sector: '证券',
      sectors: ['证券', '饮料制造']
    };
  },
  methods: {
    onSectorChange() {
      this.requestData();
    },
    async requestData() {
      const stocks = await stockRest.getStockListBySector(this.sector);
      this.stockList = stocks.map(stock => {
        return {
          name: stock.name,
          code: stock.code,
          sector: stock.sector,
          minK: kHelper.getKChartUrl(stock.code, 'min'),
          dailyK: kHelper.getKChartUrl(stock.code, 'daily'),
          weeklyK: kHelper.getKChartUrl(stock.code, 'weekly'),
          monthlyK: kHelper.getKChartUrl(stock.code, 'monthly')
        };
      });
    }
  },
  async mounted() {
    this.requestData();
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
  .k-charts {
    flex-wrap: wrap;
    .ticker {
      margin-left: 30px;
    }
  }
}
</style>

