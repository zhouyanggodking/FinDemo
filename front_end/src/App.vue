<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">
@import './scss/color.scss';

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

span.highlight {
  color: $textHighlightColor !important;
}

/* width */
::-webkit-scrollbar {
    width: 0.625rem;
    height: 0.725rem;
}

/* Track */
::-webkit-scrollbar-track {
    background-color: #dae8ed; 
    // border: solid 0.0625rem #f4f4f4;
    // border-radius: 0.4375rem;
    box-shadow: inset 0 0.125rem 0.0625rem 0 rgba(0, 0, 0, 0.05);
}

/* Handle */
::-webkit-scrollbar-thumb {
    background-color: rgba(17, 52, 65, 0.1);
    border-radius: 0.3125rem;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background-color: rgba(17, 52, 65, 0.3);
}

::-webkit-scrollbar-corner {
  background: #e6ecee;
}
</style>
