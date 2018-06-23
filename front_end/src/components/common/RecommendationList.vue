<template>
  <div class="recommendation-list-container" v-if="recommendationList.length">        
    <el-carousel trigger="click" arrow="never" :interval="3000" :height="rollingHeight" @change="swithTab">
      <el-carousel-item class="section" v-for="(section, sectionIndex) in recommendationList" :key="sectionIndex" :label="section.title" ref="recommendationList">
        <div class="content" :class="'content-' + (sectionIndex + 1)">
          <div class="header">{{section.title}}</div>
          <ul class="body">
            <li v-for="(item, itemIndex) in section.content" :key="itemIndex">
              <router-link :to="{name: 'demo-page', query: {q: item}}">{{item}}</router-link>
            </li>
          </ul>
        </div>          
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import QuestionQuery from '@/rest/questionQuery';

export default {
  name: 'recommendationList',
  data() {
    return {
      rollingHeight: '30rem',
      recommendationList: []
    };
  },
  methods: {
    swithTab() {
      setTimeout(() => {
        if (this.$refs.recommendationList) {
          const heightArr = this.$refs.recommendationList.map(section => section.$el.firstElementChild.clientHeight);
          const maxHeight = (Math.max(...heightArr) + 112) / 16; // plus padding and then convert to rem
          this.rollingHeight = `${maxHeight}rem`;
        }        
      }, 100);
    }
  },
  mounted() {
    QuestionQuery.getRecommendationList().then(response => {
      this.recommendationList = response.data.result;
    }, () => {
      // get mock data if backend service endpoint is not available
      this.recommendationList = [];
    });
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import "../../scss/mixin.scss";

$colors: #81b4f8 #77c5db #81d0cf #e8ca68 #eea78f #ee9999 #958cc8  #e5a1bf  #a3bcd9  #838bcd  #e18989  #62aec1  #ba9ccb  #d98799  #5b93ad;

.recommendation-list-container{
  width: 100%;
  background-color: #fefefe;
  border: solid 0.0625rem white;
  border-radius: 0.5rem;
  box-shadow: 0 0.625rem 1.5rem 0 rgba(0, 0, 0, 0.05);
  & /deep/ {
    .el-carousel__button{
      width: 5.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }   

    .el-carousel__indicator .el-carousel__button{  
      padding: 0.375rem 0.5rem;    
      background-color: rgba(0, 0, 0, 0.1);
    }

    .content {
      padding: 1rem;
      & > .header{        
        font-size: 1.25rem;
        color: $primaryGrayColor;
      }
      & > .body{
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        font-size: 1rem;
        color: #3f4647;
      }
      ul > li {
        display: flex;
        padding: 0.5rem 0.5rem 0.5rem 0;
        width: 50%;
        min-width: 20rem;
        list-style-type: none;
        @include linx($primaryTextColor, $primaryTextColor);
        &::before{
          content: "";
          display: inline-block;
          flex-shrink: 0;
          margin-top: 4px;
          margin-right: 0.5rem;
          width: 1rem;
          height: 1rem;
          background-size: 100% 100%;
        }
      }      
    }  
    
    @for $index from 1 through 15 {
      .content.content-#{$index}{
        .header {
          color: nth($colors, $index)
        }

        ul > li::before {
          background: url('../../assets/icons/circle.#{$index}.svg');      
        }        
      } 
      
      .el-carousel__indicator:nth-of-type(#{$index}){
        &.is-active .el-carousel__button{
          color: white;
          background-color: nth($colors, $index);
        }  
      }
    }
  }
}
</style>
