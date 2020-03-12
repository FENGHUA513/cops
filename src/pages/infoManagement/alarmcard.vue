 <template>
  <div class="content" ref="container" @mousemove="move($event)" @mouseup="up($event)">
    <div class="header">
      <img src="@/assets/back.png" alt="" style="cursor: pointer;" @click="backInfo">
      <span>{{headerName}}</span>
    </div>
    <div class="main">
      <!-- 规程树形结构部分 -->
      <div class="left-content" v-if="onlyPreview"  :style="{'right': offsetRight +'px','width':allWidth-offsetRight-10 +'px' }">
        <div class="hFourBoxer">
          <h4>报警点</h4>
          <i class="el-icon-plus" @click="addAlarmCard = true" style="cursor: pointer;float: right;font-size: 20px;color:green;font-weight: 700;"></i>
        </div>
        <ul class="treebox">
          <li v-for="(lis,index) in treeStructure" class="treelist">
            <span class="circle"  :class=" GetChinese(lis.level)=='白' ? 'whiteBac' : (GetChinese(lis.level)=='黄' ? 'yellowBac' : (GetChinese(lis.level)=='红' ? 'redBac' : 'whiteBac'))">{{GetChinese(lis.level)+'灯'}}</span>
            <div class="titlebox">
              <span class="lefttitle" @contextmenu.prevent="rightClick($event,lis.rd_id,index);addClass1(index,lis)" v-html="lis.title" v-on:click="addClass1(index,lis)" v-bind:class="{ classred:index==current}" :rd_id="lis.rd_id"></span>
              <span class="hengx" v-bind:class="{ classred1:index==current}"></span>
              <span class="cftj"  v-on:click="addClass1(index,lis)" v-bind:class="{ classred:  index==current  ,classred3 :lis.hasLogicContent==true}" @scroll.passive="getScroll($event)" :rd_id="lis.rd_id">触发条件</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="right-content" ref="container1" @mousemove="move1($event)" @mouseup="up1($event)" :style="{'margin': !onlyPreview ? '0 auto' : 'none', 'float': !onlyPreview ? 'none' : 'right','width': offsetRight-10 +'px'}">
        <!-- 规程文档预览部分 李康start-->
        <!--rightHeight*0.42-->
        <div class="preview" id="previewpart" ref="filePreview" :style="{'height': !onlyPreview ? (rightHeight + 'px') : ( offsetRight1 + 'px')}">
          <div ref="handle" id="handle" @mousedown = down($event)></div>
          <!--:style="{'height': !onlyPreview ? (rightHeight*0.04 + 'px') : (rightHeight*0.032 + 'px')}"-->
          <h4>规程内容<span v-show="still">{{msg}}</span></h4>
          <div class="fj-boxer" :style="{'height': !onlyPreview ? (rightHeight*0.96 + 'px') :(offsetRight1*0.88 + 'px') }" ref="reBack" @scroll.passive="getScroll($event)">
            <div class="all-part">
              <ul  style="position: relative;" >
                <li style="overflow: hidden;"  v-for="(lis,index) in previews1" v-if="lis.order==1">
                  <div class="left-box">
                    <div v-html="lis.content[0]" class="big-title"></div>
                    <div class="xx-line"></div>
                    <div class="crossing"></div>
                  </div>
                  <div class="right-box">
                    <img src="../../assets/hn-logo.png" class="hn-logo" alt="">
                  </div>
                </li>
                <li class="order2" v-else-if="lis.order==2">
                  <div class="company"><img src="../../assets/company.png" alt=""></div>
                </li>
                <!--修改规程名和文件编号 order3 和 order4-->
                <li class="order3" v-else-if="lis.order==3">
                  <span id="gcname" class="gcname" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                    <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,1)">
                      <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                    </span>
                    <span style="display: inline-block;" :modeltype="lis.order" v-html="lis.content[0]"></span>
                   </span>
                </li>
                <li class="order4" v-else-if="lis.order==4">
                  <span id="gccode" class="gcname" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                    <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,1)">
                      <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                    </span>
                    <span style="display: inline-block;" :modeltype="lis.order" v-html="lis.content[0]"></span>
                   </span>
                </li>
                <!--修改使用级别和文件级别 order5-->
                <li class="order5" v-else-if="lis.order==5">
                  <div class="level" id="gclevel" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                    <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,2)">
                      <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                    </span>
                      <div class="scale" style="border-right:1px dotted #000;"><div>文 件 级 别</div><div v-html="previewType[0]"></div></div>
                    <div class="scale"><div>使 用 级 别</div><div v-html="previewType[1]"></div></div>
                  </div>
                </li>
                <!--修改编审人员信息 order6 show3抓门的图片  show4是人员和日期的修改-->
                <li  class="order6" v-else-if="lis.order==6">
                  <div class="tableo">
                    <div class="r1">标准</div>
                    <div class="r2" id="bz1" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                       <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,4)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <div class="namedate" v-html="lis.content[0]"></div>
                    </div>
                    <div class="r3" id="bz2" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,3)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <div class="namedate" v-html="lis.content[1]"></div>
                    </div>
                    <div class="r4" id="bz3" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,4)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <div class="namedate" v-html="lis.content[2]"></div>
                    </div>
                  </div>
                </li>
                <li  class="order6" v-else-if="lis.order==7">
                  <div class="tableo">
                    <div class="r1">审核</div>
                    <div class="r2" id="sh1" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,4)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <div class="namedate" v-html="lis.content[0]"></div>
                    </div>
                    <div class="r3" id="sh2" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,3)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <span class="namedate" v-html="lis.content[1]"></span>
                    </div>
                    <div class="r4" id="sh3" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,4)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <span class="namedate" v-html="lis.content[2]"></span>
                    </div>
                  </div>
                </li>
                <li  class="order6" v-else-if="lis.order==8">
                  <div class="tableo">
                    <div class="r1">校对</div>
                    <div class="r2" id="jd1" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,4)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <span class="namedate" v-html="lis.content[0]"></span>
                    </div>
                    <div class="r3" id="jd2" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,3)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <span class="namedate" v-html="lis.content[1]"></span>
                    </div>
                    <div class="r4" id="jd3" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,4)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <span class="namedate" v-html="lis.content[2]"></span>
                    </div>
                  </div>
                </li>
                <li  class="order7" v-else-if="lis.order==9">
                  <div class="tableo">
                    <div class="r1 rr">编写</div>
                    <div class="r2 rr" id="bx1" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,4)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <span class="namedate" v-html="lis.content[0]"></span>
                    </div>
                    <div class="r3 rr" id="bx2" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,3)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮">
                       </span>
                      <span class="namedate" v-html="lis.content[1]"></span>
                    </div>
                    <div class="r4 rr" id="bx3" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                      <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,4)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                      <span class="namedate" v-html="lis.content[2]"></span>
                    </div>
                  </div>
                </li>
                <li  class="order8" v-else-if="lis.order==10">
                  <div class="banci" v-html="lis.content"></div>
                </li>
              </ul>
              <!--3条横线-->
              <div>
                <div class="hline hline1"></div>
                <div class="hline hline2"></div>
                <div class="hline hline3"></div>
                <div class="chanq">本文件产权属华能山东石岛湾核电有限公司所有，未经书面许可，不得以任何方式复制、泄露。</div>
              </div>
              <!--修改说明   对应show-->
              <div class="xgsm">
                <div class="sm-title">修改说明</div>
                <div class="smcl" @mouseover="mouseOver($event)" id="aaa" @mouseleave="mouseLeave($event)">
                  <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,5)">
                     <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                  </span>
                  <table class="tablesm" cellspacing="0" cellpadding="0" width="100%" >
                  <tr>
                    <th width="9.5%" align="center">版本</th>
                    <th width="17.5%" align="center">实施日期</th>
                    <th width="17.5%" align="center">章节号</th>
                    <th width="55.5%" align="center">修改内容及依据</th>
                  </tr>
                  <tbody class="smbody">
                  <tr>
                    <td v-for="item in previews2" v-html="item" class="smpanel1"></td>
                  </tr>
                  </tbody>
                </table>
                </div>
              </div>
              <!--目的和征兆和进入条件部分-->
              <div class="word-box">
                <div class="le-title">1  报警卡清单</div>
                <div id="tj1"  style="width: 100%;overflow: hidden;"  class="respective1 yyle">
                  <table border="1" style="width: 100%;text-align: center;line-height: 40px;height: 40px;">
                  <tr style="border-collapse: inherit;font-weight: bolder;">
                    <th align="center">序号</th>
                    <th align="center">报警点名</th>
                    <th align="center">报警描述</th>
                    <th align="center">等级</th>
                    <th align="center">页码</th>
                  </tr>
                  <tbody>
                  <tr v-for="(lis,index) in previews3" style="line-height: 40px;height: 40px;">
                    <td v-for="(list,index) in lis.content" v-html="list" class="fuj-lie"></td>
                  </tr>
                  </tbody>
                </table>
                </div>
                <!--报警卡清单完事-->
                <div class="le-title" :id="previewid">2. 参考文件</div>
                <div class="aim" id="tj3" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                   <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,6)">
                     <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                  </span>
                  <div class="aimbox" v-html="previews4"></div>
                </div>
                <!--缩略语与术语说明部分-->
                <div class="le-title">{{previewsx.title}}</div>
                <div class="aim" id="tj4" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                   <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,6)">
                     <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                  </span>
                  <div class="aimbox" v-for="li in previewsx.content">
                    <span v-for="lk in li.content" v-html="lk"></span>
                  </div>
                </div>
                <!--报警卡部分，渲染-->
                <div class="le-title">{{fujian.title}}</div>
              <!--第一次的时候是全面的数据，经过自己的处理就会变化-->
                <div class="cardtable" v-for="(lis,index) in fujian.content" :rd_id="lis.table_id" :id="lis.anchor_point"  @mouseover="mouseOverx($event)" @mouseleave="mouseLeavex($event)">
                  <div class="allbox">
                    <!--:form_id="list.rd_id" :table_id="plmm.table_id"-->
                    <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,7)"  class="editiconbox1">
                  <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮">
                  </span>
                    <!--:form_id="list.rd_id" :table_id="plmm.table_id"-->
                    <!--<span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,88)"  class="deletebox">-->
                  <!--<img src="@/assets/delete.png" class="editicon" alt="编辑文字按钮">-->
                  <!--</span>-->
                  </div>
                  <table width="100%" border="1" :table_id="lis.table_id" :contentType="lis.contentType" v-if="lis.content[1].content.length==6" :asd="1">
                    <!--{{lis.content}}-->
                    <tbody>
                    <!--第一种情况-->
                    <tr  style="height: 40px;" v-for="(infoArr,index) in lis.content">
                      <td v-for="(lk,index) in infoArr.content" :colspan="mesh(infoArr.content.length,index)" :rowNum="infoArr.order" :rowspan="mesh1(infoArr.content.length,index,infoArr.order)" v-if="isSee(infoArr.content.length,index,infoArr.order)">
                        <div v-html="lk"></div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <!--第二种情况-->
                  <table width="100%" border="1" :table_id="lis.table_id" :contentType="lis.contentType" v-else-if="lis.content[1].content.length!=6" :asd="2">
                    <tbody>
                    <!--第一种情况-->
                    <tr  style="height: 40px;" v-for="(infoArr,index) in lis.content">
                      <!--:colspan="mesh(infoArr.content.length,index)" :rowNum="infoArr.order" :rowspan="mesh1(infoArr.content.length,index,infoArr.order)" v-if="isSee(infoArr.content.length,index,infoArr.order)"-->
                      <td v-for="(lk,index) in infoArr.content" :rowspan="normalDataRow(infoArr.order,index)" :colspan="normalDataColumn(infoArr.order,index)">
                        <!--normalDataRow:正常数据行   normalDataColumn:正常数据列-->
                        <!--:hangxushu="infoArr.order" :liexushu="index"-->
                        <!--colspan 合并列    rowspan:合并行-->
                        <!--列数--6《infoArr.content.length》，    index(列序数)--,0→5《index》，         行序数--，1→11《infoArr.order》-->
                        <div v-html="lk"></div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div  class="youji-lay1" v-show="youjiLay1">
            <!--show1专门对应 修改规程名和文件编号-->
            <div class="sr-box" v-if="show1">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj">
                  <textarea class="area-box" placeholder="随手记事" v-model="substance" ></textarea>
                <!--富文本编辑器-->
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(1)">取消</button>
                <button class="conserve" @click="saveHtml($event,1)">保存</button>
              </div>
            </div>
            <!--show2专门对应 文件级别和使用级别-->
            <div class="sr-box" v-if="show2">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="level1">
                <div class="scale1" style="border-right:1px solid #000;"><div>文 件 级 别</div><div class="character" ref="grade1" contenteditable="true" v-html="previewType[0]"></div></div>
                <div class="scale1"><div>使 用 级 别</div><div class="character" contenteditable="true" ref="grade2" v-html="previewType[1]"></div></div>
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(2)">取消</button>
                <button class="conserve" @click="saveHtml($event,2)">保存</button>
              </div>
            </div>

            <!--show3专门对应 图片-->
            <div class="sr-box"  v-if="show3">
              <div class="over-title">上传图片</div>
              <div class="upload_img">
                 <el-upload action='' :on-exceed="handleExceed" list-type="picture-card"  ref="upload_img"  class="avatar-uploader" accept="image/jpeg,image/jpg,image/png" :on-change="getFile" :limit="1"
                             :auto-upload="false">
                   <i class="el-icon-plus"></i>
                   <div slot="tip" class="el-upload__tip">只能上传jpeg、jpg、png 格式的图片，图片大小在2M以内。</div>
                 </el-upload>
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(3)">取消</button>
                <button class="conserve" @click="saveHtml($event,3)">保存</button>
              </div>
            </div>
