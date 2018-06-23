<template>
  <div class="pdf-viewer">
    <iframe :src="src" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
export default {
  name: 'pdfViewer',
  data() {
    return {
      viewerUrl: '/static/pdfjs/web/viewer.html',
      pdfUrl: '',
      page: 1,
      search: ''
    };
  },
  computed: {
    src() {
      return `${this.viewerUrl}?file=${this.pdfUrl}#page=${this.page}&search=${this.search}`;
    }
  },
  mounted() {
    this.pdfUrl = this.$route.query.url;
    this.page = this.$route.query.page || 1;
    this.search = this.$route.query.search || '';
  }
};
</script>

<style lang="scss" scoped>
.pdf-viewer {
  width: 100%;
  height: calc(100% - 5px);
  // height: 100%;
}
</style>
