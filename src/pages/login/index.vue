<template>
  <div class="login-box">
    <div class="login-content">
      <p class="title">登录电子规程管理系统</p>
      <ul class="login-input">
        <li id="get-sty-user" class="special user-name "><span>用户名</span><input type="text" v-focus autocomplete="off" class="shuru" id="user_sr" @blur="onBlurStyle('get-sty-user')"  @focus="focusStyle('get-sty-user')" maxlength="20"/></li>
        <li id="get-sty-pwd" class="special pass-word "><span>密码</span><input type="password" autocomplete="off" id="password_sr" class="shuru"  @blur="onBlurStyle('get-sty-pwd')" @focus="focusStyle('get-sty-pwd')" maxlength="20"/></li>
        <li class='error' id="pas_reg"><span><img v-show="errpic" class="errpic" src="../../assets/wrong.png"><span style="margin-left: 3px;" v-html="errorCon"></span></span></li>
        <li>
          <!--<button id="login-btn" class="submit-btn" @click="login_btn()">登 录</button>-->
          <input id="login-btn" class="submit-btn" type="button" value="登 录" @click="login_btn();">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
    import {LoginByUsername} from '../../api/index'
    import Vue from 'vue'//如果需要单独注册全局自定义指令，需要引入才可以
    import axios from 'axios'
    // import {Logout} from '../../api/index'


    // 注册一个全局自定义指令 `v-focus`
    Vue.directive('focus', {
        // 当被绑定的元素插入到 DOM 中时……
        inserted: function (el) {
            // 聚焦元素
            el.focus()
        }
    })

    export default {

        data() {
            return {
                // loginForm: {
                //     jobNumber: 'root',
                //     accPw: '111111'
                // },

                errorCon: '',
                errpic: false,
                tokenData: '',
                // yhm:'',
                // mima:''
            }
        },
        props: {
            model: {}
        },
        //自定义指令，使得刚进入页面获取焦点
        directives: {
            focus: {
                // 指令的定义
                inserted: function (el) {
                    el.focus()
                }
            }
        },
        // created:{
        //   //进入登录页直接获取用户名的input框的焦点
        //   function func(){
        //   document.getElementById("user_sr").focus();
        // }
        // window.onload=func();
        //
        // },
        methods: {
            //分别给失焦和获得焦点的input框，通过添加class，添加样式。
            focusStyle: function (id) {
                document.getElementById(id).classList.add("focus-style");
            },
            onBlurStyle: function (id) {
                document.getElementById(id).classList.remove("focus-style");
            },







            // //点击按钮进行判断
            login_btn: function () {


                // var ree={
                //     "state": 0,
                //     "message": "成功",
                //     "data": {
                //         "userinfo": {
                //             "id": 10001,
                //             "name": "root",
                //             "gender": 1,
                //             "mobile": "110",
                //             "jobNumber": "root",
                //             "accPw": "111111",
                //             "birthDate": "2000年1月",
                //             "mainPageCode": "admin",
                //             "photo": null,
                //             "lastLoginTime": "2019-12-21 16:34:02",
                //             "lastLoginIp": "10.10.8.26",
                //             "updateTime": "2019-12-04 16:44:10",
                //             "userStatus": "2",
                //             "roleInfos": [{
                //                 "id": 101,
                //                 "name": "1#操作员",
                //                 "authorityInfos": [{
                //                     "id": 8,
                //                     "name": "规程编辑维护",
                //                     "fileTypes": "3",
                //                     "authType": "regulation-edit"
                //                 }, {
                //                     "id": 1,
                //                     "name": "1#堆规程运行监督",
                //                     "fileTypes": "1",
                //                     "authType": "regulation-excute"
                //                 }]
                //             }]
                //         },
                //         "token": "rules eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODA1MTcyNDIsImpvYk51bWJlciI6InJvb3QifQ.2uGRpoLxqw4AmsCuaavcTcbif36OYZqvx2wKyLieDKY55o8ULqOvt4iGbJ621xs2EGGg8lljTO2dTb9ldt7XoA"
                //     }
                // }
                // console.log(2232,ree.data.token);

                // 尝试
                // axios.post('login/login', {//发送请求 跳转页面
                //     jobNumber: 'root',
                //     accPw: '111111'
                // }).then((response) => {
                //     console.log("3w、返回的值",response)
                // }).catch((response) => {
                //     console.log("3、错误"+response)
                // })

                // var para = {
                //     "jobNumber": "root",
                //     "accPw": "111111"}
                // console.log(8956,para);
                // LoginByUsername(para).then(res => {
                //     console.log(999,res);
                //     // this.tableData1=res.data.data.userinfo.list;
                //     // this.total0=this.tableData1.length;
                //     // console.log(1133,this.tableData1);
                // })



                // 正确的部分
                // console.log(88569);
                // console.log(776,this.$store);
                // console.log(667,this.$store.dispatch);
                // console.log(5679,LoginByUsername);
                // var loginForm = {
                //     "jobNumber": "root",
                //      "accPw": "111111"}
                // console.log(333);
                // this.$store.dispatch('LoginByUsername',loginForm).then((res) => {
                //     console.log(7895, res);
                // }).catch((res) => {
                //     console.log(159, res);
                // })
                // 正确的部分
                    var yhm = document.getElementById("user_sr");
                    var mima = document.getElementById("password_sr");
                    var sr=document.getElementById("pas_reg");
                    var reg_user = /^[a-zA-Z]{3,10}$/;  //用户名的判断规则
                    var reg_number = /^\w{6,20}$/;     //密码的判断规则
                    if (yhm.value=="") {
                        // sr.innerHTML= yhmNoEmpty;
                        this.errpic=true;
                        this.errorCon='<span class="wk">用户名不能为空</span>'
                        return false;
                    } else if(reg_user.test(yhm.value)==false){
                        // sr.innerHTML = yhmNoRule;
                        this.errpic=true;
                        this.errorCon='<span class="wk">用户名不符合规则</span>'
                        reg_user.test(yhm.value)=='';
                        return  false;
                    }else if(mima.value==''){
                        // sr.innerHTML= passwordNoEmpty;
                        this.errpic=true;
                        this.errorCon='<span class="wk">密码不能为空</span>'
                        return false;
                    }else if(reg_number.test(mima.value)==false){
                        this.errpic=true;
                        this.errorCon='<span class="wk">密码不符合规则</span>'
                        reg_number.test(mima.value)=='';
                        return false;
                    }else {
                        var loginForm = {
                            jobNumber: yhm.value,
                            accPw: mima.value
                        }
                        console.log(789);
                        this.$store.dispatch( "LoginByUsername" , loginForm).then((res) => {
                            console.log(369555,res);
                            if (res.state == 0) {
                                this.errpic = false;
                                // 把输入框清空
                                this.errorCon = '',
                                yhm.value = ''
                                mima.value = ''
                                this.$router.push({name: 'Personnel', params: {token: res.data.token}})
                            }
                        }).catch((res) => {

                        })

                    }

                },
                // 退出登录
                logOut(){
                    this.$store.dispatch('Logout', loginOutForm).then((res) => {
                        if (res.state == 0) {
                            this.errpic = false;
                            // 把输入框清空
                            this.errorCon = '',
                                yhm.value = ''
                            mima.value = ''
                        }
                    }).catch((res) => {

                    })
                },

            }
        }

    // console.log(4444,loginForm);
    // console.log(5555,this.loginForm);
    // LoginByUsername(loginForm).then(res=>{
    //     console.log(res);})




                ///////////////////////
                //     var login_btn=document.getElementById('login-btn')







    //
    //
    //                     //////////////////////////
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                     // var loginUrl='login/login?jobNumber='+yhm.value+'&accPw='+mima.value;
    //                     // axios.post(loginUrl).then(res=>{
    //                     //     //这里需要自己吧完整的ip地址写上就可以了
    //                     //     if(res.data.state==0){
    //                     //         this.errpic=false;
    //                     //         // 把输入框清空
    //                     //         this.errorCon='',
    //                     //             yhm.value=''
    //                     //         mima.value=''
    //                     //         // 取得token的值
    //                     //         this.tokenData=res.data.data.token;
    //                     //         // 存入cookie：
    //                     //         // Cookies.set('token',this.tokenData);
    //                     //         this.$cookies.set('token', this.tokenData)   //return this
    //                     //         this.$router.push({name: 'Personnel'})
    //                     //         // console.log(this.$cookies.get('token'));
    //                     //
    //                     //         ////////////////////
    //                     //         this.userToken = 'Bearer ' + res.data.data.token;
    //                     //         // 将用户token保存到vuex中
    //                     //         this.changeLogin({ Authorization: this.tokenData });
    //                     //         ////////////////////
    //                     //
    //                     //
    //                     //
    //                     //     }
    //                     // })
    //                     //     .catch((error) =>{
    //                     //     });
    //
    //                 }
    //
    //
    //
    //
    //
    //
    // }
    //     }
    // }



    // login_btn:function () {
    //     var login_btn=document.getElementById('login-btn')
    //     var yhm = document.getElementById("user_sr");
    //     var mima = document.getElementById("password_sr");
    //     var sr=document.getElementById("pas_reg");
    //     var reg_user = /^[a-zA-Z]{3,10}$/;  //用户名的判断规则
    //     var reg_number = /^\w{6,20}$/;     //密码的判断规则
    //     if (yhm.value=="") {
    //         // sr.innerHTML= yhmNoEmpty;
    //         this.errpic=true;
    //         this.errorCon='<span class="wk">用户名不能为空</span>'
    //         return false;
    //     } else if(reg_user.test(yhm.value)==false){
    //         // sr.innerHTML = yhmNoRule;
    //         this.errpic=true;
    //         this.errorCon='<span class="wk">用户名不符合规则</span>'
    //         reg_user.test(yhm.value)=='';
    //         return  false;
    //     }else if(mima.value==''){
    //         // sr.innerHTML= passwordNoEmpty;
    //         this.errpic=true;
    //         this.errorCon='<span class="wk">密码不能为空</span>'
    //         return false;
    //     }else if(reg_number.test(mima.value)==false){
    //         this.errpic=true;
    //         this.errorCon='<span class="wk">密码不符合规则</span>'
    //         reg_number.test(mima.value)=='';
    //         return false;
    //     }else{
    //         var loginUrl='login/login?jobNumber='+yhm.value+'&accPw='+mima.value;
    //         axios.post(loginUrl).then(res=>{
    //             //这里需要自己吧完整的ip地址写上就可以了
    //             if(res.data.state==0){
    //                 this.errpic=false;
    //                 // 把输入框清空
    //                 this.errorCon='',
    //                     yhm.value=''
    //                 mima.value=''
    //                 // 取得token的值
    //                 this.tokenData=res.data.data.token;
    //                 // 存入cookie：
    //                 // Cookies.set('token',this.tokenData);
    //                 this.$cookies.set('token', this.tokenData)   //return this
    //                 this.$router.push({name: 'Personnel'})
    //                 // console.log(this.$cookies.get('token'));
    //
    //                 ////////////////////
    //                 this.userToken = 'Bearer ' + res.data.data.token;
    //                 // 将用户token保存到vuex中
    //                 this.changeLogin({ Authorization: this.tokenData });
    //                 ////////////////////
    //
    //
    //
    //             }
    //         })
    //             .catch((error) =>{
    //             });
    //
    //     }
    // }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  /*公共样式*/
  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Microsoft YaHei", "微软雅黑";
    font-weight: normal;
  }

  ul, li {
    list-style: none
  }

  img {
    border: none;
  }

  input {

    outline: none !important;
    border-radius: 5px;
  }

  a {
    text-decoration: none;
  }

  .header .title {
    margin: 0 auto;
    font-size: 30px;
    color: white;
    padding: 190px 0 35px 0;
    text-align: center;
  }

  /*登录框*/
  .login-box {
    width: 100%;
    min-width: 980px;
    position: absolute;
    top:20%;
  }

  .login-box .login-content {
    margin: 0 auto;
    padding: 60px;
    border-radius: 5px;
    width: 320px;
    box-shadow: 0px 0px 10px 0px #888888;
  }

  .login-box .title {
    letter-spacing: 2px;
    margin: 10px 0 40px;
    font-size: 24px;
    font-weight: bolder;
    color: #303A47;
    text-align: center;
  }

  .login-input li{
    text-align: center;
  }

  /*输入框样式*/

  .login-input .special {
    border: 1px solid transparent;
    margin: 20px 0;
    background-color: #E5E9ED;
    height: 55px;
    width: 315px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    line-height: 55px;
    border-radius: 5px;
    color: #787E8C;
    font-size: 14px;
    vertical-align: middle;
  }

  .login-input .special span {
    font-size: 18px;
    letter-spacing: 1px;
    background: url("../../assets/icon-user.png") no-repeat  12px center;
    padding-left: 40px;
    display: inline-block; width: 65px; height: 55px;
    float: left;
    color: #787E8C;
    font-weight: 600;
    display: inline-block;
  }
  .login-input .special input{
    color: #787E8C;
    width: 206px;
    height:53px;
    border:0;
    background-color: #E5E9ED;
    padding: 0;
    margin: 0;
    float: left;
    line-height: 40px \9;
    vertical-align: middle;
  }

  .login-input .pass-word span {
    background: url("../../assets/icon-password.png") no-repeat  12px center;
  }

  /*输入框获取焦点样式*/
  .special.focus-style{border: 1px solid #1C9EF8;}

  /*底部按钮*/
  .submit-btn {
    font-weight: normal;
    width: 315px;
    height: 100%;
    color: #FFFFFF;
    font-size: 18px;
    line-height: 45px;
    text-align: center;
    background: #303A47;
    outline: none;
    vertical-align: middle;

    cursor: pointer;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;

    border: 1px solid #1E82E9;
  }
  .submit-btn:hover {
    background: #626C79;
    border: 1px solid #626C79;
  }

  /*错误提示*/
  .login-input .distence {
    width: 30px;
    height: 20px;
  }

  #pas_reg {
    margin-bottom: 10px;
    color: red;
    text-align: center;
  }
  .error{
    height: 20px;
  }
  .error span{
    line-height: 20px;
    height: 20px;
  }
  .errpic{
    width: 20px;
    height: 20px;
  }

  #pas_reg img {
    vertical-align: sub;
  }

  .wk {
    font-size: 14px;
  }
  .shuru{font-size: 18px;text-indent: 5px;letter-spacing: 1px;}
</style>