<!--对应编辑人员名字和日期的弹框-->
            <div class="sr-box" v-if="show4">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj2">
                  <div class="area-box" contenteditable="true" ref="tempcon" v-html="substance" ></div>
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(4)">取消</button>
                <button class="conserve" @click="saveHtml($event,4)">保存</button>
              </div>
            </div>
<!--对应修改说明部分-->
            <div class="sr-box" v-if="show5">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj">
                <table class="tablesm1" cellspacing="0" cellpadding="0" width="80%" >
                  <tr>
                    <th width="9.5%" align="center">版本</th>
                    <th width="17.5%" align="center">实施日期</th>
                    <th width="17.5%" align="center">章节号</th>
                    <th width="55.5%" align="center">修改内容及依据</th>
                  </tr>
                  <tbody class="smbody">
                  <tr ref="smover">
                    <td class="smpanel"  v-for="(item,index1) in obj">
                      <div v-html="item"  :also="index1" ></div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(5)">取消</button>
                <button class="conserve" @click="saveHtml($event,5)">保存</button>
              </div>
            </div>
            <!--对应目的和征兆进入条件的修改-->
            <div class="sr-box" v-if="show6">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj">
                <!--富文本编辑器-->
                <div class="core">
                  <tinymce-editor v-model="substance"
                                  :disabled="disabled"
                                  @onClick="onClick"
                                  ref="editor"></tinymce-editor>
                </div>
                <!--富文本编辑器-->
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(6)">取消</button>
                <button class="conserve" @click="saveHtml($event,6)">保存</button>
              </div>
            </div>
            <!--对应报警卡的修改-->
            <div class="sr-box" v-if="show7">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj">
                <!--富文本编辑器-->
                <div class="core">
                  <tinymce-editor v-model="substance"
                                  :disabled="disabled"
                                  @onClick="onClick"
                                  ref="editor"></tinymce-editor>
                </div>
                <!--富文本编辑器-->
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(7)">取消</button>
                <button class="conserve" @click="saveHtml($event,7)">保存</button>
              </div>
            </div>
            <!--对应 步骤和附件中的警告和注意的修改-->
            <!--<div class="sr-box" v-if="show8">-->
              <!--<div class="over-title">编辑内容:文字内容</div>-->
              <!--<div class="sccstj">-->
                <!--&lt;!&ndash;富文本编辑器&ndash;&gt;-->
                <!--<tinymce-editor v-model="substance"-->
                                <!--:disabled="disabled"-->
                                <!--@onClick="onClick"-->
                                <!--ref="editor"></tinymce-editor>-->
                <!--&lt;!&ndash;富文本编辑器&ndash;&gt;-->
              <!--</div>-->
              <!--<div class="btn-box">-->
                <!--<button class="abolish"  @click="hideLay(8)">取消</button>-->
                <!--<button class="conserve" @click="saveHtml($event,8)">保存</button>-->
              <!--</div>-->
            <!--</div>-->
            <!--修改文件名称的部分-->
            <!--<div class="sr-box" v-if="show9">-->
              <!--<div class="over-title">编辑内容:文字内容</div>-->
              <!--<div class="sccstj">-->
                <!--<textarea class="area-box" placeholder="随手记事" v-model="substance" ></textarea>-->
                <!--&lt;!&ndash;富文本编辑器&ndash;&gt;-->
              <!--</div>-->
              <!--<div class="btn-box">-->
                <!--<button class="abolish"  @click="hideLay(9)">取消</button>-->
                <!--<button class="conserve" @click="saveHtml($event,9)">保存</button>-->
              <!--</div>-->
            <!--</div>-->
            <!--修改文件名称的部分-->
            <!--<div class="sr-box" v-if="show10">-->
              <!--<div class="over-title">编辑内容:文字内容</div>-->
              <!--<div class="sccstj">-->
                <!--&lt;!&ndash;富文本编辑器&ndash;&gt;-->
                <!--<div class="core">-->
                  <!--<tinymce-editor v-model="newChart"-->
                                  <!--:disabled="disabled"-->
                                  <!--@onClick="onClick"-->
                                  <!--ref="editor"></tinymce-editor>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="btn-box">-->
                <!--<button class="abolish"  @click="hideLay(10)">取消</button>-->
                <!--<button class="conserve" @click="saveHtml($event,10)">保存</button>-->
              <!--</div>-->
            <!--</div>-->
            <!--对应修改的在附件中新增加的普通表格的接口-->
            <!--<div class="sr-box" v-if="show11">-->
              <!--<div class="over-title">编辑内容:文字内容</div>-->
              <!--<div class="sccstj">-->
                <!--&lt;!&ndash;富文本编辑器&ndash;&gt;-->
                <!--<div class="core">-->
                  <!--<tinymce-editor v-model="substance"-->
                                  <!--:disabled="disabled"-->
                                  <!--@onClick="onClick"-->
                                  <!--ref="editor"></tinymce-editor>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="btn-box">-->
                <!--<button class="abolish"  @click="hideLay(11)">取消</button>-->
                <!--<button class="conserve" @click="saveHtml($event,11)">保存</button>-->
              <!--</div>-->
            <!--</div>-->
            <!--删除附件中新添加的普通表格的操作，需要右击。-->
            <!--<div class="del-box" v-if="show88">-->
              <!--<div class="over-title">删除该项</div>-->
              <!--<div class="btn-box" style="margin-top:90px;">-->
                <!--<button class="abolish_de"  @click="hideLay(88)">取消</button>-->
                <!--<button class="conserve_de" @click="saveHtml($event,88)">确认</button>-->
              <!--</div>-->
            <!--</div>-->
          </div>
        </div>
        <!-- 规程文档预览部分 李康end-->
        <!-- 逻辑编辑器部分 -->
        <!--rightHeight*0.57-->
        <div class="logic" :style="{'height':offsetRight2 + 'px','margin-top':rightHeight*0.01 + 'px'}" v-if="onlyPreview">
          <div ref="handle1" id="handle1" @mousedown = down1($event)></div>
          <h4>触发条件</h4>
          <div v-if="currentEndPath" style="height: 30px;line-height: 30px;margin: 0 30px;">
            <span style="font-weight: 700;margin-right:10px;">当前项目</span>
            <span style="font-weight: 700;">{{currentEndPath}}</span>
            <el-button type="success" style="position: absolute;right:30px;margin-top:10px;background:green;" @click="saveLogic">保 存</el-button>
          </div>
          <div v-if="currentEndPath" class="handle_logic">
            <div ref="logic" style="width: 80%;float: left;">
              <div v-for="(logicItem, index) in logicData" :key="index" ref="box"  style="position: relative; margin-bottom: 15px;">
                <div style="position: absolute; top: -14px; left: -12px;">
                  <i class="el-icon-error" style="cursor:pointer;color:red;font-size:18px;" @click="deleteExpress(index);changeLogic()"></i>
                </div>
                <el-row>
                  <el-col :span="20">
                    <div style="border:1px solid #000;border-right: none;" class="box">
                      <!-- 常规型逻辑表达式 -->
                      <div v-if="logicItem.type == 'rule'" class="expression3" style="margin:10px 0;">
                        <div style="margin: auto auto auto 30px;">
                          <!-- 常规表达式  模拟量or数字量 -->
                          <el-select style="width: 85px;" v-model="logicItem.data.value" @change="changeLogic">
                            <el-option
                              v-for="item in numOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <!-- 常规表达式 数字量 -->
                          <el-input v-if="logicItem.data.value == 'digit'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.data.digit.input" @change="changeLogic"></el-input>
                          <span v-if="logicItem.data.value == 'digit'" style="display:inline-block;width: 60px;text-align: center;">==</span>
                          <el-select v-if="logicItem.data.value == 'digit'" style="width: 60px;" v-model="logicItem.data.digit.value" @change="changeLogic">
                            <el-option
                              v-for="item in digitOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                         <!-- 常规表达式 模拟量 -->
                          <el-input v-if="logicItem.data.value == 'analogy'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.data.analogy.input1" @change="changeLogic"></el-input>
                          <el-select v-if="logicItem.data.value == 'analogy'" style="width: 60px;" v-model="logicItem.data.analogy.value" @change="changeLogic">
                            <el-option
                              v-for="item in ruleLogicOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <el-input v-if="logicItem.data.value == 'analogy'" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.data.analogy.input2" @change="changeLogic"></el-input>
                         <!-- 常规表达式 范围量 -->
                          <el-input v-if="logicItem.data.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.data.limits.input1" @change="changeLogic"></el-input>
                          <el-select v-if="logicItem.data.value == 'limits'" style="width: 60px;" v-model="logicItem.data.limits.value1" @change="changeLogic">
                            <el-option
                              v-for="item in ruleLogicOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <el-input v-if="logicItem.data.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.data.limits.kksValue" @change="changeLogic"></el-input>
                          <el-select v-if="logicItem.data.value == 'limits'" style="width: 60px;" v-model="logicItem.data.limits.value2" @change="changeLogic">
                            <el-option
                              v-for="item in ruleLogicOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <el-input v-if="logicItem.data.value == 'limits'" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.data.limits.input2" @change="changeLogic"></el-input>
                        </div>
                      </div>
                      <!-- 条件型逻辑表达式 -->
                      <div v-if="logicItem.type == 'judge'" class="expression3">
                        <div style="margin: 20px auto 10px 30px; width:100%;">
                          <div class="condition" style="position: relative;box-sizing: border-box;border:1px solid #ccc;width: 96%;margin-bottom: 10px;border-radius: 5px;padding:20px 0 0 85px;">
                            <div style="position: absolute;top:-10px;left:50%;margin-left: -50px;background: #fff;">判断条件项<i class="el-icon-plus" style="cursor: pointer;color:green;font-size:16px;font-weight: 700;margin:0 5px;"  @click="addIf(index);changeLogic()"></i></div>
                            <el-select style="width: 95px;position: absolute;top:-12px;left:-20px;" v-model="logicItem.if.value" @change="changeLogic">
                              <el-option
                                v-for="item in ifOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <div v-for="(ifItem, item) in logicItem.if.list" :key="item" style="margin-bottom:10px;">
                              <!-- 条件型逻辑表达式  模拟量or数字量 -->
                              <el-select style="width: 85px;" v-model="ifItem.value" @change="changeLogic">
                                <el-option
                                  v-for="item in termOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <!-- 条件型逻辑表达式 数字量 -->
                              <el-input v-if="ifItem.value == 'digit'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="ifItem.digit.input" @change="changeLogic"></el-input>
                              <span v-if="ifItem.value == 'digit'" style="display:inline-block;width: 60px;text-align: center;">==</span>
                              <el-select v-if="ifItem.value == 'digit'" style="width: 60px;" v-model="ifItem.digit.value" @change="changeLogic">
                                <el-option
                                  v-for="item in digitOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                             <!-- 条件型逻辑表达式 模拟量 -->
                              <el-input v-if="ifItem.value == 'analogy'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="ifItem.analogy.input1" @change="changeLogic"></el-input>
                              <el-select v-if="ifItem.value == 'analogy'" style="width: 60px;" v-model="ifItem.analogy.value" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="ifItem.value == 'analogy'" minlength="1" maxlength="25" style="width: 60px;" v-model="ifItem.analogy.input2" @change="changeLogic"></el-input>
                             <!-- 条件型逻辑表达式 范围量 -->
                              <el-input v-if="ifItem.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 60px;" v-model="ifItem.limits.input1" @change="changeLogic"></el-input>
                              <el-select v-if="ifItem.value == 'limits'" style="width: 60px;" v-model="ifItem.limits.value1" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="ifItem.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="ifItem.limits.kksValue" @change="changeLogic"></el-input>
                              <el-select v-if="ifItem.value == 'limits'" style="width: 60px;" v-model="ifItem.limits.value2" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="ifItem.value == 'limits'" minlength="1" maxlength="25" style="width: 60px;" v-model="ifItem.limits.input2" @change="changeLogic"></el-input>
                              <i class="el-icon-error" style="cursor:pointer;color:red;font-size:18px;" @click="deleteIf(index, item);changeLogic()"></i>
                            </div>
                          </div>
                          <!-- 成立 -->
                          <div class="setup" style="margin-bottom: 10px;">
                            <span style="display:inline-block; width: 85px;">then:</span>
                            <!-- 条件型逻辑表达式 成立  模拟量or数字量 -->
                            <el-select style="width: 85px;" v-model="logicItem.then.value" @change="changeLogic">
                              <el-option
                                v-for="item in numOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <!-- 条件型逻辑表达式 成立 数字量 -->
                            <el-input v-if="logicItem.then.value == 'digit'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.then.digit.input" @change="changeLogic"></el-input>
                            <span v-if="logicItem.then.value == 'digit'" style="display:inline-block;width: 60px;text-align: center;">==</span>
                            <el-select v-if="logicItem.then.value == 'digit'" style="width: 60px;" v-model="logicItem.then.digit.value" @change="changeLogic">
                              <el-option
                                v-for="item in digitOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <!-- 条件型逻辑表达式 成立 模拟量 -->
                            <el-input v-if="logicItem.then.value == 'analogy'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.then.analogy.input1" @change="changeLogic"></el-input>
                            <el-select v-if="logicItem.then.value == 'analogy'" style="width: 60px;" v-model="logicItem.then.analogy.value" @change="changeLogic">
                              <el-option
                                v-for="item in ruleLogicOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-input v-if="logicItem.then.value == 'analogy'" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.then.analogy.input2" @change="changeLogic"></el-input>
                           <!-- 条件型逻辑表达式 成立 范围量 -->
                            <el-input v-if="logicItem.then.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.then.limits.input1" @change="changeLogic"></el-input>
                            <el-select v-if="logicItem.then.value == 'limits'" style="width: 60px;" v-model="logicItem.then.limits.value1" @change="changeLogic">
                              <el-option
                                v-for="item in ruleLogicOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-input v-if="logicItem.then.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.then.limits.kksValue" @change="changeLogic"></el-input>
                            <el-select v-if="logicItem.then.value == 'limits'" style="width: 60px;" v-model="logicItem.then.limits.value2" @change="changeLogic">
                              <el-option
                                v-for="item in ruleLogicOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-input v-if="logicItem.then.value == 'limits'" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.then.limits.input2" @change="changeLogic"></el-input>
                          </div>
                          <!-- 不成立 none -->
                          <div class="insetup">
                            <el-select style="width: 85px;" v-model="logicItem.isestablished" @change="changeLogic">
                              <el-option
                                v-for="item in infoundOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <!-- 条件型逻辑表达式   不成立的 html -->
                            <div v-if="logicItem.isestablished == 'else'" style="display: inline-block;">
                              <!-- 条件型逻辑表达式   不成立的  模拟量or数字量 -->
                              <el-select style="width: 85px;" v-model="logicItem.none.value" @change="changeLogic">
                                <el-option
                                  v-for="item in numOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <!-- 条件型逻辑表达式   不成立的 数字量 -->
                              <el-input v-if="logicItem.none.value == 'digit'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.none.digit.input" @change="changeLogic"></el-input>
                              <span v-if="logicItem.none.value == 'digit'" style="display:inline-block;width: 60px;text-align: center;">==</span>
                              <el-select v-if="logicItem.none.value == 'digit'" style="width: 60px;" v-model="logicItem.none.digit.value" @change="changeLogic">
                                <el-option
                                  v-for="item in digitOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                             <!-- 条件型逻辑表达式   不成立的 模拟量 -->
                              <el-input v-if="logicItem.none.value == 'analogy'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.none.analogy.input1" @change="changeLogic"></el-input>
                              <el-select v-if="logicItem.none.value == 'analogy'" style="width: 60px;" v-model="logicItem.none.analogy.value" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="logicItem.none.value == 'analogy'" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.none.analogy.input2" @change="changeLogic"></el-input>
                             <!-- 条件型逻辑表达式   不成立的 范围量 -->
                              <el-input v-if="logicItem.none.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.none.limits.input1" @change="changeLogic"></el-input>
                              <el-select v-if="logicItem.none.value == 'limits'" style="width: 60px;" v-model="logicItem.none.limits.value1" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="logicItem.none.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.none.limits.kksValue" @change="changeLogic"></el-input>
                              <el-select v-if="logicItem.none.value == 'limits'" style="width: 60px;" v-model="logicItem.none.limits.value2" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="logicItem.none.value == 'limits'" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.none.limits.input2" @change="changeLogic"></el-input>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 多项常规型逻辑表达式 -->
                      <div v-if="logicItem.type == 'multi'" class="expression3">
                        <div style="margin: 20px auto 10px 30px; width:100%;">
                          <div style="position: relative;box-sizing: border-box;border:1px solid #ccc;width: 96%;border-radius: 5px;padding:20px 0 0 85px;">
                            <div style="position: absolute;top:-10px;left:50%;margin-left: -50px;background: #fff;">表达式项<i class="el-icon-plus" style="cursor: pointer;color:green;font-size:16px;font-weight: 700;margin:0 5px;"  @click="addMulti(index);changeLogic()"></i></div>
                            <div style="position: absolute;top:-12px;left:-20px;background: #fff;">
                              <el-select style="width: 100px;" v-model="logicItem.value" @change="changeLogic">
                                <el-option
                                  v-for="item in multiOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <div v-if="logicItem.value == 'getor'" style="display: inline-block;">
                                <span style="font-size: 14px;">取</span>
                                <el-input style="width: 45px;" v-model="logicItem.input" @change="changeLogic"></el-input>
                                <span style="font-size: 14px;">个</span>
                              </div>
                            </div>
                            <div v-for="(multiItem, multi) in logicItem.list" :key="multi" style="margin-bottom:10px;">
                              <!-- 多项常规型逻辑表达式  模拟量or数字量 -->
                              <el-select style="width: 85px;" v-model="multiItem.value" @change="changeLogic">
                                <el-option
                                  v-for="item in numOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <!-- 多项常规型逻辑表达式 数字量 -->
                              <el-input v-if="multiItem.value == 'digit'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="multiItem.digit.input" @change="changeLogic"></el-input>
                              <span v-if="multiItem.value == 'digit'" style="display:inline-block;width: 60px;text-align: center;">==</span>
                              <el-select v-if="multiItem.value == 'digit'" style="width: 60px;" v-model="multiItem.digit.value" @change="changeLogic">
                                <el-option
                                  v-for="item in digitOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <!-- 多项常规型逻辑表达式 模拟量 -->
                              <el-input v-if="multiItem.value == 'analogy'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="multiItem.analogy.input1" @change="changeLogic"></el-input>
                              <el-select v-if="multiItem.value == 'analogy'" style="width: 60px;" v-model="multiItem.analogy.value" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="multiItem.value == 'analogy'" minlength="1" maxlength="25" style="width: 60px;" v-model="multiItem.analogy.input2" @change="changeLogic"></el-input>
                              <!-- 多项常规型逻辑表达式 范围量 -->
                              <el-input v-if="multiItem.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 60px;" v-model="multiItem.limits.input1" @change="changeLogic"></el-input>
                              <el-select v-if="multiItem.value == 'limits'" style="width: 60px;" v-model="multiItem.limits.value1" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="multiItem.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="multiItem.limits.kksValue" @change="changeLogic"></el-input>
                              <el-select v-if="multiItem.value == 'limits'" style="width: 60px;" v-model="multiItem.limits.value2" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="multiItem.value == 'limits'" minlength="1" maxlength="25" style="width: 60px;" v-model="multiItem.limits.input2" @change="changeLogic"></el-input>
                              <i class="el-icon-error" style="cursor:pointer;color:red;font-size:18px;" @click="deleteMulti(index, multi);changeLogic()"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 组合项常规型逻辑表达式 -->
                      <div v-if="logicItem.type == 'compose'" class="expression3">
                        <div style="margin: 20px auto 10px 30px; width:100%;">
                          <div style="position: relative;box-sizing: border-box;border:1px solid #ccc;width: 96%;border-radius: 5px;padding:40px 0 0 25px;">
                            <div style="position: absolute;top:-10px;left:50%;margin-left: -50px;background: #fff;">组合项<i class="el-icon-plus" style="cursor: pointer;color:green;font-size:16px;font-weight: 700;margin:0 5px;"  @click="addCompose(index);changeLogic()"></i></div>
                            <div style="position: absolute;top:-12px;left:-20px;background: #fff;">
                              <el-select style="width: 100px;" v-model="logicItem.value" @change="changeLogic">
                                <el-option
                                  v-for="item in multiOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <div v-if="logicItem.value == 'getor'" style="display: inline-block;">
                                <span style="font-size: 14px;">取</span>
                                <el-input style="width: 45px;" v-model="logicItem.input" @change="changeLogic"></el-input>
                                <span style="font-size: 14px;">个</span>
                              </div>
                            </div>
                            <div v-for="(composeItem, compose) in logicItem.list" :key="compose" style="margin-bottom:20px;">
                              <div style="position: relative;border:1px solid #ccc;width: 85%;border-radius: 5px;padding:20px 0 0 60px;">
                                <div style="position: absolute;top:-10px;left:50%;margin-left: -50px;background: #fff;">表达式项<i class="el-icon-plus" style="cursor: pointer;color:green;font-size:16px;font-weight: 700;margin:0 5px;"  @click="addComposeMulti(index,compose);changeLogic()"></i></div>
                                <div style="position: absolute;top:-12px;left:-20px;background: #fff;">
                                  <el-select style="width: 100px;" v-model="composeItem.value" @change="changeLogic">
                                    <el-option
                                      v-for="item in multiOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <div v-if="composeItem.value == 'getor'" style="display: inline-block;">
                                    <span style="font-size: 14px;">取</span>
                                    <el-input style="width: 45px;" v-model="composeItem.input" @change="changeLogic"></el-input>
                                    <span style="font-size: 14px;">个</span>
                                  </div>
                                </div>
                                <div style="position: absolute;right:-8px;top:-8px;">
                                  <i class="el-icon-error" style="cursor:pointer;color:red;font-size:18px;" @click="deleteCompose(index, compose);changeLogic()"></i>
                                </div>
                                <div v-for="(content, ele) in composeItem.content" :key="ele" style="margin-bottom:10px;">
                                  <!-- 组合项常规型逻辑表达式  模拟量or数字量 -->
                                  <el-select style="width: 85px;" v-model="content.value" @change="changeLogic">
                                    <el-option
                                      v-for="item in numOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <!-- 组合项常规型逻辑表达式 数字量 -->
                                  <el-input v-if="content.value == 'digit'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="content.digit.input" @change="changeLogic"></el-input>
                                  <span v-if="content.value == 'digit'" style="display:inline-block;width: 60px;text-align: center;">==</span>
                                  <el-select v-if="content.value == 'digit'" style="width: 60px;" v-model="content.digit.value" @change="changeLogic">
                                    <el-option
                                      v-for="item in digitOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                 <!-- 组合项常规型逻辑表达式 模拟量 -->
                                  <el-input v-if="content.value == 'analogy'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="content.analogy.input1" @change="changeLogic"></el-input>
                                  <el-select v-if="content.value == 'analogy'" style="width: 60px;" v-model="content.analogy.value" @change="changeLogic">
                                    <el-option
                                      v-for="item in ruleLogicOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-input v-if="content.value == 'analogy'" minlength="1" maxlength="25" style="width: 60px;" v-model="content.analogy.input2" @change="changeLogic"></el-input>
                                 <!-- 组合项常规型逻辑表达式 范围量 -->
                                  <el-input v-if="content.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 60px;" v-model="content.limits.input1" @change="changeLogic"></el-input>
                                  <el-select v-if="content.value == 'limits'" style="width: 60px;" v-model="content.limits.value1" @change="changeLogic">
                                    <el-option
                                      v-for="item in ruleLogicOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-input v-if="content.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="content.limits.kksValue" @change="changeLogic"></el-input>
                                  <el-select v-if="content.value == 'limits'" style="width: 60px;" v-model="content.limits.value2" @change="changeLogic">
                                    <el-option
                                      v-for="item in ruleLogicOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-input v-if="content.value == 'limits'" minlength="1" maxlength="25" style="width: 60px;" v-model="content.limits.input2" @change="changeLogic"></el-input>
                                  <i class="el-icon-error" style="cursor:pointer;color:red;font-size:18px;" @click="deleteComposeMulti(index, compose, ele);changeLogic()"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="2" :style="{height: logicItem.height + 'px'}">
                    <div ref="boxbox" style="height: 50%;width:100%;">
                      <div :style="{width:logicItem.width-1+'px','transform':'rotate('+logicItem.angle+'deg) translateZ(0)','border':'0.5px solid #000','transform-origin': 'left top'}"></div>
                    </div>
                    <div style="height: 50%;width:100%;transform:scaleY(-1);">
                      <div :style="{width:logicItem.width-1+'px','transform':'rotate('+logicItem.angle+'deg) translateZ(0)','border': '0.5px solid #000','transform-origin': 'left top'}"></div>
                    </div>
                  </el-col>
                  <el-col :span="2" :style="{height:logicItem.height+ 'px','display': 'flex','align-items': 'center'}">
                    <div style="border:0.5px solid #000;width:100%;"></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="isLogicData" style="width: 20%; float: right;">
              <div v-if="isLogicDataOne == true" style="height:220px;width: 90px; border: 1px solid #ccc;float: left;">
                <el-select v-model="radio" disabled placeholder="请选择">
                  <el-option
                    v-for="item in checkOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div v-if="isLogicDataOne == true" style="width: 100px;float: left;height: 1px;background: #ccc;margin-top:60px;">
              </div>
              <div v-if="isLogicDataOne == false" ref="count" style="min-height:100px;width: 90px; border: 1px solid #000;float: left;">
                <el-select v-model="radio" @change="changeLogic" placeholder="请选择">
                  <el-option
                    v-for="item in checkOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div v-if="isLogicDataOne == false" style="position: relative; width: 100px;float: left;height: 1px;background: #000;margin-top:50px;">
                <div style="position: absolute;right: 0; top: -18px;font-size: 14px;">计算结果</div>
              </div>
            </div>
            <div style="clear: both;"></div>
            <div class="add-express-btn">
              <div class="expression3" >
                <div style="margin: auto auto auto 5px;">
                  <el-button plain size="mini" @click="addRuleExpress();changeLogic()">常规型逻辑表达式</el-button>
                  <el-button plain size="mini" @click="addJudgeExpress();changeLogic()">条件型逻辑表达式</el-button>
                  <el-button plain size="mini" @click="addMultiRuleExpress();changeLogic()">多项常规型逻辑表达式</el-button>
                  <el-button plain size="mini" @click="addComposeRuleExpress();changeLogic()">组合项常规型逻辑表达式</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--右击出现浮层部分-->
    <div v-if="alarmCard" ref="alarmCard" :style="{'position': 'absolute','top': addMainY,'left':addMainX}">
      <el-button style='width:125px;text-align:left;' @click="dialogDelAlarmCard = true">删除报警卡</el-button>
      <br>
      <el-button style='width:125px;text-align:left;' @click="alarmOrder('step')">报警卡调序</el-button>
    </div>
    <!--删除报警卡-->
    <el-dialog title="删除报警卡" :visible.sync="dialogDelAlarmCard" width="35%" center>
      <p>你即将删除报警卡:</p>
      <p v-html="getTitle" style="padding:20px;font-weight: 700;font-size: 20px;color:#000;text-align: center;">{{getTitle}}</p>
      <p style="color:red;">该报警卡和报警卡的逻辑条件,以及报警卡下的检查项及检查项的逻辑,都会一起删除!</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelAlarmCard = false">取 消</el-button>
        <el-button type="primary" @click="removeAlarmCard">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 报警卡调序 -->
    <el-dialog title="报警卡调序" :visible.sync="showAlarmCardOrder" width="35%">
      <div v-if="orderCurrentName" style="height: 30px;line-height: 30px;margin: 0 8px;">
        <span style="font-weight: 700;margin-right:10px;">当前调整项目</span>
        <span>{{orderCurrentName}}</span>
      </div>
      <ul>
        <li v-for="(orderItem, index) in treeStructure" :key="index" style="width: 100%;line-height: 2;border-radius: 5px;padding: 0 10px;box-sizing: border-box;margin-top:10px;" :style="{border: orderIndex == index ? '2px solid #000' : '1px solid #000'}">
          <el-radio v-if="orderItem.title.replace(/<[^>]+>/g,'').length > 50" v-model="currentOrder" :label="orderItem.rd_id" @change="(val) => getOrderIndex(val,index)">
            {{orderItem.title.replace(/<[^>]+>/g,'').substring(0,50)+'...'}}
          </el-radio>
          <el-radio v-else v-model="currentOrder" :label="orderItem.rd_id" @change="(val) => getOrderIndex(val,index)">
            {{orderItem.title.replace(/<[^>]+>/g,'')}}
          </el-radio>
        </li>
      </ul>
      <div style="overflow: hidden;margin-top:20px;">
        <div style="float: left;height: 32px;padding: 4px 8px;background: #DADADA;box-sizing: border-box;border:1px solid #C9C9C9;border-radius: 4px;">
          <i class="el-icon-download" style="font-size: 24px;font-weight: 700;color:#409EFF;cursor: pointer;" @click="downOrder1"></i>
          <i class="el-icon-upload2" style="font-size: 24px;font-weight: 700;color:#409EFF;cursor: pointer;" @click="upOrder1"></i>
        </div>
        <div style="float: right;">
          <el-button @click="showAlarmCardOrder = false">取 消</el-button>
          <el-button type="primary" @click="saveTreeOrder1" style="background:green;border:1px solid green;">保 存</el-button>
        </div>
      </div>
    </el-dialog>

    <!--新添加报警卡-->
    <el-dialog title="添加报警卡" :visible.sync="addAlarmCard" width="80%" height="80%">
      <div class="sccstj">
        <!--富文本编辑器-->
        <div class="core">
          <tinymce-editor v-model="addAlarmCardCon"
                          :disabled="disabled"
                          @onClick="onClick"
                          ref="editor"></tinymce-editor>
        </div>
        <!--富文本编辑器-->
      </div>
        <div style="margin: 20px 0 0;overflow: hidden;">
          <el-button type="primary" @click="addAlarmCardBut()" style="background:green;border:1px solid green;float: right;margin-right: 2%;">保 存</el-button>
          <el-button @click="addAlarmCard = false" style="float: right;margin-right: 20px;">取 消</el-button>
        </div>
      <!--</div>-->
    </el-dialog>
   
    <!-- 逻辑发生变化 -->
    <el-dialog
      title="提示"
      :visible.sync="changeDialogLogic"
      width="30%"
      center>
      <span>当前逻辑已发生变化,是否保存?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogLogic = false,isLogicChange = false,getTree()">取 消</el-button>
        <el-button type="primary" @click="saveLogic">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
