<template>
  <div style="height: 100%;">
    <!-- <head-view></head-view> -->
    <el-tabs type="border-card" style="height: 100%;">
      <el-tab-pane label="规程数据列表库">
        <div class="keyword">
          <div style="margin: auto;">
            <div class="demo-input-suffix">
              <span>规程名：</span>
              <el-input class="ele-input" placeholder="请输入内容" v-model="regulationName" clearable>
              </el-input>
            </div>
            <div class="demo-input-suffix" style="margin-left:60px;">
              <span>规程类型：</span>
              <el-select v-model="regulationTypes" clearable placeholder="请选择">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="demo-input-suffix" style="margin-left:60px;">
              <el-button type="primary" @click="searchRegulations">查询</el-button>
            </div>
          </div>
        </div>
        <div class="content">
          <el-button type="primary" @click="creatWord = true"><span style="font-size:18px;font-weight: 700;">新建&nbsp;&nbsp;</span>规程文档</el-button>
          <el-button type="primary" @click="fileUploadWord = true"><span style="font-size:18px;font-weight: 700;">上传&nbsp;&nbsp;</span>规程文档</el-button>
          <el-button type="primary" @click="fileUploadZip = true"><span style="font-size:18px;font-weight: 700;">导入&nbsp;&nbsp;</span>规程数据</el-button>
          <el-button type="primary" v-if="isMultipleExports" @click="multipleExports = true,isBack= true, isMultipleExports = false"><span style="font-size:18px;font-weight: 700;">导出&nbsp;&nbsp;</span></el-button>
          <el-button type="primary" v-if="isBack" @click="multipleExports = false,isMultipleExports = true,isBack=false">返 回</el-button>
          <div v-if="multipleExports" style="float:right;">
            <el-radio-group v-model="documentForm">
              <el-radio label="word" style="margin-right:20px;">规程文档形式</el-radio>
              <el-radio label="zip" style="margin-right:20px;">数据文件形式</el-radio>
            </el-radio-group>
            <el-button type="primary" @click="selectedDataExport"><span style="font-size:18px;font-weight: 700;">当前&nbsp;&nbsp;</span>页选中记录导出</el-button>
            <el-button type="primary" @click="allSelectedDataExport"><span style="font-size:18px;font-weight: 700;">所有&nbsp;&nbsp;</span>查询结果记录导出</el-button>
          </div>
          <el-table ref="multipleTable" :data="tableData" border style="width: 99.9%;margin:10px 0;font-size: 16px;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50">
            </el-table-column>
            <el-table-column type="index" align="center" width="50">
            </el-table-column>
           <!--  <el-table-column align="center" prop="id" label="id" width="100">
            </el-table-column> -->
            <el-table-column prop="dirName" label="文档详细信息所在目录名称" v-if="hideRow">
            </el-table-column>
            <el-table-column align="left" label="规程名">
              <template slot-scope="scope">
                <el-button @click="handleFilePreview(scope.row)" type="text" style="font-size: 16px;">{{ scope.row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="edition" label="版次" width="70">
            </el-table-column>
            <el-table-column align="left" prop="fileCode" label="文档编码" width="230">
            </el-table-column>
            <el-table-column align="center" prop="regulationType" label="规程类型" width="100">
            </el-table-column>
            <el-table-column align="center" label="归属" width="75">
              <template slot-scope="scope">
                <el-button @click="editBelong(scope.row)" type="text" style="font-size: 16px;">{{ scope.row.fileType }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="uploadTime" label="上传时间" width="180">
            </el-table-column>
            <el-table-column align="center" prop="updateTime" label="最新更新时间" width="180">
            </el-table-column>
            <el-table-column align="center" label="操作" width="105">
              <template slot-scope="scope">
                <el-button @click="handleUpdate(scope.row)" type="text" style="font-size: 16px;">修改</el-button>
                <el-button @click="handleDelete(scope.row)" type="text" style="font-size: 16px;">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="导出" width="300">
              <template slot-scope="scope">
                <el-button @click="exportDialogWord(scope.row)" type="text" style="font-size: 16px;">导出成word文档</el-button>
                <el-button @click="exportDialogZip(scope.row)" type="text" style="font-size: 16px;">导出成数据文件</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination align="right" background layout="prev, pager, next" :current-page="pageData.pageNo" :total="pageData.count" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="入口条件列表库">
        <div class="keyword">
          <div style="margin: auto;">
            <div class="demo-input-suffix">
              <span>入口条件：</span>
              <el-input class="ele-input" placeholder="请输入内容" v-model="enterName" clearable>
              </el-input>
            </div>
            <div class="demo-input-suffix" style="margin-left:200px;">
              <el-button type="primary" @click="searchEnterCondition">查询</el-button>
            </div>
          </div>
        </div>
        <div class="content">
          <el-button type="primary" @click="fileUploadEntry = true"><span style="font-size:18px;font-weight: 700;">导入&nbsp;&nbsp;</span>入口条件</el-button>
          <el-button type="primary" @click="selectedEntryExport"><span style="font-size:18px;font-weight: 700;">导出&nbsp;&nbsp;</span>当前页选中记录</el-button>
          <el-button type="primary" @click="allSelectedEntryExport"><span style="font-size:18px;font-weight: 700;">导出&nbsp;&nbsp;</span>所有查询结果记录</el-button>
          <el-table ref="multipleEnter" :data="enterData" border style="width: 99.9%;margin:10px 0;font-size: 16px;" @selection-change="entrySelectionChange">
            <el-table-column type="selection" align="center" width="50">
            </el-table-column>
            <el-table-column type="index" align="center" width="50">
            </el-table-column>
            <el-table-column align="left" prop="description" label="入口条件" width="500">
            </el-table-column>
            <el-table-column align="left" prop="relationRegulation" label="涉及的规程">
            </el-table-column>
            <el-table-column align="center" label="操作" width="250">
              <template slot-scope="scope">
                <el-button @click="reorderRegulation(scope.row)" type="text" style="font-size: 16px;">调整规程优先级</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination align="right" background layout="prev, pager, next" :current-page="entryPageData.pageNo" :total="entryPageData.count" @current-change="handleEntryChange">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 规程归属更改 -->
    <el-dialog title="修改归属" :visible.sync="dialogEditBelong" width="35%">
      <div style="height: 30px;text-align: left;font-size: 16px;">
        <span>规程名：</span>
        <span>{{belongName}}</span>
      </div>
      <div style="height: 30px;text-align: left;font-size: 16px;">
        <span>归&nbsp;&nbsp;&nbsp;&nbsp;属：</span>
        <el-select v-model="belongValue" placeholder="请选择">
          <el-option
            v-for="item in belongOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditBelong = false">取 消</el-button>
        <el-button type="primary" @click="saveBelongFileType">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 规程数据文件上传 -->
    <el-dialog title="选择要导入的规程数据文件包" :visible.sync="fileUploadZip" width="35%">
      <el-upload class="upload-demo" ref="uploadZip" :limit="1" action="/regulations/importzip" :on-preview="handlePreview" :before-remove="handleZipBeforeRemove" :on-remove="handleZipRemove" :file-list="zipFile" :auto-upload="false" :on-success="handleZipFileSuccess" :on-exceed="handleExceed" :on-error="handleZipFileError" :before-upload="beforeZipFileUpload">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="success" @click="submitUploadZip">上传文件</el-button>
      </div>
    </el-dialog>
    <!-- 规程word文档上传 -->
    <el-dialog title="选择规程word文档" :visible.sync="fileUploadWord" width="35%">
      <el-upload class="upload-demo" ref="uploadWord" :limit="1" action="/regulations/importWord" :on-preview="handlePreview" :on-remove="handleWordRemove" :file-list="wordFile" :auto-upload="false" :on-success="handleWordFileSuccess" :on-exceed="handleExceed" :on-error="handleZipFileError" :before-upload="beforeWordFileUpload">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="success" @click="submitUploadWord">上传文件</el-button>
      </div>
    </el-dialog>
    <!--新建规程文档-->
    <el-dialog title="新建规程文档" :visible.sync="creatWord"  width="35%">
      <table class="table">
        <tr>
          <td> 规程名：</td>
          <td> <el-input
                  placeholder="请输入内容"
                  v-model="regulaName"
                  clearable>
          </el-input></td>
          <td>(<el-input
                  placeholder="请输入内容"
                  v-model="regulaName1"
                  clearable>
          </el-input>)</td>
        </tr>
        <tr>
          <td> 文档编码：</td>
          <td> <el-input
                  placeholder="请输入内容"
                  v-model="fileCode"
                  clearable>
          </el-input></td>
        </tr>
        <tr>
          <td>规程类型：</td>
          <td>
            <el-select v-model="regulationType">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td> 版次：</td>
          <td>
            <el-select v-model="edition">
              <el-option v-for="item in editionOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr v-show="isTip"><td colspan="3" style="text-align: center;color: red;">该规程已经存在，请重新输入文档编码！</td></tr>
      </table>
   <span slot="footer" class="dialog-footer">
    <el-button @click="creatWord = false">取 消</el-button>
    <el-button type="primary" @click="handleClose()">确 定</el-button>
  </span>


    </el-dialog>
    <!-- 导出word文档 -->
    <el-dialog title="导出word文档" :visible.sync="showDialogWord" width="35%" center>
      <el-form :model="dataZip">
        <el-form-item label="规程名" :label-width="formLabelWidth">
          <el-input v-model="dataZip.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="版次" :label-width="formLabelWidth">
          <el-input v-model="dataZip.edition" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="文档编码" :label-width="formLabelWidth">
          <el-input v-model="dataZip.fileCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="规程类型" :label-width="formLabelWidth">
          <el-input v-model="dataZip.regulationType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="上传时间" :label-width="formLabelWidth">
          <el-input v-model="dataZip.uploadTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="最新修改时间" :label-width="formLabelWidth">
          <el-input v-model="dataZip.updateTime" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleExportWord(dataZip)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 导出数据文件 -->
    <el-dialog title="导出数据文件" :visible.sync="showDialogZip" width="35%" center>
      <el-form :model="dataZip">
        <el-form-item label="规程名" :label-width="formLabelWidth">
          <el-input v-model="dataZip.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="版次" :label-width="formLabelWidth">
          <el-input v-model="dataZip.edition" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="文档编码" :label-width="formLabelWidth">
          <el-input v-model="dataZip.fileCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="规程类型" :label-width="formLabelWidth">
          <el-input v-model="dataZip.regulationType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="上传时间" :label-width="formLabelWidth">
          <el-input v-model="dataZip.uploadTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="最新修改时间" :label-width="formLabelWidth">
          <el-input v-model="dataZip.updateTime" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleExportZip(dataZip)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选中导入数据文件 -->
    <el-dialog title="导入数据" :visible.sync="dialogImportVisible">
      <div style="text-align: left;">
        <el-button type="primary" @click="selectedDataImport">当前页选中记录导入</el-button>
        <el-button type="primary" @click="allSelectedDataImport">所有记录导入</el-button>
      </div>
      <el-table :data="importData" border style="width: 100%;margin:10px 0;" @selection-change="handleImportChange">
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column type="index" align="center" width="50">
        </el-table-column>
        <!-- <el-table-column align="center" prop="id" label="id" width="100">
        </el-table-column> -->
        <el-table-column prop="dirName" label="文档详细信息所在目录名称" v-if="hideRow">
        </el-table-column>
        <el-table-column align="center" prop="name" label="规程名">
        </el-table-column>
        <el-table-column align="center" prop="edition" label="版次" width="100">
        </el-table-column>
        <el-table-column align="center" prop="fileCode" label="文档编码" width="100">
        </el-table-column>
        <el-table-column align="center" prop="regulationType" label="规程类型" width="100">
        </el-table-column>
        <el-table-column align="center" prop="uploadTime" label="上传时间">
        </el-table-column>
        <el-table-column align="center" prop="updateTime" label="最新更新时间">
        </el-table-column>
      </el-table>
      <el-pagination align="right" background layout="prev, pager, next" :total="importPageData.count">
      </el-pagination>
    </el-dialog>
    <!-- 入口条件 导入 -->
    <el-dialog title="选择要导入的入口条件文件包" :visible.sync="fileUploadEntry" width="35%">
      <el-upload class="upload-demo" ref="uploadEntry" :limit="1" action="/regulations/importEntryConditionData" :on-preview="handlePreview" :before-remove="handleEntryBeforeRemove" :on-remove="handleEntryRemove" :file-list="EntryFile" :auto-upload="false" :on-success="handleEntryFileSuccess" :on-exceed="handleExceed" :on-error="handleZipFileError" :before-upload="beforeEntryFileUpload">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="success" @click="submitUploadEntry">上传文件</el-button>
      </div>
    </el-dialog>
    <!-- 调序 -->
    <el-dialog title="调整规程优先级" :visible.sync="showDialogOrder" width="35%">
      <div v-if="orderCurrentName" style="height: 30px;line-height: 30px;margin: 0 8px;">
        <span style="font-weight: 700;margin-right:10px;">当前入口条件</span>
        <span v-if="orderCurrentName.length > 25">{{orderCurrentName.substring(0,25)+'...'}}</span>
        <span v-else >{{orderCurrentName}}</span>
      </div>
      <ul>
        <li v-for="(orderItem, index) in orderData" :key="index" style="width: 100%;line-height: 2;border-radius: 5px;padding: 0 10px;box-sizing: border-box;margin-top:10px;" :style="{border: orderIndex == index ? '2px solid #000' : '1px solid #000'}">
          <el-radio v-if="orderItem.regulationName.replace(/<[^>]+>/g,'').length > 27" v-model="currentOrder" :label="orderItem.order" @change="(val) => getOrderIndex(val,index)">
            {{orderItem.regulationName.replace(/<[^>]+>/g,'').substring(0,27)+'...'}}
          </el-radio>
          <el-radio v-else v-model="currentOrder" :label="orderItem.order" @change="(val) => getOrderIndex(val,index)">
            {{orderItem.regulationName.replace(/<[^>]+>/g,'')}}
          </el-radio>
        </li>
      </ul>
      <div style="overflow: hidden;margin-top:20px;">
        <div style="float: left;height: 32px;padding: 4px 8px;background: #DADADA;box-sizing: border-box;border:1px solid #C9C9C9;border-radius: 4px;">
          <i class="el-icon-download" style="font-size: 24px;font-weight: 700;color:#409EFF;cursor: pointer;" @click="downOrder"></i>
          <i class="el-icon-upload2" style="font-size: 24px;font-weight: 700;color:#409EFF;cursor: pointer;" @click="upOrder"></i>
        </div>
        <div style="float: right;">
          <el-button @click="showDialogOrder = false">取 消</el-button>
          <el-button type="primary" @click="saveEnterOrder" style="background:green;border:1px solid green;">保 存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'home',
  data() {
    return {
      fileNum: '',
      isBack: false,
      isMultipleExports: true,
      documentForm: 'word',
      pageData: {},
      entryPageData: {},
      importPageData: {},
      hideRow: false,
      multipleExports: false,
      fileUploadZip: false,
      fileUploadEntry: false,
      fileUploadWord: false,
      dialogEditBelong: false,
      showDialogOrder: false,
      unicode: '',
      orderCurrentName: '',
      orderData: [],
      orderIndex: null,  //排序索引
      currentOrder: '',
        //李康添加
      creatWord:false,
      regulationType :'fault',
      regulaName  :'',
      regulaName1:'',
      edition :'A',
      editionOptions: [{
        value: 'A',
        label: 'A'
      }, {
        value: 'B',
        label: 'B'
      }, {
        value: 'C',
        label: 'C'
      }, {
        value: 'D',
        label: 'D'
      }],
      fileCode:'',
      isTip:false,
        //李康添加
      zipFile: [],
      wordFile: [],
      EntryFile: [],
      belongName: '',
      belongValue: '',
      belongOptions: [{
        value: '1#堆',
        label: '1#堆'
      }, {
        value: '2#堆',
        label: '2#堆'
      }, {
        value: '常规',
        label: '常规'
      }],
      showDialogZip: false,
      showDialogWord: false,
      dialogImportVisible: false,
      dataZip: {},
      formLabelWidth: '120px',
      tableData: [],
      enterData: [],
      importData: [],
      exportMultipIds: [],
      importMultipIds: [],
      txtfileName: '',
      zipfileName: '',
      regulationName: '',
      enterName: '',
      exportEntryMultipIds: [],
      typeOptions: [{
        value: 'accident',
        label: '应急响应'
      }, {
        value: 'fault',
        label: '故障规程'
      }, {
        value: 'alarm',
        label: '报警规程'
      }],
      regulationTypes: ''
    }
  },
  // components: {},
  // beforeCreate() {
  //     console.log('beforeCreate')
  // },
  // mounted() {},
  created() {
    this.renderList()
    this.renderEnterList()
  },
  methods: {
      // 李康
      handleClose() {
          axios.post('/regulations/newRegulationDoc?regulationType='+this.regulationType+'&regulaName='+this.regulaName+'('+this.regulaName1+')'+'&edition='+this.edition+'&fileCode='+this.fileCode, {//发送请求 跳转页面
          }).then((response) => {
              // console.log("3、返回的值",response.data.state)
              if(response.data.state==1){
                  this.isTip=true;
                  this.creatWord=true;
              }else{
                  this.creatWord=false;
                  this.renderList()
                  console.log(1110,response);
                  switch (response.data.data.regulationType) {
                      case 'accident':
                      case 'fault':
                          sessionStorage.setItem('fileNum', response.data.data.fileNum)
                          sessionStorage.setItem('isShow', true)
                          sessionStorage.setItem('name', response.data.data.regulationName)
                          this.$router.push({name: 'Fault', params: {fileNum: response.data.data.fileNum, name: response.data.data.regulationName}})
                          break
                      case 'alarm':
                          sessionStorage.setItem('fileNum', response.data.data.fileNum)
                          sessionStorage.setItem('isShow', true)
                          sessionStorage.setItem('name', response.data.data.regulationName)
                          this.$router.push({name: 'Alarmcard', params: {fileNum: response.data.data.fileNum, name: response.data.data.regulationName}})
                          break
                      default:
                          break
                  }
              }
          }).catch((response) => {
              // console.log("3、错误"+response)
          })
      },
    //加载
    openFullScreen() {
      const loading = this.$loading({
        lock: true,
        text: '正在解析文档..',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return loading;
    },
    closeFullScreen(loading){
      loading.close();
    },
    //上传word文档部分
    beforeWordFileUpload: function (file) {
      this.wordFile.push(file)
    },
    handleWordFileSuccess: function (res, file) {
      let that = this;
      let row = res.data;
      that.closeFullScreen(that.openFullScreen());
      if (res.state == 0) {
        switch (row.regulationType) {
          case 'accident':
          case 'fault':
            sessionStorage.setItem('fileNum', row.fileNum)
            sessionStorage.setItem('isShow', true)
            sessionStorage.setItem('name', row.regulationName)
            this.$router.push({name: 'Fault', params: {fileNum: row.fileNum, name: row.regulationName}})
            break
          case 'alarm':
            sessionStorage.setItem('fileNum', row.fileNum)
            sessionStorage.setItem('isShow', true)
            sessionStorage.setItem('name', row.regulationName)
            this.$router.push({name: 'Alarmcard', params: {fileNum: row.fileNum, name: row.regulationName}})
            break
          default:
            break
        }
      } else if(res.state == 1) {
        if(res.message == 'word_repeat') {
          this.$confirm('该文件已存在,是否覆盖规程word文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'warning'
          }).then(() => {
            axios({
              url: '/regulations/confirmWordFileRepeat',
              method: 'post',
              data: qs.stringify({
                fileNum: res.data.fileNum,
                regulationName: res.data.regulationName,
                confirm: 'y'
              })
            }).then(function (res) {
              that.$message.success("覆盖规程word文件成功！");
              that.$refs.uploadWord.clearFiles();
              that.wordFile = []
              switch (row.regulationType) {
                case 'accident':
                case 'fault':
                  sessionStorage.setItem('fileNum', res.data.data.fileNum)
                  sessionStorage.setItem('isShow', true)
                  sessionStorage.setItem('name', res.data.data.regulationName)
                  that.$router.push({name: 'Fault', params: {fileNum: res.data.data.fileNum, name: res.data.data.regulationName}})
                  break
                case 'alarm':
                  sessionStorage.setItem('fileNum', res.data.data.fileNum)
                  sessionStorage.setItem('isShow', true)
                  sessionStorage.setItem('name', res.data.data.regulationName)
                  that.$router.push({name: 'Alarmcard', params: {fileNum: res.data.data.fileNum, name: res.data.data.regulationName}})
                  break
                default:
                  break
              }
            })
            .catch(function (error) {
              console.log(error);
            });
          }).catch(() => {
            axios({
              url: '/regulations/confirmWordFileRepeat',
              method: 'post',
              data: qs.stringify({
                fileNum: res.data.fileNum,
                regulationName: res.data.regulationName,
                confirm: 'n'
              })
            }).then(function (res) {
              that.$refs.uploadWord.clearFiles();
              that.wordFile = []
            })
            .catch(function (error) {
              console.log(error);
            });
          });
        } else {
          that.$message.error("上传的word文档类型不正确或现在还不支持此种规程类型！");
          that.$refs.uploadWord.clearFiles();
          that.wordFile = [];
        }
      }
    },
    submitUploadWord() {
      this.$refs.uploadWord.submit();
      if (this.wordFile.length < 1) {
        this.$message.error("请选择文件！");
        return
      }
      this.fileUploadWord = false;
      this.openFullScreen();  //加载
    },
    handleWordRemove(file, wordFile) {
      this.wordFile = [];
    },
    //导入压缩文件部分
    beforeZipFileUpload: function (file) {
      this.zipFile = [];
      this.zipFile.push(file)
      if (file.name.length != 21 || !(/.+\.zip/.test(file.name)) ) {
        // this.$message.error('请上传正确的压缩文件!');
        // this.$refs.uploadZip.clearFiles();
        // this.zipFile = [];
        return false;
      }
      this.fileUploadZip = false;
      this.openFullScreen();  //加载
    },
    handleZipFileError: function (err, file) {
      // alert("文件上传走丢了。。");
    },
    handleZipFileSuccess: function (res, file) {
      // this.$message.success("上传文件成功！");
      this.closeFullScreen(this.openFullScreen());
      this.dialogImportVisible = true;
      this.$refs.uploadZip.clearFiles();
      this.importPageData.count = file.response.data.count;
      this.txtfileName = file.response.data.txtfileName;
      this.zipfileName = file.response.data.zipfileName;
      let list = file.response.data.regulations;
      this.importData = this.getRegulationType(list);
    },
    submitUploadZip() {
      this.$refs.uploadZip.submit();
      if (this.zipFile.length < 1) {
        this.$message.error("请选择文件！");
        return
      }
    },
    handleZipBeforeRemove(file, zipFile) {
      if (file.name.length != 21 || !(/.+\.zip/.test(file.name)) ) {
        return this.$confirm('数据文件格式错误,请重新上传!');
      }
    },
    handleZipRemove(file, zipFile) {
      this.zipFile = [];
    },
    handleExceed() {  //文件超出个数限制
      this.$message.error('只可以上传一个文件!');
    },
    handlePreview(file) {
      console.log(file);
    },
    //选中记录导入
    selectedDataImport() {
      if (this.importMultipIds.length < 1) {
        this.$message.error("请选择导入的数据！");
        return false;
      }
      let params = {};
      params.txtfileName = this.txtfileName;
      params.zipfileName = this.zipfileName;
      params.ids = this.importMultipIds.join();
      this.selectedImport(params)
    },
    //所有记录导入
    allSelectedDataImport() {
      let params = {};
      params.txtfileName = this.txtfileName;
      params.zipfileName = this.zipfileName;
      this.selectedImport(params)
    },
    //修改规程文件
    handleUpdate(row) {
      switch (row.regulationType) {
        case '应急响应':
        case '故障规程':
          sessionStorage.setItem('fileNum', row.dirName)
          sessionStorage.setItem('isShow', true)
          sessionStorage.setItem('name', row.name)
          this.$router.push({name: 'Fault', params: {fileNum: row.dirName, name: row.name}})
          break
        case '报警规程':
          sessionStorage.setItem('fileNum', row.dirName)
          sessionStorage.setItem('isShow', true)
          sessionStorage.setItem('name', row.name)
          this.$router.push({name: 'Alarmcard', params: {fileNum: row.dirName, name: row.name}})
          break
        default:
          break
      }
    },
    //修改规程归属
    editBelong(row) {
      this.dialogEditBelong = true;
      this.belongName = row.name;
      this.belongValue = row.fileType;
      this.fileNum = row.dirName;
    },
    //保存 归属
    saveBelongFileType() {
      let that = this;
      let fileType = '';
      switch (this.belongValue) {
        case '1#堆':
          fileType = '1'
          break
        case '2#堆':
          fileType = '2'
          break
        case '常规':
          fileType = '3'
          break
        default:
          break
      }

      this.$request({
        url: '/regulations/updateRegulationFileType',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          fileType: fileType
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.dialogEditBelong = false;
          that.$message.success("修改成功！");
          that.renderList()
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //规程文件预览
    handleFilePreview(row) {
      // let routeUrl = this.$router.resolve({
      //   path: "/fault",
      //   query: {fileNum: row.dirName, name: row.name}
      // });
      // window.open(routeUrl.href, '_blank');
      switch (row.regulationType) {
        case '应急响应':
        case '故障规程':
          sessionStorage.setItem('fileNum', row.dirName)
          sessionStorage.setItem('isShow', false)
          sessionStorage.setItem('name', row.name)
          this.$router.push({name: 'Fault', params: {fileNum: row.dirName, name: row.name}})
          break
        case '报警规程':
          sessionStorage.setItem('fileNum', row.dirName)
          sessionStorage.setItem('isShow', false)
          sessionStorage.setItem('name', row.name)
          this.$router.push({name: 'Alarmcard', params: {fileNum: row.dirName, name: row.name}})
          break
        default:
          break
      }
    },
    reorderRegulation(row) {
      let that = this;
      this.unicode = row.unicode;
      this.showDialogOrder = true;
      this.orderCurrentName = row.description;
      this.$request({
        url: '/regulations/getEntryConditionRelatedRegulationByUnicode',
        method: 'post',
        data: {
          unicode: this.unicode
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.orderData = res.data;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    getOrderIndex(val, index) {
      this.orderIndex = index;
    },
    downOrder() {
      let arr = this.orderData;
      let index = this.orderIndex;
      if(this.orderIndex < arr.length-1) {
        [arr[index], arr[index+1]] = [arr[index+1], arr[index]];
        this.orderIndex ++;
        this.$forceUpdate()
      }
    },
    upOrder() {
      let arr = this.orderData;
      let index = this.orderIndex;
      if(this.orderIndex > 0) {
        [arr[index], arr[index-1]] = [arr[index-1], arr[index]];
        this.orderIndex --;
        this.$forceUpdate()
      }
    },
    saveEnterOrder() {
      let that = this;
      let orderList = [];
      this.orderData.forEach(item => {
        orderList.push(item.fileNum)
      });
      orderList = orderList.join(',')
      this.$request({
        url: '/regulations/adjustRegulationPriorityByUnicode',
        method: 'post',
        data: {
          unicode: this.unicode,
          relatedRegulationList: orderList
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.$message.success("修改规程优先级成功！");
          that.showDialogOrder = false;
          that.renderEnterList()
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //删除数据
    handleDelete(row) {
      let that = this;
      this.$confirm('确认删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: false,
        center: true,
        type: 'warning'
      }).then(() => {
        axios({
          url: '/regulations/regulations',
          method: 'delete',
          params: {
            id: row.id
          }
        }).then(function (res) {
          that.$message.success("删除数据成功！");
          that.renderList()
        })
        .catch(function (error) {
          console.log(error);
        });
      }).catch(() => {
                 
      });
    },
    //导出数据文件
    exportDialogZip(row) {
      this.showDialogZip = true;
      this.dataZip = row;
    },
    handleExportZip(dataZip) {
      this.exportZip({ids: dataZip.id})
      this.showDialogZip = false;
    },
    //导出word文档
    exportDialogWord(row) {
      this.showDialogWord = true;
      this.dataZip = row;
    },
    handleExportWord(dataZip) {
      var that = this;
      this.openFullScreen();  //加载
      axios({
        url: '/regulations/downloadword',
        method: 'post',
        responseType: 'blob',
        data: qs.stringify({id: dataZip.id})
      }).then(function (res) {
        console.log('res',res);
        let blob = new Blob([res.data], {type: 'application/zip;charset=utf-8'});
        let contentDisposition = res.headers['content-disposition'];
        let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        let result = patt.exec(contentDisposition);
        let filename = decodeURI(result[1]);

        if(window.navigator.msSaveBlob){
          window.navigator.msSaveBlob(blob,filename.replace(/^\"|\"$/g,''));
        }else{
          let downloadElement = document.createElement('a');
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.style.display = 'none';
          downloadElement.href = href;
          downloadElement.download =filename.replace(/^\"|\"$/g,'') ; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        }
        that.closeFullScreen(that.openFullScreen());
      })
      .catch(function (error) {
        console.log(error);
        that.closeFullScreen(that.openFullScreen());
      });
      this.showDialogWord = false;
    },
    //当前选中记录导出
    selectedDataExport() {
      let that = this;
      let ids = that.exportMultipIds.join();
      this.$confirm('确认导出当前页的选中记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: false,
        center: true,
        type: 'warning'
      }).then(() => {
        if (ids.length < 1) {
          this.$message.error('请选择数据!');
          return false;
        }
        switch (that.documentForm) {
          case 'word':
            that.exportWord({ids: ids})
            break
          case 'zip':
            that.exportZip({ids: ids})
            break
          default:
            break
        }
      }).catch(() => {
                 
      });
    },
    //所有记录导出
    allSelectedDataExport() {
      let that = this;
      let ids = that.exportMultipIds.join();
      this.$confirm('确认导出所有查询结果吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: false,
        center: true,
        type: 'warning'
      }).then(() => {
        let params = {};
        if(that.regulationName) {
          params.name = that.regulationName
        } else {
          delete params['name']
        }
        if(that.regulationTypes) {
          params.regulationType = that.regulationTypes
        } else {
          delete params['regulationType']
        }
        switch (that.documentForm) {
          case 'word':
            that.exportWord(params)
            break
          case 'zip':
            that.exportZip(params)
            break
          default:
            break
        }
      }).catch(() => {
                 
      });
    },      
    // 获取选中导出数据ids
    handleSelectionChange(val) {
      let multipleSelection = val;
      this.exportMultipIds = [];
      multipleSelection.forEach(item => {
        this.exportMultipIds.push(item.id)
      });
    },
    // 获取选中导入数据ids
    handleImportChange(val) {
      let multipleSelection = val;
      this.importMultipIds = [];
      multipleSelection.forEach(item => {
        this.importMultipIds.push(item.id)
      });
    },
    //选中数据导入api
    selectedImport(param) {
      let that = this;
      axios({
        url: '/regulations/dataimport',
        method: 'post',
        data: qs.stringify(param)
      }).then(function (res) {
        that.$alert('<strong>'+ res.data.message +'</strong>', '', {
          dangerouslyUseHTMLString: true,
          center: true,
          confirmButtonText: '确定',
          callback: action => {
            that.dialogImportVisible = false;
            that.renderList()
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //导出多个word文档
    exportWord(param) {
      var that = this;
      that.openFullScreen();  //加载
      axios({
        url: '/regulations/downloadwordzip',
        method: 'post',
        responseType: 'blob',
        data: qs.stringify(param)
      }).then(function (res) {
        console.log('res',res);
        let blob = new Blob([res.data], {type: 'application/zip;charset=utf-8'});
        let contentDisposition = res.headers['content-disposition'];
        let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        let result = patt.exec(contentDisposition);
        let filename = result[1];
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.style.display = 'none';
        downloadElement.href = href;
        downloadElement.download =filename.replace(/^\"|\"$/g,'') ; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
        that.closeFullScreen(that.openFullScreen());
      })
      .catch(function (error) {
        console.log(error);
        that.closeFullScreen(that.openFullScreen());
      });
    },
    //导出压缩文件
    exportZip(param) {
      var that = this;
      that.openFullScreen();  //加载
      axios({
        url: '/regulations/downloadzip',
        method: 'post',
        responseType: 'blob',
        data: qs.stringify(param)
      }).then(function (res) {
        console.log('res',res);
        let blob = new Blob([res.data], {type: 'application/zip;charset=utf-8'});
        let contentDisposition = res.headers['content-disposition'];
        let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        let result = patt.exec(contentDisposition);
        let filename = result[1];
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.style.display = 'none';
        downloadElement.href = href;
        downloadElement.download =filename.replace(/^\"|\"$/g,'') ; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
        that.closeFullScreen(that.openFullScreen());
      })
      .catch(function (error) {
        console.log(error);
        that.closeFullScreen(that.openFullScreen());
      });
    },
    //查询规程列表
    searchRegulations() {
      this.renderList()
    },
    searchEnterCondition() {
      this.renderEnterList()
    },
    renderList() {
      let search = {
        pageNo: this.pageData.pageNo || 1,
        pageCount: 10
      };
      if(this.regulationName) {
        search.name = this.regulationName
      } else {
        delete search['name']
      }
      if(this.regulationTypes) {
        search.regulationType = this.regulationTypes
      } else {
        delete search['regulationType']
      }

      this.$request({
        url: '/regulations/regulationsPage',
        method: 'get',
        data: search
      }).then((res) => {  //pageData
        let result = res.data.regulations.list;
        this.pageData.count = res.data.regulations.count;   //总记录数
        this.pageData.pageNo = res.data.regulations.pageNo;   //当前页码
        // this.pageData.pageSize = res.data.regulations.pageSize; //总页数
        // this.pageData.pageCount = res.data.regulations.pageCount;//每页的数据条数
        this.tableData = this.getRegulationType(result);
      }).catch((error) => {
        console.log(error)
      })
    },
    //入口条件列表库
    renderEnterList() {
      let search = {
        pageNo: this.entryPageData.pageNo || 1,
        pageCount: 10
      };
      if(this.enterName) {
        search.name = this.enterName
      } else {
        delete search['name']
      }

      this.$request({
        url: '/regulations/enterConditionPage',
        method: 'get',
        data: search
      }).then((res) => {  //entryPageData
        let result = res.data.enterConditionList.list;
        this.entryPageData.count = res.data.enterConditionList.count;   //总记录数
        this.entryPageData.pageNo = res.data.enterConditionList.pageNo;   //当前页码
        // this.entryPageData.pageSize = res.data.enterConditionList.pageSize; //总页数
        // this.entryPageData.pageCount = res.data.enterConditionList.pageCount;//每页的数据条数
        this.enterData = result;
      }).catch((error) => {
        console.log(error)
      })
    },
    //导入入口条件
    beforeEntryFileUpload: function (file) {
      this.EntryFile = [];
      this.EntryFile.push(file)
      if (!(/.+\.ec/.test(file.name)) ) {
        // this.$message.error('请上传正确的压缩文件!');
        // this.$refs.uploadZip.clearFiles();
        // this.zipFile = [];
        return false;
      }
      this.fileUploadEntry = false;
      this.openFullScreen();  //加载
    },
    handleEntryFileSuccess: function (res, file) {
      this.closeFullScreen(this.openFullScreen());
      if(res && res.state == 0) {
        this.$message.success("导入入口条件成功！");
        this.renderEnterList()
      }
    },
    submitUploadEntry() {
      this.$refs.uploadEntry.submit();
      if (this.EntryFile.length < 1) {
        this.$message.error("请选择文件！");
        return
      }
    },
    handleEntryBeforeRemove(file, zipFile) {
      if (!(/.+\.ec/.test(file.name)) ) {
        return this.$confirm('数据文件格式错误,请重新上传!');
      }
    },
    handleEntryRemove(file, zipFile) {
      this.EntryFile = [];
    },
    //入口条件导出当前
    selectedEntryExport() {
      let that = this;
      let unicodes = that.exportEntryMultipIds.join(',');
      this.$confirm('确认导出当前页的选中记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: false,
        center: true,
        type: 'warning'
      }).then(() => {
        if (that.exportEntryMultipIds.length < 1) {
          this.$message.error('请选择数据!');
          return false;
        }
        that.exportEntryConditionData({unicodes: unicodes})
      }).catch(() => {
                 
      });
    },  
    //入口条件导出所有
    allSelectedEntryExport() {
      let that = this;
      this.$confirm('确认导出所有查询结果吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: false,
        center: true,
        type: 'warning'
      }).then(() => {
        that.exportEntryConditionData({name: that.enterName})
      }).catch(() => {
                 
      });
    },
    exportEntryConditionData(param) {
      let that = this;
      that.openFullScreen();  //加载
      axios({
        url: '/regulations/exportEntryConditionData',
        method: 'post',
        responseType: 'blob',
        data: qs.stringify(param)
      }).then(function (res) {
        let blob = new Blob([res.data], {type: 'application/zip;charset=utf-8'});
        let contentDisposition = res.headers['content-disposition'];
        let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        let result = patt.exec(contentDisposition);
        let filename = result[1];
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.style.display = 'none';
        downloadElement.href = href;
        downloadElement.download =filename.replace(/^\"|\"$/g,'') ; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
        that.closeFullScreen(that.openFullScreen());
      })
      .catch(function (error) {
        console.log(error);
        that.closeFullScreen(that.openFullScreen());
      });
    },
    entrySelectionChange(val) {
      this.exportEntryMultipIds = [];
      val.forEach(item => {
        this.exportEntryMultipIds.push(item.unicode)
      });
    },
    handleCurrentChange(curPage) {
      // console.log(curPage);
      this.pageData.pageNo = curPage
      this.renderList()
    },
    handleEntryChange(curPage) {
      this.entryPageData.pageNo = curPage
      this.renderEnterList()
    },
    getRegulationType(listData) {
      listData.forEach(item => {
        switch (item.regulationType) {
          case 'fault':
            item.regulationType = '故障规程'
            break
          case 'accident':
            item.regulationType = '应急响应'
            break
          case 'alarm':
            item.regulationType = '报警规程'
            break
          default:
            break
        }
        switch (item.fileType) {
          case 1:
            item.fileType = '1#堆'
            break
          case 2:
            item.fileType = '2#堆'
            break
          case 3:
            item.fileType = '常规'
            break
          default:
            break
        }
      });
      return listData;
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
div {
  line-height: 0;
}

div {
  .keyword {
    display: flex;
    width: 50%;
    border: 1px solid #ccc;
    background: #FAFAFA;
    height: 80px;
    margin: 0 auto;
    .demo-input-suffix {
      float: left;
      text-align: left;
      height: 32px;
      overflow: hidden;
      span {
        display: inline-block;
        width: 85px;
      }
      .ele-input {
        width: 200px;
      }
    }
  }
  .content {
    text-align: left;
    margin-top: 30px;    
  }
  .item{margin: 20px 0;}
  a {
    font-size: 50px;
    color: red;
    cursor: pointer;
    text-decoration: none;
  }
}
</style>
<style>
  .el-table thead {
    color: #000000;
  }
  .el-table{
    color:#000000 ;
  }
  .has-gutter tr .cell{
    font-weight: bolder!important;
  }
  .has-gutter tr th{
    background-color: #FAFAFA!important;
  }
  .inflist .el-input{ width: 40%;}

  .table{line-height: 40px;margin: 0 auto; border: none;outline: none;}
  .table td:first-child{text-align: right;}
</style>