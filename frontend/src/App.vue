<template>
  <div>
    <!-- <navigation></navigation>   -->
    <router-view/>
  </div>
</template>

<script>
// import Navigation from './components/Navigation';

export default {
  components: {
    // Navigation
  }
};
</script>

<style lang="scss">
html, body{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Tahoma', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  box-sizing: border-box;
}

*{
  box-sizing: border-box;
}

</style>
