<template>
  <div class="main-page" :class="{blur: isBlur, 'blur-out': isBlurOut, 'show-more': showMore}" @mousewheel="handleMouseWheel" @scroll="this.handleScroll">
    <div class="row header">
      <div class="row logo-container">
        <div class="logo"></div>
        <div class="logo-text"></div>
      </div>
      <user-account></user-account>
    </div>
    <div class="input-positioning">
      <div class="input-container">
        <div class="guide-text-animation">
          <div class="guide-text">{{guideText}}</div>
        </div>
        <div class="search-container" id="search-container">
          <search-input @change="search" @focus="searchInputFocus" @blur="searchInputBlur" class="search-input-animation"></search-input>
        </div>
      </div>
    </div>
    <div class="recommendation-positioning">
      <recommendation-list class="recommendation-list"></recommendation-list>
    </div>
    <div class="show-more" v-if="!showMore" @click="showMoreContent()">
      <div class="show-more-text">点击查看更多</div>
      <div class="show-more-icon"></div>
    </div>
    <div id="gallery_top" class="content-more" v-show="showMore">
      <ul class="content-nav">
        <li v-for="(section, sectionIndex) in recommendationList" :key="sectionIndex" @click="goToFragment(section.id)">{{section.title}}</li>
      </ul>
      <div v-for="(section, sectionIndex) in recommendationList" :key="sectionIndex">
        <div :id="section.id" class="row section-content">
          <div class="prefix">
            <div class="top"></div>
            <div class="bottom"></div>
          </div>
          <div class="content">
            <div class="header">{{section.title}}</div>
            <ul class="body">
              <li v-for="(item, itemIndex) in section.content" :key="itemIndex">
                <router-link :to="{name: 'demo-page', query: {q: item}}">{{item}}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="back-to-top" v-if="showMore" @click="goToFragment('gallery_top')">
      <div class="back-to-top-icon"></div>
      <div class="back-to-top-text">TOP</div>
    </div>
    <div class="row top-bar-fixed" v-if="showTopBar">
      <div class="row search-box">
        <router-link to="/" class="logo">
          <img class="logo" src="../../assets/img/logo.svg" alt="shannon logo"/>
        </router-link>
        <search-input class="search-input" @change="search" @focus="searchInputFocus" @blur="searchInputBlur"></search-input>
      </div>
      <user-account></user-account>
    </div>
  </div>
</template>

<script>
import VueScrollTo from 'vue-scrollto';
import QuestionQuery from '@/rest/questionQuery';
import RecommendationList from '@/components/common/RecommendationList';
import SearchInput from '@/components/common/SearchInput';
import UserAccount from '@/components/common/UserAccount';


