<template>
  <div id="app">
    <!-- <Header></Header> -->
    <head-view></head-view>
    <router-view/>
  </div>
</template>

<script>
import Header from '../src/components/header'
export default {
  name: 'App',
  components: {
    Header
  },
  data(){
    return {}
  },
  methods:{}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  height: 100%;
  /* margin-top: 60px; */
}
/*.el-header {
  padding: 0;
}
.el-main {
  padding: 0;
}*/
html,body{
  width: 100%;
  height: 100%;}
.el-icon-loading {
  font-size: 50px; 
}
.el-loading-spinner .el-loading-text {
  font-size: 30px ; 
}
.el-tree .el-tree-node__content {
  height: auto;
}
.el-tree .el-tree-node__content p {
  margin: 5px 0;
}
.el-tree-node__content:hover {
  background-color: #F4F4F4;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: #ccc !important;
}
.el-tree-node__expand-icon {
  color: #000;
  font-size: 20px;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #ccc;
}
.el-textarea__inner {
  border: 1px solid #ccc;
  border-radius: 0;
}
.el-input--small .el-input__inner {
  height: 26px;
  line-height: 26px;
}

.ql-toolbar.ql-snow {
  display: none;
}

.ql-toolbar.ql-snow + .ql-container.ql-snow {
  border-top: 1px solid #ccc;
}
.el-tabs__item {
  font-size: 18px;
}
.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
  color: #000;
  font-weight: 700;
}
</style>
