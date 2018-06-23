<template>
  <div class="resume-container">
    <div class="row header">
      <div><chart-header class="chart-header" v-if="showHeader" :title="title && title"></chart-header></div>
      <div class="data-source" v-if="description">数据来源：{{description}}</div>
    </div>
    <div class="body">
      <div class="row">
        <div class="row company">
          <div>{{data.company.name}}</div>
          <div class="row short">
            <div>{{data.company['short-name']}}</div>
            <div class="ticker">{{data.company.ticker}}</div>
          </div> 
        </div>               
      </div>
      <div class="row content">
        <div class="col-6 summary">
          <div class="row person">
            <div class="duty">{{data['职务']}}：</div>
            <div class="name">{{data.name}}</div>
            <div class="sex"> ({{data.sex}}) </div>
            <div class="control" v-if="data['是否是实际控制人']==='是'">实际控制人</div>
          </div>
          <div class="row detail">
            <div class="col-6">
              <div class="row record">
                <div class="key">管理层级别：</div>
                <div class="value">{{data['管理层级别']}}</div>
              </div>
              <div class="row record">
                <div class="key">上任日期：</div>
                <div>{{data['上任日期']}}</div>
              </div>
              <div class="row record">
                <div class="key">离任日期：</div>
                <div>{{data['离任日期']}}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="row record">
                <div class="key">国籍：</div>
                <div>{{data.nationality}}</div>
              </div> 
              <div class="row record">
                <div class="key">学历：</div>
                <div>{{data['学历']}}</div>
              </div>
              <div class="row record">
                <div class="key">出生日期：</div>
                <div>{{data.birthday}}</div>
              </div>
            </div>      
          </div>
          <div class="row nullable-values">
            <div class="row col-6 record" v-if="data['是否有境外居留权']">
              <div class="key">境外居留权:</div>
              <div>{{data['是否有境外居留权']}}</div>
            </div> 
            <div class="row col-6 record" v-if="data['毕业学校']">
              <div class="key">毕业学校:</div>
              <div>{{data['毕业学校']}}</div>
            </div> 
          </div>
        </div>
        <div class="col-6 resume">
          <div class="resume-title">详细信息:</div>
          <div class="resume-detail">{{data.resume}}</div>
        </div>          
      </div>      
    </div>  
  </div>
</template>

<script>
import ChartHeader from '@/components/common/ChartHeader';

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '个人简历'
    },
    description: {
      type: String
    }
  },
  components: {
    ChartHeader
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/mixin.scss';

.resume-container{
  .header {
    justify-content: space-between;
    .data-source {
      padding: 0 1rem;
      line-height: 3rem;
    }
  }
  .body {
    @include cardStyle;
    padding: 0.75rem 1.375rem;
    color: $primaryTextColor;

    .company{
      align-items: center;
      padding: 0.75rem 0.625rem;
      font-size: 1rem;
      background-color: #e6eff3;
      border-radius: 0.5rem;

      .short{
        margin-left: 0.5rem;
        padding: 0.125rem 0.5rem;
        color: white;
        background-color: $primaryTextColor;
        border-radius: 0.5rem;
        .ticker{
          margin-left: 0.875rem;
        }
      }
    }

    .content{
      margin-top: 1.125rem;
      .summary{        
        .person {
          align-items: flex-end;
          .duty {
            font-size: 0.875rem;
          }
          .name {
            font-size: 1.5rem;
            font-weight: bold;
          }
          .sex {
            margin-left: 0.5rem;
          }
          .control{
            margin-left: 1rem;
            padding: 0.125rem 0.5rem;
            color: $primaryColor;
            border: solid 0.0625rem $primaryColor;
            border-radius: 0.625rem;
          }
        }
        .record{
          margin-top: 1rem;
          .key{
            width: 5.625rem;
          }
        }
        .detail{
          margin-top: 0.5rem;
          font-size: 0.875rem;                    
        }
        
      }
      .resume{
        padding: 0 0.5rem;
        font-size: 0.875rem;
        .resume-title{
          padding-top: 1.25rem;
        }
        .resume-detail{
          overflow: auto;
          margin-top: 1rem;
          max-height: 12rem;
          text-indent: 1.75rem;
          line-height: 1.5rem;
        }
      }
    }
  }
}
</style>
