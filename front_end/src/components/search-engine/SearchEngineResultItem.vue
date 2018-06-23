<template>
  <div class="search-engine-result-item">
    <div class="body">
      <div class="link" @click="preview">{{data.body}}</div>
    </div>
    <div class="row data-source">
      <div class="source-text">信息来源:</div>
      <div :title="data.title" class="link" @click="preview">{{data.title}}</div>
    </div>
  </div>
</template>

<script>
import Mark from 'mark.js';

export default {
  name: 'searchEngineResultItem',
  props: {
    highlight: {
      type: Array
    },
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    preview() {
      const search = this.highlight && this.highlight.length > 0 ? this.highlight[0] : '';
      const { href } = this.$router.resolve({
        name: 'pdf-preview-page',
        query: {
          url: this.data.link,
          search,
          page: this.data.page
        }
      });
      window.open(href, '_blank');
    }
  },
  mounted() {
    const instance = new Mark(this.$el);
    const highlight = this.highlight || [];
    instance.mark(highlight, {
      element: 'span',
      className: 'highlight'
    });
  }
};
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/mixin.scss';

.search-engine-result-item {
  & > .body {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    background-color: #f2f5f8;
    color: #444c4e;
    box-shadow: 0 0.125rem 0.25rem 0 rgba(6, 94, 114, 0.1);
    border-radius: 0.5rem 0.5rem 0 0;
    border: solid 0.0625rem #ffffff;
    line-height: 1.5rem;
    .link {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  & > .data-source {
    align-items: center;
    padding: 0 1.5rem;
    height: 2.5rem;
    background-color: #f7f9fa;
    box-shadow: 0 0.125rem 0.25rem 0 rgba(6, 94, 114, 0.1);
    border-radius: 0 0 0.5rem 0.5rem;
    border: solid 0.0625rem #ffffff;
    .source-text{
      flex-shrink: 0;
      line-height: 2.5rem;
    }
    .link {
      overflow:hidden; 
      margin-left: 0.5rem;
      font-size: 0.875rem;
      color: #499aff;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
