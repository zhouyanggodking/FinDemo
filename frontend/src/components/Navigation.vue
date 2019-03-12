<template>
  <div class="navigation">
    <ul class="row">
      <li>
        <router-link to="/">主页</router-link>
      </li>
      <li>
        <router-link to="/security">Security</router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
$textColor: white;
$bgColor: #24292e;
.navigation {
  color: white;
  background-color: $bgColor;
  ul {    
    align-items: center;
    height: 64px;
    margin: 0 0 0 32px;
    padding: 0;
    font-size: 20px;
    font-weight: 600;
    li {
      padding: 0 8px;
      list-style: none;
      a {
        position: relative;
        text-decoration: none;
        color: $textColor;
        &:visited {
          color: $textColor;
        }
        &.router-link-exact-active {
          &::after {
            content: "";
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            display: inline-block;
            width: 100%;
            height: 4px;
            background-color: #0366d6;
          }
        }
      }
    }
  }
}
</style>

