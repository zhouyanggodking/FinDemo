<template>
  <div class="login-page">
    <login-form class="login-form"></login-form>     
  </div>
</template>

<script>
import LoginForm from '@/components/common/LoginForm';

export default {  
  name: 'loginPage',
  data() {
    return {
    };
  },
  methods: {
  },
  components: {
    LoginForm
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/mixin.scss';

.login-page{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  &::before{
    content: "";
    display:block;
    position: fixed;
    left: 0;
    right: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/main-bg.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    @include blur(6.25rem);
  } 
}

</style>
