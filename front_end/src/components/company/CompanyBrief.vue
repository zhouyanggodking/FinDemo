<template>
  <div class="brief-container">
    <div class="row section-header">
      <h2 class="title">公司简介</h2>
      <div class="divider"></div>
    </div>
    <div class="section-body">
      <div class="row">
        <div class="company-name">{{data['公司名称']}}</div>
      </div>
      <div class="row">
        <div class="col col-4">
          <div class="row ticker-container">
            <div class="ticker">{{data['short-name']}} {{data['ticker']}}</div>
          </div>
          <div class="row industry">
            <div class="icon"></div>
            <div class="header">所属行业 :</div>
            <div class="content">{{data['所属行业']}}</div>
          </div>
          <div class="row area">
            <div class="icon"></div>
            <div class="header">所属地域 :</div>
            <div class="content">{{data['所属地域']}}</div>
          </div>
          <div class="row concept-list">
            <div class="concept-item" v-for="(concept, index) in data['概念']" :key="index">{{concept}}</div>
          </div>         
        </div>
        <div class="col col-4">
          <div class="col-title">实际控制人:</div>
          <div class="control-list">
            <div class="row control-item" v-for="(item, index) in data['实际控制人']" :key="index">
              <div class="person-photo">{{item['name'][0]}}</div>
              <div class="name">{{item['name']}}</div>
              <div class="stock-ratio-text">持股比例:</div>
              <div class="stock-ratio-number">{{item["持股比例"]}}</div>
            </div>
          </div>
          <div class="col-title">控股股东:</div>
          <div class="control-list">
            <div class="row">
              <div class="person-photo" v-if="data['控股股东']['name'].length <= 3">{{data['控股股东']['name'][0]}}</div>
              <div class="company-photo" v-else></div>
              <div class="holder-content">
                <div class="holder-name">{{data['控股股东']['name']}}</div>
                <div class="row holder-ratio">
                  <div class="stock-ratio-text">持股比例：</div>
                  <div class="stock-ratio-number">{{data['控股股东']['持股比例']}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-4"> 
          <div class="col-title">业务简介 :</div>     
          <div class="row brief">
          <div class="content">{{businessBrief}} ...
            <el-button type="text" @click="expand = true">展开</el-button>
          </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="业务简介"
      :visible.sync="expand"
      width="80%">
      <div class="dialog-content">{{originalBusinessBrief}}</div>
    </el-dialog>
  </div>
</template>

<script>
const MAX_BRIEF_CHARS = 200;

export default {
  name: 'companyBrief',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      expand: false
    };
  },
  computed: {
    businessBrief() {
      return this.data['业务简介'].slice(0, MAX_BRIEF_CHARS);
    },
    originalBusinessBrief() {
      return this.data['业务简介'];
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';

$colors: #81b4f8 #eea78f #eed88f #8fddee #c1e787 #ee8f8f #e196f9 #a497f9 #b4c2d3 #5463e4 #be4c4c #62aec1;

.brief-container{  
  & > .section-body{
    padding: 1.5rem;
    color: $primaryTextColor;
    background-color: $primaryBackgroundColor;
    border-radius: 0.625rem;
    border: solid 0.125rem $defaultBorderColor;
    &:hover{
      box-shadow: 0 0.625rem 1.875rem 0 rgba(6, 94, 114, 0.1);
    }

    .company-name {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .col{
      &:nth-of-type(2) {
        padding: 0 1rem;
      }
      .ticker{
        height: 1.5rem;
        padding: 0 0.5rem;
        margin-top: 1.5rem;
        color: #ffffff;        
        background-color: $primaryTextColor;
        font-weight: bold;
        font-size: 1.125rem;
        border-radius: 0.5rem;
        line-height: 1.5rem;
      }     

      .industry, .area{
        align-items: center;
        font-size: 1rem;
        & > .icon{
          flex-shrink: 0;
          width: 1.125rem;
          height: 1.125rem;
          margin-right: 0.5rem;
          background-size: 100% 100%;
        }
        & > .header{
          flex-shrink: 0;
        }
        & > .content{
          margin-left: 0.25rem;
        }
      }
      .industry{ 
        margin-top: 1.5rem;
      }
      .area{ 
        margin-top: 0.5rem;
      }

      .industry .icon{
        background-image: url(../../assets/icons/industry-icon.png);
      }
      .area .icon{
        background-image: url(../../assets/icons/geo-icon.png);
      }

      .concept-list{
        padding-top: 1rem;
        flex-wrap: wrap;
        .concept-item{
          flex-shrink: 0;
          margin-top: 0.5rem;
          margin-right: 0.5rem;
          padding: 0.3125rem 0.875rem;
          height: 1.5rem;
          color: white;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          text-align: center;
          line-height: 0.875rem;
        }
        @for $index from 1 through 12{
          .concept-item:nth-of-type(#{$index}){
            background-color: nth($colors, $index);
          }
        }
      }

      .brief {        
        margin-top: 0.5rem;
        font-size: 1rem;
        .content{
          padding: 1rem 1.125rem;
          background-color: $primaryBackgroundColor;
          font-size: 0.875rem;
          text-indent: 1.75rem;
        }
      } 
      .col-title{
        font-size: 1rem;
      }
      .control-list{
        overflow: auto;
        margin-top: 0.5rem;
        padding: 0.5rem;
        max-height: 8rem;
        border-radius: 0.625rem;
        border: solid 0 $defaultBorderColor;
        background-color: $primaryBackgroundColor;
        .control-item{
          flex-shrink: 0;
          margin-top: 1rem;
          height: 3rem;
          align-items: center;
          &:first-of-type{
            margin-top: 0;
          }
        }
        .person-photo{
          flex-shrink: 0;
          width: 3rem;
          height: 3rem;
          color: $primaryGrayColor;
          border-radius: 0.25rem;
          border: solid 0.0625rem $defaultBorderColor;
          font-size: 1.75rem;
          font-weight: bold;
          text-align: center;
          line-height: 3rem;
        }
        .company-photo{
          flex-shrink: 0;
          width: 4rem;
          height: 4rem;
          background-image: url(../../assets/icons/company-icon.png);
          background-position: center;
          background-size: 3rem 3rem;
          background-repeat: no-repeat;
        }
        .name{
          flex-shrink: 0;
          margin-left: 1rem;
          // width: 6.25rem;
          font-size: 1.125rem;
        }
        .holder-name{  
          margin-left: 1rem;        
          font-size: 1.125rem;
        }
        .stock-ratio-text{
          flex-shrink: 0;
          margin-left: 1rem;
          color: $primaryGrayColor;
          font-size: 1rem;
        }
        .stock-ratio-number{
          flex-shrink: 0;
          margin-left: 1rem;
          color: #f4b862;
          font-size: 1rem;
          font-weight: bold;
        }
        .holder-ratio{
          margin-top: 1.25rem;
        }
      }
    }
  }

  & /deep/ {
    .dialog-content{
      font-size: 1rem;
      text-indent: 2rem;
    }
  }
}
</style>
