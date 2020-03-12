<template>
  <!-- <div>
    <el-container :style="contentStyleObj">
      <el-header>
        <div class="banner" @click="showBanner = !showBanner">
          <img :src="require('@/assets/' + imgsrc +'.png')" alt="">
          <ul v-if="showBanner">
            <li @click="imgsrc = 'execution'"><router-link :to="{path: '/personnel'}" exact replace><img src="@/assets/execution.png" alt=""></router-link></li>
            <li @click="imgsrc = 'regulationEdit'"><router-link :to="{path: '/info'}" exact replace><img src="@/assets/regulationEdit.png" alt=""></router-link></li>
            <li @click="imgsrc = 'execution'"><router-link :to="{path: '/execute'}" exact replace><img src="@/assets/execution.png" alt=""></router-link></li>
          </ul>
        </div>
        <span>COPS规程数据库和规程人机界面</span>
        <span style="font-size: 12px; font-weight: 400;">V3.0</span>
      </el-header>
      <el-container style="height: 500px;">
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div> -->
</template>
<script>
export default {
  name: 'home',
  data() {
    return {
      showBanner: false,
      imgsrc: 'regulationEdit',
      contentStyleObj: {
        height: ''
      }
    };
  },
  methods: {
    getHeight(){
      this.contentStyleObj.height=window.innerHeight+'px';
    }
  },
  created() {
    this.getHeight()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
div {
  .el-header {
    background-color: #303A47;
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    line-height: 60px;
    .banner {
      position: relative;
      float: left;
      width: 60px;
      height: 60px;
      cursor: pointer;
      img {
        width: 56px;
        // border: 2px solid #fff;
        // border-radius: 50%;
        vertical-align: middle;
      }
      ul {
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 220px;
        background: #ccc;
        display: flex;
        flex-direction: column;
        li {
          flex: 1;
          cursor: pointer;
          img {
            width: 60px;
          }
        }
      }
    }
  }
  .el-aside {
    color: #333;
    .item{
      display: block;
      width: 100%;
      height: 100%;
      &.active {
        background-color: #409EFF;
        color: #fff;
      }
    }
  }
  .el-main {
    // background-color: #F5F5F5;
    color: #333;
    text-align: center;
    line-height: 620px;
  }
}
</style>