<template>
  <div class="result-item-list-container">
    <div class="result-item" v-for="(config, index) in contentConfig" :key="index">
      <div v-if="hasFilter">
        <div v-if="config.options.filter && filterComponent(config, filter)">
          <result-item :config="config"></result-item>
        </div>            
      </div>
      <div v-else>
        <result-item :config="config"></result-item>
      </div>          
    </div>
  </div>
</template>

<script>
import ResultItem from '@/components/result/ResultItem';

export default {
  name: 'resultItemList',
  props: {
    contentConfig: {
      type: Array,
      required: true
    },    
    filter: {
      type: Object
    },
    hasFilter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    filterComponent(config, filter) {
      const filterResult = [];
      if (filter) {
        Object.keys(filter).forEach(key => {
          if (!filter[key] || filter[key] === config.options.filter[key]) {
            filterResult.push(true);
          } else {
            filterResult.push(false);
          }
        });
      }      
      return filterResult.filter(item => item === false).length === 0;
    }
  },
  components: {
    ResultItem
  }
};
</script>

<style lang="scss" scoped>
.result-item-list-container{
  .result-item{
    margin-top: 1rem;
  }
}
</style>

