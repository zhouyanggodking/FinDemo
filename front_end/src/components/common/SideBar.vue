<template>
  <div :class="{'side-bar-container': true, expanded: isAnyExpanded}">
    <div class="suggest-questions-panel">
      <div class="row header suggest">
        <div class="collapse"><div v-show="isQuestionPanelExpanded">相关问题</div></div>
        <div class="icon" @click="toggleQuestionPanel" title="相关问题"></div>
      </div>
      <div class="question-list" v-if="isQuestionPanelExpanded">
        <el-carousel v-if="rollingQuestions.length > 0" trigger="click" arrow="never" indicator-position="none" :interval="3000" :height="rollingQuestionHeight" @change="swithTab">
          <el-carousel-item class="section" v-for="(questionGroup, groupIndex) in rollingQuestions" :key="groupIndex" ref="questionList">
            <ul class="rolling-questions">
              <li class="row question-item" v-for="(question, qIndex) in questionGroup" :key="qIndex" @click="search(question)">
                <div class="link">
                  {{question}}
                </div>
                <div class="icon"></div>
              </li>
              <li class="question-item" v-if="questions.length === 0">没有找到相关的推荐</li>
            </ul>   
          </el-carousel-item>
        </el-carousel>   
        <ul v-else>
          <li class="question-item" v-if="questions.length === 0">没有找到相关的推荐</li>
        </ul>    
      </div>
    </div>    
    <div class="search-history-panel">
      <div class="row header search-history">
        <div class="collapse"><div v-show="isSearchHistoryPanelExpanded">历史记录</div></div>
        <div class="icon" @click="toggleSearchHistoryPanel" title="历史记录"></div>
      </div>
      <div class="search-history-list" v-show="isSearchHistoryPanelExpanded">
        <ul>
          <li class="row search-history-item" v-for="(history, sIndex) in searchHistory" :key="sIndex" @click="search(history)">
            <div class="link">
              {{history}}
            </div>
            <div class="icon" @click="removeHistory(history)"></div>
          </li>
          <li class="search-history-item" v-if="searchHistory.length === 0">您还没有过任何搜索记录</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: refactor search history into seperate component when side bar goes larger
import searchHistoryHelper from '@/helpers/searchHistoryHelper';
import searchHistoryEvent from '@/events/searchHistoryEvent';

const MAX_SEARCH_HISTORY_COUNT = 5;

export default {
  name: 'sideBar',
  data() {
    return {
      isQuestionPanelExpanded: true,
      isSearchHistoryPanelExpanded: true,
      rollingQuestionHeight: '7rem',
      searchHistory: []
    };
  },
  props: {
    questions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    isAnyExpanded() {
      return this.isQuestionPanelExpanded || this.isSearchHistoryPanelExpanded;
    },
    rollingQuestions() {
      const groupRecords = 5;
      const result = [];
      const groupCount = Math.ceil(this.questions.length / groupRecords);
      for (let groupIndex = 0; groupIndex < groupCount; ++groupIndex) {
        result.push(this.questions.slice(groupIndex * groupRecords, (groupIndex + 1) * groupRecords));
      }
      return result;
    }
  },
  methods: {
    notifyExpandStatusChange() {      
      if (this.isAnyExpanded) {
        this.$emit('expand-status', true);
      } else {
        this.$emit('expand-status', false);
      }      
    },
    removeHistory(history) {
      searchHistoryHelper.remove(history);
    },
    search(searchText) {
      this.$router.push({
        name: 'demo-page',
        query: {
          q: searchText
        }
      });
    },
    swithTab() {
      setTimeout(() => {
        if (this.$refs.questionList) {
          const heightArr = this.$refs.questionList.map(section => section.$el.firstElementChild.clientHeight);
          const maxHeight = (Math.max(...heightArr) + 28) / 16; // plus padding and then convert to rem
          this.rollingQuestionHeight = `${maxHeight}rem`;
        }
      }, 100);
    },
    toggleQuestionPanel() {
      const orgStatus = this.isAnyExpanded;
      this.isQuestionPanelExpanded = !this.isQuestionPanelExpanded;
      if (orgStatus !== this.isAnyExpanded) {
        this.notifyExpandStatusChange();
      }      
    }, 
    toggleSearchHistoryPanel() {
      const orgStatus = this.isAnyExpanded;
      this.isSearchHistoryPanelExpanded = !this.isSearchHistoryPanelExpanded;
      if (orgStatus !== this.isAnyExpanded) {
        this.notifyExpandStatusChange();
      }  
    }
  },
  mounted() {
    this.notifyExpandStatusChange();
    this.searchHistory = searchHistoryHelper.get(MAX_SEARCH_HISTORY_COUNT);

    eventBus.$on(searchHistoryEvent.HISTORY_CHANGE, () => {      
      this.searchHistory = searchHistoryHelper.get(MAX_SEARCH_HISTORY_COUNT);
    });
  }
};
</script>

<style lang="scss" >
@import '../../scss/color.scss';
@import "../../scss/mixin.scss";

.side-bar-container{
  height: 100%;
  font-size: 0.875rem;
  
  // common styles
  .header {
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    height: 2.5rem;
    color: $primaryGrayColor;
    line-height: 2.5rem;
    .collapse{
      cursor: pointer;
    }
    .icon{
      flex-shrink: 0;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  }

  ul {
    padding: 0;
    & > li {
      margin-top: 0.125rem;
      padding: 0.5rem 1rem;
      list-style-type: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  } 
  .suggest-questions-panel{
    .header > .collapse {
      color: $primaryTextColor;
    }
    .header > .icon {
      background: $redPink url(../../assets/icons/suggest-questions-icon.png) no-repeat center;      
      background-size: 50% 50%;
    }
    .question-list{
      .question-item{
        justify-content: space-between;
        align-items: center;
        color: $redPink;
        background-color: rgba(238, 143, 143, 0.15);
        @include linx($redPink, $redPink);

        &:hover {
          color: white;
          background-image: linear-gradient(270deg, #ee8f8f 0%, #ee9f8f 100%);
          @include linx(white, white);

          .icon {
            background-image: url(../../assets/icons/fire-white.svg);
          }
        }       

        .icon{
          flex-shrink: 0;
          width: 1rem;
          height: 1rem;
          background-size: 100% 100%;
          background-image: url('../../assets/icons/fire.svg');
          cursor: pointer;
        }
      }
    }
  }

  .search-history-panel{
    margin-top: 0.5rem;
    .header > .icon {
      background: $primaryColor url(../../assets/icons/search-history-icon.png) no-repeat center;      
      background-size: 50% 50%;
    }
    .search-history-list{
      .search-history-item{
        justify-content: space-between;
        align-items: center;
        color: $primaryColor;
        background-color: rgba(93, 180, 198, 0.1);
        @include linx($primaryColor, $primaryColor);

        &:hover{
          color: white;
          background-image: linear-gradient(270deg, #54afd0 0%, #5fb4d7 100%);
          @include linx(white, white);
          .icon{
            display: block;
          }
        }

        .icon{
          display: none;
          flex-shrink: 0;
          width: 1rem;
          height: 1rem;
          background-size: 100% 100%;
          background-image: url('../../assets/icons/close.svg');
          cursor: pointer;
        }
      }      
    }
  }

  /deep/ {
    .el-carousel__indicator {
      padding: 0.25rem;
      .el-carousel__button{
        background-color: #125db9;
      }
      &.is-active .el-carousel__button{
        background-color: #ee9f8f;
      }
    }
  }
}
</style>

