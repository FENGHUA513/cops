<template>
  <div style="width: 100%;height: 100%;">
    <!-- <head-view></head-view> -->
    <div :style="{'height':conHeight + 'px','margin':'10px auto','width':'98%','box-shadow': '0px 0px 10px 0px #000000','min-width':'1800px'}">
      <ul class="title">
        <li v-for="(item, index) in list" v-on:click="addClass(index)" v-bind:class="{ special:index==ordinal}">{{ item.tab}}</li>
      </ul>
      <ul>
        <!--第一部分:人员部分-->
        <li v-show="ordinal==0?true:false">
          <div  class="allbox1">
              <ul class="polling_box1">
                <li class="pre_polling"><span class="pre_name">用户名:</span><input class="quer_inp" v-model="queryStaffName" placeholder="请输入内容"></li>
                <li class="pre_polling"><span class="pre_name">手机号:</span><input class="quer_inp" v-model="queryStaffPhone" placeholder="请输入内容"></li>
                <li class="pre_polling"><span class="pre_name">工  号:</span><input class="quer_inp" v-model="queryStaffJobNumber" placeholder="请输入内容"></li>
              </ul>
          <ul class="polling_box2">
            <li class="pre_polling"><span class="pre_name">状  态:</span>
              <el-select v-model="queryStaffState" style="width: 100px;">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            </li>
            <li class="pre_polling"><span class="pre_name">角  色:</span><input class="quer_inp1" v-model="queryStaffRole" placeholder="请输入内容"></li>
            <li style="margin-left: 30px;"><el-button type="primary" @click="staffQuery()">查询</el-button></li>
        </ul>
          </div>
          <div class="allbox2">
             <!--《添加人员》按钮-->
            <span class="cellbox" @click="arise(1)">
                <span class="cell" style="font-size: 25px;color: #008000;"><b>+</b></span>
                <span class="cell" style="font-size: 18px;margin-left: 5px;">人员</span>
            </span>
             <!--第二部分，列表部分-->
            <div class="content">
              <el-table
                      border
                      :data="tableData1"
                      style="width: 99.9%;margin:10px 0;font-size: 16px;"
                      :default-sort = "{prop: 'date', order: 'descending'}"
              >
                <el-table-column align="center" label="用户名" width="150">
                  <template slot-scope="scope">
                    <el-button @click="staffNameLay(scope.row.id)" type="text" size="small" style="font-size: 16px;">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center"  label="所具有的角色" :render-header="renderHeader">
                  <template slot-scope="scope">
                    <el-button style="font-size: 16px;float: left;" @click="staffDispose(scope.row.id,scope.row.name,scope.row.roleInfos)" type="text">配置</el-button>
                    <span class="rolelist1">
                      <span v-for="item in scope.row.roleInfos">{{ item.name }}</span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="lastLoginTime"  label="最近登录时间 / IP" width="320">
                  <template slot-scope="scope">
                    <span> {{ scope.row.lastLoginTime }}</span><span style="color: #000000;font-weight: bolder;font-size: 22px;">/</span>
                    <span> {{ scope.row.lastLoginIp }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="userStatus" label="状态" width="150">
                  <template slot-scope="scope">
                    <span> {{['在线', '登出', '锁定'][scope.row.userStatus-1]}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="mobile" label="手机号" width="220"></el-table-column>
                <el-table-column align="center" prop="jobNumber" label="工号" width="150"></el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button style="font-size: 16px;" v-bind:disabled="scope.row.userStatus==3" @click="staffModifyLay(scope.row.id)" type="text" size="small">修改</el-button>
                    <el-button style="font-size: 16px;" v-bind:disabled="scope.row.userStatus==3" @click="staffPasswordResetLay(scope.row.id)" type="text" size="small">密码重置</el-button>
                    <el-button style="font-size: 16px;" type="text" size="small"  @click="staffLockLay(scope.row.id,scope.row.userStatus)">{{['锁定', '锁定', '解锁'][scope.row.userStatus-1]}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="日志信息" width="120">
                  <template slot-scope="scope">
                    <el-button @click="staffViewLogLay(scope.row.id)" style="font-size: 16px;" type="text" size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination class="fy"
                             @current-change="current_change1"
                             layout="total, prev, pager, next"
                             :total="total1"
                             :current-page="currentPage1"
                             background
              >
              </el-pagination>
            </div>
          </div>
        </li>
        <!--第二部分:权限部分-->
        <li v-show="ordinal==1?true:false">
          <div class="allbox3">
          <!--《添加人员》按钮-->
          <span class="cellbox" @click="arise(2)">
                <span class="cell" style="font-size: 25px;color: #008000;"><b>+</b></span>
                <span class="cell" style="font-size: 18px;margin-left: 5px;">角色</span>
            </span>
          <!--第二部分，列表部分-->
            <div class="content">
              <el-table
                      border
                      :data="tableData2"
                      style="width: 99.9%;margin:10px 0;font-size: 16px;"
                      :default-sort = "{prop: 'date', order: 'descending'}"
              >
                <!--authorityInfos：总的情况
                  editAuthorityInfos ：规程编辑模块权限
                   excuteAuthorityInfos：规程执行模块
                 userAuthorityInfos：人员管理模块权限-->
                <el-table-column align="center" prop="name" label="角色名" width="230"></el-table-column>
                <el-table-column align="center"  label="人员管理模块权限" width="250">
                  <template slot-scope="scope">
                    <ul class="rolelist">
                      <li v-for="item in scope.row.userAuthorityInfos" style="margin: 0 10px;">
                        {{ item.name }}
                      </li>
                    </ul>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="规程编辑模块权限">
                  <template slot-scope="scope">
                    <ul class="rolelist">
                      <li v-for="item in scope.row.editAuthorityInfos" style="margin: 0 10px;">
                        {{ item.name }}
                      </li>
                    </ul>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="规程执行模块" width="250">
                  <template slot-scope="scope">
                  <ul class="rolelist">
                  <li v-for="item in scope.row.excuteAuthorityInfos" style="margin: 0 10px;">
                  {{ item.name }}
                  </li>
                  </ul>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button  style="font-size: 16px;" @click="powerDisposeLay(scope.row.id,scope.row.authorityInfos)" type="text" size="small">配置</el-button>
                    <el-button  style="font-size: 16px;" @click="powerModifyLay(scope.row.id,scope.row.name)" type="text" size="small">修改</el-button>
                    <el-button  style="font-size: 16px;" type="text" size="small" @click="powerDeleteLay(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination class="fy"
                             @current-change="current_change2"
                             layout="total, prev, pager, next"
                             :total="total2"
                             :current-page="currentPage2"
                             background
              >
              </el-pagination>
            </div>
        </div></li>
        <!--第三部分:日志部分-->
        <li v-show="ordinal==2?true:false">
          <!--当做表格处理-->
          <div  class="logbox">
            <el-radio-group v-model="radio">
               <table class="table">
                 <tr>
                   <td width="80px" style="text-align: center;line-height: 50px;height: 50px;"><el-radio :label="1" v-model="timeToday">今天</el-radio></td>
                   <td width="80px" style="line-height: 50px;height: 50px;text-align: right;"><el-radio :label="2" v-model="timeNearly">近</el-radio></td>
                   <td width="130px" style="text-align: center;line-height: 50px;height: 50px;"><el-select v-model="recent" style="width: 100px;">
                     <el-option v-for="item in recentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                   </el-select></td>
                   <td width="150px" style="text-align: center;line-height: 50px;height: 50px;"><el-radio :label="3">自定义时间段</el-radio></td>
                   <td><el-date-picker
                           v-model="timeSlot"
                           value-format="yyyy-MM-dd"
                           type="daterange"
                           @change="chooseTimeRange"
                           placeholder="选择日期范围">
                   </el-date-picker></td>
                   <td width="100px" style="text-align: center;line-height: 50px;height: 50px;"><el-button type="primary" @click="logQuery()">查询</el-button></td>
                 </tr>
               </table>
            </el-radio-group>
          </div>
          <!--当做表格处理-->
            <div class="allbox3">
              <div class="content">
              <el-table
                      border
                      :data="tableData3"
                      style="width: 99.9%;margin:10px 0;font-size: 16px;"
                      :default-sort = "{prop: 'date', order: 'descending'}"
              >
                <el-table-column
                        align="center"
                        prop="operateName"
                        label="操作名"
                        width="180">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="operateRemark"
                        label="操作简述">
                </el-table-column>
                <el-table-column align="center" label="用户名" width="230">
                  <template slot-scope="scope">
                    <el-button @click="journalNameLay(scope.row.operator)" type="text" size="small" style="font-size: 16px;">{{ scope.row.operatorName }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                        width="250"
                        align="center"
                        prop="operator"
                        label="工号"
                >
                </el-table-column>
                <el-table-column align="center" prop="lastLoginTime"  label="最近登录时间 / IP" >
                  <template slot-scope="scope">
                    <span> {{ scope.row.operateTime  }}</span><span style="color: #000000;font-weight: bolder;font-size: 22px;">/</span>
                    <span> {{ scope.row.operateIp }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination class="fy"
                             layout="total, prev, pager, next"
                             @current-change="current_change3"
                             :total="total3"
                             :current-page="currentPage3"
                             background
              >
              </el-pagination>
              </div>
            </div>
        </li>
      </ul>
    </div>
    <el-dialog title="人员添加" :visible.sync="show1"  width="35%">
          <table class="table">
            <tr>
              <td style="vertical-align: top;"> 头像：</td>
              <td> <div class="upload_img">
                <el-upload action='' :on-exceed="handleExceed" list-type="picture-card"  ref="upload_img"  class="avatar-uploader" accept="image/jpeg,image/jpg,image/png" :on-change="getFile" :limit="1"
                           :auto-upload="false">
                  <i class="el-icon-plus"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpeg、jpg、png 格式的图片，图片大小在2M以内。</div>
                </el-upload>
              </div></td>
            </tr>
            <tr>
              <td> 姓名<span style="color: red;font-size: 20px;">*</span>：</td>
              <td> <el-input
                      placeholder="请输入内容"
                      v-model="addStaffName"
                      clearable>
              </el-input></td>
            </tr>

            <tr>
              <td> 手机号：</td>
              <td> <el-input
                      placeholder="请输入内容"
                      v-model="addStaffPhoneNum"
                      clearable>
              </el-input></td>
            </tr>
            <tr>
              <td> 工号<span style="color: red;font-size: 20px;">*</span>：</td>
              <td> <el-input
                      placeholder="请输入内容"
                      v-model="addStaffJobNum"
                      clearable>
              </el-input></td>
            </tr>


            <tr>
              <td>首主页面：</td>
              <td>
                <el-select v-model="addStaffPage">
                  <el-option v-for="item in pageList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td> 登录密码<span style="color: red;font-size: 20px;">*</span>：</td>
              <td> <el-input
                      placeholder="请输入内容"
                      v-model="addStaffPassWord"
                      clearable>
              </el-input></td>
            </tr>
            <tr>
            </tr>
          </table>
          <span slot="footer" class="dialog-footer">
    <el-button @click="hideLay(1)">取 消</el-button>
    <el-button type="primary" :plain="true"  @click="addStaff(1)">确 定</el-button>
  </span>
        </el-dialog>
      <!--添加角色按钮点击-->
    <el-dialog title="角色添加" :visible.sync="show2"  width="35%">
      <table class="table">
        <tr>
          <td> 名称：</td>
          <td> <el-input
                  placeholder="请输入内容"
                  v-model="addRoleName"
                  clearable>
          </el-input></td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="hideLay(2)">取 消</el-button>
    <el-button type="primary"  @click="addRole()">确 定</el-button>
  </span>
    </el-dialog>
    <!--人员信息展示-->
    <el-dialog title="人员信息" :visible.sync="show3"  width="35%">
      <table class="table">
        <tr>
          <td style="vertical-align: top;"> 头像：</td>
          <td>
            <img src="../../assets/regulationEdit.png" style="width: 50px;height: 50px;" alt="">
          </td>
        </tr>
        <tr>
          <td> 姓名：</td>
          <td>
            <span v-html="detailInfo.name"></span>
          </td>
        </tr>

        <tr>
          <td> 手机号：</td>
          <td> <span v-html="detailInfo.mobile"></span></td>
        </tr>
        <tr>
          <td> 工号：</td>
          <td><span v-html="detailInfo.jobNumber"></span></td>
        </tr>


        <tr>
          <td>生日日期：</td>
          <td>
            <span v-html="detailInfo.birthDate"></span>
          </td>
        </tr>
        <tr>
          <td> 登录密码：</td>
          <td><span v-html="detailInfo.accPw"></span> </td>
        </tr>
        <tr>
        </tr>
        <!--<tr v-show="isTip"><td colspan="3" style="text-align: center;color: red;">该规程已经存在，请重新输入文档编码！</td></tr>-->
      </table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="hideLay(3)">关 闭</el-button>
    <!--<el-button type="primary" :plain="true"  @click="addStaff(3)">确 定</el-button>-->
  </span>
    </el-dialog>
    <!--人员信息修改浮层-->
    <el-dialog title="修改人员信息" :visible.sync="show4"  width="35%">
      <table class="table">
        <tr>
          <td style="vertical-align: top;"> 头像：</td>
          <td>
            <img src="../../assets/regulationEdit.png" style="width: 50px;height: 50px;" alt="">
          </td>
        </tr>
        <tr>
          <td> 姓名：</td>
          <td>
            <el-input
                    placeholder="请输入内容"
                    v-model="xgname"
                    clearable>
            </el-input>
            <!--<span v-html="detailInfo.name"></span>-->
          </td>
        </tr>

        <tr>
          <td> 手机号：</td>
          <td>
            <!--<span v-html="detailInfo.mobile"></span>-->
            <el-input
                    placeholder="请输入内容"
                    v-model="xgmobile"
                    clearable>
            </el-input>
          </td>
        </tr>
        <tr>
          <td> 工号：</td>
          <td>

            <!--<span v-html="detailInfo.jobNumber"></span>-->
            <el-input
                    placeholder="请输入内容"
                    v-model="xgjobNumber"
                    clearable>
            </el-input></td>
        </tr>


        <tr>
          <td>生日日期：</td>
          <td>
            <!--<span v-html="detailInfo.birthDate"></span>-->
            <el-input
                    placeholder="请输入内容"
                    v-model="xgbirthDate"
                    clearable>
            </el-input>
          </td>
        </tr>
        <tr>
          <td> 登录密码：</td>
          <td>
            <!--<span v-html="detailInfo.accPw"></span>-->
            <el-input
                    placeholder="请输入内容"
                    v-model="xgaccPw"
                    clearable>
            </el-input>
          </td>
        </tr>
        <tr>
        </tr>
        <!--<tr v-show="isTip"><td colspan="3" style="text-align: center;color: red;">该规程已经存在，请重新输入文档编码！</td></tr>-->
      </table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="hideLay(4)">取 消</el-button>
        <el-button type="primary" :plain="true"  @click="addStaff(4)">确 定</el-button>
  </span>
    </el-dialog>
    <!--人员页面点击查看按钮，展示日志信息的浮层-->
    <el-dialog title="人员日志信息" :visible.sync="show5"  width="70%">
      <div class="content">
        <el-table
                border
                :data="tableData4"
                style="width: 99.9%;margin:10px 0;font-size: 16px;"
                :default-sort = "{prop: 'date', order: 'descending'}"
        >
          <el-table-column align="center" prop="operateName" label="操作名" width="230"></el-table-column>
          <el-table-column align="center"  prop="operateRemark"  label="操作简述"></el-table-column>
          <el-table-column align="center"  label="操作时间 / IP" width="500">
            <template slot-scope="scope">
              <span> {{ scope.row.operateTime  }}</span><span style="color: #000000;font-weight: bolder;font-size: 22px;">/</span>
              <span> {{ scope.row.operateIp }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="fy"
                       @current-change="current_change4"
                       layout="total, prev, pager, next"
                       :total="total4"
                       :current-page="currentPage4"
                       background
        >
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog title="角色信息修改" :visible.sync="show6"  width="35%">
      <table class="table">
        <tr>
          <td> 名称：</td>
          <td> <el-input
                  placeholder="请输入内容"
                  v-model="modifyRoleName"
                  clearable>
          </el-input></td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="hideLay(6)">取 消</el-button>
    <el-button type="primary"  @click="modifyRole()">确 定</el-button>
  </span>
    </el-dialog>
    <!--设置人员角色-->
    <el-dialog title="设置人员角色" :visible.sync="show7"  width="20%">
      <table class="table1">
        <tr>
          <td>
            <span class="role">即将拥有的角色：</span>
            <ul class="staffcheckbox">
              <li  v-for="(list,index) in checkboxRoleList">
                <!--@click.stop="clickMe(list)"-->
                <input type="checkbox" :checked="list.id==disposeId" :value="list.id"  v-model="checkedIds" style="vertical-align: middle;cursor: pointer;"><label>{{list.name}}</label>
                <!--//:checked="index == 0"为索引为0的，即为第一个复选框添加属性。-->
              </li>
            </ul>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="hideLay(7)">取 消</el-button>
    <el-button type="primary"  @click="singleStaffCheckBox()">确 定</el-button>
  </span>
    </el-dialog>
    <!--批量设置人员角色-->
    <el-dialog title="批量设置人员角色" :visible.sync="show8"  width="40%">
      <!--<table class="table1">-->
      <ul class="batchSetup" style="margin-left: 5%;">
        <li class="single">
          <span class="role">选取人员：</span>
          <ul class="staffcheckbox">
            <li  v-for="(item,index) in checkboxList">
              <!--:checked="list.id==disposeId"-->
              <input type="checkbox" :value="item.id" v-model="choosePerson" style="vertical-align: middle;cursor: pointer;"/><label>{{item.name}}</label>
            </li>
          </ul>
        </li>
        <li class="single" style="margin-left: 15%;">
          <span class="role">即将拥有的角色：</span>
          <ul class="staffcheckbox">
            <li  v-for="(item,index) in checkboxRoleList">
              <!--:checked="list.id==disposeId"-->
              <input type="checkbox"  :value="item.id" v-model="chooseRole" style="vertical-align: middle;cursor: pointer;"/><label>{{item.name}}</label>
              <!--<input type="checkbox" :checked="index == 0||index == 2" style="vertical-align: middle;"><label>{{list.name}}</label>-->
              <!--//:checked="index == 0"为索引为0的，即为第一个复选框添加属性。-->
            </li>
          </ul>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
    <el-button @click="hideLay(8)">取 消</el-button>
    <el-button type="primary"  @click="batchStaffCheckBox()">确 定</el-button>
  </span>
    </el-dialog>
    <!--权限页面点击配置-->
    <el-dialog title="设置角色权限" :visible.sync="show9"  width="70%">
      <!--<table class="table1">-->
      <ul class="batchSetup" style="margin-left: 5%;">
        <li class="single1" >
          <span class="role">人员管理模块的权限项：</span>
          <ul class="staffcheckbox">
            <li  v-for="(item,index) in powerCheckboxList" v-if="item.authType=='user'">
              <!--:checked="list.id==disposeId"-->
              <input type="checkbox" :value="item.id" v-model="userManage" style="vertical-align: middle;cursor: pointer;"/><label>{{item.name}}</label>
            </li>
          </ul>
          {{userManage}}
        </li>
        <li class="single1" style="margin-left: 15%;" >
          <span class="role">规程编辑模块的权限项：</span>
          <ul class="staffcheckbox">
            <li  v-for="(item,index) in powerCheckboxList" v-if="item.authType=='regulation-edit'">
              <!--:checked="list.id==disposeId"-->
              <input type="checkbox"  :value="item.id" v-model="regulationEdit" style="vertical-align: middle;cursor: pointer;"/><label>{{item.name}}</label>
              <!--<input type="checkbox" :checked="index == 0||index == 2" style="vertical-align: middle;"><label>{{list.name}}</label>-->
              <!--//:checked="index == 0"为索引为0的，即为第一个复选框添加属性。-->
            </li>
          </ul>
          {{regulationEdit}}
        </li>
        <li class="single1" style="margin-left: 15%;" >
          <span class="role">规程执行模块的权限项：</span>
          <ul class="staffcheckbox">
            <li  v-for="(item,index) in powerCheckboxList" v-if="item.authType=='regulation-excute'">
              <!--:checked="list.id==disposeId"-->
              <input type="checkbox" :value="item.id" v-model="regulationExcute" style="vertical-align: middle;cursor: pointer;"/><label>{{item.name}}</label>
            </li>
          </ul>
          {{regulationExcute}}
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
    <el-button @click="hideLay(9)">取 消</el-button>
    <el-button type="primary"  @click="powerCheckbox()">确 定</el-button>
  </span>
    </el-dialog>
    </div>
  <!--</div>-->
</template>
<script>
    import axios from 'axios'
    import qs from 'qs'
    import Vue from 'vue'
    // 引入方法 人员部分
    import {getPersonalDataInn} from '../../api/index'  //刚刚进入页面，获取人员页面表格数据
    import {addPersonalDataInn} from '../../api/index' // 用户操作接口 /【/api/userinfo/userInfo 保存用户信息】<添加人员按钮>
    import {detailPersonalDataInn } from '../../api/index'// 用户操作接口 /【/api/userinfo/userInfo 查询用户详情信息】<点击用户名，出现个人详细信息>
    import {modifyPersonalDataInn } from '../../api/index'// 用户操作接口 /【/api/userinfo/userInfo 修改用户信息】<点击修改按钮，先走个人详情接口，点击浮层的保存再走这个接口>
    import {resetPwdDataInn  } from '../../api/index'// 用户操作接口 /【/api/userinfo/resetPwd 重置密码】<点击重置密码>
    import {lockPwdDataInn  } from '../../api/index'// 用户操作接口 /【/api/userinfo/userInfoLock 用户锁定】<点击锁定按钮>
    import {unlockPwdDataInn} from '../../api/index'// 用户操作接口 /【/api/userinfo/userInfoUnLock 用户解锁】<点击解锁按钮>

    //配置部分
    import {disposeRoleDataInn1} from '../../api/index'// 1、get方式   角色操作接口 /【/api/roleInfo/roleInfoAll 分页查询角色信息】
    import {disposeRoleDataInn2 } from '../../api/index'//2、GET   角色操作接口/【/api/userinfo/userInfo 查询用户详情信息】 记录下哪些打勾，哪些不打勾
    import {disposeRoleDataInn3} from '../../api/index'//3、PUT   角色操作接口/【/api/userinfo/setUserRole 设置人员角色及批量设置人员角色】
    // 引入方法 权限部分

    import {addRoleInn} from '../../api/index'//角色操作接口  POST  【/api/roleInfo/roleInfo   保存角色信息】<权限页面，左上角添加角色按钮的确定按钮>
    import {detailRoleDataInn} from '../../api/index' // 角色操作接口  GET【/api/roleInfo/roleInfo  查询角色详情信息】<点击用户名，出现个人详细信息>
    import {modifyRoleDataInn} from '../../api/index'// 角色操作接口  PUT【/api/roleInfo/roleInfo  修改角色信息】<点击修改按钮，先走个人详情接口，点击浮层的确定按钮再走这个接口>
    import {deleteRoleDataInn} from '../../api/index' // 角色操作接口  DELETE【/api/roleInfo/roleInfo  删除角色信息】<点击权限页面的删除按钮走的接口>


    // 权限页面点击配置按钮的接口总结
    import {getPowerDataInn1} from '../../api/index'//GET  【/api/authorityInfo/authorityInfoAll  分页查询权限信息】/api/authorityInfo/authorityInfoAll
    // import {addRoleInn} from '../../api/index'//角色操作接口  POST  【/api/roleInfo/roleInfo   保存角色信息】前边有一个接口用了这个，所以这里直接引用了。
    import {getPowerDataInn3} from '../../api/index'// 角色操作接口  PUT【/api/roleInfo/roleInfoAuthority  配置权限】<暂时不知道哪里用>

    // 引入方法 日志部分
    import {getJournalDataInn} from '../../api/index'//3、GET  刚刚进入页面，获取日志页面表格数据 【/api/syslog/sysLogInfoAll 同样也是人员查看日志的按钮的接口】区别:传入账号作为参数则个人日志，不传参数则所有的日志
export default {
  data() {
    return {
        userManage :[],
        regulationEdit :[],
        regulationExcute:[],
        powerCheckboxList:[],//权限页面的点击配置第一步，获取浮层的数据的定义
        // cityOptions:[],
        // checkedCities: ['11', '爱情'],
        choosePerson:[],
        chooseRole:[],
        checkedIds:[],
        // cities: this.cityOptions,
        disposeId:'',

        checkboxList:[],//人员页面的配置按钮，获取信息，循环获取角色名的定义，选取人员
        checkboxRoleList:[],//即将拥有的角色
        dateSelection:[],
        // 定义不同的日期
        todayDate:'',
        threeAgoDate :'',
        sevenAgoDate:'',
        thirtyAgoDate:'',
        pageNo:'',
        // 权限页面修改按钮点击浮层的输入框数据定义
        modifyRoleName:'',
        modifyRoleId:'',
        // 人员页面点击表格按钮数据定义
        detailInfo:{},
        specialId:'',
        // 人员界面修改浮层的数据定义
        xgaccPw :'',
        xgbirthDate :'',
        xgjobNumber:'',
        xgname :'',
        xgmobile:'',
        /////////
        total1:this.total1,
        total2:this.total2,
        total3:this.total3,
        total4:this.total4,
        // 人员查询部分数组定义
        queryStaffName:'',
        queryStaffPhone:'',
        queryStaffJobNumber:'',
        queryStaffState:'',
        typeOptions: [{
            value: '1',
            label: '在线'
        }, {
            value: '2',
            label: '登出'
        }, {
            value: '3',
            label: '锁定'
        }, {
            value: '',
            label: '所有'
        }],
        queryStaffRole:'',
        queryStaffList:[],
        // 添加人员按钮部分元素定义
        addStaffName:'',
        addStaffPhoneNum :'',
        addStaffJobNum :'',
        addStaffPage:'',
        addStaffPassWord:'',
        addStaffPic:'',
        // 添加角色数据定义
        addRoleName:'',
// 日志中的时间段数据定义
        timeSlot:'',
        timeToday:'',
        timeNearly:'',
        // 新添加自己尝试
        quxnxianData:[],
        currentPage1:this.currentPage1,
        currentPage2:this.currentPage2,
        currentPage3:this.currentPage3,
        currentPage4:this.currentPage4,
        pagesize1:'',
        pagesize2:'',
        pagesize3:'',
        pagesize4:'',
        istag: true,
        input:"",
        //新添加自己尝试
        para:[],
        pageList: [{
            value: 'manage',
            label: '人员管理'
        }, {
            value: 'compile',
            label: '规程编辑'
        }, {
            value: 'execute',
            label: '规程执行'
        }],
        staffName:'',
        staffPhoneNum:'',
        staffJobNum:'',
        staffPassWord:'',
        value6: '',
        radio:1,
        show1:false,
        show2:false,
        show3:false,
        show4:false,
        show5:false,
        show6:false,
        show7:false,
        show8:false,
        show9:false,
        recent:'three',
        recentList: [{
            value: 'three',
            label: '三天'
        }, {
            value: 'seven',
            label: '一周'
        }, {
            value: 'thirty',
            label: '一个月'
        }],
        list:[
            {tab:"人员"},
            {tab:"权限"},
            {tab:"日志"}
        ],
        name:'',
        phone:'',
        jobNumber:'',
        role:'',
        ordinal:'',
        conHeight:0,
        tableData1:[],
        tableData2:[],
        tableData3:[],
        tableData4:[],
    };
  },
    watch:{
        checkedValue:function(){
            this.answer=[];
            this.answer.push(this.checkedValue);
        }
    },
  methods: {
      // 人员页面的接口总结
      // 刚刚进入页面数据请求(人员部分)
      getPersonalData(){
          if(this.pageNo==''){
              var para = {
                  pageNo : 1,
                  pageSize : 10
              }
              console.log(111,para);
          }else {
              var para = {
                  pageNo : this.pageNo,
                  pageSize : 10
              }
          }
          getPersonalDataInn(para).then(res => {
              console.log('刚刚进入页面数据请求(人员部分)',res);
              this.total1=res.data.data.userinfo.count;
              this.currentPage1=res.data.data.userinfo.pageNo
              this.pagesize1=res.data.data.userinfo.pageCount
              this.tableData1=res.data.data.userinfo.list.slice(0,10);
          })
      },

      // 人员部分的按钮
      // 用户名点击
      staffNameLay(row){
          var para = {
              id : row
          }
          detailPersonalDataInn(para).then(res => {
              this.detailInfo=res.data.data.userinfo;
              console.log(231,this.detailInfo);
              this.show3=true;
          })
      },
      // 操作中的修改
      staffModifyLay(row){
          this.specialId=row;
          var para = {
              id : row
          }
          detailPersonalDataInn(para).then(res => {
              this.detailInfo=res.data.data.userinfo;
              // console.log(124556,this.detailInfo);
                  this.xgaccPw=this.detailInfo.accPw
                  this.xgbirthDate=this.detailInfo.birthDate
                  this.xgjobNumber=this.detailInfo.jobNumber
                  this.xgname=this.detailInfo.name
                  this.xgmobile=this.detailInfo.mobile
              this.show4=true;
          })
          // console.log('操作中的修改id',row);
      },
      // 操作中的密码重置
      staffPasswordResetLay(row){
          console.log('操作中的密码重置id',row);
          this.$confirm('此操作将重置密码, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              var para = {
                  id : row,
              }
              resetPwdDataInn(para).then(res => {
                  console.log('操作中的密码重置id(人员部分1334)',res);
                  if(res.status==200){
                      this.$message({
                          type: 'success',
                          message: '恭喜你，重置密码成功！!'
                      });
                  }
              })

          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消重置密码操作！！'
              });
          });
      },
      // 操作中的锁定
      staffLockLay(row,nnm) {
          console.log('操作中的锁定id', row);
          if (nnm == 3) {//解锁操作
              this.$confirm('此操作将解锁此用户, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  var para = {
                      id: row,
                  }
                  unlockPwdDataInn(para).then(res => {
                      console.log('操作中的解锁(人员部分1115)', res);
                      if (res.status == 200) {
                          this.$message({
                              type: 'success',
                              message: '恭喜你，成功解锁此用户！!'
                          });
                      }
                  })
              }).catch(() => {
                  this.$message({
                      type: 'info',
                      message: '已取消解锁此用户操作！！'
                  });
              });
              var that=this
              window.setTimeout(function(){
                  that.getPersonalData();//获取人员列表的数据
              },1200);
          } else {//锁定操作
          this.$confirm('此操作将锁定此用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              var para = {
                  id: row,
              }
              lockPwdDataInn(para).then(res => {
                  console.log('操作中的锁定(人员部分1334)', res);
                  if (res.status == 200) {
                      this.$message({
                          type: 'success',
                          message: '恭喜你，成功锁定此用户！!'
                      });
                  }
              })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消锁定此用户操作！！'
              });
          });
              var that=this
              window.setTimeout(function(){
                  that.getPersonalData();//获取人员列表的数据
              },1200);
      }


      },
      // 日志信息中的查看
      staffViewLogLay(row){
          console.log('日志信息中的查看id',row);
          if(this.pageNo==''){
              var para = {
                  pageNo : 1,
                  pageSize : 10,
                  operator:row,//操作者ID
              }
          }else {
              var para = {
                  pageNo : this.pageNo,
                  pageSize : 10,
                  operator:row,//操作者ID
              }
          }
          getJournalDataInn(para).then(res => {
              console.log('查看单个日志的信息',res);
              this.tableData4=res.data.data.sysLog.list.slice(0,10);
              this.total4=res.data.data.sysLog.count;
              this.currentPage4=res.data.data.sysLog.pageNo
              this.pagesize4=res.data.data.sysLog.pageCount
              this.show5=true;
          })
      },
      //浮层的人员部分数据
      handleCheckedCitiesChange(value) {
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.cities.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },


      // render 事件【表格的标题设置点击按钮《批量设置》】
      renderHeader (h,{column}) { // h即为cerateElement的简写，具体可看vue官方文档
          return h(
              'div',
              [
                  h('span', column.label),
                  h(
                      "el-button",
                      {
                          style: {marginLeft:'10px' },
                          class: "level-font-class",
                          on: {
                              click: () => {
                                  var para = {
                                      pageNo : 1,
                                      pageSize : 999
                                  }
                                  getPersonalDataInn(para).then(res => {
                                      console.log('这里是选取人员名字',res);
                                      console.log(144,res.data.data.userinfo);
                                      this.checkboxList=res.data.data.userinfo.list;

                                  })
                                  disposeRoleDataInn1(para).then(res => {
                                      console.log('这里是角色名字',res);//这里是角色名字
                                      console.log('res.data.data.roleInfo.list.name',res.data.data.roleInfo.list);
                                      this.checkboxRoleList=res.data.data.roleInfo.list;
                                  })
                                  this.show8=true
                              }
                          }
                      },
                      "批量设置"
                  ),
              ],
          );
      },
      // 人员页面配置按钮函数
      staffDispose(id,name,roleName){
          this.singleId=id;
          var disposeId=[];
          for (var i = 0; i < roleName.length; i++) {
              console.log('disposeId',roleName[i].id);
              disposeId.push(roleName[i].id)
          }
          this.disposeId=disposeId
          this.checkedIds=this.disposeId
          // if(this.pageNo==''){
          var para = {
              pageNo : 1,
              pageSize : 999,
              // name:name,
          }

          disposeRoleDataInn1(para).then(res => {
              console.log('配置按钮',res);//这里是角色名字
              // console.log('res.data.data.roleInfo.list.name',res.data.data.roleInfo.list);
              this.checkboxRoleList=res.data.data.roleInfo.list;
          })
          this.show7=true;
      },

      // 人员页面的单个配置按钮单击出现浮层，选定角色后点击确定的接口
      singleStaffCheckBox(){
          var str = "";
          for (var i = 0; i < this.checkedIds.length; i++) {
              str += 'roleIds='+this.checkedIds[i]+'&';
          }
          var para=str+'userIds='+this.singleId
          console.log(8889,para);
          // 3、PUT   角色操作接口/【/api/userinfo/setUserRole 设置人员角色及批量设置人员角色】
          disposeRoleDataInn3(para).then(res => {
              if(res.status==200){
                  this.checkedIds='';
                  this.singleId='';
                  this.show7=false;
                  var that=this
                  window.setTimeout(function(){
                      that.getPersonalData();//获取人员列表的数据
                  },1200);
              }
          })
      },
      // 批量设置人员角色
      batchStaffCheckBox(){
          // PUT  /api/userinfo/setUserRole  设置人员角色及批量设置人员角色
          var str1 = "";
          for (var i = 0; i < this.choosePerson.length; i++) {
              str1 += 'userIds='+this.choosePerson[i]+'&';
          }
          var str2 = "";
          for (var i = 0; i < this.chooseRole.length; i++) {
              str2 += 'roleIds='+this.chooseRole[i]+'&';
          }
          // 去掉最后一个逗号(如果不需要去掉，就不用写)
          if (str2.length > 0) {
              str2 = str2.substr(0, str2.length - 1);
          }
          var para=str1+str2;
          // 走权限的分页查询接口
          disposeRoleDataInn3(para).then(res => {
              console.log('(qqqqqq)',res);
              if(res.status==200){
                  // this.checkedIds='';
                  // this.singleId='';
                  this.show8=false;
                  var that=this
                  window.setTimeout(function(){
                      that.getPersonalData();//获取人员列表的数据
                  },1200);
              }
          })




          // let json = [
          //     {
          //         高压2:"120",
          //         低压3:null,
          //         低压2:"120"
          //     },
          //     {
          //         高压2:"130",
          //         低压3:null,
          //         低压2:"100"
          //     }]

          // console.log(111,json);





// //存放总结果
//           let  resultArr = [];
// //存放键名数组
//           let keynames = Object.keys(json[0]);
//
// //遍历所有的键名
//           for(let i = 0 ; i < keynames.length ; i++){
//               let tempJson = {};
//               tempJson.name = keynames[i];
//               let dataArr = [];
//               //遍历存放json的数组
//               for(let j = 0; j < json.length ; j++){
//                   let value = json[j];
//                   //遍历json中的每一项
//                   for(let key in value){
//                       //如果键名一样那么就把其键值存储到暂时数组中
//                       if(key === tempJson.name){
//                           dataArr.push(value[key])
//                       }
//                   }
//               }
//               tempJson.data = dataArr;
//               resultArr.push(tempJson);
//           }

          // 尝试
         // var arra={ userIds:[10000017,10000016,10000016]}
         // var arrb= {roleIds:[117,118,119]}




          //存放总结果
          // let  resultArr = [];
//存放键名数组
//           let keynames = Object.keys(json[0]);
          // console.log(1241,keynames,Object,Object.keys,json[0]);
          // for(){
          //
          // }

//遍历所有的键名
//           for(let i = 0 ; i < keynames.length ; i++){
//               let tempJson = {};
//               tempJson.name = keynames[i];
//               let dataArr = [];
//               //遍历存放json的数组
//               for(let j = 0; j < json.length ; j++){
//                   let value = json[j];
//                   //遍历json中的每一项
//                   for(let key in value){
//                       //如果键名一样那么就把其键值存储到暂时数组中
//                       if(key === tempJson.name){
//                           dataArr.push(value[key])
//                       }
//                   }
//               }
//               tempJson.data = dataArr;
//               resultArr.push(tempJson);
//           }


          // console.log(779,resultArr)  //打印结果

          // console.log(222,JSON.parse("{'userIds':10000017,'userIds':10000016,'userIds':10000015,'roleIds':118,'roleIds':107,'roleIds':106,}"));

          // test() {
          //     let temp = {}
          //     for (var i = 0; i < allIds.length; i++) {
          //         for (var j in allIds[i]) {
          //         //     temp[j] = allIds[i][j]
          //             console.log(333,allIds[i][j]);
          //         }
          //         console.log(444,allIds[i]);
          //
          //     }
              // console.log('temp',temp)
          // }
          // alert(allIds);
          // var v1 =  JSON.stringify(arr).toString();

          // var para={
          //     userIds:this.choosePerson,
          //     roleIds:this.chooseRole
          // }
          // console.log(qs.stringify(para));
          //
    // qs.stringify(para)
          // console.log(222,this.choosePerson.slice(','));
          // disposeRoleDataInn3(qs.stringify(allIds)).then(res => {
          //     console.log('批量修改',res);
          // })


      },

      // clickMe(list){
      //     console.log(3356,list.id);
      //
      //     // function addCheckBoxData(list, item){
      //     //     if($.inArray(item, list) == -1){
      //     //         list.push(item);
      //     //     }else{
      //     //         for(var i=0; i < list.length; i++){
      //     //             if(list[i] == item){
      //     //                 list.splice(i, 1); //将这个元素移除
      //     //             }
      //     //         }
      //     //     }
      //     // }
      //
      //
      // },

      // 人员页面批量设置按钮
      // batchSetupClick(){
      //     console.log(555632);
      // },


      // 人员页面的接口总结完毕

      // 权限部分 接口总结
      // 刚刚进入页面数据请求(权限部分) 【但是这里需要走角色的，分页查询接口】
      getPowerData(){
          if(this.pageNo==''){
              var para = {
                  pageNo : 1,
                  pageSize : 10
              }
          }else {
              var para = {
                  pageNo : this.pageNo,
                  pageSize : 10
              }
          }
      // 走权限的分页查询接口
          disposeRoleDataInn1(para).then(res => {
              console.log('刚刚进入页面数据请求(权限部分)',res);
              this.tableData2=res.data.data.roleInfo.list.slice(0,10);
              this.total2=res.data.data.roleInfo.count;
              this.currentPage2=res.data.data.roleInfo.pageNo
              this.pagesize2=res.data.data.roleInfo.pageCount
          })
      },
      // 权限页面删除接口
      powerDeleteLay(row){
          this.$confirm('此操作将删除此角色, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              var para = {
                  id : row,
              }
              deleteRoleDataInn(para).then(res => {
                  console.log('删除此角色(权限部分111)',res);
                  if(res.status==200){
                      this.$message({
                          type: 'success',
                          message: '恭喜你，删除角色成功！!'
                      });
                      var that=this
                      window.setTimeout(function(){
                          that.getPowerData();//获取权限列表的数据
                      },1200);
                  }
              })

          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除角色操作！！'
              });
          });
      },
      // 权限页面点击修改按钮，出现对应浮层
      powerModifyLay(row,dd){
          this.modifyRoleId=row;
          this.modifyRoleName=dd;
          this.show6=true;
      },
      // 权限页面的配置按钮点击
      powerDisposeLay(row,info){
          var userArr=[]
          var excuteArr=[]
          var editArr=[]
          for (var i = 0; i < info.length; i++) {
              if(info[i].authType=='user'){
                  userArr.push(info[i].id)
              }
          }
          for (var i = 0; i < info.length; i++) {
              if(info[i].authType=='regulation-edit'){
                  editArr.push(info[i].id)
              }
          }
          for (var i = 0; i < info.length; i++) {
              if(info[i].authType=='regulation-excute'){
                  excuteArr.push(info[i].id)
              }
          }
          // regulation-excute  regulation-edit  user


          this.userManage=userArr
          this.regulationExcute=excuteArr
          this.regulationEdit=editArr
          console.log(13258,userArr,excuteArr,editArr);
          this.newId=row;
          // 走第一个接口，获取浮层需要的数据
          var para = {
              pageNo : 1,
              pageSize : 100
          }
          getPowerDataInn1(para).then(res => {
              if (res.status == 200) {
                  console.log(228,res.data.data);
                  this.powerCheckboxList=res.data.data.authorityInfo.list;
              }
          })
          this.show9=true;
      },
      // 权限页面的点击配置后的浮层的确定按钮
      powerCheckbox(){

          var para1={
              // id:this.newId
              id:this.newId
          }




          /////////////////////////////////
          var str1 = "";
          for (var i = 0; i < this.userManage.length; i++) {
              str1 += 'authorityInfoIds='+this.userManage[i]+'&';
          }
          var str2 = "";
          for (var i = 0; i < this.regulationEdit.length; i++) {
              str2 += 'authorityInfoIds='+this.regulationEdit[i]+'&';
          }
          var str3 = "";
          for (var i = 0; i < this.regulationExcute.length; i++) {
              str3 += 'authorityInfoIds='+this.regulationExcute[i]+'&';
          }
          // 去掉最后一个逗号(如果不需要去掉，就不用写)
          if (str3.length > 0) {
              str3 = str3.substr(0, str3.length - 1);
          }
          var para2=str1+str2+str3;
          // 走权限的分页查询接口
          // disposeRoleDataInn3(para).then(res => {
          //     console.log('(qqqqqq)',res);
          //     if(res.status==200){
          //         // this.checkedIds='';
          //         // this.singleId='';
          //         this.show8=false;
          //         var that=this
          //         window.setTimeout(function(){
          //             that.getPersonalData();//获取人员列表的数据
          //         },1200);
          //     }
          // })


          console.log(779,para1, para2);

          // PUT   /api/roleInfo/roleInfoAuthority  配置权限
          getPowerDataInn3(para1,para2).then(res => {
              // if (res.status == 200) {
              //     this.show6=false;
              //     this.$message({
              //         type: 'success',
              //         message: '恭喜你，修改信息成功！!'
              //     });
              // }
              console.log(1103,res);
              if(res.status==200){
                  this.show9=false;
                  var that=this
                  window.setTimeout(function(){
                      that.getPowerData();//获取人员列表的数据
                  },1200);
              }
          })



          ///////////////////////////////////



















      },

      // 点击浮层的确定按钮，对内容进行修改，走修改接口
      modifyRole(){
          var para = {
              id : this.modifyRoleId,
              name:this.modifyRoleName,
          }
          modifyRoleDataInn(para).then(res => {
                  if (res.status == 200) {
                      this.show6=false;
                      this.$message({
                          type: 'success',
                          message: '恭喜你，修改信息成功！!'
                      });
                  }
              })
          var that=this
          window.setTimeout(function(){
              that.getPowerData();//获取权限列表的数据
          },1200);

      },
      // 权限部分接口 完毕

      // 日志部分接口总结
      // 刚刚进入页面数据请求(日志部分)
      getJournalData(){
          if(this.pageNo==''){
              var para = {
                  pageNo : 1,
                  pageSize : 10
              }
          }else {
              var para = {
                  pageNo : this.pageNo,
                  pageSize : 10
              }
          }
          getJournalDataInn(para).then(res => {
              console.log('刚刚进入页面数据请求(日志部分)',res);
              this.tableData3=res.data.data.sysLog.list.slice(0,10);
              // this.total2=this.tableData3.length;
              this.total3=res.data.data.sysLog.count;
              this.currentPage3=res.data.data.sysLog.pageNo
              this.pagesize3=res.data.data.sysLog.pageCount
          })
      },
      // 日志页面用户名点击
      journalNameLay(row){
          var para = {
              id : row
          }
          detailPersonalDataInn(para).then(res => {
              this.detailInfo=res.data.data.userinfo;
              this.show3=true;
          })
      },


      // 日志部分的按钮
      // 用户名按钮
      logName(row){
          console.log('日志部分用户名按钮',row);
      },
   // 日志部分接口总结完毕

      // 人员查询部分函数,头部点击查询按钮
      staffQuery(){
          // 问题：粘贴到这里不行，手动输入可以。
          var para = {
              pageNo : 1,
              pageSize : 10,
              name:this.queryStaffName,//用户名
              mobile:this.queryStaffPhone,//手机号
              jobNumber:this.queryStaffJobNumber,//工号
              userStatus:this.queryStaffState,//用户状态1在线2登出3锁定
              roleNames:this.queryStaffRole,//角色多个用逗号分隔
          }
          getPersonalDataInn(para).then(res => {
              console.log('条件查询(人员部分)',res);
              this.tableData1=res.data.data.userinfo.list.slice(0,10);
              this.total1=res.data.data.userinfo.count;
              this.currentPage1=res.data.data.userinfo.pageNo
              this.pagesize1=res.data.data.userinfo.pageCount
              console.log(552,this.total1,this.tableData1,para);
          })
      },
