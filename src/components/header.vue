<template>
  <div>
    <el-header>
      <div class="banner" @click="showBanner = !showBanner">
        <img :src="require('@/assets/' + imgsrc +'.png')" alt="">
        <ul v-if="showBanner">
          <li @click="onIconClick(1)"><router-link :to="{path: '/personnel'}" exact replace><img src="@/assets/person.png" alt=""></router-link></li>
          <li @click="onIconClick(2)"><router-link :to="{path: '/info'}" exact replace><img src="@/assets/regulationEdit.png" alt=""></router-link></li>
          <li @click="onIconClick(3)"><router-link :to="{path: '/execution'}" exact replace><img src="@/assets/execution.png" alt=""></router-link></li>
        </ul>
      </div>
      <span>COPS规程数据库和规程人机界面</span>
      <span style="font-size: 12px; font-weight: 400;">V3.0</span>
    </el-header>
  </div>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {
      showBanner: false,
      imgsrc: 'regulationEdit'
    }
  },
  methods: {
    onIconClick(index) {
      switch (index) {
        case 1:
          this.imgsrc = 'person';
          break
        case 2:
          this.imgsrc = 'regulationEdit';
          break
        case 3:
          this.imgsrc = 'execution';
          break
        default:
          break
      }
    }
  },
  created() {
    switch (this.$route.path) {
      case '/personnel':
        this.imgsrc = 'person';
        break
      case '/info':
        this.imgsrc = 'regulationEdit';
        break
      case '/execution':
        this.imgsrc = 'execution';
        break
      default:
        break
    }
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
        // background: #ccc;
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
}
</style>