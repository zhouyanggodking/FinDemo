<template>
  <div class="network-error-container">
    <h2>{{errorMessage}}</h2>
  </div>
</template>

<script>
export default {
  name: 'networkError',
  data() {
    return {
      errorMessage: '与服务器连接错误'
    };
  }
};
</script>