// 添加人员的确定按钮获取数据
      addStaff(num){
          if(num==1){
              // 人员页面下添加人员浮层的确定按钮
              var para = {
                  "accPw": this.addStaffPassWord,
                  // "birthDate": "string",
                  // "gender": 0,
                  "jobNumber": this.addStaffJobNum,
                  // "lastLoginIp": "string",
                  // "lastLoginTime": "2019-12-23T07:01:19.179Z",
                  // "mainPageCode": this.addStaffPage,
                  // "mobile": this.addStaffPhoneNum,
                  "name": this.addStaffName,
                  "photo": this.addStaffPic,
                  // "updateTime": "2019-12-23T07:01:19.179Z",
                  "userStatus": "2",//2代表状态
                  //这里是正确的姿势
                  // "accPw": "123456",
                  // "name": "test",
                  // "jobNumber": "testz"
              }
              if(this.addStaffName==''||this.addStaffPassWord==''||this.addStaffJobNum==''){//这2项为必填项
                  this.$message.error('提示：带*为必填项！！');
              }else {
                  addPersonalDataInn(para).then(res => {
                      if(res.status==200){
                          this.show1=false;
                          var that=this
                          window.setTimeout(function(){
                              that.getPersonalData();//获取人员列表的数据
                          },1200);
                      }
                  })
              }
          }else if(num==3){
              this.show3=false;
          }else if(num==4){//修改人员信息接口
              var para={
                  // accPw: this.xgaccPw,
                  // birthDate: this.xgbirthDate,
                  // gender: 1,
                  // id: 10011,
                  // jobNumber:this.xgjobNumber,
                  // lastLoginIp: null,
                  // lastLoginTime: null,
                  // mainPageCode: "admin",
                  // mobile:this.xgmobile,
                  "name":this.xgname  ,
                  "id":this.specialId,
                  // "accPw": "111",
                  // "id": "10011"
                  // photo: null,
                  // roleInfos: Array(0),
                  // updateTime: "2019-12-03 14:24:30",
                  // userStatus: "2",
              }
              modifyPersonalDataInn(para).then(res => {
                  console.log(9980,res);
                  if(res.status==200){
                      this.show4=false;
                  }
              })
              var that=this
              window.setTimeout(function(){
                  that.getPersonalData();//获取人员列表的数据
              },1200);
          }

      },
