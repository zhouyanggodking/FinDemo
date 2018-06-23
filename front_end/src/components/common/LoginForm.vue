<template>
  <div class="login-form-container">
    <header class="row header">
      <div class="logo"></div>
      <div class="login-text">用户登陆</div> 
    </header>
    <el-form ref="loginForm" :model="loginForm" class="form" label-position="top" :rules="rules">
      <el-form-item label="用户名" prop="userName" class="username-container">
        <el-input v-model="loginForm.userName"  @keypress.enter.native="login()"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" class="pwd-container">
        <el-input type="password" v-model="loginForm.password" @keypress.enter.native="login()"></el-input>
      </el-form-item>
      <div class="error-message" v-show="loginError">用户名或密码错误，请重新输入</div>
      <el-form-item class="auto-login">
        <el-checkbox v-model="loginForm.autoLogin">下次自动登陆</el-checkbox>
      </el-form-item>
      <el-form-item class="login-btn-container">
        <el-button @click="login()">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import authQuery from '@/rest/authQuery';
import localStorageHelper from '@/helpers/localStorageHelper';

const USER_AUTH_INFO_KEY = 'USER_AUTH_INFO';

export default {
  name: 'loginForm',
  data() {
    return {
      loginError: false,
      loginForm: {
        autoLogin: false,
        password: '',
        userName: ''        
      },      
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // if valid, send request to server  
          authQuery.login(this.loginForm.userName, this.loginForm.password).then(() => {
            if (this.$route.query && this.$route.query.redirect) {
              this.$router.push({
                path: this.$route.query.redirect
              });
            } else {
              this.$router.push({
                path: '/'
              });
            }
            // if logged in successfully, then write auth into localstorage if autoLogin is true
            if (this.loginForm.autoLogin) {
              localStorageHelper.setItem(USER_AUTH_INFO_KEY, JSON.stringify({
                autoLogin: true,
                username: this.loginForm.userName,
                password: this.loginForm.password // TODO: use encoded string instead
              }));
            }           
          }, () => {
            this.loginError = true;
          });
        } 
      });
    }
  },
  mounted() {
    const userAuthInfo = JSON.parse(localStorageHelper.getItem(USER_AUTH_INFO_KEY));
    if (userAuthInfo) {
      this.loginForm = {
        autoLogin: userAuthInfo.autoLogin,
        userName: userAuthInfo.username,
        password: userAuthInfo.password
      };
      if (userAuthInfo.autoLogin) {
        this.$nextTick(() => this.login());
      }      
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/mixin.scss';

.login-form-container {
  padding: 2rem;
  width: 29.375rem;
  background-color: white;
  box-shadow: 0 0.6875rem 2.5rem 0 rgba(5, 69, 92, 0.2);
  border-radius: 0.5rem;
  & > .header {
    align-items: center;    
    .logo {
      width: 2rem;
      height: 2rem;
      background-image: url('../../assets/img/logo.svg');
      background-size: 100% 100%;
    }
    .login-text {
      margin-left: 1rem;
      padding-left: 1rem;
      height: 1.5rem;
      border-left: solid 0.125rem #e8eeef;
      font-size: 1.25rem;
      font-weight: bold;
      color: #263033;
      line-height: 1.5rem;
    }
  }

  & > .form {
    position: relative;
    margin-top: 4rem;
  }

  /deep/ {
    .el-form {
      .el-form-item {
        .el-form-item__label {
          padding: 0;
          height: 1.5rem;
          font-size: 0.875rem;
          color: #83898b;
          line-height: 1.5rem;
        }

        .el-input__inner {
          margin-top: 0.5rem;
          height: 3rem;
          font-size: 1rem;
          background-color: #f5fafc;
          border-color: #f5fafc;
          line-height: 3rem;
          &:focus {
            border-color: #34afdc;
          }
        }
        &.is-success .el-input__inner {
          border-color: #34afdc;
        }
        &.is-error .el-input__inner {
          border-color: #f27272;
        }
        &.pwd-container {
          margin-top: 2rem;
          margin-bottom: 0;
        }
        &.auto-login {
          margin-top: 2rem;
        }
        &.login-btn-container{
          margin-top: 4rem;
          .el-button {
            width: 100%;
            height: 3rem;
            font-size: 1.25rem;
            color: white;
            background-color: #45a8cc;
            box-shadow: 0 0.125rem 0.25rem 0 rgba(6, 94, 114, 0.1);
            @include buttonEffect;
          }          
        }
      }

      .error-message {
        position: absolute;
        margin-top: 0.125rem;
        padding-left: 0.375rem;
        width: 25.375rem;
        height: 1.5rem;
        font-size: 0.875rem;
        color: #f27272;
        background-color: #fff0ee;
        border-radius: 0.25rem;
        line-height: 1.5rem;        
      }
    }    
  }
}
</style>