import TinymceEditor from './tinymce-editor.vue'

export default {
  // inject: ['reload'],
  components: {
    TinymceEditor
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar:[]
        }
      },
      propsCascader: {       //层级选择器
        value: 'value',
        children: 'steps'
      },
        // 李康
        dialogDelAlarmCard:false,
        showAlarmCardOrder:false,
        addAlarmCard:false,
        addAlarmCardCon:'',
        alarmCard:false,
        // 李康
        current:-1,
      optionsMainStep: [],
      prestepWatchTableData: '', //前置监视项处理步骤数据
      watchPadType: '',          //全局监视项还是前置监视项
      prestepTrigger: 'beforenter',   //前置触发条件
      globalTrigger: 'start',    //全局触发条件
      globalTimes: 300,
      appendixName: '',
      changeDialogLogic: false,
      isLogicChange: false,  //逻辑数据是否发生变化
      rightHeight: 0,
      radio: 'and',    //逻辑与还是逻辑或
      currentFrontPath: '',
      currentEndPath: '',
      ifFrontPath: true,  //是否有前缀 当前项目
      checkOptions: [{
        value: 'and',
        label: '逻辑与'
      }, {
        value: 'or',
        label: '逻辑或'
      }],
      checkValue: 'and',
      //if条件逻辑关系
      ifOptions: [{
        value: 'and',
        label: '与条件if'
      }, {
        value: 'or',
        label: '或条件if'
      }],
      ifValue: 'and',
      //多项组合表达式逻辑关系
      multiOptions: [{
        value: 'and',
        label: '与关系'
      }, {
        value: 'or',
        label: '或关系'
      }, {
        value: 'getor',
        label: '取或关系'
      }],
      multiValue: 'and',
      // 常规表达式or判断表达式
      expressOptions: [{
        value: 'judge',
        label: '判断型表达式'
      }, {
        value: 'rule',
        label: '常规型表达式'
      }],
      // 常规表达式  模拟量or数字量
      numOptions: [{
        value: 'digit',
        label: '数字量'
      }, {
        value: 'analogy',
        label: '模拟量'
      }, {
        value: 'limits',
        label: '范围量'
      }],
      // 常规表达式  逻辑关系
      ruleLogicOptions: [{
        value: 'less',
        label: '<'
      }, {
        value: 'lessequal',
        label: '<='
      }, {
        value: 'greater',
        label: '>'
      }, {
        value: 'greaterequal',
        label: '>='
      }],
      // 数字量 对应的值
      digitOptions: [{
        value: 'zero',
        label: '0'
      }, {
        value: 'one',
        label: '1'
      }],
      //转至   规程选择
      orderOptions: [{
        value: 'self',
        label: '本规程的附件:'
      }, {
        value: 'other',
        label: '其他规程:'
      }],
      // 判断表达式   条件 数字量or模拟量
      termOptions: [{
        value: 'digit',
        label: '数字量'
      }, {
        value: 'analogy',
        label: '模拟量'
      }, {
        value: 'limits',
        label: '范围量'
      }],
      //判断表达式  成立有动作  不成立无动作
      infoundOptions: [{
        value: 'else',
        label: 'else:'
      }, {
        value: 'none',
        label: 'none'
      }],
      //本规程的附件
      selfMain: [],
      selfStep: [],
      logicData: [],
      ifBasicLogic: {
        value: 'digit',
        digit: {
          type: 'digit',             //数字量对应的值
          input: '',
          value: 'zero'
        },
        analogy: {
          type: 'analogy',            //模拟量对应的值
          input1: '',
          input2: '',
          value: 'less'
        },
        limits: {
          type: 'limits',            //范围量对应的值
          input1: '',
          input2: '',
          kksValue: '',
          value1: 'less',
          value2: 'less'
        }
      },
      basicLogic: {
        value: 'digit',
        digit: {
          type: 'digit',             //数字量对应的值
          input: '',
          value: 'zero'
        },
        analogy: {
          type: 'analogy',            //模拟量对应的值
          input1: '',
          input2: '',
          value: 'less'
        },
        manual: {
          type: 'manual',              //人工对应的值
          input: ''
        },
        limits: {
          type: 'limits',            //范围量对应的值
          input1: '',
          input2: '',
          kksValue: '',
          value1: 'less',
          value2: 'less'
        },
        skip: {
          type: 'skip',            //转至对应的值
          input: '',
          value: 'self',
          fileValue: [],
          linkTo: ''
        }
      },
      ruleData: '',
      judgeData: '',
      multiRuleData: '',
      composeRuleData: '',
      isLogic: false,       //链接至 是否是逻辑编辑
      isDisplay: false,
      unanticipated: '',    //非预期内容
      selectText: '',       //非预期选中文本
      searchLinkText: '',   //查询树形结构
      getTitle: '',
      addMainX: '',
      addMainY: '',
      getLogicIndex: 0,     //逻辑编辑索引
      getLogicType: '',     //逻辑编辑类型
      fileNum: '',
      headerName: '',
      onlyPreview: true,  //是否只显示文件预览 默认显示
      rd_id: '',
      rd_id_unexpect: '', //非预期id
      table_id: '',
      pre_table_id: '',  //前置监视 对应 总监视板 存储id
      point: '',
      goto_target: '',
      treeData: [],
      watchData: [],
      rightData: {},
      orderCurrentName: '',
      orderData: {},
      currentOrder: '',
      removeAlarmCardRd_id:'',
      orderIndex: null,  //排序索引
      warnchange: true,
      indexwarn: null,
      indexmain: null,
      treeStructure:[],//左侧树结构的数据定义
      yuqiindexstep: '',
      yuqiindexitem: '',
      feiyuqiindexstep: '',
      feiyuqiindexitem: '',
      treeDataLink: [],
      defaultProps: {
        children: 'content',
        label: 'title'
      },
      isLogicDataOne: false,   //是否只有一条表达式
      isLogicData: true,   //是否有数据表达式
      enterHasValue: false,  //入口条件有无表达式
        // 规程文档预览 李康start
        tempObj:[],
        loadPict:[],
        newobj:[],
        obj:[],
        pict:'',
        editor:false,
        isResizing:false,
        lastDownX:0,
        offsetRight:0,
        expect:'',
        unexpect:'',
        isResizing1:false,
        lastDownX1:0,
        offsetRight1:this.rightHeight*0.42,
        offsetRight2:this.rightHeight*0.57,
        allWidth:0,
        still:false,
        msg:1,
        suibian:1,
        scrollTop:'',
        active: "",//设置处理步骤部分移入移除事件
        previews1: [],
        previews2:[],
        previews3:[],
        previews4:[],
        previews5:[],
        previewsx:[],
        previewid:'',
        previewType:[],
        fujian:[],
        changdu:[],
        show1: false,//控制浮层显示与隐藏
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false,
        show7: false,
        show8: false,
        show9: false,
        show10: false,
        show11: false,
        show88:false,
        dataId:'',//获取到id走保存接口
        youjiLay1:false,//点击编辑出现的灰色背景
        youjiLay:false,//右击出现的透明浮层
        menuVisible1:false,
        casual:[],
        core:[],
        substance:[],
        addTable:[],//当增加说明表格的时候数据部分注册
        neir:'',
        postData:[],//接收处理的数据
        arrGrade:[],
        tempconte:[],//修改名字和日期时候  ==4
        specid:[],//获取目的和进入条件的id，判断传值为1还是2
        specnum:'',//判断传值为1还是2
        specrd_id:'',  // 步骤部分的rd_id取值
        newNormal:'',
        newChart:'',
        form_id:'',
        table_id:'',
        disabled: false,
        maxCount:'',
        cornerId:'',//在定位的有背景色的时候，通过id来设置有背景色的部分，编辑后的事情
    // 规程文档预览结束 李康end
    }
  },
  created() {
    this.onlyPreview = JSON.parse(sessionStorage.getItem('isShow'));
    this.fileNum = sessionStorage.getItem('fileNum');
    this.headerName = sessionStorage.getItem('name');
      this.getTree()
    // 规程文档预览 李康start
    this.annexRequest();//所有附件的请求接口
    // 规程文档预览 李康end
    this.ruleData = {
      type: 'rule',
      data: JSON.parse(JSON.stringify(this.basicLogic))
    }
    this.judgeData = {
      type: 'judge',
      isestablished: 'none',
      if: {
        value: 'or',
        list: [JSON.parse(JSON.stringify(this.ifBasicLogic))]
      },
      then: JSON.parse(JSON.stringify(this.basicLogic)),
      else: JSON.parse(JSON.stringify(this.basicLogic))
    }
    this.multiRuleData = {
      type: 'multi',
      value: 'and',
      input: 3,
      list: [JSON.parse(JSON.stringify(this.basicLogic))]
    }
    this.composeRuleData = {
      type: 'compose',
      value: 'and',
      input: 5,
      list: [{
        value: 'and',
        input: 3,
        content: [JSON.parse(JSON.stringify(this.basicLogic))]
      }]
    }
  },
  mounted() {
      this.allWidth=document.documentElement.clientWidth;
      this.offsetRight=document.documentElement.clientWidth*0.71;
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      this.rightHeight = h - 70;
      this.offsetRight1=this.rightHeight*0.42;
      this.offsetRight2=this.rightHeight*0.57;
      window.onresize = () => {
          return (() => {
              let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
              this.rightHeight = h - 70;
              this.offsetRight1=this.rightHeight*0.42;
              this.offsetRight2=this.rightHeight*0.57;
          })();
      };
        // 李康开始
      this.addAlarmCardCon='<table width="100%" border="1" contenttype="alarmCard">\n' +
          '  <tbody>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td rowspan="4">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b></b></p>\n' +
          '          <p><b></b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td rowspan="4">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b></b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td rowspan="4">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b></b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td rowspan="2">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>正常值</b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td rowspan="2">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b></b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td>\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td>\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td rowspan="2">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>报警值</b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td rowspan="2">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b></b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td>\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td>\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td>\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>适用机组状态</b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td>\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="2">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>逻辑图</b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="2">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td>\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>连锁保护与动作检查</b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td>\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="2">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>人员立即响应</b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="2">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '          <p></p>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>原因分析</b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>人员行动</b></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>可能的后果: </b></p>\n' +
          '          <p></p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p><b>情况说明: </b></p>\n' +
          '          <p>&nbsp;</p>\n' +
          '          <div>\n' +
          '            &nbsp;\n' +
          '          </div>\n' +
          '          <p>&nbsp;</p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  <tr style="height: 40px;">\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p>&nbsp;</p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '    <td colspan="3">\n' +
          '      <div>\n' +
          '        <div>\n' +
          '          <p>&nbsp;</p>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </td>\n' +
          '  </tr>\n' +
          '  </tbody>\n' +
          '</table>'


            //李康结束
  },
    computed:{
        GetChinese(strValue){
            return function(strValue){
                if(strValue!= null && strValue!= ""){
                    var reg = /[\u4e00-\u9fa5]/g;
                    if(strValue.match(reg)==null){
                        return '';
                    }else {
                        return strValue.match(reg).join("")
                    }
                }
                else
                    return "";
            }
        },
        mesh(length,order){
            return function(length,order){
                if(length==4&&order==2){
                return 2
            }else if(length==4&&order==3){
                    return 2
                }else if(length==2){
                    return 3
                }
            }
        },
        mesh1(length,order,rowNumber){
            return function(length,order){
                if(length==6&&order==0){
                    return 4
                }else if(length==6&&order==1){
                    return 4
                }else if(length==6&&order==2){
                    return 4
                }else if(length==6&&order==3){
                    return 2
                }else if(length==6&&order==4){
                    return 2
                }
            }
        },

        // 列数--6，    index(列序数)--,0→5，         行序数--，1→11
        isSee(length,order,rowNumber){
            return function(length,order,rowNumber) {
                if (rowNumber == 2 && order == 0) {
                    return false
                }else if (rowNumber == 2 && order == 1) {
                    return false
                }else if (rowNumber == 2 && order == 2) {
                    return false
                }else if (rowNumber == 2 && order == 3) {
                    return false
                }else if (rowNumber == 2 && order == 4) {
                    return false
                } else if (rowNumber == 3 && order == 0) {
                    return false
                } else if (rowNumber == 3 && order == 1) {
                    return false
                } else if (rowNumber == 3 && order == 2) {
                    return false
                } else if (rowNumber == 4 && order == 0) {
                    return false
                }else if (rowNumber == 4 && order == 1) {
                    return false
                }else if (rowNumber == 4 && order == 2) {
                    return false
                }else if (rowNumber == 4 && order == 3) {
                    return false
                }else if (rowNumber == 4 && order == 4) {
                    return false
                }else {
                    return true
                }
            }
        },





        normalDataRow(rowNum,columnNum){
            return function(rowNum,columnNum) {
                if (rowNum == 1 && columnNum == 0) {
                    return 4
                }else if (rowNum == 1 && columnNum == 1) {
                    return 4
                }else if (rowNum == 1 && columnNum == 2) {
                    return 4
                }else if (rowNum == 1 && columnNum == 3) {
                    return 2
                }else if (rowNum == 1 && columnNum == 4) {
                    return 2
                }else if (rowNum == 3 && columnNum == 0) {
                    return 2
                }else if (rowNum == 3 && columnNum == 1) {
                    return 2
                }
            }
        },

      // 行序数--，1→11           index(列序数)--,0→5，
        normalDataColumn(rowNum,columnNum){
            return function(rowNum,columnNum) {
                if (rowNum == 5 && columnNum == 2) {
                    return 2
                }else if (rowNum == 5 && columnNum == 3) {
                    return 2
                }else if (rowNum == 6 && columnNum == 2) {
                    return 2
                }else if (rowNum == 6 && columnNum == 3) {
                    return 2
                }else if (rowNum == 7 && columnNum == 0) {
                    return 3
                }else if (rowNum >= 7) {
                    return 3
                }
                }
        },
    },
  methods: {

      // 左侧右击事件
      // 右击菜单栏部分，出现的选择操作框
      rightClick(e,rd_id,index) { // 鼠标右击触发事件
          this.orderIndex=index;
          // console.log(7788,this.fileNum);
          this.currentOrder=rd_id;
          this.removeAlarmCardRd_id=rd_id
          this.alarmCard = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
          // 去掉大段的判断，用参数去判即可
          this.alarmCard=true;
          this.addMainX = e.clientX +15 + 'px';
          this.addMainY = e.clientY- 10 + 'px';
          document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
      },
      foo() { // 取消鼠标监听事件 菜单栏
          this.alarmCard = false
          document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
      },

      // 左侧树点击事件
      addClass1:function(index,data){
          this.current=index;
          this.currentEndPath = '';
          this.rd_id = data.rd_id;
          let endPath = '';
          endPath = data.title;
          this.currentEndPath = endPath.replace(/<[^>]+>/g,"");
          if(this.currentEndPath.length > 25){
            this.currentEndPath = this.currentEndPath.substring(0,25)+"...";
          }
          this.getLogicExpression(this.rd_id)

          // 李康 描点 这不需要变色
          let id = data.anchor_point;
          document.getElementById(id).scrollIntoView();  //  滚动到可视范围底部;
      },
    //树型结构 左击
    treeClick(type, index, unexpected) {
      this.pre_table_id = '';
      if(unexpected) {
        switch (type) {
          case 'step':
            this.feiyuqiindexstep = index;
            this.feiyuqiindexitem = null;
            this.yuqiindexitem = null;
            this.yuqiindexstep = null;
            this.indexwarn = null;
            this.indexmain = null;
            return
          case 'item':
            this.feiyuqiindexstep = null;
            this.feiyuqiindexitem = index;
            this.yuqiindexitem = null;
            this.yuqiindexstep = null;
            this.indexwarn = null;
            this.indexmain = null;
            return
          default:
            break
        }
      }
      switch (type) {
        case 'warn':
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.yuqiindexitem = null;
          this.yuqiindexstep = null;
          this.indexmain = null;
          this.indexwarn = index;
          return
        case 'step':
          this.yuqiindexstep = index;
          this.yuqiindexitem = null;
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.indexwarn = null;
          this.indexmain = null;
          return
        case 'item':
          this.yuqiindexitem = index;
          this.yuqiindexstep = null;
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.indexwarn = null;
          this.indexmain = null;
          return
        default:
          break
      }
    },
   
    open(item) {
      item.change = !item.change
    },
    //获取树模型结构
    getTree() {
      let that = this
      this.$request({
        url: '/regulations/getRegulaionTreeStructure',
        method: 'post',
        data: {
          fileNum: this.fileNum
        }
      }).then(function (res) {
          that.treeStructure=res.data


          // console.log(777,res.data);
          // if(res && res.state == 0) {
        //   that.treeData = [];
        //   res.data.forEach(item => {
        //     if(item.type != 'entryCondition') {
        //       that.treeData.push(item)
        //     } else {
        //       that.enterHasValue = item.hasValue;
        //     }
        //   });
        //   that.treeData.forEach(item => {
        //     let step = item.content;
        //     let stmp = [];
        //     that.$set(item,'change', true);
        //     step.forEach(el => {
        //       that.$set(el,'change', true);
        //     });
        //   });
        //
        // }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //获取核对项逻辑表达式
    getLogicExpression(rdid) {
      let that = this;
      this.$request({
        url: '/regulations/getLogicExpression',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: rdid
        }
      }).then((res) => {
        if(res && res.data) {
          let data = JSON.parse(res.data);
          that.radio = data.radio;
          that.logicData = data.logicData;
        } else {
          that.logicData = [];
        }
        console.log(333,that.logicData)
        if(that.logicData.length == 1) {
          that.isLogicDataOne = true;
          that.isLogicData = true;
        } else if (that.logicData.length > 1) {
          that.isLogicDataOne = false;
          that.isLogicData = true;
          that.$nextTick(() => {
            let h = that.$refs.logic.offsetHeight;
            that.$refs.count.style.height = h - 15 + 'px';
          })
        } else {
          that.isLogicData = false;
        }
      }).catch((error) => {
        console.log('error')
      })
    },
    //获取核对项非预期内容
    getUnexpected(rdid) {
      let that = this;
      this.$request({
        url: '/regulations/getUnexpectedByID',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: rdid
        }
      }).then((res) => {
        if(res && res.state == 0) {
          that.unanticipated = res.data;
        }
      }).catch((error) => {
        console.log('error')
      })
    },
    //添加常规型表达式
    addRuleExpress() {
      // let main = this.optionsMainStep[0].value;
      // let step = this.optionsMainStep[0].steps[0].value;
      // this.$set(this.ruleData,'skipFileValue', [main, step]);
      this.logicData.push(JSON.parse(JSON.stringify(this.ruleData)))
      console.log(this.logicData)
    },
    //添加条件型表达式
    addJudgeExpress() {
      // let main = this.optionsMainStep[0].value;
      // let step = this.optionsMainStep[0].steps[0].value;
      // this.$set(this.judgeData.setup,'skipFileValue', [main, step]);
      // this.$set(this.judgeData.insetup,'skipFileValue', [main, step]);
      this.logicData.push(JSON.parse(JSON.stringify(this.judgeData)))
      console.log(this.logicData)
    },
    //多项常规型表达式
    addMultiRuleExpress() {
      this.logicData.push(JSON.parse(JSON.stringify(this.multiRuleData)))
    },
    //组合型表达式
    addComposeRuleExpress() {
      this.logicData.push(JSON.parse(JSON.stringify(this.composeRuleData)))
    },
    //增加判断条件项
    addIf(index) {
      this.logicData[index].if.list.push(JSON.parse(JSON.stringify(this.basicLogic)))
    },
    //删除判断条件项
    deleteIf(index, item) {
      this.logicData[index].if.list.splice(item, 1);
      this.logicData[index].height = 0;
    },
    //多项表达式增加
    addMulti(index) {
      this.logicData[index].list.push(JSON.parse(JSON.stringify(this.basicLogic)))
    },
    //多项表达式删除
    deleteMulti(index, item) {
      this.logicData[index].list.splice(item, 1);
      this.logicData[index].height = 0;
    },
    //组合项表达式增加
    addCompose(index) {
      this.logicData[index].list.push({
        value: 'and',
        input: 3,
        content: [JSON.parse(JSON.stringify(this.basicLogic))]
      })
    },
    //组合项表达式删除
    deleteCompose(index, compose) {
      this.logicData[index].list.splice(compose, 1);
      this.logicData[index].height = 0;
    },
    //组合项下的表达式 添加
    addComposeMulti(index, compose){
      this.logicData[index].list[compose].content.push(JSON.parse(JSON.stringify(this.basicLogic)))
    },
    //组合项下的表达式 删除
    deleteComposeMulti(index, compose, ele){
      this.logicData[index].list[compose].content.splice(ele, 1);
      this.logicData[index].height = 0;
    },
    deleteExpress(index) {
      this.logicData.splice(index, 1);
    },
    //逻辑保存
    saveLogic() {
      let that = this;
      let rdid = this.rd_id;
      let flag = false;
      this.logicData && this.logicData.forEach(item => {
        switch (item.type) {
          case 'rule':
            switch (item.data.value) {
              case 'digit':
                if(!item.data.digit.input) {
                  flag = true;
                }
                break
              case 'analogy':
                if(!item.data.analogy.input1 || !item.data.analogy.input2) {
                  flag = true;
                }
                break
              case 'skip':
                if(!item.data.skip.input) {
                  flag = true;
                }
                if(item.data.skip.value == 'other' && !item.data.skip.linkTo) {
                  flag = true;
                }
                break
              case 'manual':
                if(!item.data.manual.input) {
                  flag = true;
                }
                break
              case 'limits':
                if(!item.data.limits.input1 || !item.data.limits.kksValue || !item.data.limits.input2) {
                  flag = true;
                }
                break
              default:
                break
            }
            break
          case 'judge':
            if(item.if.list.length >= 1) {
              item.if.list.forEach(el => {
                switch (el.value) {
                  case 'digit':
                    if(!el.digit.input) {
                      flag = true;
                    }
                    break
                  case 'analogy':
                    if(!el.analogy.input1 || !el.analogy.input2) {
                      flag = true;
                    }
                    break
                  case 'limits':
                    if(!el.limits.input1 || !el.limits.kksValue || !el.limits.input2) {
                      flag = true;
                    }
                    break
                  default:
                    break
                }
              });
            } else {
              flag = true;
            }
            switch (item.then.value) {
              case 'digit':
                if(!item.then.digit.input) {
                  flag = true;
                }
                break
              case 'analogy':
                if(!item.then.analogy.input1 || !item.then.analogy.input2) {
                  flag = true;
                }
                break
              case 'skip':
                if(!item.then.skip.input) {
                  flag = true;
                }
                if(item.then.skip.value == 'other' && !item.then.skip.linkTo) {
                  flag = true;
                }
                break
              case 'manual':
                if(!item.then.manual.input) {
                  flag = true;
                }
                break
              case 'limits':
                if(!item.then.limits.input1 || !item.then.limits.kksValue || !item.then.limits.input2) {
                  flag = true;
                }
                break
              default:
                break
            }
            if(item.isestablished == 'else') {
              switch (item.none.value) {
                case 'digit':
                  if(!item.none.digit.input) {
                    flag = true;
                  }
                  break
                case 'analogy':
                  if(!item.none.analogy.input1 || !item.none.analogy.input2) {
                    flag = true;
                  }
                  break
                case 'skip':
                  if(!item.none.skip.input) {
                    flag = true;
                  }
                  if(item.none.skip.value == 'other' && !item.none.skip.linkTo) {
                    flag = true;
                  }
                  break
                case 'manual':
                  if(!item.none.manual.input) {
                    flag = true;
                  }
                  break
                case 'limits':
                  if(!item.none.limits.input1 || !item.none.limits.kksValue || !item.none.limits.input2) {
                    flag = true;
                  }
                  break
                default:
                  break
              }
            }
            break
          case 'multi':
            if(item.value == 'getor' && !item.input) {
              flag = true;
            }
            if(item.list.length >= 1) {
              item.list.forEach(el => {
                switch (el.value) {
                  case 'digit':
                    if(!el.digit.input) {
                      flag = true;
                    }
                    break
                  case 'analogy':
                    if(!el.analogy.input1 || !el.analogy.input2) {
                      flag = true;
                    }
                    break
                  case 'skip':
                    if(!el.skip.input) {
                      flag = true;
                    }
                    if(el.skip.value == 'other' && !el.skip.linkTo) {
                      flag = true;
                    }
                    break
                  case 'manual':
                    if(!el.manual.input) {
                      flag = true;
                    }
                    break
                  case 'limits':
                    if(!el.limits.input1 || !el.limits.kksValue || !el.limits.input2) {
                      flag = true;
                    }
                    break
                  default:
                    break
                }
              });
            } else {
              flag = true;
            }
            break
          case 'compose':
            if(item.value == 'getor' && !item.input) {
              flag = true;
            }
            if(item.list.length >= 1) {
              item.list.forEach(el => {
                if(el.value == 'getor' && !el.input) {
                  flag = true;
                }
                if(el.content.length >= 1) {
                  el.content.forEach(cont => {
                    switch (cont.value) {
                      case 'digit':
                        if(!cont.digit.input) {
                          flag = true;
                        }
                        break
                      case 'analogy':
                        if(!cont.analogy.input1 || !cont.analogy.input2) {
                          flag = true;
                        }
                        break
                      case 'skip':
                        if(!cont.skip.input) {
                          flag = true;
                        }
                        if(cont.skip.value == 'other' && !cont.skip.linkTo) {
                          flag = true;
                        }
                        break
                      case 'manual':
                        if(!cont.manual.input) {
                          flag = true;
                        }
                        break
                      case 'limits':
                        if(!cont.limits.input1 || !cont.limits.kksValue || !cont.limits.input2) {
                          flag = true;
                        }
                        break
                      default:
                        break
                    }
                  })
                } else {
                  flag = true;
                }
              });
            } else {
              flag = true;
            }
            break
          default:
            break
        }
      });
      if(flag) {
        that.$message.error("请输入内容！");
        return
      }
      let expression;
      this.logicData.length == 0 ? expression = '' : expression = JSON.stringify({
        radio: this.radio,
        term: this.globalTrigger,
        times: this.globalTimes,
        logicData: this.logicData
      })
      
      axios({
        url: '/regulations/saveLogicExpression',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          fileNum: this.fileNum,
          rd_id: rdid,
          expression: expression
        }
      }).then(function (res) {
        that.$message.success("逻辑保存成功！");
        that.isLogicChange = false;
        that.changeDialogLogic = false;
        that.getTree()
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    backInfo() {
      this.$router.push({name: 'Info'})
    },

      //报警卡调序
      alarmOrder(type) {
          this.showAlarmCardOrder = true;
      },

    getOrderIndex(val, index) {
      this.orderIndex = index;
    },

      // 尝试调序函数
      //下调
      downOrder1() {
          let arr = this.treeStructure;
          let index = this.orderIndex;
          if(this.orderIndex < arr.length-1) {
              [arr[index], arr[index+1]] = [arr[index+1], arr[index]];
              this.orderIndex ++;
              // this.$forceUpdate()
          }
      },
      //上调
      upOrder1() {
          // let arr = this.orderData.data;
          let arr = this.treeStructure
          let index = this.orderIndex;
          if(this.orderIndex > 0) {
              [arr[index], arr[index-1]] = [arr[index-1], arr[index]];
              this.orderIndex --
              // this.$forceUpdate()
          }
      },
      // 新增加报警卡保存按钮
      addAlarmCardBut(){
          // 增加报警卡
          // http://localhost:12306/regulations/addAlarmCardTable
          // {
          //     "fileNum":"HS1-1CWBBJ00-TP-1341__alarm",
          //     "table_content":"<table><tr><td><p><b>1CPS20EY702XD87</b></p ><p><b>安全触发柜B旁通test</b></p ></td><td><p><b>安全触发柜B旁通</b></p ></td><td><p><b>白</b></p ></td><td><p><b>正常值</b></p ></td><td><p>N/A</p ></td><td><p>1CWB02EK106YP14</p ></td></tr><tr><td><p><b/></p ></td><td><p><b/></p ></td><td><p><b/></p ></td><td><p/></td><td><p/></td><td><p>报警列表</p ></td></tr></table>"
          // }
          axios.post('regulations/addAlarmCardTable', {//发送请求 跳转页面
              'fileNum': this.fileNum,
              'table_content': this.addAlarmCardCon,
          }).then((res) => {
              if( res.data.state==0){
                  // 延时(setTimeout)后指针指向发生变化
                  var that = this;
                  window.setTimeout((function() {
                      that.getTree();
                      that.annexRequest();
                      that.add();
                      that.substance='';
                      that.addAlarmCard = false;
                  })(), 1200);
              }
          }).catch((error) => {
              // console.log("3、错误"+response)
          })
      },
      //调序保存
      saveTreeOrder1() {
          // 报警卡调序
          // http://localhost:12306/regulations/adjustOrderAlarmCardTable
          //     fileNum=HS1-1CWBBJ00-TP-1341__alarm
          // table_id_list=table_86e7e60c-f03e-4a56-9230-8c4646ab735f,table_0e2af1c1-f8f5-4628-9b3b-925c3b9a21a0
          var tableIdStr=''
          for(var i=0;i<this.treeStructure.length;i++) {
              tableIdStr += this.treeStructure[i].rd_id+',';
          }
          tableIdStr = tableIdStr.substring(0, tableIdStr.length -1);
      //    注意这里需要用 this.$request的方式请求，用我原来的axios.post的方式不行。
              this.$request({
                  url: '/regulations/adjustOrderAlarmCardTable',
                  method: 'post',
                  data: {
                      'fileNum': this.fileNum,
                      'table_id_list': tableIdStr,
                  }
              }).then((res) => {
                  if( res.state==0){
                      // 延时(setTimeout)后指针指向发生变化
                      var that = this;
                      window.setTimeout((function() {
                          that.getTree();
                          that.annexRequest();
                          that.add();
                          that.showAlarmCardOrder = false;
                      })(), 1200);
                  }
              }).catch((error) => {
                  // console.log("3、错误"+response)
              })
      },
      // 尝试

    getAllRegulaionTreeStructure(str) {
      let that = this
      this.$request({
        url: '/regulations/queryAllRegulaionTreeStructure',
        method: 'post',
        data: {
          queryString: str
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.treeDataLink = res.data
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    //非预期选中文本
    getSelectText() {
      try{
        this.selectText = window.getSelection().toString()
      }catch(e){
        this.selectText = document.selection.createRange().text;
      }
    },
    changeLogic() {
      this.isLogicChange = true;
      let widthlogic = [];
      let heightlogic = [];
      this.$nextTick(() => {
        let box = this.$refs['box'];
        let boxbox = this.$refs['boxbox'];
        box.forEach(item => {
          heightlogic.push(item.clientHeight)
        });
        boxbox.forEach(el => {
          widthlogic.push(el.clientWidth)
        });
        this.logicData.forEach((ele, index) => {
          let h = heightlogic[index] / 2;
          let w = widthlogic[index];
          this.$set(ele,'width', Math.sqrt(h*h + w*w).toFixed(2));
          this.$set(ele,'angle', (Math.atan(h/w))/(Math.PI/180));
          this.$set(ele,'height', heightlogic[index]);
        });
      })

      if(this.logicData.length == 1) {
        this.isLogicDataOne = true;
        this.isLogicData = true;
      } else if (this.logicData.length > 1) {
        this.isLogicDataOne = false;
        this.isLogicData = true;
        this.$nextTick(() => {
          let h = this.$refs.logic.offsetHeight;
          this.$refs.count.style.height = h - 15 + 'px';
        })
      } else {
        this.isLogicData = false;
      }
    },
    nodeChange() {
      if(this.isLogicChange) {
        this.changeDialogLogic = true;
      }
    },

      // 李康写左侧报警卡删除调序功能
      //删除报警卡
      removeAlarmCard() {
          let that = this
          this.$request({
              url: '/regulations/removeAlarmCardTable',
              method: 'post',
              data: {
                  fileNum: that.fileNum,
                  table_id: that.removeAlarmCardRd_id
              }
          }).then(function (res) {
              if( res.state == 0) {
                  that.dialogDelAlarmCard = false;
                  that.$message.success("删除成功！");
                  that.getTree()
                  that.annexRequest();
                  window.setTimeout(function(){
                      that.annexRequest();
                      that.add();
                  },1200);
              }
          })
              .catch(function (error) {
                  console.log(error);
              })
      },
               // 规程文档预览 李康start
            down(e){
                this.isResizing = true;
                this.lastDownX = e.clientX;
                // 将鼠标选中文字功能禁止js，出现不能选中复制的效果
                document.onselectstart = function(){return false;}
            },
            move(e){
                if (!this.isResizing) return;
                this.offsetRight = this.$refs.container.clientWidth - (e.clientX - this.$refs.container.offsetLeft);
            },
            up(e){
                this.isResizing = false;
                // 打开禁止选中文字的功能
                document.onselectstart = function(){return true;}
            },
            // 上下的移动函数
            down1(e){
                this.isResizing1 = true;
                this.lastDownX1 = e.clientY;
                document.onselectstart = function(){return false;}
            },
            move1(e){
                if (!this.isResizing1) return;
                // this.rightHeight
                // - this.$refs.container.offsetLeft
                this.offsetRight1 = e.clientY-70;
                if(this.rightHeight-e.clientY+70-this.rightHeight*0.01<160){
                    this.offsetRight2=160;
                }else {
                    this.offsetRight2=this.rightHeight-e.clientY+70-this.rightHeight*0.01;
                };
            },
            up1(e){
                this.isResizing1 = false;
                document.onselectstart = function(){return true;}
            },
            // 移入   移出事件
            //解决在表格中移入，换行的问题，所以对于单行的需要特殊处理。
            mouseOver1(e) {
                if(!this.onlyPreview) {
                    return false;
                }
                var sx=e.currentTarget.id;
                if(sx==""){

                }else {
                    if(document.getElementById(sx).style.background=='rgb(204, 204, 204)') {
                        document.getElementById(sx).style = "border: 1px solid #008000;cursor: pointer;background:rgb(204, 204, 204);";
                    }
                }
            },
            mouseLeave1(e) {
                var sx=e.currentTarget.id;
                if(sx==""){

                }else {
                    if(document.getElementById(sx).style.background=='rgb(204, 204, 204)'){
                        document.getElementById(sx).style= "border: 1px solid transparent;background:rgb(204, 204, 204);";
                    }

                }
            },
            // 移入   移出事件
            mouseOver(e) {
                if(!this.onlyPreview) {
                    return false;
                }
                var sx=e.currentTarget.id;
                if(sx==''){
                }else {
                    if(document.getElementById(sx).style.background=='rgb(204, 204, 204)') {
                        document.getElementById(sx).style = "border: 1px solid #008000;cursor: pointer;background:rgb(204, 204, 204);";
                    }else {
                        document.getElementById(sx).style = "border: 1px solid #008000;cursor: pointer;";
                    }
                    // document.getElementById(sx).style= "border: 1px solid #008000;cursor: pointer;";
                    // C111EA
                    // #获得点击元素的第一个子元素
                    e.currentTarget.firstElementChild.style="display:inline;"
                }
            },
            mouseLeave(e) {
                var sx=e.currentTarget.id;
                if(sx==""){
                }else {
                    if(document.getElementById(sx).style.background=='rgb(204, 204, 204)'){
                        document.getElementById(sx).style= "border: 1px solid transparent;background:rgb(204, 204, 204);";
                    }else {
                        document.getElementById(sx).style= "";
                    }
                    // #获得点击元素的第一个子元素
                    e.currentTarget.firstElementChild.style="display:none;"
                }
            },










      // 移入   移出事件
      mouseOverx(e) {
          if(!this.onlyPreview) {
              return false;
          }
          var sx=e.currentTarget.id;
          if(sx==''){
          }else {
              if(document.getElementById(sx).style.background=='rgb(204, 204, 204)') {
                  document.getElementById(sx).style = "border: 1px solid #008000;cursor: pointer;background:rgb(204, 204, 204);";
              }else {
                  document.getElementById(sx).style = "border: 1px solid #008000;cursor: pointer;";
              }
              // document.getElementById(sx).style= "border: 1px solid #008000;cursor: pointer;";
              // C111EA
              // #获得点击元素的第一个子元素
              e.currentTarget.firstElementChild.style="display:inline;"
          }
      },
      mouseLeavex(e) {
          var sx=e.currentTarget.id;
          if(sx==""){
          }else {
              if(document.getElementById(sx).style.background=='rgb(204, 204, 204)'){
                  document.getElementById(sx).style= "border: 1px solid transparent;background:rgb(204, 204, 204);";
              }else {
                  document.getElementById(sx).style= "border: 1px solid transparent;";
              }
              // #获得点击元素的第一个子元素
              e.currentTarget.firstElementChild.style="display:none;"
          }
      },






            // 对特殊表格的处理函数
            handleTable(){
                var step = document.querySelectorAll('#laststep>table');
                for (var b = 0; b < step.length; b++) {
                    var parent = step[b].children[0].children
                    var arr = []
                    var Match = (function () {
                        var arr = null;
                        var len = 0;
                        return {
                            max: function (arr, len) {
                                arr = arr;
                                len = arr.length;
                                var newArr = arr.sort();
                                return newArr[len - 1];
                            }
                        }
                    })();
                    for (var j = 0; j < parent.length; j++) {
                        arr.push(parent[j].children.length)
                        this.maxCount = Match.max(arr);
                    }
                    // 对E-0-0附件2中步骤9后面的特殊表格的style中text-align单独设置left，判断每行的td数是否为1并且每行的td数是否相同
                    if (Math.max.apply(null, arr) == 1 && Math.min.apply(null, arr) == 1 && Math.max.apply(null, arr) === Math.min.apply(null, arr)) {
                        step[b].setAttribute('style', 'border-collapse: collapse; width: 100%; text-align: left;line-height: 40px;text-indent: 2%;')
                    }
                    for (var j = 0; j < parent.length; j++) {
                        if (parent[j].children.length == 1) {
                            parent[j].children[0].setAttribute('colspan', this.maxCount)
                        } else {
                            var xhtimes = this.maxCount - parent[j].children.length;
                            for (var p = 0; p < xhtimes; p++) {
                                var newnode = document.createElement("td");
                                parent[j].appendChild(newnode);
                            }
                        }
                    }
                }
            },


            // 移入   移出事件
            mouseOverimg(e) {
                e.currentTarget.classList.add('className')
            },
            mouseLeaveimg(e) {
                e.currentTarget.classList.remove('className')
            },
//             // 上传图片的功能
            //文件超出个数限制时的钩子【判断上传的图片是否超过限制，超过提醒删除再进行上传】
            handleExceed: function () {
                this.$alert('图片最多上传一张，请删除再重新上传！', '', {
                    showConfirmButton: false,
                    callback: action => {}
                });
            },

            //新的编辑器tinymac
            //鼠标单击的事件
            onClick(e, editor) {
                // console.log('Element clicked')
                // console.log(e)
                // console.log(editor)
            },
            //清空内容
            // clear() {
            //     this.$refs.editor.clear()
            // },


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

            getFile(file, fileList) {
                this.getBase64(file.raw).then(res => {
                    this.pict=res;
                });
            },

            arise(e,cxNum,dataCon){
                this["show"+cxNum]=true;
                this.youjiLay1 = true

                if (cxNum==1){
                    this.substance=e.currentTarget.nextElementSibling.innerHTML;
                    this.core=e.currentTarget.nextElementSibling.getAttribute('modeltype');
                }else if(cxNum==5){//当为修改说明部分的时候，禁止enter键的使用
                    this.substance=e.currentTarget.nextElementSibling.innerHTML;
                    document.onkeydown = function(e) {
                        var ev = (typeof event!= 'undefined') ? window.event : e;
                        if(ev.keyCode == 13) {
                            return false;
                        }
                    }
                    var s1=this.previews2[0];
                    var num1=(s1.split('</p>')).length-1;
                    var s2=this.previews2[2];
                    var num2=(s2.split('</p>')).length-1;
                    // 添加必要的p标签，使得第三行和第一行的p标签的数量相同（修改说明部分）
                    if(num1==num2){
                    }else if(num1>num2){
                        for(var i=0;i<num1-1;i++){
                            this.previews2[2]+='<p></p>';
                        }
                    }
                    this.obj = this.previews2
                    this.tempObj = []
                    this.obj.forEach(item => {
                        this.tempObj.push(item.replace(/\<p/g, '<p contenteditable="true"'))
                    })
                    this.obj = this.tempObj
                }else if(cxNum==6){
                    this.substance=e.currentTarget.nextElementSibling.innerHTML;
                    this.specid=e.currentTarget.parentElement.getAttribute('id');
                }else if(cxNum==7){
                     this.substance=e.currentTarget.parentElement.nextElementSibling.outerHTML;
                    this.specrd_id=e.currentTarget.parentElement.parentElement.getAttribute('rd_id');
                    }else {
                    this.substance=e.currentTarget.nextElementSibling.innerHTML;
                }
            },
            hideLay(qxNum){
                this["show"+qxNum]=false;
                this.youjiLay1 = false;
                this.substance='';
            },
            // 右下角保存走的接口   这里的接口可能会换
            saveHtml(e,wayNum) {
                this["show"+wayNum]=false;
                this.youjiLay1 = false
                if(wayNum=='1'){//文件编号和文件名字的修改
                    if(this.core=='3'){
                        var firsturl='regulations/updateRegulationNameAndCode?fileNum='+this.fileNum+'&regulaName='+this.substance;
                    }else if(this.core=='4'){
                        var firsturl='regulations/updateRegulationNameAndCode?fileNum='+this.fileNum+'&fileCode='+this.substance
                    }
                    var firsturl1 = firsturl.replace('#', '%23');
                    axios.post(firsturl1).then(res=>{
                        if( res.data.state==0){
                            // 延时(setTimeout)后指针指向发生变化
                            var that = this;
                            window.setTimeout((function() {
                                that.annexRequest();
                                that.add();
                                that.substance='';
                            })(), 1200);
                        }
                    })
                        .catch((error) =>{
                        });
                }else if(wayNum=='2') {// 文件级别的修改
                    this.arrGrade=[
                        this.$refs.grade1.innerHTML,
                        this.$refs.grade2.innerHTML
                        ]
                    axios.post('regulations/updateLevel', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'content': this.arrGrade,
                    }).then((res) => {
                        // console.log("3、返回的值",this.arrGrade,response)
                        if( res.data.state==0){
                            // 延时(setTimeout)后指针指向发生变化
                            var that = this;
                            window.setTimeout((function() {
                                that.annexRequest();
                                that.add();
                                that.substance='';
                            })(), 1200);
                        }
                    }).catch((error) => {
                        // console.log("3、错误"+response)
                    })
                }else if(wayNum=='3'){//名字图片修改部分
                    // 要以数组的形式传给后台
                    this.loadPict = [];//定义空数组
                     //吧src属性后面进行匹配，吧获取到的新的图片的路径赋值即可
                     this.loadPict.push(this.substance.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,'<img src="'+this.pict+'">'));
                    axios.post('regulations/updateFileApprove', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'content': this.loadPict,
                    }).then((res) => {
                        if( res.data.state==0){
                            // 延时(setTimeout)后指针指向发生变化
                            var that = this;
                            window.setTimeout((function() {
                                that.annexRequest();
                                that.add();
                                that.substance='';
                            })(), 1200);
                        }
                    }).catch((error) => {
                        // console.log("2、错误"+response)
                    })
                }
                else if(wayNum=='4') {//对应的人名和日期的修改
                    this.tempconte=[this.$refs.tempcon.innerHTML]
                    axios.post('regulations/updateFileApprove', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'content': this.tempconte,
                    }).then((res) => {
                        if( res.data.state==0){
                            // 延时(setTimeout)后指针指向发生变化
                            var that = this;
                            window.setTimeout((function() {
                                that.annexRequest();
                                that.add();
                                that.substance='';
                            })(), 1200);
                        }
                    }).catch((error) => {
                        // console.log("3、错误"+response)
                    })
                }else if(wayNum=='5'){//修改说明的接口改动
                     this.postData=[];
                    let smdata=this.$refs.smover.children;
                    for(var i=0;i<smdata.length;i++){
                        this.postData.push(smdata[i].children[0].innerHTML)

                    }
                    axios.post('regulations/updateRegulationRemarks', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'content': this.postData,
                    }).then((res) => {
                        // console.log("1、返回的值"+response)
                        if( res.data.state==0){
                            // 延时(setTimeout)后指针指向发生变化
                            var that = this;
                            window.setTimeout((function() {
                                that.annexRequest();
                                that.add();
                                that.substance='';
                            })(), 1200);
                        }
                    }).catch((error) => {
                        // console.log("1、错误"+response)
                    })
                }else if(wayNum=='6'){//目的和征兆条件的接口
                    // 根据id的不同值给不同的值
                    if(this.specid=='tj3'){
                        this.specnum='3'
                    }else if(this.specid=='tj4'){
                        this.specnum='4'
                    }
                    axios.post('regulations/updateCommonParagraph', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'paragraph_type': this.specnum,
                        'paragraph_content': this.substance,
                    }).then((res) => {
                        if( res.data.state==0){
                            // 延时(setTimeout)后指针指向发生变化
                            var that = this;
                            window.setTimeout((function() {
                                that.annexRequest();
                                that.add();
                                that.substance='';
                            })(), 1200);
                        }
                    }).catch((error) => {
                        // console.log("1、错误"+response)
                    })
                }else if(wayNum=='7'){//报警卡的修改
                    if(this.substance==''){
                        this.substance='<p></p>'
                    }
                    axios.post('regulations/updateAlarmCardTable', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'table_id': this.specrd_id,
                        'table_content': this.substance,
                    }).then((res) => {
                        if( res.data.state==0){
                            // 延时(setTimeout)后指针指向发生变化
                            var that = this;
                            window.setTimeout((function() {
                                that.getTree()
                                that.annexRequest();
                                that.add();
                                that.substance='';
                            })(), 1200);
                        }
                    }).catch((error) => {
                        // console.log("1、错误"+response)
                    })
                }

            },



            add(){
                ++this.suibian;
            },
            onEditorBlur(e,editorNun) {
                // console.log('editor blur!',e,editorNun)
            },
            onEditorFocus(e,editorNun) {
                // console.log('editor focus!', e,editorNun)
            },
            onEditorChange(e,editorNun) {
                // console.log('editor change!', e,editorNun)
                // this.content = html
            },
            //动态绑定id的方法
            gernerateId: function (index) {
                return index
            },
            annexRequest() {
                var that = this;
                that.teshuurl = 'regulations/getRegulationAllParagraph';
                axios.post(that.teshuurl + '?fileNum=' + that.fileNum)
                    .then(function (response) {
                        if(response.data.data==null){
                            that.annexRequest();
                        }else {
                            that.previews1 = response.data.data[0].content;
                            that.previews2 = response.data.data[1].content[0].content;
                            that.previews3 = response.data.data[2].content;
                            that.previews4 = response.data.data[3].content[0].content[0];
                            that.previewid = response.data.data[3].anchor_point;
                            that.previewsx = response.data.data[4];
                            that.fujian = response.data.data[5];
                            that.previewType = response.data.data[0].content[4].content;
                        }
                        that.msg++;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getScroll(event) {
                // 滚动条距离底部的距离scrollBottom
                this.scrollTop=event.target.scrollTop;
            },

            // 规程文档预览 李康end
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/*引入css 样式文件,添加到这就可以使得图片居中，但是添加到export default 上方就不行*/
@import './../../assets/user.css';
/* 设置滚动条的样式
::-webkit-scrollbar {
    width: 5px;
} */
/* 滚动槽
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(204, 204, 204, 1);
    border-radius: 0;
} */
/* 滚动条滑块
::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: rgba(84, 92, 100, 0.8);
}
::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(84, 92, 100, 0.3);
    width: 0;
} */
.content {
  .header {
    background-color: #303A47;
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    line-height: 60px;
    padding: 0 20px;
    img {
      float: left;
      width: 40px;
      margin-top: 8px;
      border: 2px solid #fff;
      border-radius: 50%;
    }
  }
  .main {
    padding: 5px;
    background-color: #ccc;
    width: 100%;
    position: absolute;
    top: 60px;
    bottom: 0;
    box-sizing: border-box;
    .hFourBoxer{
      border-bottom: 1px solid #ccc;
    }
    .hFourBoxer h4{
      font-weight: 700;
      font-size: 20px;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      display: inline-block;
    }
    .hFourBoxer i{
      font-weight: 700;
      font-size: 20px;
      height: 40px;
      line-height: 40px;
      padding-right: 10px;
    }
    h4 {
      font-weight: 700;
      font-size: 20px;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
    }
    .left-content {
      /*position: relative;*/
      float: left;
      /*width: 29%;*/
      background-color: #F2F2F2;
      /*height: 100%;*/
      margin-left: 5px;
      margin-bottom: 5px;
      margin-top: 5px;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      /*right: 100px;*/
      .treebox{width: 90%;margin: 0 auto;min-width: 480px;}
      .treelist{margin: 20px 0;}
      .titlebox{font-size: 0;display: inline-block;margin-left: 40px;}
      .titlebox span{font-size: 16px;}
      .whiteBac{background: #ffffff!important;}
      .yellowBac {background: yellow!important;;}
      .redBac{background: red!important;;}
      .circle{
        letter-spacing: 2px;
        border: none;
        font-size: 16px;
        border-radius: 100%;
        position: relative;
        z-index: 2;
        display: inline-block;
        width: 80px;
        /*宽度、高度都为32px，line-height为28px;记下这个差距*/
        height: 80px;
        line-height: 76px;
        background-color: #ffffff;
        text-align: center;
        box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
      }
      .lefttitle{border: 1px solid black;padding: 10px 20px;display: inline-block;vertical-align: middle;cursor: pointer;text-align: center;border-radius: 5px;max-width: 160px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
      .hengx{border: 0.5px solid black;width:50px;height:0;display:inline-block;vertical-align: middle;}
      .cftj{border: 1px solid black;padding: 5px 15px;display: inline-block;vertical-align: middle;cursor: pointer;border-radius: 5px;}
      .classred{background:#CCCCCC!important;border: 2px solid black; color: black!important;}
      .classred1{border: 1px solid black; }
      .classred3{background: #008000;color: #ffffff;}
    }
    .right-content {
      position: relative;
      float: right;
      height: 100%;

      /*position: absolute;*/
      right: 0;
      top: 0;
      bottom: 0;
      /*width: 200px;*/
      width: 70.5%;
      .preview {
        width: 100%;
        background: #fff;
        //box-shadow: 0px -7px 15px 0px #ccc,-7px 0px 15px 0px #ccc,0px 7px 15px 0px #ccc,7px 0px 15px 0px #ccc;
         /*规程文档预览 李康start*/
          .fj-boxer{overflow: auto;}
          .fj-box{margin: 10px 0;}
          #handle{position: absolute;left: -4px;top: 0;bottom: 0;width: 8px;cursor: w-resize;}
          .all-part {width: 74%;margin: 100px auto 0;min-width: 1000px; /*当宽度被挤压小于800px时，出现滚动条*/}
          .editicon{width: 18px;height: 18px;margin: 0 2px;line-height: 18px!important;}
          .editiconbox{position:absolute;float: right;right: 3px;top:0.5px;display:none;background-color: #008000;z-index: 10;}
          .editiconbox1{float: right;right: 3px;top:0.5px;background-color: #008000;}
          .deletebox{float: left;left: 3px;top:0.5px;background-color: #008000;}
          .allbox{overflow: hidden;position: absolute;width: 100%;z-index: 10;display: none;}
          .className{background-color: #2BD52B;}
          .left-box{width: 20%;float: left;}
          .big-title{font-size: 29.3px;text-align-last: justify; width: 90%;margin: 0 auto;}
          .xx-line{background-color: #0070C0;height: 1px;margin-bottom: 2px;}
          .crossing{background-color: #0070C0;height: 3px;}
          .right-box{width: 19%;float: right;right: 0;}
          .hn-logo{width: 100%;}
          .company{width: 64%;margin: 0 auto;text-align: center;}
          .order2{margin-top: 100px;}
          .order3{font-size: 24px;text-align: center;letter-spacing: 2px;margin: 80px 0;font-weight: bolder;}
          .gcname{position: relative;}
          .fjname{border: 1px solid transparent;position: relative;padding: 3px;}
          .order4{font-size: 18.6px;text-align: center;letter-spacing: 2px;font-weight: bolder;font-family: "Times New Roman";}
          .order5{text-align: center;margin: 50px 0;}
          .level{border: 1px dotted #000;text-align: center;font-weight: bolder;margin: 0 auto;width: 18%;overflow: hidden;position: relative;}
          .scale{float: left;width: 49%;}
          .level1{border: 1px solid #000;text-align: center;font-weight: bolder;width: 18%;overflow: hidden;position: relative;margin: 100px auto 50px;}
          .scale1{float: left;width: 49%;}
          .character{border: 1px solid #BBBBBB;margin: 5px;}
          .order7{margin-bottom: 30px;}
          .tableo{margin: 0 auto;width: 510px;overflow: hidden;}
          .r1{width: 80px;border-top: 1px dotted #000;border-left: 1px dotted #000;border-right: 1px dotted #000;border-bottom: none;}
          .r2{position:relative;width: 135px;border-left: none;border-right:  1px dotted #000;border-top: 1px dotted #000;border-top: 1px dotted #000;}
          .r3{position:relative;width: 135px;border-left: none;border-right:  1px dotted #000;border-top: 1px dotted #000;border-top: 1px dotted #000;}
          .r4{position:relative;width: 150px;border-top: 1px dotted #000;border-left: none;border-right: 1px dotted #000;border-bottom: none;}
          .r1,.r3, .r2,.r4{overflow: hidden;text-align: center;height: 55px;float: left;font-weight: bolder;font-size: 14px;}
          .namedate,.r1{line-height: 55px;}
          .namedatefj{line-height: 40px;}
          .rr{border-bottom: 1px dotted #000;}
          /*.Signature_picture{width: 10px;}*/
          .order8{overflow: hidden;}
          .banci{float: right;margin-right: 3%;font-size:14px;font-weight: bolder; margin-bottom: 20px;}
          .hline{height: 1px;background-color: #000000;}
          .hline2{margin: 3px 0;}
          .chanq{font-size: 14px;text-align: center;width: 96%;margin: 5px auto 0;font-weight: bolder;}
          /*修改说明*/
          .xgsm{margin: 50px auto 100px;width: 100%;overflow: hidden;}
          .sm-title{font-weight: bolder;font-size: 18.6px;text-align: center;letter-spacing: 3px;}
          .sm1{width: 9.5%;border-top: 1px solid #000;border-left: 1px solid #000;border-right: 1px solid #000;border-bottom: none;}
          .sm2{width: 17.5%;border-left: none;border-right:  1px solid #000;border-top: 1px solid #000;}
          .sm3{width: 17.5%;border-left: none;border-right:  1px solid #000;border-top: 1px solid #000;}
          .sm4{width: 55%;border-top: 1px solid #000;border-left: none;border-right: 1px solid #000;border-bottom: none;}
          .smcl{border: 1px solid #000;position: relative;}
          .tablesm{font-size: 16px;line-height: 40px;}
          .tablesm th{font-weight: bolder;border-right: 1px solid #000;}
          .tablesm th:last-child{border-right: none;}
          .tablesm1{font-size: 16px;line-height: 30px;border: 1px solid #000;margin: 0 auto;}
          .tablesm1 th{font-weight: bolder;border-right: 1px solid #000;}
          .tablesm1 th:last-child{border-right: none;}
          .smbody td{border: 1px solid #000;border-bottom: none;}
          .smbody td:first-child{border-left: none;border-bottom: none;}
          .smbody td:last-child{border-right: none;}
          .titll th{font-weight: bolder!important;font-size: 16px;line-height: 40px;}
          .tablex{font-size: 16px;border: 1px solid #000;}
          .tte{line-height: 40px;}
          .tablex td{height: 38px;}
          /*inherit  initial  separate  unset collapse*/
          .tablex th{font-weight: bolder;}
          .clock div{float: left;border-right: 1px solid black;border-bottom: 1px solid black;width: 24.92%;line-height: 50px;text-align: center;}
          .clock .clock1:last-child{border-right: none;}
          .form .clock:last-child .clock1{border-bottom: none;}
          table td{text-indent: 2px;vertical-align: text-top;}
          table .smpanel{text-indent: 2px;vertical-align:inherit;}
          table .smpanel1{text-indent: 2px;vertical-align:inherit;}
          /*目的部分*/
          .le-title{font-size: 16px;font-weight: bolder;line-height: 40px;text-indent: 2%;display: inline;padding: 3px;margin: 10px 0;}
          .aim{overflow: hidden;border: 1px solid transparent;position: relative;}
          .aimbox{line-height: 40px;font-size: 16px;text-indent: 4%;overflow: hidden;}
         .cardtable{margin: 50px 0;position: relative;border: 1px solid transparent;}
          /*处理步骤部分*/
          .step-box{margin-top: 100px;}
          .step-title{font-size: 16px;font-weight: bolder;text-indent: 2%;}
          .load1{margin: 30px 0;}
          .load{margin: 30px 0;border: none;}
          .respective{border: 1px solid #000;position: relative;}
          .respective1{border: 1px solid transparent;position: relative;}
          .respective2{border: 1px solid transparent;position: relative;}
          .yyle td{text-align: center;line-height: 40px;}
          .form td:first-child {font-weight: bolder;font-size: 18px;text-align: center;vertical-align: text-top;}
          .table2 tr{border-bottom:1px dashed #000;}
          .mindk .sky{text-align: left;vertical-align: text-top;text-indent: 2px;}
          .mindk .sky:first-child{text-align: center;font-weight: bolder;font-size: 18px;}
          .mindk td{border-right: 1px dotted #000;}
          .special{text-align: left;text-indent: 2%;border: 1px solid #000;position: relative;} /*注意那一部分的特殊处理*/
          .mindk th{border-bottom:1px solid #000;border-right: 1px dotted #000;}
          .procedure{border: 1px solid transparent;position: relative;}
          .ss1 .fujian{border: 1px solid transparent;position: relative;}
          .fujian{border: 1px solid transparent;}
          .fj-title{font-size: 16px;font-weight: bolder;text-indent: 2%;}
          .fj-title1{font-size: 16px;font-weight: bolder;}
          /*设置所有的td的位置，为了设置当内容为空时照样可以百分百占据td标签*/
          td{position: relative;}
          /*设置tiny编辑器的高度*/
          .tox-tinymce{height: 100%!important;}
          /*附件的第三种情况*/
          .fj-special{width: 100%;position: relative;border: 1px solid #000;}
          .fj-newadd{width: 100%;position: relative;border: 1px solid transparent;}
          .mindy tr{border-left: none;border-right: none;border-top: none;border-bottom: 1px dashed #000;}
          .mindy1{border-left: none;border-right: none;border-top: none;border-bottom: 1px dashed #000;height: 40px;line-height: 40px;text-indent: 2%;}
          .mindy2{height: 40px;line-height: 40px;text-indent: 2%;}
        /*开始添加操作文档的事件*/
          /*移入右击出现的菜单，背景色变色，文字颜色变化*/
          .overlay{position: fixed;top: 0;left: 0;z-index: 10;background: rgba(0,0,0,0.8);width: 100%;height: 100%;}
          .youji-lay{position: fixed;top: 0;left: 0;background:transparent;width: 100%;height: 100%;z-index: 2;}   /*处处删*/
          .youji-lay1{position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 2;background: rgba(0,0,0,0.8);}
          .sr-box{width: 60%;height: 550px;border-radius: 10px;background: #ffffff;left: 50%;position: absolute;overflow: hidden;top: 50%;margin-left: -30%;margin-top: -275px;}
          .del-box{width: 20%;height: 20%;border-radius: 10px;background: #ffffff;left: 50%;position: relative;overflow: hidden;top: 50%;margin-left: -10%;margin-top: -10%;}
          /*浮层的题目*/
          .over-title{font-size: 25px;font-weight: 600;height: 60px;line-height: 60px;text-indent: 5%;border-bottom: 1px solid #ccc;position: absolute;width: 100%;}
          .upload_img{text-align: center;    margin: 75px auto 20px;}
          .el-upload__tip{margin: 15px 0;}
          .core{width: 90%;border-radius: 5px;overflow-y: auto;margin: 0 auto;}
          .area-box{border: 1px solid #000000;width: 90%;height: 90%;margin: 0 auto;border-radius: 5px;overflow-y: auto;text-indent: 5%;}
          .sccstj2{overflow: auto;font-size: 22px;margin: 80px auto 10px; height: 300px;}
          .sccstj {overflow: auto;font-size: 22px;margin: 80px auto 10px;height: 300px; text-align: center;}
          /*移入右击出现的菜单，背景色变色，文字颜色变化*/
          .menu li:hover {background-color: #1790ff;color: white;}
          .menu {font-size: 16px;cursor: pointer;padding: 6px;position: absolute;z-index: 5;border-radius: 5px;border: 1px solid #999999;background-color: #f4f4f4;}
          .menu_item {line-height: 35px;text-align: center;font-size: 18px;letter-spacing: 3px;padding: 5px 10px;}
          .btn-box{text-align: center;margin-top: 5%;position: relative;}
          .conserve_de{margin-left: 5%;padding: 5px;letter-spacing: 3px;font-size: 15px;cursor: pointer;border: none;background-color: #409eff;border-radius:7px;color: #ffffff;text-align: center;}
          .conserve{margin-left: 5%;padding: 5px;letter-spacing: 3px;font-size: 15px;cursor: pointer;border: none;background-color: #008000;border-radius:7px;color: #ffffff;text-align: center;}
          .abolish{padding: 5px;letter-spacing: 3px;font-size: 15px;cursor: pointer;border: 1px solid #cccccc;border-radius:7px;background: transparent;color: #cccccc;text-align: center;}
          .abolish_de{padding: 5px;letter-spacing: 3px;font-size: 15px;cursor: pointer;border: 1px solid #cccccc;border-radius:7px;background: transparent;color: #cccccc;text-align: center;}
          .temp{background: #cccccc;}
          /*附件部分的按钮增加*/
          .tpwz{margin-left: 3%;padding: 5px;letter-spacing: 2px;font-size: 14px;cursor: pointer;border: none;background-color: #008000;border-radius: 7px;color: #ffffff; }
          /*规程文档预览 李康end*/
      }
      .logic {
        width: 100%;
        background: #fff;
        position: relative;
        //box-shadow: 0px -7px 15px 0px #ccc,-7px 0px 15px 0px #ccc,0px 7px 15px 0px #ccc,7px 0px 15px 0px #ccc;
        #handle1{position: absolute;top: -4px;bottom: 0;height: 8px;width:100%;cursor: s-resize;}
        .handle_logic {
          position: absolute;
          top: 110px;
          left: 10px;
          bottom: 0;
          right: 10px;
          padding: 20px 30px;
          overflow-y: auto;
          .box {
            .expression3 {
              display: flex;
              height: 100%;
            }
          }
          .add-express-btn {
            display: inline-block;
            border: 1px solid #ccc;
            padding: 10px 45px;
            .expression3 {
              display: flex;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
  .character p{line-height: 18px;height: 18px;}
  .area-box p{height: 100%;width: 100%;}
</style>

<!--<template>-->
  <!--<div>-->
  <!--<div v-for="(item, index) in data" :key="index" class="sub-list">-->
    <!--<div>{{ item.name }}</div>-->
    <!--<div class="op-box">-->
      <!--<span @click="onUpItem(item, index)">上移</span>-->
      <!--<span @click="onDownItem(item, index)">下移</span>-->
    <!--</div>-->
  <!--</div>-->
  <!--</div>-->
<!--</template>-->
<!--<script>-->
    <!--export default {-->
        <!--data () {-->
            <!--return {-->
                <!--data: [-->
                    <!--{name: '1'},-->
                    <!--{name: '2'},-->
                    <!--{name: '3'},-->
                    <!--{name: '4'}-->
                <!--]-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--// 上移-->
            <!--onUpItem (item, index) {-->
                <!--this.data.splice(index - 1, 0, item)-->
                <!--this.data.splice(index + 1, 1)-->
            <!--},-->
            <!--// 下移-->
            <!--onDownItem (item, index) {-->
                <!--this.data.splice(index + 2, 0, item)-->
                <!--this.data.splice(index, 1)-->
            <!--}-->
        <!--}-->
    <!--}-->
<!--</script>-->