// 添加角色的确定按钮获取数据
      addRole(){
          var para={
              "name":this.addRoleName,
          }
          addRoleInn(para).then(res => {
              if(res.status==200){
                  this.show2=false;
              }
          })
          var that=this
          window.setTimeout(function(){
              that.getPowerData();//获取权限列表的数据
          },1200);
      },

      // 日志查询按钮
      logQuery(){
          console.log('todayDate',this.todayDate);
          console.log('this.radio',this.radio);
          if(this.radio==1){
              this.operateTimeStart=this.todayDate;
              this.operateTimeEnd=this.todayDate;
          }else if(this.radio==2){
              if(this.recent=='three'){
                  this.operateTimeStart=this.threeAgoDate;
                  this.operateTimeEnd=this.todayDate;
              }else if(this.recent=='seven'){
                  this.operateTimeStart=this.sevenAgoDate;
                  this.operateTimeEnd=this.todayDate;
              }else if(this.recent=='thirty'){
                  console.log(34654);
                  this.operateTimeStart=this.thirtyAgoDate;
                  this.operateTimeEnd=this.todayDate;
              }
          }else if(this.radio==3){
              if(this.dateSelection==''){
                  this.$message('自定义时间段不能为空！！');
              }else {
                  this.operateTimeStart=this.dateSelection[0];
                  this.operateTimeEnd=this.dateSelection[1];
              }
          }
          var para = {
              pageNo : 1,
              pageSize : 10,
              operateTimeStart:this.operateTimeStart,
              operateTimeEnd:this.operateTimeEnd,
              // 应该还有参数
          }
          console.log('para',para);
          console.log('this.timeSlot',this.timeSlot);
          getJournalDataInn(para).then(res => {
              this.tableData3=res.data.data.sysLog.list.slice(0,10);
              this.total3=res.data.data.sysLog.count;
              this.currentPage3=res.data.data.sysLog.pageNo
              this.pagesize3=res.data.data.sysLog.pageCount
          })
      },

      chooseTimeRange(dateSelection) {
          this.dateSelection=dateSelection
          // console.log(1155,this.dateSelection);//结果为一个数组，如：["2018-08-04", "2018-08-06"]
      },
      // 头部人员、权限、日志之间的切换
      addClass:function(index){
          this.ordinal=index;
      },
      // 刚刚进入页面获取的内容
      arise(cxNum){
          this["show"+cxNum]=true;
          // this.youjiLay = true
      },
      hideLay(qxNum){
          this["show"+qxNum]=false;
          // this.youjiLay = false;
      },




      // 上传图片的功能
      //文件超出个数限制时的钩子【判断上传的图片是否超过限制，超过提醒删除再进行上传】
      handleExceed: function () {
          this.$alert('图片最多上传一张，请删除再重新上传！', '', {
              showConfirmButton: false,
              callback: action => {}
          });
      },

      getFile(file, fileList) {
          this.getBase64(file.raw).then(res => {
              this.addStaffPic=res;
          });
      },
      getBase64(file) {
          return new Promise(function(resolve, reject) {
              let reader = new FileReader();
              let imgResult = "";
              reader.readAsDataURL(file);
              reader.onload = function() {
                  imgResult = reader.result;
              };
              reader.onerror = function(error) {
                  reject(error);
              };
              reader.onloadend = function() {
                  resolve(imgResult);
              };
          });
      },
      current_change1:function(currentPage){
          this.pageNo = currentPage;
          this.getPersonalData();
      },
      current_change2:function(currentPage){
          this.pageNo = currentPage;
          this.getPowerData();
          console.log(222,currentPage);
      },
      current_change3:function(currentPage){
          this.pageNo = currentPage;
          this.getJournalData();
          console.log(333,currentPage);
      },
      current_change4:function(currentPage){
          this.pageNo = currentPage;
          this.staffViewLogLay();
          console.log(444,currentPage);
      },

      //获取当前时间，格式YYYY-MM-DD
      getNowFormatDate(type=null,number=0) {
        var nowdate = new Date();
        switch (type) {
            case "day":   //取number天前、后的时间
                nowdate.setTime(nowdate.getTime() + (24 * 3600 * 1000) * number);
                var y = nowdate.getFullYear();
                var m = nowdate.getMonth() + 1;
                var d = nowdate.getDate();
                var retrundate = y + '-' + m + '-' + d;
                break;
            case "week":  //取number周前、后的时间
                var weekdate = new Date(nowdate + (7 * 24 * 3600 * 1000) * number);
                var y = weekdate.getFullYear();
                var m = weekdate.getMonth() + 1;
                var d = weekdate.getDate();
                var retrundate = y + '-' + m + '-' + d;
                break;
            case "month":  //取number月前、后的时间
                nowdate.setMonth(nowdate.getMonth() + number);
                var y = nowdate.getFullYear();
                var m = nowdate.getMonth() + 1;
                var d = nowdate.getDate();
                var retrundate = y + '-' + m + '-' + d;
                break;
            case "year":  //取number年前、后的时间
                nowdate.setFullYear(nowdate.getFullYear() + number);
                var y = nowdate.getFullYear();
                var m = nowdate.getMonth() + 1;
                var d = nowdate.getDate();
                var retrundate = y + '-' + m + '-' + d;
                break;
            default:     //取当前时间
                var y = nowdate.getFullYear();
                var m = nowdate.getMonth() + 1;
                var d = nowdate.getDate();
                var retrundate = y + '-' + m + '-' + d;
        }
        return retrundate;
    },
  },
    mounted(){
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.conHeight=h-80;
        this.getPersonalData();//获取人员列表的数据
        this.getPowerData();//获取权限列表的数据
        this.getJournalData();//获取日志列表的数据
    },
  created() {
      // 获取当前的时间
      this.todayDate=this.getNowFormatDate(); //当天时间
      this.threeAgoDate=this.getNowFormatDate("day", -3)  //近三天
      this.sevenAgoDate=this.getNowFormatDate("day", -7);   //近一周
      this.thirtyAgoDate=this.getNowFormatDate("month", -1)  //前一个月的时间
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
      img {
        float: left;
        width: 40px;
        margin-top: 8px;
        border: 2px solid #fff;
        border-radius: 50%;
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
      background-color: #F5F5F5;
      color: #333;
      text-align: center;
      line-height: 620px;
    }
    .title{overflow: hidden;background-color:#F2F2F2;}
    .title li{float: left;font-size: 18px;border: 1px solid #CCCCCC;text-align: center;letter-spacing: 5px;padding: 0 50px;cursor: pointer;line-height: 30px;border-radius: 5px;height: 30px;}
    .special{border: 1px solid transparent!important;background-color: #ffffff!important;font-weight: 600;}
    /*人员部分*/
    .allbox1{margin:20px auto; border: 1px solid #CCCCCC;width: 55%;background-color: #FAFAFA;text-align: center;min-width: 850px;}
    .polling_box1{overflow: hidden;height: 50px;line-height: 50px;display: inline-block;}
    .polling_box1 li{float: left;margin: 0 10px;}
    .polling_box1 li span{margin-right: 10px;}

    /*人员页面点击单个配置的浮层的样式*/
    .role {font-size: 16px;font-weight: bolder;color: black;}
    .staffcheckbox{border: 1px solid #cccccc;max-height: 400px;overflow: auto;font-size: 16px;line-height: 40px;margin-top: 15px;}
    .staffcheckbox li{text-indent: 10px;}
    .batchSetup{overflow: hidden;}
    .batchSetup .single{float: left;width: 40%;}
    .batchSetup .single1{float: left;width: 20%;}

    /*日志部分的css*/
    .logbox{margin:20px auto; border: 1px solid #CCCCCC;width: 55%;background-color: #FAFAFA;text-align: center;min-width: 850px;line-height: 55px;height: 55px;}
    /*line-height: 50px;height: 50px;*/
    .log_box1{overflow: hidden;}
    .log_box1 li{float: left;margin: 0 10px;}
    .log_box1 li span{margin-right: 10px;}

    .time_line{display: inline-block;height: 50px;line-height: 50px;}
    .zdy_line{display: inline-block;}
    .block_line{display: inline-block;margin-left: 10px;}

    .polling_box2{overflow: hidden;height: 50px;line-height: 50px;display: inline-block;}
    .polling_box2 li{float: left;margin: 0 10px;}
    .polling_box2 li span{margin-right: 20px;}
    .quer_inp{width: 180px;}
    .quer_inp1{width: 420px;}
    /*第二部分列表部分*/
    .allbox2{width: 90%;margin: 0 auto;}
    .rolelist{text-align: center;}
    .rolelist li{display: inline;margin: 0 10px;}
    /*.rolelist1{text-align: center;}*/
    /*.rolelist1 li{display: inline;margin: 0 10px;}*/
    .cellbox{
      cursor: pointer;
      border: 1px solid #cccccc;
      border-radius: 5px;
      padding:10px 20px;
    }
    .cell{
      height: 40px;
      vertical-align: middle;
      display: inline-block;
      line-height: 40px;
    }
    .allbox3{width: 90%;margin: 100px auto 0;}
    .youji-lay{position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 2;background: rgba(0,0,0,0.8);}
  }
</style>
<style>
  .el-radio-button__inner, .el-radio-group{line-height: 50px;}
  .table{line-height: 40px;margin: 0 auto; border: none;outline: none;}
  .table td:first-child{text-align: right;}
  .table1{line-height: 40px;margin: 0 auto; border: none;outline: none; width: 90%;}
  .table1 td:first-child{text-align: left;text-indent: 10px;}
  .has-gutter tr .cell{
    font-weight: bolder!important;
    color: #000000;
  }
  .fy{
    text-align:right;
  }
</style>