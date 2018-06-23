<template>
  <div class="main-business-container">
    <div class="row section-header">
      <h2 class="title">主营构成</h2>
      <div class="divider"></div>
    </div>
    <div class="row">
      <div class="col-6 panel">
        <div class="tab-header">
          <div :class="{active: incomeDisplay === 'product', header: true}" @click="switchIncome('product')">产品</div>
          <div :class="{active: incomeDisplay === 'area', header: true}" @click="switchIncome('area')">地区</div>
        </div>
        <div class="tab-body" v-if="rerenderIncome">
          <div v-if="incomeDisplay === 'product'" class="chart-area">
            <chart-item
              v-if="data['income'] && data['income']['product']"
              :config="data['income']['product']"
              title="收入构成">
            </chart-item>
          </div>
          <div v-if="incomeDisplay === 'area'" class="chart-area">
            <chart-item
              v-if="data['income'] && data['income']['area']"
              :config="data['income']['area']"
              title="收入构成">
            </chart-item>
          </div>
        </div>
      </div>
      <div class="col-6 panel">
        <div class="tab-header">
          <div :class="{active: grossDisplay === 'product', header: true}" @click="switchGross('product')">产品</div>
          <div :class="{active: grossDisplay === 'area', header: true}" @click="switchGross('area')">地区</div>
        </div>
        <div class="tab-body" v-if="rerenderGross">
          <div v-if="grossDisplay === 'product'" class="chart-area">
            <chart-item
              v-if="data['gross-profit'] && data['gross-profit']['product']"
              :config="data['gross-profit']['product']"
              title="毛利构成">
            </chart-item>
          </div>
          <div v-if="grossDisplay === 'area'" class="chart-area">
            <chart-item
              v-if="data['gross-profit'] && data['gross-profit']['area']"
              :config="data['gross-profit']['area']"
              title="毛利构成">
            </chart-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartItem from '@/components/charts/ChartItem';

export default {
  name: 'mainBusiness',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      incomeDisplay: 'product', // area
      grossDisplay: 'product', // area
      rerenderIncome: true,
      rerenderGross: true
    };
  },
  methods: {
    switchIncome(category) {
      this.incomeDisplay = category;
      this.rerenderIncome = false;
      this.$nextTick(() => this.rerenderIncome = true);
    },
    switchGross(category) {
      this.grossDisplay = category;
      this.rerenderGross = false;
      this.$nextTick(() => this.rerenderGross = true);
    }
  },
  components: {
    ChartItem
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
.main-business-container{
  .panel{
    &:first-of-type{
      padding-right: 0.625rem;
    }
    .tab-header{
      display: flex;
      justify-content: flex-end;
      height: 2.5rem;
      margin-right: 1rem;
      margin-bottom: -0.125rem;
      font-size: 1.125rem;
      .header{
        margin-right: 0.25rem;
        padding: 0 2.5rem;
        border: solid 0.0625rem white;
        border-radius: 2.125rem 0.5rem 0 0;
        background-color: rgba(242, 245, 248, 0.6); // $primaryBackgroundColor;
        vertical-align: middle;
        line-height: 2.5rem;
        cursor: pointer;
      }
      .active{
        color: $primaryColor;
        border-bottom: solid 0.0625rem white;
        background-color: $primaryBackgroundColor;
        border-bottom-color: $primaryBackgroundColor;
        z-index: 100;
      }
    }
    .tab-body{
      margin-top: -3rem;
    }
  }
}
</style>
