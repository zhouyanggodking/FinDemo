<template>
  <div class="container">
    <el-select v-model="kType">
      <el-option v-for="(item, index) in kTypes" :key="index" :value="item" :label="item"></el-option>
    </el-select>
    <div v-for="(item, index) in stockList" :key="index">
      <div>{{item.name}}</div>
      <img :src="item[kType]" alt="">
    </div>
  </div>
</template>

<script>
import stockRest from '../rest/stock_rest';
import kHelper from '../helpers/k_helper';

export default {
  data(){
    return {
      kType: 'dailyK',
      kTypes: ['minK', 'dailyK', 'weeklyK', 'monthlyK'],
      stockList: []
    };
  },
  async mounted() {
    const stocks = await stockRest.getStockListBySector('证券');
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
    })
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
}
</style>

