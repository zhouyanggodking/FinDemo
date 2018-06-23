<template>
  <div class="chart-header-container">
    <div class="header-title">{{title}}</div>
    <div class="header-description" v-show="false">{{description}}</div>
  </div>
</template>

<script>
export default {
  name: 'chart-header',
  props: {
    title: {
      type: String,
      default: 'Chart Title'
    },
    description: {
      types: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
.chart-header-container{
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  height: 3rem;
  background-color: $cardBackgroundColor;
  border-radius: 0.5rem 0.5rem 0 0;
  border: solid 0.0625rem white;
  border-bottom-color: $primaryBackgroundColor;
  .header-title{
    height: 1.5rem;
    font-size: 1.25rem;
    line-height: 1.25rem;
    color: $primaryTextColor;
  }

  .header-description{
    height: 1rem;
    margin-left: 1.5rem;
    font-size: 1rem;
    line-height: 1rem;
    color: #8199a4;
  }
}
</style>