export default {
  name: 'mainPage',
  data() {
    return {
      guideText: '您想了解什么？',
      isBlur: false,
      isBlurOut: true,
      showMore: false,
      searchText: '',
      recommendationList: [],
      showTopBar: false
    };
  },
  methods: {
    goToFragment(fragment) {
      const elem = this.$el.querySelector(`#${fragment}`);
      VueScrollTo.scrollTo(elem, 500, {
        container: '.main-page',
        offset: -80 // top bar height
      });
    },
    handleMouseWheel() {
      // this.showMore = true;
    },
    handleScroll() {
      const searchContainer = this.$el.querySelector('#search-container');
      const scrollTop = this.$el.scrollTop;
      const offsetTop = searchContainer.offsetTop;
      if (scrollTop > offsetTop) {
        this.showTopBar = true;
      } else {
        this.showTopBar = false;
      }
    },
    search(searchText) {
      if (searchText) {
        this.$router.push({
          name: 'demo-page',
          query: {
            q: searchText
          }
        });
      }
    },
    searchInputFocus() {
      this.isBlur = true;
      this.isBlurOut = false;
    },
    searchInputBlur() {
      this.isBlur = false;
      this.isBlurOut = true;
    },
    showMoreContent() {
      this.showMore = true;
      this.$nextTick(() => this.goToFragment('gallery_top'));
    }
  },
  mounted() {
    QuestionQuery.getMoreQuestionList().then(response => {
      this.recommendationList = response.data.result.map((item, index) => {
        const id = Math.floor(Math.random() * 1000000000);
        return {
          title: item.title,
          id: `gallery_${id}_${index}`,
          content: item.content
        };
      });
    }, () => {
      // get mock data if backend service endpoint is not available
      this.recommendationList = [];
    });
    // window.addEventListener('scroll', this.handleScroll);
  },
  components: {
    RecommendationList,
    SearchInput,
    UserAccount
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/mixin.scss';

$ribonColor: #34afdc;
.main-page{
  overflow: auto;
  width: 100%;
  height: 100%;
  min-width: 45rem;
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
  }
  &.blur::before{
    animation: blur-in 0.3s linear forwards;
  }
  &.blur-out::before{
    animation: blur-out 0.2s linear forwards;
  }
  &.blur.show-more::before, &.blur-out.show-more::before {
    animation: blur-in 0.3s linear forwards;
  }
  & > .header{
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 5rem;
    padding: 1rem 2.75rem 1rem 3rem;
    @include blur(0);
    animation:slide-down 0.5s linear forwards;
    .logo-container{
      justify-content: center;
      align-items: center;
      .logo{
        width: 3rem;
        height: 3rem;
        background-image: url('../../assets/img/logo.svg');
        background-size: 100% 100%;
      }
      .logo-text{
        width: 18rem;
        height: 1.25rem;
        margin-left: 1.5rem;
        background-image: url('../../assets/img/logo-text.svg');
        background-size: 100% 100%;
      }
    }
  }
  .input-positioning {
    display: flex;
    justify-content: center;
    margin-top: 8rem;
    width: 100%;
    .input-container{
      width: 45rem;
      min-width: 45rem;;
      .guide-text-animation{
        position: relative;
        height: 4.5rem;
        .guide-text {
          position: absolute;
          top: 4.5rem;
          height: 100%;
          color: #f9f9f9;
          font-weight: bold;
          font-size: 3rem;
          animation: slide-up 0.5s linear 0.5s forwards;
          line-height: 4.5rem;
        }
      }
      .search-container{
        display: flex;
        justify-content: center;
        width: 100%;
        .search-input-animation{
          animation: grow 0.5s linear;
        }
        & /deep/ .search-input-container{
          width: 56.25rem;
          height: 5rem;
          .search-input{
            & > input{
              padding: 0 9.875rem 0 3.125rem;
              font-size: 1.5rem;
              box-shadow: 0 0.75rem 1.875rem 0 rgba(0, 0, 0, 0.1);
              border-radius: 0.25rem 3rem 0.25rem 3rem;
              border: solid 0.0625rem $defaultBorderColor;
              background-color: white;
            }

            & .suggestion-list{
              padding: 0.625rem 1.5rem 0.625rem 3rem;
              box-shadow: 0 0.75rem 1.875rem 0 rgba(0, 0, 0, 0.1);
              border-radius: 3rem 0.25rem 3rem 0.25rem;
              border: solid 0.0625rem $defaultBorderColor;

              .suggestion-item{
                padding-right: 0.625rem;
                height: 3.5rem;
                font-size: 1.25rem;
                line-height: 3.5rem;

                .icon-clock{
                  width: 1.5rem;
                  height: 1.5rem;
                }

                .item-value{
                  width: calc(100% - 1.875rem);
                  padding: 0 1rem;
                }

                .item-remove{
                  width: 1rem;
                  height: 1rem;
                  margin-right: 1.375rem;
                }
              }
            }
          }

          .el-button{
            right: 1.5rem;
            width: 8rem;
            height: 3rem;
            padding-top: 0.75rem;
            border-radius: 1.5rem;
            .icon-search{
              display: inline-block;
              width: 1.5rem;
              height: 1.5rem
            }
          }
        }
      }
    }
  }
  .recommendation-positioning{
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    width: 100%;
    .recommendation-list{
      width: 45rem;
      min-width: 45rem;
    }
  }
  .show-more{
    margin: 2rem auto; // center show-more
    width: 7rem;
    cursor: pointer;
    .show-more-text {
      font-size: 0.875rem;
      color: #717a7b;
      text-align: center;
    }
    .show-more-icon {
      margin: 1.125rem auto 0 auto;
      width: 2.375rem;
      height: 0.75rem;
      background-image: url(../../assets/icons/show-more.png);
      background-size: 100% 100%;
    }
  }
  .content-more {
    margin: 3rem auto 0 auto;
    padding-top: 1rem;
    width: 60rem;
    ul.content-nav {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1rem;
      padding: 1rem;
      font-size: 1rem;
      color: #3f4647;
      background-color: #ffffff;
      box-shadow: 0 0.625rem 1.875rem 0 rgba(98, 118, 125, 0.05);
      border-radius: 0.5rem;
      cursor: pointer;
      & > li {
        width: 6rem;
        padding: 0.5rem 0.25rem;
        list-style-type: none;
        &:hover {
          color: $ribonColor;
        }
      }
    }
    .section-content {
      margin: 1rem 0;
      width: 100%;
      & > .prefix {
        width: 0.5rem;
        height: 2.5rem;
        & > .top{
          width: 100%;
          height: 2rem;
          background-color: $ribonColor;
        }
        & > .bottom{
          width: 0;
          height: 0;
          border-right: 0.5rem solid #1e96c2;
          border-bottom: 0.5rem solid transparent;
        }
      }
      & > .content {
        width: calc(100% - 0.5rem);
        background-color: #ffffff;
        box-shadow: 0 0.625rem 1.875rem 0 rgba(98, 118, 125, 0.05);
        border-radius: 0 0.5rem 0.5rem 0.5rem;
        & > .header{
          padding-left: 1rem;
          width: 7.5rem;
          height: 2rem;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          background-color: $ribonColor;
          border-radius: 0 0 0.5rem 0;
          line-height: 2rem;
        }
        & > .body{
          display: flex;
          flex-wrap: wrap;
          padding: 0;
          font-size: 1rem;
          color: #3f4647;
        }
        ul{
          margin: 0;
          padding: 1rem 0 !important;
          li {
            display: flex;
            padding: 0.5rem 0.5rem 0.5rem 1.5rem;
            width: 50%;
            min-width: 20rem;
            list-style-type: none;
            @include linx($primaryTextColor, $ribonColor);
          }
        }
      }
    }
  }
  .back-to-top {
    position: fixed;
    right: 2rem;
    bottom: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    &:hover{
      background-color: rgba(0, 0, 0, 0.5);
    }
    & > .back-to-top-icon{
      margin: 0.5rem auto;
      width: 1.125rem;
      height: 0.375rem;
      background-image: url('../../assets/icons/back-to-top.png');
    }
    & > .back-to-top-text{
      font-size: 0.625rem;
      color: white;
      text-align: center;
    }
  }
  .top-bar-fixed{
    position: fixed;
    top: 0;
    justify-content: space-between;
    align-items: center;
    padding-right: 2.5rem;
    width: 100%;
    background-color: white;
    box-shadow: 0 0.75rem 1.875rem 0 rgba(0, 0, 0, 0.05);
    z-index: 1000;
    .search-box{
      align-items: center;
      height: 5rem;
      padding: 1rem 1rem 1rem 3rem;
      background-color: white;
      z-index: 1000;

      .logo{
        width: 3rem;
        height: 3rem;
      }

      & > .search-input{
        width: 37.5rem;
        height: 3.5rem;
        margin-left: 1.5rem;
        min-width: 18.75rem;
        max-width: 37.5rem;
      }
    }
  }
}

@keyframes blur-in {
  0% {
    @include blur(0);
  }
  100% {
    @include blur(6.25rem);
  }
}

@keyframes blur-out {
  0% {
    @include blur(6.25rem);
  }
  100% {
    @include blur(0);
  }
}

@keyframes slide-down {
  0% {
    top: -5rem;
  }
  100% {
    top: 0;
  }
}

@keyframes slide-up {
  0% {
    top: 4.5rem;
    color: $primaryTextColor;
  }
  100% {
    top: 0;
    color: $primaryTextColor;
  }
}

@keyframes grow {
  0% {
    width: 13.25rem;
  }
  100% {
    width: calc(100%);
  }
}

@media screen and (max-width: 3000px) { // 900 80
  .main-page{
    .input-positioning .input-container {
      width: 56.25rem;
      .guide-text{
        font-size: 3rem !important;
      }
    }
    .recommendation-positioning .recommendation-list{
      width: 56.25rem;
    }

    /deep/ {
      .search-container .search-input-container{
        .suggestion-list{
          top: 5.5rem !important;
        }
        .el-button{
          top: 1rem !important;
        }
      }
      .el-carousel__indicators.el-carousel__indicators--labels{
        padding: 0 11.25rem 0.5rem 11.25rem;
      }
    }
  }
}
@media screen and (max-width: 1680px) { // 788 70
  .main-page{
    .input-positioning .input-container {
      width: 49.25rem;
      .guide-text{
        font-size: 2.625rem !important;
      }

    }
    .recommendation-positioning .recommendation-list{
      width: 49.25rem;
    }

    /deep/ {
      .search-container .search-input-container{
        height: 4.375rem !important;
        .search-input {
          input {
            font-size: 1.25rem !important;
            box-shadow: 0px 0.6875rem 1.625rem 0px rgba(0, 0, 0, 0.1) !important;
            border-radius: 0.25rem 2.625rem 0.25rem 2.625rem !important;
          }
          .suggestion-list{
            top: 5rem !important;
            .suggestion-item{
              height: 3rem !important;
              font-size: 1.2rem !important;
              .item-value{
                line-height: 3rem;
              }
            }
          }
          .el-button {
            top: 0.875rem !important;
            width: 6.75rem !important;
            height: 2.625rem !important;
          }
        }
      }
      .el-carousel__indicators.el-carousel__indicators--labels{
        padding: 0 9.375rem 0.5rem 9.375rem;
      }
    }
  }
}
@media screen and (max-width: 1440px) { // 720 60
  .main-page{
    .input-positioning .input-container {
      width: 45rem;
      .guide-text{
        font-size: 2.25rem !important;
      }
    }
    .recommendation-positioning .recommendation-list{
      width: 45rem;
    }
    /deep/{
      .search-container .search-input-container{
        height: 3.75rem !important;
        .search-input {
          input {
            font-size: 1.125rem !important;
            box-shadow: 0px 0.6875rem 1.625rem 0px rgba(0, 0, 0, 0.1) !important;
            border-radius: 0.25rem 2.625rem 0.25rem 2.625rem !important;
          }
          .suggestion-list{
            top: 4.2rem !important;
            .suggestion-item{
              height: 2.5rem !important;
              font-size: 1rem !important;
              .icon-fire, .icon-clock {
                width: 1rem !important;
                height: 1rem !important;
              }
              .item-value{
                line-height: 2.5rem;
              }
            }
          }
          .el-button {
            top: 0.6875rem !important;
            width: 6.25rem !important;
            height: 2.375rem !important;
          }
        }
      }
      .el-carousel__indicators.el-carousel__indicators--labels{
        padding: 0 6.25rem 0.5rem 6.25rem;
      }
    }
  }
}
@media screen and (max-height: 750px) {
  .main-page > .input-positioning{
    margin-top: 4rem;
  }
}
</style>
