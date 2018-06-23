<template>
  <div class="tree-rel-container">
    <el-tree :data="treeData" :props="defaultProps"></el-tree>
  </div>
</template>

<script>

const data = [{
  text: '一级 1',
  children: [{
    text: '二级 1-1',
    children: [{
      text: '三级 1-1-1'
    }]
  }]
}, {
  text: '一级 2',
  children: [{
    text: '二级 2-1',
    children: [{
      text: '三级 2-1-1'
    }]
  }, {
    text: '二级 2-2',
    children: [{
      text: '三级 2-2-1'
    }]
  }]
}, {
  text: '一级 3',
  children: [{
    text: '二级 3-1',
    children: [{
      text: '三级 3-1-1'
    }]
  }, {
    text: '二级 3-2',
    children: [{
      text: '三级 3-2-1'
    }]
  }]
}];

export default {
  name: 'treeRelationship',
  data() {
    return {
      defaultProps: {
        label: 'text',
        children: 'children'
      },
      treeData: data
    };
  }
};
</script>

<style lang="scss" scoped>
.tree-rel-container{
  overflow: auto;
  width: 100%;
  height: 100%;  
}
</style>

