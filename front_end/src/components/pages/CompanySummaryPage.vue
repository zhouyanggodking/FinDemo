<template>
  <div>
    <company-summary v-if="companyBriefData" :data="companyBriefData"></company-summary> 
  </div>
</template>

<script>
import axios from 'axios';
import CompanySummary from '@/components/company/CompanySummary';

export default {
  name: 'company-summary-page',
  components: {
    CompanySummary
  },
  data() {
    return {
      companyBriefData: null
    };
  },
  mounted() {
    axios.get('/static/mock/company-brief.json').then((response) => {
      this.companyBriefData = response.data['search-result'][0].data;
    });
  }
};
</script>
