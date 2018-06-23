<template>
  <div class="not-found-container">
    <div class="row header">
      <div><chart-header v-if="title" :title="title" :description="description"></chart-header></div>
      <div></div>
    </div>
    <div class="row body">
      <h2>{{description}}</h2>
    </div>
  </div>
</template>

<script>
import ChartHeader from '@/components/common/ChartHeader';

export default {
  name: 'notFound',
  props: {
    description: {
      type: String,
      default: '系统暂无相关数据'
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    ChartHeader
  }
};
</script>

<style lang="scss" scoped>
.not-found-container {
  .body {
    justify-content: center;
    align-items: center;
    margin-top: -0.0625rem;
    height: 10rem;
    background-color: #f2f5f8;
    -webkit-box-shadow: 0 0.125rem 0.25rem 0 rgba(6, 94, 114, 0.1);
    box-shadow: 0 0.125rem 0.25rem 0 rgba(6, 94, 114, 0.1);
    border: solid 1px #ffffff;
    border-radius: 0 0.5rem 0.5rem 0.5rem;
    z-index: 50;
    padding: 0.75rem 1.375rem;
    color: #3f4647;
  }
}
</style>
