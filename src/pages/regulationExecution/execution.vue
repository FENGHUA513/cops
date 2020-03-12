<template>
  <div class="content" ref="container" @mousemove="move($event)" @mouseup="up($event)">
    <div class="header">
      <img src="@/assets/back.png" alt="" style="cursor: pointer;" @click="backInfo">
      <span>{{headerName}}</span>
    </div>
    <div class="main">
      <!-- 规程树形结构部分 -->
      <div class="left-content" v-if="onlyPreview"  :style="{'right': offsetRight +'px','width':allWidth-offsetRight-10 +'px' }">
        <h4>规程结构</h4>
        <!-- 树模型-处理步骤 -->
        <div class="process">
          <!-- 入口条件 -->
          <div class="enter">
            <div style="padding:5px;background: #F5F5F5;border-radius: 5px;">
              <i v-if="enterData.length > 0" class="el-icon-caret-bottom" style="cursor: pointer;font-size: 20px;color: #000;" @click="enterchange = !enterchange" :class="{rotate: !enterchange}"></i>
              <i v-else style="display: inline-block;width: 20px;height: 20px;"></i>
              <span style="font-weight: 700;">入口条件</span>
              <i class="el-icon-plus" @click="addEnterDialog = true" style="cursor: pointer;float: right;font-size: 20px;color:green;font-weight: 700;"></i>
            </div>
            <div v-if="enterchange" v-for="(enterItem, index) in enterData" :key="index" style="padding: 8px;">
              <!-- 第二层 入口条件 -->
              <el-row style="height: 30px;line-height: 30px;">
                <el-col :span="19" :class="['enter-el',('enter'+index == indexenter) ? 'entersele' : 'enterinsele']">
                  <div @click="treeClick('enter', 'enter'+index);enterClick(enterItem)" @contextmenu.prevent="treeRightClick($event, enterItem, 'enter', 'enter'+index)" style="cursor: pointer;font-size:14px;">
                    <span v-if="enterItem.title.replace(/<[^>]+>/g,'').length > 27">{{enterItem.title.replace(/<[^>]+>/g,'').substring(0,27)+'...'}}</span>
                    <span v-else>{{enterItem.title.replace(/<[^>]+>/g,'')}}</span>
                  </div>
                </el-col>
                <el-col :span="2" style="height: 100%;">
                  <div style="display: inline-block;width: 100%;vertical-align: middle;" :style="{'border': ('enter'+index == indexenter) ? '1px solid #000' : '0.5px solid #A4A4A4'}">
                  </div>
                </el-col>
                <el-col :span="3" style="height: 100%;cursor: pointer;">
                  <div :class="['enterbox','enter'+index == indexenter ? 'enterccc' : (enterItem.hasLogicContent ? 'entergreen' : 'enterwhite')]" @click="treeClick('enter', 'enter'+index);enterClick(enterItem)"></div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 看板 -->
          <div class="warn">
            <div style="padding:5px;background: #E7D478;border-radius: 5px;">
              <i v-if="watchData.length > 0" class="el-icon-caret-bottom" style="cursor: pointer;font-size: 20px;color: #000;" @click="warnchange = !warnchange" :class="{rotate: !warnchange}"></i>
              <i v-else style="display: inline-block;width: 20px;height: 20px;"></i>
              <span style="font-weight: 700;">看板</span>
              <i class="el-icon-plus" @click="addWarnDialog = true;watchPadType = 'global'" style="cursor: pointer;float: right;font-size: 20px;color:green;font-weight: 700;"></i>
            </div>
            <div v-if="warnchange" v-for="(watchItem, index) in watchData" :key="index" style="padding: 8px;">
              <!-- 第二层 看板 -->
              <el-row style="height: 30px;line-height: 30px;">
                <el-col :span="19" :class="['warn-el',('warn'+index == indexwarn || pre_table_id == watchItem.table_id) ? 'warnsele' : 'warninsele']">
                  <div @click="treeClick('warn', 'warn'+index);watchClick(watchItem)" @contextmenu.prevent="treeRightClick($event, watchItem, 'warn', 'warn'+index)" style="cursor: pointer;font-size:14px;">
                    <span v-if="watchItem.text.replace(/<[^>]+>/g,'').length > 27">{{watchItem.text.replace(/<[^>]+>/g,'').substring(0,27)+'...'}}</span>
                    <span v-else>{{watchItem.text.replace(/<[^>]+>/g,'')}}</span>
                  </div>
                </el-col>
                <el-col :span="2" style="height: 100%;">
                  <div style="display: inline-block;width: 100%;vertical-align: middle;" :style="{'border': ('warn'+index == indexwarn || pre_table_id == watchItem.table_id) ? '1px solid #000' : '0.5px solid #A4A4A4'}">
                  </div>
                </el-col>
                <el-col :span="3" style="height: 100%;cursor: pointer;">
                  <div :class="['warnbox','warn'+index == indexwarn || pre_table_id == watchItem.table_id ? 'warnccc' : (watchItem.hasLogicContent ? 'warngreen' : 'warnwhite')]" @click="treeClick('warn', 'warn'+index);watchClick(watchItem)"></div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="tree">
            <div v-for="(treeItem, index) in treeData" :key="index" class="item-tree">
              <div style="padding:5px;background: #F5F5F5;border-radius: 5px;">
                <el-row>
                  <el-col :span="1" style="text-align: center;">
                    <i v-if="treeItem.content && treeItem.content.length > 0" class="el-icon-caret-bottom" style="cursor: pointer;font-size: 20px;color: #000;" @click="open(treeItem)" :class="{rotate: !treeItem.change}"></i>
                    <i v-else style="display: inline-block;width: 20px;height: 20px;"></i>
                  </el-col>
                  <el-col :span="22">
                    <div @click="treeClick('main', index)" @contextmenu.prevent="treeRightClick($event, treeItem, 'main', index)" style="cursor: pointer;">
                      <span style="font-weight: 700;">{{treeItem.title.replace(/<[^>]+>/g,'').substring(0,4)}}</span>
                    </div>
                  </el-col>
                  <el-col :span="1" style="text-align: center;">
                    <i class="el-icon-plus" style="cursor: pointer;float: right;font-size: 20px;color:green;font-weight: 700;" @click="addTreeMain(treeItem)"></i>
                  </el-col>
                </el-row>
              </div>
              <!-- 第二层 处理步骤 -->
              <div v-if="treeItem.change" style="padding: 8px;" v-for="(stepItem, step) in treeItem.content" :key="`${index}-${step}`">
                <el-row style="height: 30px;line-height: 30px;">
                  <el-col :span="3" style="height: 100%;background: #F4E390;border-radius:3px 0 0 3px;font-size:14px;text-align: center;cursor: pointer;" :style="{'border': (`${index}-${step}` == (yuqiindexstep || feiyuqiindexstep)) ? '2px solid #000' : '1px solid #A4A4A4','border-right': 'none'}">
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        看板
                      </span>
                      <el-dropdown-menu slot="dropdown" size="mini">
                        <el-dropdown-item v-for="(watchPadItem, el) in stepItem.watchpad" :key="el" @click.native="prestepWatchClick(watchPadItem)">【{{watchPadItem.title.replace(/<[^>]+>/g,'').substring(0,3)}}】</el-dropdown-item>
                        <el-dropdown-item style="text-align: center;">
                          <i class="el-icon-plus" style="cursor: pointer;font-size: 20px;color:green;font-weight: 700;" @click="addPrestepWatchpad(stepItem)"></i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                  <el-col :span="13" style="height: 100%;border-radius:0 3px 3px 0;" :class="{'highLight': `${index}-${step}` == (yuqiindexstep || feiyuqiindexstep)}" :style="{'border': (`${index}-${step}` == (yuqiindexstep || feiyuqiindexstep)) ? '2px solid #000' : '1px solid #A4A4A4','border-left': 'none'}">
                    <el-row style="height: 100%;">
                      <el-col :span="2" style="height: 100%;text-align: center;">
                        <i v-if="stepItem.content && stepItem.content.length > 0" class="el-icon-caret-bottom" style="cursor: pointer;font-size: 20px;color: #000;" @click="open(stepItem)" :class="{rotate: !stepItem.change}"></i>
                        <i v-else style="display: inline-block;width: 20px;height: 20px;"></i>
                      </el-col>
                      <el-col :span="20" style="height: 100%;">
                        <div @click="treeClick('step', `${index}-${step}`);clickTree(treeItem, stepItem, '', 'initialize')" @contextmenu.prevent="treeRightClick($event, stepItem, 'step', `${index}-${step}`)" style="cursor: pointer;">
                          <span v-if="stepItem.title.replace(/<[^>]+>/g,'').length > 12" style="font-weight: 700;">{{stepItem.title.replace(/<[^>]+>/g,'').substring(0,13)+'...'}}</span>
                          <span v-else style="font-weight: 700;">{{stepItem.title.replace(/<[^>]+>/g,'')}}</span>
                        </div>
                      </el-col>
                      <el-col :span="2" style="height: 100%;text-align: center;">
                        <i class="el-icon-plus" style="cursor: pointer;color:green;font-weight: 700;" @click="addTreeCheck(stepItem)"></i>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="2" style="height: 100%;">
                    <div style="display: inline-block;width:100%;vertical-align: middle;" :style="{'border': (`${index}-${step}` == (yuqiindexstep || feiyuqiindexstep)) ? '1px solid #000' : '0.5px solid #A4A4A4'}">
                    </div>
                  </el-col>
                  <el-col :span="3" style="height: 100%;cursor: pointer;">
                    <div :style="{'border': (`${index}-${step}` == (yuqiindexstep || feiyuqiindexstep)) ? '2px solid #000' : '1px solid #A4A4A4','border-right': (`${index}-${step}` == (yuqiindexstep || feiyuqiindexstep)) ? '0px solid #000' : '0px solid #A4A4A4'}" :class="['tree-suffix',`${index}-${step}` == yuqiindexstep ? 'suffixccc' : (stepItem.hasLogicContent ? 'suffixgreen' : 'suffixwhite')]" @click="logicType = 'expect';treeClick('step', `${index}-${step}`);clickTree(treeItem, stepItem);expectClick(stepItem)">
                      预期
                    </div>
                  </el-col>
                  <el-col :span="3" style="height: 100%;">
                    <div :style="{'border': (`${index}-${step}` == (yuqiindexstep || feiyuqiindexstep)) ? '2px solid #000' : '1px solid #A4A4A4', 'border-left' : (`${index}-${step}` == (yuqiindexstep || feiyuqiindexstep)) ? '1px solid #000' : '1px solid #A4A4A4'}" :class="['tree-suffix',`${index}-${step}` == feiyuqiindexstep ? 'suffixccc' : (stepItem.hasLogicContent_unexpect ? 'suffixgreen' : 'suffixwhite')]" @click="logicType = 'unexpect';treeClick('step', `${index}-${step}`, 'unexpected');clickTree(treeItem, stepItem);expectClick(stepItem)">
                      非预期
                    </div>
                  </el-col>
                </el-row>
                <!-- 第三层 核对项 -->
                <div v-if="stepItem.change" style="margin-top:16px;" v-for="(itemItem, item) in stepItem.content" :key="`${index}-${step}-${item}`">
                  <el-row style="height: 30px;line-height: 30px;">
                    <el-col :span="4" style="height: 100%;"></el-col>
                    <el-col :span="12" style="height: 100%;border-radius:3px;border:1px solid #A4A4A4;padding-left: 10px;" :class="{'highLight': `${index}-${step}-${item}` == (yuqiindexitem || feiyuqiindexitem)}" :style="{'border': (`${index}-${step}-${item}` == (yuqiindexitem || feiyuqiindexitem)) ? '2px solid #000' : '1px solid #A4A4A4'}">
                      <div @click="treeClick('item', `${index}-${step}-${item}`);clickTree(treeItem, stepItem, itemItem, 'initialize')" @contextmenu.prevent="treeRightClick($event, itemItem, 'item', `${index}-${step}-${item}`)" style="cursor: pointer;">
                        <span v-if="itemItem.title.replace(/<[^>]+>/g,'').length > 14">{{itemItem.title.replace(/<[^>]+>/g,'').substring(0,15)+'...'}}</span>
                        <span v-else>{{itemItem.title.replace(/<[^>]+>/g,'')}}</span>
                      </div>
                    </el-col>
                    <el-col :span="2" style="height: 100%;">
                      <div style="display: inline-block;width:100%;vertical-align: middle;" :style="{'border': (`${index}-${step}-${item}` == (yuqiindexitem || feiyuqiindexitem)) ? '1px solid #000' : '0.5px solid #A4A4A4'}">
                      </div>
                    </el-col>
                    <el-col :span="3" style="height: 100%;cursor: pointer;">
                      <div :style="{'border': (`${index}-${step}-${item}` == (yuqiindexitem || feiyuqiindexitem)) ? '2px solid #000' : '1px solid #A4A4A4','border-right': (`${index}-${step}-${item}` == (yuqiindexitem || feiyuqiindexitem)) ? '0px solid #000' : '0px solid #A4A4A4'}" :class="['tree-suffix',`${index}-${step}-${item}` == yuqiindexitem ? 'suffixccc' : (itemItem.hasLogicContent ? 'suffixgreen' : 'suffixwhite')]" @click="logicType = 'expect';treeClick('item', `${index}-${step}-${item}`);clickTree(treeItem, stepItem, itemItem);expectClick(itemItem)">
                        预期
                      </div>                      
                    </el-col>
                    <el-col :span="3" style="height: 100%;">
                      <div :style="{'border': (`${index}-${step}-${item}` == (yuqiindexitem || feiyuqiindexitem)) ? '2px solid #000' : '1px solid #A4A4A4', 'border-left' : (`${index}-${step}-${item}` == (yuqiindexitem || feiyuqiindexitem)) ? '1px solid #000' : '1px solid #A4A4A4'}" :class="['tree-suffix',`${index}-${step}-${item}` == feiyuqiindexitem ? 'suffixccc' : (itemItem.hasLogicContent_unexpect ? 'suffixgreen' : 'suffixwhite')]" @click="logicType = 'unexpect';treeClick('item', `${index}-${step}-${item}`, 'unexpected');clickTree(treeItem, stepItem, itemItem);expectClick(itemItem)">
                        非预期
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div style="width:80px;border:1px solid #000;height: 30px;border-radius: 3px;text-align: center;line-height: 30px;cursor: pointer;" @click="addAppendixDialog = true">
              <i class="el-icon-plus" style="font-size: 18px;color:green;font-weight: 700;"></i>附件
            </div>
          </div>
        </div>
      </div>
      <div class="right-content" ref="container1" @mousemove="move1($event)" @mouseup="up1($event)" :style="{'margin': !onlyPreview ? '0 auto' : 'none', 'float': !onlyPreview ? 'none' : 'right','width': offsetRight-10 +'px'}">
        <!-- 规程文档预览部分 李康start-->
        <!--rightHeight*0.42-->
        <div class="preview" id="previewpart" ref="filePreview" :style="{'height': !onlyPreview ? (rightHeight + 'px') : ( offsetRight1 + 'px')}">
          <div ref="handle" id="handle" @mousedown = down($event)></div>
          <!--:style="{'height': !onlyPreview ? (rightHeight*0.04 + 'px') : (rightHeight*0.032 + 'px')}"-->
          <h4>规程文档预览<span v-show="still">{{msg}}</span></h4>
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
              <div class="xgsm" >
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
                <div class="le-title">1   目的</div>
                <!--@contextmenu.prevent="rightClick($event,1,previews3)"-->
                <div class="aim" id="tj1"  @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                  <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,6)">
                     <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                  </span>
                  <div class="aimbox" v-html="previews3"></div>
                </div>
                <div class="le-title" :id="previewid">2 征兆和进入条件</div>
                <div class="aim" :id="index" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)" v-for="(item,index) in newEvidenceObj">
                   <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,6)">
                     <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                  </span>
                  <div class="aimbox" v-html="item"></div>
                </div>
              </div>
              <!--处理步骤部分-->
              <div class="step-box">
                <div class="step-title">{{previewsx.title}}</div>
                <!--表格渲染-->
                <div  v-for="(plmm1,index) in previewsx.content" class="load1">
                  <!--{{plmm1}}-->
                  <table class="tablex"  v-if="plmm1.tableType=='step'" :style="active" cellspacing="0" cellpadding="0" width="100%">
                    <!--@mouseover="mouseOver($event)" :id="plmm1.table_id" @mouseleave="mouseLeave($event)"-->
                    <!--@contextmenu.prevent="rightClick($event,5,plmm1,plmm1.tableType,plmm1.tableRowSize)"-->
                    <tr style="border-collapse: inherit;">
                      <th width="6.5%" align="center"></th>
                      <th width="1%" align="center"></th>
                      <th width="47%" align="center"></th>
                      <th width="1%" align="center"></th>
                      <th width="44.5%" align="center"></th>
                    </tr>
                    <tbody class="mindk mindy">
                    <tr v-for="(lis,index) in plmm1.content">
                      <!--第一种情况，表格类型-->
                      <td v-for="(list,index) in lis.content"  :ordinal="index"  class="sky">
                        <!--list.content[1]取值有问题，所以改为判断数据类型，string和object-->
                        <!--@contextmenu.prevent="rightClick($event,5,plmm1,plmm1.tableType,plmm1.tableRowSize)"-->
                        <div class="procedure" v-if="typeof (list.content)=='string'"   @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="list.anchor_point" :class="list.unexpected_empty">
                           <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                               <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                           </span>
                          <div class="tte" v-html="typeof (list.content)=='string'||''?list.content:''"></div>
                        </div>
                        <div class="procedure" v-else-if="typeof (list.content)!='string'"  v-for="mi in list.content"   @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="mi.anchor_point">
                           <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                          <div class="tte" v-html="!mi.anchor_point?'':mi.content"></div>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <!--第二种情况,单个框  注意和警告的接口走同一个，步骤和附件中的表格接口走同一个-->
                  <div v-else-if="plmm1.tableType=='watch'" v-for="(lis,index) in plmm1.content" @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="plmm1.table_id" class="special">
                     <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,8,plmm1)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                    <div v-for="(list,index) in lis.content" style="margin: 30px auto;line-height: 40px;">
                      <div v-if="typeof (list.content)=='string'" v-html="list.content"></div>
                      <div v-else-if="typeof (list.content)!='string'">
                        <div v-for="mi in list.content"  v-html="mi.content"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--附件部分-->
              <div class="annex-part" >
                <!--当附件没有内容的时候-->
                <div v-if="fujian.content==''"></div>
                <!--当附件有内容的时候-->
                <div v-if="fujian.content!=''">
                  <div class="fj-title">{{fujian.title}}</div>
                  <!--附件开始循环-->
                  <!--true则显示,false不显示-->
                  <div class="fj-box" v-for="(list,index) in fujian.content">
                    <!--show9专门对应 修改附件名称的部分-->
                    <span :id="list.rd_id" class="fjname" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                    <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,9)">
                      <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                    </span>
                    <span class="fj-title1" style="display: inline-block;" v-html="list.title"></span>
                   </span>
                    <!--show10对应,增加图片文字表格的浮层。show11对应,增加普通表格的浮层，-->
                    <input type="button" class="tpwz" :form_id="list.rd_id" @click="arise($event,10)" value="增加段落">
                    <!--<input type="button" class="tpwz" :form_id="list.rd_id" @click="arise($event,12)"  @mouseover="mouseOver2($event)" @mouseleave="mouseLeave2($event)" value="增加普通表格">-->
                    <!--附件这部分重新写有问题-->
                    <!--心得:v-for="(plmm,index) in list.content"要作为父级标签中，然后v-if="plmm.tableRowSize=='1'&&plmm.tableType=='common'"要放在子标签中才真正没有错误-->
                    <div class="load" v-for="(plmm,index) in list.content" >
                      <!--第一种情况单行注意或者警告这种添加外框，修改是和步骤中的警告和注意的接口同一个接口,这个是文件本身有的东西。-->
                      <div class="fj-special respective form" v-if="plmm.tableRowSize=='1'&&plmm.tableType=='watch'" name="1" :id="plmm.table_id" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)">
                        <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,8,plmm)">
                         <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                       </span>
                        <div v-for="mik in plmm.content" class="namedatefj" style="margin: 30px auto;padding-left: 1%;">
                          <div  v-for="milk in mik.content" v-html="milk.content"></div>
                        </div>
                      </div>
                      <!--这个解析的是新添加的增加图片文字的单行表格判断，是普通表格类型，修改的接口和附件里注意警告的修改是不同的。这是自己添加的。单独添加了右击事件 @contextmenu.prevent="rightClick($event)"-->
                      <div class="fj-newadd" v-if="plmm.tableRowSize=='1'&&plmm.tableType=='common'" name="11" :id="plmm.table_id" @mouseover="mouseOver($event)" @mouseleave="mouseLeave($event)" >
                        <div class="allbox">
                        <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,66)" :form_id="list.rd_id" :table_id="plmm.table_id" class="editiconbox1">
                            <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮">
                           </span>
                          <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,88)" :form_id="list.rd_id" :table_id="plmm.table_id" class="deletebox">
                            <img src="@/assets/delete.png" class="editicon" alt="编辑文字按钮">
                           </span>
                        </div>
                        <div v-for="mik in plmm.content" class="namedatefj">
                          <div v-for="milk in mik" v-html="milk" id="laststep" ref="laststep" text="000"></div>
                        </div>
                      </div>
                      <!--第二种情况 写完了-->
                      <div v-else-if="plmm.tableType=='step'" class="respective form" name="2">
                        <table class="table2" style="border:none;" cellspacing="0" cellpadding="0" width="100%">
                          <tr style="border: none;">
                            <th width="6.5%" align="center"></th>
                            <th width="1%" align="center"></th>
                            <th width="47%" align="center"></th>
                            <th width="1%" align="center"></th>
                            <th width="44.5%" align="center"></th>
                          </tr>
                          <tbody class="mindk" >
                          <tr v-for="(lis,index) in plmm.content" style="height: 40px;">
                            <td v-for="(list,index) in lis.content" :orderlist="index" :class="index==2?'ss1':'ss2'">
                              <div class="fujian" v-if="typeof (list.content)=='string'"  @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="list.anchor_point" :class="list.unexpected_empty">
                                  <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                                      <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮">
                                   </span>
                                  <div class="namedatefj" v-html="typeof (list.content)=='string'||''?list.content:''"></div>
                              </div>
                              <div class="fujian" v-else-if="typeof (list.content)!='string'"  v-for="mi in list.content"   @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="mi.anchor_point">
                                  <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                                    <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                                  </span>
                                  <div class="namedatefj" v-html="!mi.anchor_point?'':mi.content"></div>
                              </div>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                        <!--z注意:用v-if  v-else-if这种体系最好，别v-if  v-if 这样会使得渲染的东西没有系统性，不能按照数据顺序去加载。很难说清楚但是你明白的小宝贝。。-->
                        <!--img标签添加margin:0 auto;和display:block;即可使得它居中-->
                      </div>
                      <!--第三种情况  写完了-->
                      <div v-else-if="plmm.tableType=='step'" name="3" class="respective form">
                        <table style="border: none;" cellspacing="0" cellpadding="0" width="100%">
                          <tr class="mindk titll">
                            <th width="6.5%" align="center">步骤</th>
                            <th width="1%" align="center"></th>
                            <th width="47%" align="center">操作/预期响应</th>
                            <th width="1%" align="center"></th>
                            <th width="44.5%" align="center">非预期响应/操作</th>
                          </tr>
                          <tbody class="mindk">
                          <tr v-for="(lis,index) in plmm.content" style="height: 40px;">
                            <td v-for="(list,index) in lis.content">
                              <div class="fujian" v-if="typeof (list.content)=='string'"    @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="list.anchor_point" :class="list.unexpected_empty">
                                 <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                                     <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                                  </span>
                                <div class="namedatefj" v-html="typeof (list.content)=='string'||''?list.content:''"></div>
                              </div>
                              <div class="fujian" v-else-if="typeof (list.content)!='string'"  v-for="mi in list.content"   @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="mi.anchor_point">
                                <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                                  <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                                </span>
                                <div class="namedatefj" v-html="!mi.anchor_point?'':mi.content"></div>
                              </div>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--第四种情况，这里未动，417文件最后部分-->
                      <div v-else-if="plmm.tableRowSize=='11'&&plmm.tableType=='common'"    @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" style="width: 100%;overflow: hidden;"  class="respective1 yyle"  :id="plmm.table_id" name="4">
                        <div class="allbox">
                        <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,66)" :form_id="list.rd_id" :table_id="plmm.table_id" class="editiconbox1">
                            <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮">
                           </span>
                          <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,88)" :form_id="list.rd_id" :table_id="plmm.table_id" class="deletebox">
                            <img src="@/assets/delete.png" class="editicon" alt="编辑文字按钮">
                           </span>
                        </div>
                        <table border="1" style="width: 100%;">
                          <tbody>
                          <tr v-for="(lis,index) in plmm.content" class="fuj-hang">
                            <td style="text-align: center;" v-for="(list,index) in lis" v-html="list" class="fuj-lie"></td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--第六种情况：行数为3行 写完了-->
                      <div v-else-if="plmm.tableType=='step'" name="6" class="respective form">
                        <table class="table2" style="border: none;" cellspacing="0" cellpadding="0" width="100%">
                          <tr style="border: none;">
                            <th width="6.5%" align="center"></th>
                            <th width="1%" align="center"></th>
                            <th width="47%" align="center"></th>
                            <th width="1%" align="center"></th>
                            <th width="44.5%" align="center"></th>
                          </tr>
                          <tbody class="mindk" >
                          <tr v-for="(lis,index) in plmm.content" style="height: 40px;">
                            <td v-for="(list,index) in lis.content">
                              <div class="fujian" v-if="typeof (list.content)=='string'"    @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="list.anchor_point" :class="list.unexpected_empty">
                                 <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,7)" class="editiconbox">
                                     <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮">
                                  </span>
                                <div class="namedatefj" v-html="typeof (list.content)=='string'||''?list.content:''"></div>
                              </div>
                              <div class="fujian" v-else-if="typeof (list.content)!='string'"  v-for="mi in list.content"   @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="mi.anchor_point">
                                <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                                  <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮">
                                </span>
                                <div class="namedatefj" v-html="!mi.anchor_point?'':mi.content"></div>
                              </div>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--第七种情况：行数为4行-->
                      <div v-else-if="plmm.tableRowSize=='4'&&plmm.tableType=='step'" name="7" class="respective form">
                        <table class="table2" style="border: none;" cellspacing="0" cellpadding="0" width="100%">
                          <tr style="border: none;">
                            <th width="6.5%" align="center"></th>
                            <th width="1%" align="center"></th>
                            <th width="47%" align="center"></th>
                            <th width="1%" align="center"></th>
                            <th width="44.5%" align="center"></th>
                          </tr>
                          <tbody class="mindk">
                          <tr v-for="(lis,index) in plmm.content" style="height: 40px;">
                            <td v-for="(list,index) in lis.content">
                              <div class="fujian" v-if="typeof (list.content)=='string'"    @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="list.anchor_point" :class="list.unexpected_empty">
                                 <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                                     <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                                  </span>
                                <div class="namedatefj" v-html="typeof (list.content)=='string'||''?list.content:''"></div>
                              </div>
                              <div class="fujian" v-else-if="typeof (list.content)!='string'"  v-for="mi in list.content"   @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)" :id="mi.anchor_point">
                                <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" class="editiconbox" @click="arise($event,7)">
                                  <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮" >
                                </span>
                                <div class="namedatefj" v-html="!mi.anchor_point?'':mi.content"></div>
                              </div>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--第八种情况：需破坏真空紧急停机的事件 E-0- 0文件>附件2>第九条-->
                      <div v-else-if="plmm.tableRowSize=='12'&&plmm.tableType=='common'" class="respective2" name="8" :id="plmm.table_id" @mouseover="mouseOver($event)"  @mouseleave="mouseLeave($event)">
                        <div class="allbox">
                        <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,66)" :form_id="list.rd_id" :table_id="plmm.table_id" class="editiconbox1">
                            <img src="@/assets/editicon.png" class="editicon" alt="编辑文字按钮">
                           </span>
                          <span @mouseover="mouseOverimg($event)" @mouseleave="mouseLeaveimg($event)" @click="arise($event,88)" :form_id="list.rd_id" :table_id="plmm.table_id" class="deletebox">
                            <img src="@/assets/delete.png" class="editicon" alt="编辑文字按钮">
                           </span>
                        </div>
                        <table cellspacing="0" cellpadding="0" width="100%" style="border-bottom: 1px solid #000;border-top: 1px solid #000;border-left: 1px solid #000;border-right: 1px solid #000;">
                          <tbody>
                          <tr v-for="(lis,index) in plmm.content" class="mindy1">
                            <td v-for="(list,index) in lis" v-html="list"></td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
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
<!--对应修改说明部分  还没开始-->
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
            <!--对应步骤部分的正常表格修改-->
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
            <div class="sr-box" v-if="show8">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj">
                <!--富文本编辑器-->
                <tinymce-editor v-model="substance"
                                :disabled="disabled"
                                @onClick="onClick"
                                ref="editor"></tinymce-editor>
                <!--富文本编辑器-->
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(8)">取消</button>
                <button class="conserve" @click="saveHtml($event,8)">保存</button>
              </div>
            </div>
            <!--修改文件名称的部分-->
            <div class="sr-box" v-if="show9">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj">
                <textarea class="area-box" placeholder="随手记事" v-model="substance" ></textarea>
                <!--富文本编辑器-->
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(9)">取消</button>
                <button class="conserve" @click="saveHtml($event,9)">保存</button>
              </div>
            </div>
            <!--修改文件名称的部分-->
            <div class="sr-box" v-if="show10">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj">
                <!--富文本编辑器-->
                <div class="core">
                  <tinymce-editor v-model="newChart"
                                  :disabled="disabled"
                                  @onClick="onClick"
                                  ref="editor"></tinymce-editor>
                </div>
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(10)">取消</button>
                <button class="conserve" @click="saveHtml($event,10)">保存</button>
              </div>
            </div>
            <!--对应修改的在附件中新增加的普通表格的接口-->
            <div class="sr-box" v-if="show11">
              <div class="over-title">编辑内容:文字内容</div>
              <div class="sccstj">
                <!--富文本编辑器-->
                <div class="core">
                  <tinymce-editor v-model="substance"
                                  :disabled="disabled"
                                  @onClick="onClick"
                                  ref="editor"></tinymce-editor>
                </div>
              </div>
              <div class="btn-box">
                <button class="abolish"  @click="hideLay(11)">取消</button>
                <button class="conserve" @click="saveHtml($event,11)">保存</button>
              </div>
            </div>
            <!--删除附件中新添加的普通表格的操作，需要右击。-->
            <div class="del-box" v-if="show88">
              <div class="over-title">删除该项</div>
              <div class="btn-box" style="margin-top:90px;">
                <button class="abolish_de"  @click="hideLay(88)">取消</button>
                <button class="conserve_de" @click="saveHtml($event,88)">确认</button>
              </div>
            </div>
          </div>
        </div>
        <!-- 规程文档预览部分 李康end-->
        <!-- 逻辑编辑器部分 -->
        <!--rightHeight*0.57-->
        <div class="logic" :style="{'height':offsetRight2 + 'px','margin-top':rightHeight*0.01 + 'px'}" v-if="onlyPreview">
          <div ref="handle1" id="handle1" @mousedown = down1($event)></div>
          <h4>逻辑编辑</h4>
          <div v-if="currentEndPath" style="height: 30px;line-height: 30px;margin: 0 30px;">
            <span style="font-weight: 700;margin-right:10px;">当前项目</span>
            <span v-if="ifFrontPath">{{currentFrontPath}}</span>
            <span style="font-weight: 700;">{{currentEndPath}}</span>
            <el-button type="success" style="position: absolute;right:30px;margin-top:10px;background:green;" @click="saveLogic">保 存</el-button>
          </div>
          <div v-if="logicType == 'enter'" style="margin: 0px 30px;">
            <span style="font-weight: 700;margin-right:10px;">相关规程优先级:</span>
            <span>{{enterPriority}}</span>
            <el-button v-if="enterPriorityLength > 1" type="text" style="font-size:16px;font-weight: 700;" @click="showDialogEnterOrder = true">调整优先级</el-button>
            <el-button v-if="enterPriorityLength < 2" type="text" disabled style="font-size:16px;font-weight: 700;">调整优先级</el-button>
          </div>
          <div v-if="logicType == 'global'" style="margin: 10px 30px;">
            <span style="font-size: 14px;">触发条件:</span>
            <el-radio-group v-model="globalTrigger">
              <el-radio label="start">开始时触发一次</el-radio>
              <el-radio label="times">每隔<input type="text" v-model="globalTimes" style="width:40px;">秒触发一次</el-radio>
              <el-radio label="continuous">持续步骤</el-radio>
            </el-radio-group>
          </div>
          <div v-if="logicType == 'prestep'" style="margin: 10px 30px;">
            <span style="font-size: 14px;">触发条件:</span>
            <el-radio disabled v-model="prestepTrigger" label="beforenter">进入步骤前触发</el-radio>
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
                          <!-- 常规表达式 人工 -->
                          <el-input v-if="logicItem.data.value == 'manual'" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.data.manual.input" @change="changeLogic"></el-input>
                          <!-- 常规表达式   转 至 -->
                          <el-input v-if="logicItem.data.value == 'skip'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.data.skip.input" @change="changeLogic"></el-input>
                          <el-select v-if="logicItem.data.value == 'skip'" style="width: 125px;" v-model="logicItem.data.skip.value" @change="changeLogic">
                            <el-option
                              v-for="item in orderOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <el-cascader v-if="logicItem.data.value == 'skip' && logicItem.data.skip.value == 'self'"
                            :options="optionsMainStep"
                            v-model="logicItem.data.skip.fileValue"
                            :props="propsCascader"
                            @change="changeLogic">
                          </el-cascader>
                          <el-button v-if="logicItem.data.value == 'skip' && logicItem.data.skip.value == 'other'" type="info" @click="wordLink('logic', index, 'rule')">链接至</el-button>
                          <el-input v-if="logicItem.data.value == 'skip' && logicItem.data.skip.value == 'other'" :disabled="true" style="width: 160px;" v-model="logicItem.data.skip.linkTo" @change="changeLogic"></el-input>
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
                            <!-- 条件型逻辑表达式 成立 人工 -->
                            <el-input v-if="logicItem.then.value == 'manual'" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.then.manual.input" @change="changeLogic"></el-input>
                            <!-- 条件型逻辑表达式 成立   转 至 -->
                            <el-input v-if="logicItem.then.value == 'skip'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.then.skip.input" @change="changeLogic"></el-input>
                            <el-select v-if="logicItem.then.value == 'skip'" style="width: 125px;" v-model="logicItem.then.skip.value" @change="changeLogic">
                              <el-option
                                v-for="item in orderOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-cascader v-if="logicItem.then.value == 'skip' && logicItem.then.skip.value == 'self'"
                              :options="optionsMainStep"
                              v-model="logicItem.then.skip.fileValue"
                              :props="propsCascader"
                              @change="changeLogic">
                            </el-cascader>
                            <el-button v-if="logicItem.then.value == 'skip' && logicItem.then.skip.value == 'other'" type="info" @click="wordLink('logic', index, 'rule')">链接至</el-button>
                            <el-input v-if="logicItem.then.value == 'skip' && logicItem.then.skip.value == 'other'" :disabled="true" style="width: 160px;" v-model="logicItem.then.skip.linkTo" @change="changeLogic"></el-input>
                          </div>
                          <!-- 不成立 else -->
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
                              <el-select style="width: 85px;" v-model="logicItem.else.value" @change="changeLogic">
                                <el-option
                                  v-for="item in numOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <!-- 条件型逻辑表达式   不成立的 数字量 -->
                              <el-input v-if="logicItem.else.value == 'digit'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.else.digit.input" @change="changeLogic"></el-input>
                              <span v-if="logicItem.else.value == 'digit'" style="display:inline-block;width: 60px;text-align: center;">==</span>
                              <el-select v-if="logicItem.else.value == 'digit'" style="width: 60px;" v-model="logicItem.else.digit.value" @change="changeLogic">
                                <el-option
                                  v-for="item in digitOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                             <!-- 条件型逻辑表达式   不成立的 模拟量 -->
                              <el-input v-if="logicItem.else.value == 'analogy'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.else.analogy.input1" @change="changeLogic"></el-input>
                              <el-select v-if="logicItem.else.value == 'analogy'" style="width: 60px;" v-model="logicItem.else.analogy.value" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="logicItem.else.value == 'analogy'" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.else.analogy.input2" @change="changeLogic"></el-input>
                             <!-- 条件型逻辑表达式   不成立的 范围量 -->
                              <el-input v-if="logicItem.else.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.else.limits.input1" @change="changeLogic"></el-input>
                              <el-select v-if="logicItem.else.value == 'limits'" style="width: 60px;" v-model="logicItem.else.limits.value1" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="logicItem.else.value == 'limits'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.else.limits.kksValue" @change="changeLogic"></el-input>
                              <el-select v-if="logicItem.else.value == 'limits'" style="width: 60px;" v-model="logicItem.else.limits.value2" @change="changeLogic">
                                <el-option
                                  v-for="item in ruleLogicOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-input v-if="logicItem.else.value == 'limits'" minlength="1" maxlength="25" style="width: 60px;" v-model="logicItem.else.limits.input2" @change="changeLogic"></el-input>
                              <!-- 条件型逻辑表达式   不成立的 人工 -->
                              <el-input v-if="logicItem.else.value == 'manual'" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.else.manual.input" @change="changeLogic"></el-input>
                              <!-- 条件型逻辑表达式   不成立的   转 至 -->
                              <el-input v-if="logicItem.else.value == 'skip'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="logicItem.else.skip.input" @change="changeLogic"></el-input>
                              <el-select v-if="logicItem.else.value == 'skip'" style="width: 125px;" v-model="logicItem.else.skip.value" @change="changeLogic">
                                <el-option
                                  v-for="item in orderOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-cascader v-if="logicItem.else.value == 'skip' && logicItem.else.skip.value == 'self'"
                                :options="optionsMainStep"
                                v-model="logicItem.else.skip.fileValue"
                                :props="propsCascader"
                                @change="changeLogic">
                              </el-cascader>
                              <el-button v-if="logicItem.else.value == 'skip' && logicItem.else.skip.value == 'other'" type="info" @click="wordLink('logic', index, 'rule')">链接至</el-button>
                              <el-input v-if="logicItem.else.value == 'skip' && logicItem.else.skip.value == 'other'" :disabled="true" style="width: 160px;" v-model="logicItem.else.skip.linkTo" @change="changeLogic"></el-input>
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
                              <!-- 多项常规型逻辑表达式 人工 -->
                              <el-input v-if="multiItem.value == 'manual'" minlength="1" maxlength="25" style="width: 175px;" v-model="multiItem.manual.input" @change="changeLogic"></el-input>
                              <!-- 多项常规型逻辑表达式   转 至 -->
                              <el-input v-if="multiItem.value == 'skip'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="multiItem.skip.input" @change="changeLogic"></el-input>
                              <el-select v-if="multiItem.value == 'skip'" style="width: 125px;" v-model="multiItem.skip.value" @change="changeLogic">
                                <el-option
                                  v-for="item in orderOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                              <el-cascader v-if="multiItem.value == 'skip' && multiItem.skip.value == 'self'"
                                :options="optionsMainStep"
                                v-model="multiItem.skip.fileValue"
                                :props="propsCascader"
                                @change="changeLogic">
                              </el-cascader>
                              <el-button v-if="multiItem.value == 'skip' && multiItem.skip.value == 'other'" type="info" @click="wordLink('logic', index, 'rule')">链接至</el-button>
                              <el-input v-if="multiItem.value == 'skip' && multiItem.skip.value == 'other'" :disabled="true" style="width: 160px;" v-model="multiItem.skip.linkTo" @change="changeLogic"></el-input>
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
                                  <!-- 组合项常规型逻辑表达式 人工 -->
                                  <el-input v-if="content.value == 'manual'" minlength="1" maxlength="25" style="width: 175px;" v-model="content.manual.input" @change="changeLogic"></el-input>
                                  <!-- 组合项常规型逻辑表达式   转 至 -->
                                  <el-input v-if="content.value == 'skip'" onKeyUp="value=value.replace(/[^A-Za-z0-9_]/g,'')" minlength="1" maxlength="25" style="width: 175px;" v-model="content.skip.input" @change="changeLogic"></el-input>
                                  <el-select v-if="content.value == 'skip'" style="width: 125px;" v-model="content.skip.value" @change="changeLogic">
                                    <el-option
                                      v-for="item in orderOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                  <el-cascader v-if="content.value == 'skip' && content.skip.value == 'self'"
                                    :options="optionsMainStep"
                                    v-model="content.skip.fileValue"
                                    :props="propsCascader"
                                    @change="changeLogic">
                                  </el-cascader>
                                  <el-button v-if="content.value == 'skip' && content.skip.value == 'other'" type="info" @click="wordLink('logic', index, 'rule')">链接至</el-button>
                                  <el-input v-if="content.value == 'skip' && content.skip.value == 'other'" :disabled="true" style="width: 160px;" v-model="content.skip.linkTo" @change="changeLogic"></el-input>
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
    <!-- 右击事件 -->
    <div v-if="showAddMain" ref="addMain" :style="{'position': 'absolute','top': addMainY,'left':addMainX}">
      <el-button @click="addTreeMain">增加处理步骤</el-button>
    </div>
    <div v-if="showDelMain" ref="delMain" :style="{'position': 'absolute','top': addMainY,'left':addMainX}">
      <el-button style='width:95px;text-align:left;' @click="showDialogDelMain = true">删除附件</el-button>
    </div>
    <div v-if="showAddCheck" ref="addCheck" :style="{'position': 'absolute','top': addMainY,'left':addMainX}">
      <!-- <el-button style='width:104px;text-align:left;' @click="editTreeText">编辑文字</el-button>
      <br>
      <el-button style='width:104px;text-align:left;' @click="addTreeCheck">增加检查项</el-button>
      <br> -->
      <el-button style='width:125px;text-align:left;' @click="showDialogDelStep = true">删除处理步骤</el-button>
      <br>
      <el-button style='width:125px;text-align:left;' @click="treeOrder('step')">调序</el-button>
    </div>
    <div v-if="showDeleteCheck" ref="deleteCheck" :style="{'position': 'absolute','top': addMainY,'left':addMainX}">
      <!-- <el-button style='width:90px;text-align:left;' @click="editTreeText">编辑文字</el-button>
      <br> -->
      <el-button style='width:110px;text-align:left;' @click="showDialogDelCheck = true">删除检查项</el-button>
      <br>
      <el-button style='width:110px;text-align:left;' @click="treeOrder('item')">调序</el-button>
    </div>
    <div v-if="showDeleteWarn" ref="deleteWarn" :style="{'position': 'absolute','top': addMainY,'left':addMainX}">
      <el-button style='width:128px;text-align:left;' @click="showDialogDelWarn = true">删除监视板项</el-button>
    </div>
    <div v-if="showDeleteEnter" :style="{'position': 'absolute','top': addMainY,'left':addMainX}">
      <el-button style='width:102px;text-align:left;' @click="showDialogDelEnter = true">删除入口条件</el-button>
    </div>
    <!-- 添加监视项 -->
    <el-dialog title="添加监视项信息" :visible.sync="addWarnDialog" width="30%" center>
      <el-row style="margin-bottom: 10px;">
        <el-col :span="2">标题：</el-col>
        <el-col :span="22">
          <el-input v-model="globalWarnTitle" placeholder="请输入标题"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">内容：</el-col>
        <el-col :span="22">
          <el-input
            type="textarea"
            rows="8"
            resize = "none"
            placeholder="请输入内容"
            v-model="globalWarnContent">
          </el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addWarnDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveGlobalWarn">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 添加入口条件 -->
    <el-dialog title="增加入口条件" :visible.sync="addEnterDialog" width="30%" center>
      <el-row style="margin-bottom: 10px;">
        <el-col :span="24">条件项简述：</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input
            type="textarea"
            rows="8"
            resize = "none"
            placeholder="请输入内容"
            v-model="entryText">
          </el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" style="position: relative;height: 30px;">
        <el-button type="primary" @click="selectEntry" style="position: absolute;left:0;">从入口条件库中选择</el-button>
        <div style="position: absolute;right:0;">
          <el-button @click="addEnterDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveEntryText">保 存</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="选择入口条件" :visible.sync="seleEnterDialog" width="70%" center>
      <el-table ref="multipleEnter" :data="entryData" highlight-current-row border style="width: 99.9%;margin:10px 0;font-size: 16px;" @row-click="handleSelectionChange">
        <el-table-column type="index" align="center" width="50">
        </el-table-column>
        <el-table-column align="left" prop="description" label="入口条件" width="500">
        </el-table-column>
        <el-table-column align="left" prop="relationRegulation" label="涉及的规程">
        </el-table-column>
      </el-table>
      <el-pagination align="right" background layout="prev, pager, next" :current-page="entryPageData.pageNo" :total="entryPageData.count" @current-change="handleEntryChange">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seleEnterDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveEntrySelected">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加附件 -->
    <el-dialog title="添加附件" :visible.sync="addAppendixDialog" width="35%" center>
      <el-row style="margin-bottom: 10px;">
        <el-col :span="2">标题：</el-col>
        <el-col :span="22">
          <el-input v-model="appendixName" placeholder="请输入附件标题"></el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAppendixDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAppendix">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑文字 -->
    <el-dialog title="编辑文字" :visible.sync="editTreeTextDialog" width="35%" center>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="12"><div style="border:1px solid #ccc;height: 30px;line-height: 30px;text-align: center;">操作/预期响应</div></el-col>
        <el-col :span="12"><div style="border:1px solid #ccc;height: 30px;line-height: 30px;text-align: center;">非预期响应/操作</div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <quill-editor class="ql_container" style="height: 300px;"
            v-model="textContent"
            :options="editorOption">
           <!--  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)" -->
          </quill-editor>
        </el-col>
        <el-col :span="12">
          <quill-editor class="ql_container" style="height: 300px;"
            v-model="textUnexpected"
            :options="editorOption">
          </quill-editor>
          <!-- <el-input type="textarea" :rows="15" resize="none" v-model="textUnexpected">
          </el-input> -->
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTreeTextDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveTreeText">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 新增检查项 新增处理步骤 -->
    <el-dialog :title="addTitle" :visible.sync="showDialogCheck" width="35%" center>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="12"><div style="border:1px solid #ccc;height: 30px;line-height: 30px;text-align: center;">操作/预期响应</div></el-col>
        <el-col :span="12"><div style="border:1px solid #ccc;height: 30px;line-height: 30px;text-align: center;">非预期响应/操作</div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <quill-editor class="ql_container" style="height: 300px;"
            v-model="addCheckContent"
            :options="editorOption">
          </quill-editor>
        </el-col>
        <el-col :span="12">
          <quill-editor class="ql_container" style="height: 300px;"
            v-model="addCheckUnexpected"
            :options="editorOption">
          </quill-editor>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialogCheck = false">取 消</el-button>
        <el-button type="primary" @click="saveTreeCheck">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 删除附件 -->
    <el-dialog title="删除附件" :visible.sync="showDialogDelMain" width="35%" center>
      <p>你即将删除附件:</p>
      <p v-html="getTitle" style="padding:20px;font-weight: 700;font-size: 20px;color:#000;text-align: center;">{{getTitle}}</p>
      <p style="color:red;">该附件,以及附件下的处理步骤和检查项以及逻辑表达式,都会一起删除!</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialogDelMain = false">取 消</el-button>
        <el-button type="primary" @click="removeAppendix">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 删除处理步骤 -->
    <el-dialog title="删除处理步骤" :visible.sync="showDialogDelStep" width="35%" center>
      <p>你即将删除处理步骤:</p>
      <p v-html="getTitle" style="padding:20px;font-weight: 700;font-size: 20px;color:#000;text-align: center;">{{getTitle}}</p>
      <p style="color:red;">该步骤和步骤的逻辑条件,以及步骤下的检查项及检查项的逻辑,都会一起删除!</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialogDelStep = false">取 消</el-button>
        <el-button type="primary" @click="removeChecked">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 删除检查项 -->
    <el-dialog title="删除检查项" :visible.sync="showDialogDelCheck" width="35%" center>
      <p>你即将删除检查项:</p>
      <p v-html="getTitle" style="padding:20px;font-weight: 700;font-size: 20px;color:#000;text-align: center;">{{getTitle}}</p>
      <p style="color:red;">该检查项及检查项的逻辑,都会一起删除!</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialogDelCheck = false">取 消</el-button>
        <el-button type="primary" @click="removeChecked">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 删除入口条件 -->
    <el-dialog title="删除入口条件" :visible.sync="showDialogDelEnter" width="35%" center>
      <p>你即将删除入口条件:</p>
      <p v-html="getTitle" style="padding:20px;font-weight: 700;font-size: 20px;color:#000;text-align: center;">{{getTitle}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialogDelEnter = false">取 消</el-button>
        <el-button type="primary" @click="removeEntry">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 删除监视板 -->
    <el-dialog title="删除监视板项" :visible.sync="showDialogDelWarn" width="35%" center>
      <p>你即将删除监视板项:</p>
      <p v-html="getTitle" style="padding:20px;font-weight: 700;font-size: 20px;color:#000;text-align: center;">{{getTitle}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialogDelWarn = false">取 消</el-button>
        <el-button type="primary" @click="removeDelWarn">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 调序 -->
    <el-dialog title="调序" :visible.sync="showDialogOrder" width="35%">
      <div v-if="orderCurrentName" style="height: 30px;line-height: 30px;margin: 0 8px;">
        <span style="font-weight: 700;margin-right:10px;">当前调整项目</span>
        <span>{{orderCurrentName}}</span>
      </div>
      <ul>
        <li v-for="(orderItem, index) in orderData.data" :key="index" style="width: 100%;line-height: 2;border-radius: 5px;padding: 0 10px;box-sizing: border-box;margin-top:10px;" :style="{border: orderIndex == index ? '2px solid #000' : '1px solid #000'}">
          <el-radio v-if="orderItem.title.replace(/<[^>]+>/g,'').length > 27" v-model="currentOrder" :label="orderItem.rd_id" @change="(val) => getOrderIndex(val,index)">
            {{orderItem.title.replace(/<[^>]+>/g,'').substring(0,27)+'...'}}
          </el-radio>
          <el-radio v-else v-model="currentOrder" :label="orderItem.rd_id" @change="(val) => getOrderIndex(val,index)">
            {{orderItem.title.replace(/<[^>]+>/g,'')}}
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
          <el-button type="primary" @click="saveTreeOrder" style="background:green;border:1px solid green;">保 存</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="调整规程优先级" :visible.sync="showDialogEnterOrder" width="35%">
      <div v-if="currentEndPath" style="height: 30px;line-height: 30px;margin: 0 8px;">
        <span style="font-weight: 700;margin-right:10px;">当前入口条件</span>
        <span>{{currentEndPath}}</span>
      </div>
      <ul>
        <li v-for="(orderItem, index) in orderEnterData" :key="index" style="width: 100%;line-height: 2;border-radius: 5px;padding: 0 10px;box-sizing: border-box;margin-top:10px;" :style="{border: orderEnterIndex == index ? '2px solid #000' : '1px solid #000'}">
          <el-radio v-if="orderItem.regulationName.replace(/<[^>]+>/g,'').length > 27" v-model="currentEnter" :label="orderItem.order" @change="(val) => getEnterIndex(val,index)">
            {{orderItem.regulationName.replace(/<[^>]+>/g,'').substring(0,27)+'...'}}
          </el-radio>
          <el-radio v-else v-model="currentEnter" :label="orderItem.order" @change="(val) => getEnterIndex(val,index)">
            {{orderItem.regulationName.replace(/<[^>]+>/g,'')}}
          </el-radio>
        </li>
      </ul>
      <div style="overflow: hidden;margin-top:20px;">
        <div style="float: left;height: 32px;padding: 4px 8px;background: #DADADA;box-sizing: border-box;border:1px solid #C9C9C9;border-radius: 4px;">
          <i class="el-icon-download" style="font-size: 24px;font-weight: 700;color:#409EFF;cursor: pointer;" @click="downEnterOrder"></i>
          <i class="el-icon-upload2" style="font-size: 24px;font-weight: 700;color:#409EFF;cursor: pointer;" @click="upEnterOrder"></i>
        </div>
        <div style="float: right;">
          <el-button @click="showDialogEnterOrder = false">取 消</el-button>
          <el-button type="primary" @click="saveEnterOrder" style="background:green;border:1px solid green;">保 存</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 链接至 规程文档 -->
    <el-dialog title="规程文档" :visible.sync="showDialogLink" width="35%" center>
      <div>
        <span style="margin-left: 15px;">规程名：</span>
        <el-input v-model="searchLinkText" style="width: 70%;" placeholder="请输入内容" clearable>
        </el-input>
        <el-button type="primary" @click="searchLinks">查询</el-button>
      </div>
      <el-tree style="height: 300px;overflow-y: auto;" :data="treeDataLink" ref="treeLink" node-key="anchor_point" highlight-current
        :props="defaultProps" @node-click="clickItemTreeLink">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.type == 'list'" style="color:#000;font-weight: 700;" v-html="node.label">
            {{ node.label }}
          </span>
          <span v-else style="color:#000;" v-html="node.label">
            {{ node.label }}
          </span>
        </span>
      </el-tree>
      <hr>
      <p>已选定目标链接:</p>
      <p v-html="unanticipatedText1" style="margin-left: 30px;color:#000;"></p>
      <p v-html="unanticipatedText2" style="margin-left: 50px;color:#000;"></p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveLinkTo">确 定</el-button>
      </div>
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
      optionsMainStep: [],
      showAddMain: false,
      showAddCheck: false,
      showDelMain: false,
      showDeleteCheck: false,
      showDeleteWarn: false,
      showDeleteEnter: false,
      showDialogCheck: false,
      showDialogDelStep: false,
      showDialogDelMain: false,
      showDialogDelCheck: false,
      showDialogDelWarn: false,
      showDialogDelEnter: false,
      showDialogOrder: false,
      showDialogEnterOrder: false,
      showDialogLink: false,
      editTreeTextDialog: false,
      addWarnDialog: false,
      addEnterDialog: false,
      seleEnterDialog: false,
      entryData: [],
      entryPageData: {},
      addAppendixDialog: false,
      logicType: '',       //逻辑表达式类型  入口条件？看板？预期？非预期
      prestepWatchTableData: '', //前置监视项处理步骤数据
      watchPadType: '',          //全局监视项还是前置监视项
      prestepTrigger: 'beforenter',   //前置触发条件
      globalTrigger: 'start',    //全局触发条件
      globalTimes: 300,
      globalWarnTitle: '',
      globalWarnContent: '',
      entryText: '',
      appendixName: '',
      changeDialogLogic: false,
      isLogicChange: false,  //逻辑数据是否发生变化
      rightHeight: 0,
      radio: 'and',    //逻辑与还是逻辑或
      currentFrontPath: '',
      currentEndPath: '',
      enterPriority: '',
      enterPriorityLength: 0,
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
      }, {
        value: 'manual',
        label: '人 工'
      }, {
        value: 'skip',
        label: '转 至'
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
      unanticipatedText1: '',
      unanticipatedText2: '',
      searchLinkText: '',   //查询树形结构
      textContent: '',      //编辑文字 内容文字
      textUnexpected: '',   //编辑文字  非预期内容
      addCheckContent: '',  //增加检查项内容文字
      addCheckUnexpected: '',  //增加检查项非预期文字
      addTitle: '',
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
      unicode: '',       //从列表库选择
      treeData: [],
      enterData: [],
      watchData: [],
      rightData: {},
      orderCurrentName: '',
      orderData: {},
      orderEnterData: [],
      currentOrder: '',
      currentEnter: '',
      orderIndex: null,  //排序索引
      orderEnterIndex: null,
      warnchange: true,
      enterchange: true,
      indexwarn: null,
      indexenter: null,
      indexmain: null,
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
        // 规程文档预览 李康start
        tempObj:[],
        newEvidenceObj:[],
        evidenceId:'',
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
    this.getOneTree()
    this.getWatchPad()
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
            //获取渲染完毕之后的table标签内容
            this.$nextTick(()=> {
                var that=this;
                setTimeout(()=> {
                    //在加载完毕以后，再对表格进行dom的操作，获取dom对象
                    that.handleTable();
                },1000)
            })


            //李康结束
  },
  methods: {
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
            this.indexenter = null;
            break
          case 'item':
            this.feiyuqiindexstep = null;
            this.feiyuqiindexitem = index;
            this.yuqiindexitem = null;
            this.yuqiindexstep = null;
            this.indexwarn = null;
            this.indexmain = null;
            this.indexenter = null;
            break
          default:
            break
        }
      }
      switch (type) {
        case 'enter':
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.yuqiindexitem = null;
          this.yuqiindexstep = null;
          this.indexmain = null;
          this.indexwarn = null;
          this.indexenter = index;
          break
        case 'warn':
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.yuqiindexitem = null;
          this.yuqiindexstep = null;
          this.indexmain = null;
          this.indexenter = null;
          this.indexwarn = index;
          break
        case 'step':
          this.yuqiindexstep = index;
          this.yuqiindexitem = null;
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.indexwarn = null;
          this.indexmain = null;
          this.indexenter = null;
          break
        case 'item':
          this.yuqiindexitem = index;
          this.yuqiindexstep = null;
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.indexwarn = null;
          this.indexmain = null;
          this.indexenter = null;
          break
        default:
          break
      }
    },
    //树结构 左击事件
    clickTree(main, step, item, type) {
      let data;
      item ? data = item : data = step

      // this.point = data;
      // if(this.isLogicChange) {
      //   return
      // }
      
      let that = this;
      that.rd_id = data.rd_id;
      that.rd_id_unexpect = data.rd_id_unexpect;

      // 规程文档预览 李康start
      let id = data.rd_id;
      that.finder=data.rd_id;
      if(!document.getElementById(id)){
      }else {
          document.getElementById(id).scrollIntoView();  //  滚动到可视范围底部;
      }
        var allId=document.getElementById("previewpart").querySelectorAll('[id]');
        for(var i=0;i<allId.length;i++){
          allId[i].style= "background:transparent";
      }
      if(document.getElementById(id)) {
        document.getElementById(id).style='background:#cccccc;';
      }
      // 规程文档预览 李康end

      //获取核对项逻辑表达式
      if(type) {
        this.logicType = 'expect';
        this.expectClick(data)
      }

      //获取核对项非预期内容
      // this.getUnexpected(that.rd_id)

      this.currentFrontPath = '';
      this.currentEndPath = '';
      let frontPath = '';
      let endPath = '';
      if(data.type == 'step') {
        frontPath = main.title;
        this.isDisplay = true;
      } else if(data.type == 'items') {
        frontPath = main.title + step.title;
        this.isDisplay = true;
      }
      endPath = data.title;
      //正则匹配标签内容
      if(frontPath) {
        this.currentFrontPath = frontPath.match(/[^><]+(?=<\/(b|p)>)/g).join(' > ');
        this.currentEndPath = ' > ' + endPath.replace(/<[^>]+>/g,"");
      }
      if(this.currentFrontPath.length > 15){
        this.currentFrontPath = this.currentFrontPath.substring(0,15)+"...";
      }
      if(this.currentEndPath.length > 25){
        this.currentEndPath = this.currentEndPath.substring(0,25)+"...";
      }
      //右键添加按钮相关
      this.showAddMain = false;
      this.showAddCheck = false;
      this.showDelMain = false;
      this.showDeleteCheck = false;
      this.showDeleteWarn = false;
    },
    //入口条件 左击  表达式
    enterClick(data) {
      this.currentEndPath = data.title;
      if(this.currentEndPath.length > 45){
        this.currentEndPath = this.currentEndPath.substring(0,45)+"...";
      }
      this.ifFrontPath = false;
      this.logicType = 'enter';
      this.rd_id = data.rd_id;
      let that = this;
      this.$request({
        url: '/regulations/getLogicExpression',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: data.rd_id
        }
      }).then((res) => {
        if(res && res.data) {
          let data = JSON.parse(res.data);
          that.radio = data.radio;
          that.logicData = data.logicData;
        } else {
          that.logicData = [];
        }  
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
      
      this.renderEnterRegulation(data.rd_id)
        //李康 锚点
      document.getElementById(data.anchor_point).scrollIntoView();  //  滚动到可视范围底部;
      var allId=document.getElementById("previewpart").querySelectorAll('[id]');
      for(var i=0;i<allId.length;i++){
          allId[i].style= "background:transparent";
      }
      document.getElementById(data.anchor_point).style='background:#cccccc;';
      //李康 锚点
    },
    renderEnterRegulation(rdid) {
      let that = this;
      this.$request({
        url: '/regulations/getEntryConditionRelatedRegulation',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: rdid
        }
      }).then((res) => {
        if(res && res.state == 0) {
          let title = [];
          res.data.forEach(item => {
            title.push(item.regulationName)
          });
          that.enterPriority = title.join(',');
          that.enterPriorityLength = res.data.length;
          that.orderEnterData = res.data;
          if(that.enterPriority.length > 40) {
            that.enterPriority = that.enterPriority.substring(0,40) + '......'
          }
        }
      }).catch((error) => {
        console.log('error')
      })
    },
    //看板 左击 获取表达式
    watchClick(data) {
      this.ifFrontPath = false;
      this.table_id = data.table_id;
      var id = data.table_id;
      if(data.configureType == 'prestep') {
        this.logicType = 'prestep'
      } else {
        this.logicType = 'global'
      }

      let that = this;
      this.$request({
        url: '/regulations/getWatchpadTableConfigure',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          table_id: data.table_id
        }
      }).then((res) => {
        if(res && res.data) {
          try {
            let data = JSON.parse(res.data.logicExpression);
            that.radio = data.radio;
            that.globalTrigger = data.term;
            that.globalTimes = data.times;
            that.logicData = data.logicData;
          } catch(e) {
            that.logicData = []
          }
          that.currentEndPath = '设置看板信息项';
        }
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
        
      //李康 锚点
      document.getElementById(id).scrollIntoView();  //  滚动到可视范围底部;
      var allId=document.getElementById("previewpart").querySelectorAll('[id]');
      for(var i=0;i<allId.length;i++){
          allId[i].style= "background:transparent";
      }
      document.getElementById(id).style='background:#cccccc;';
      //李康 锚点
    },
    //树型结构 右击事件
    treeRightClick(e, data, type, index) {
      this.rightData.data = data;
      this.rightData.index = index;
      this.showAddCheck = false;
      this.showDeleteCheck = false;
      this.showDeleteWarn = false;
      this.showDeleteEnter = false;
      this.showDelMain = false;
      switch (type) {
        case 'enter':
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.yuqiindexitem = null;
          this.yuqiindexstep = null;
          this.indexwarn = null;
          this.indexenter = index;
          this.indexmain = null;

          this.getTitle = data.title;
          this.rd_id = data.rd_id;
          this.showDeleteEnter = true;
          this.addMainX = e.clientX + 'px';
          this.addMainY = e.clientY + 'px';
          break
        case 'main':
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.yuqiindexitem = null;
          this.yuqiindexstep = null;
          this.indexwarn = null;
          this.indexenter = null;
          this.indexmain = index;

          this.getTitle = data.title;
          this.rd_id = data.rd_id;
          this.showDelMain = true;
          this.addMainX = e.clientX + 'px';
          this.addMainY = e.clientY + 'px';
          break
        case 'warn':
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.yuqiindexitem = null;
          this.yuqiindexstep = null;
          this.indexmain = null;
          this.indexenter = null;
          this.indexwarn = index;

          this.getTitle = data.content;
          this.rd_id = data.table_id;
          this.showDeleteWarn = true;
          this.addMainX = e.clientX + 'px';
          this.addMainY = e.clientY + 'px';
          break
        case 'step':
          this.yuqiindexstep = index;
          this.yuqiindexitem = null;
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.indexwarn = null;
          this.indexmain = null;
          this.indexenter = null;

          this.getTitle = data.title;
          this.rd_id = data.rd_id;
          this.showAddCheck = true;
          this.addMainX = e.clientX + 'px';
          this.addMainY = e.clientY + 'px';
          break
        case 'item':
          this.yuqiindexitem = index;
          this.yuqiindexstep = null;
          this.feiyuqiindexstep = null;
          this.feiyuqiindexitem = null;
          this.indexwarn = null;
          this.indexmain = null;
          this.indexenter = null;

          this.getTitle = data.title;
          this.rd_id = data.rd_id;
          this.showDeleteCheck = true;
          this.addMainX = e.clientX + 'px';
          this.addMainY = e.clientY + 'px';
          break
        default:
          break
      }
      document.addEventListener('click', this.removeEvent)
    },
    //预期事件
    expectClick(data) {
      this.ifFrontPath = true;
      let rdid = '';
      switch (this.logicType) {
        case 'expect':
          rdid = data.rd_id;
          break
        case 'unexpect':
          rdid = data.rd_id_unexpect;
          break
        default:
          break
      }
      this.getLogicExpression(rdid)
      // 李康 描点
      let id = '';
      switch (this.logicType) {
        case 'expect':
          id = data.anchor_point;
          break
        case 'unexpect':
          id = data.anchor_point_unexpect;
          break
        default:
          break
      }

      // 李康 描点
      document.getElementById(id).scrollIntoView();  //  滚动到可视范围底部;
      var allId=document.getElementById("previewpart").querySelectorAll('[id]');
      for(var i=0;i<allId.length;i++){
          allId[i].style= "background:transparent";
      }
      document.getElementById(id).style='background:#cccccc;';
      // 李康 描点
    },
    //前置监视项 点击对应table_id
    prestepWatchClick(data) {
      this.pre_table_id = data.table_id;
      this.feiyuqiindexstep = null;
      this.feiyuqiindexitem = null;
      this.yuqiindexitem = null;
      this.yuqiindexstep = null;
      this.indexwarn = null;
      this.indexmain = null;
    },
    addPrestepWatchpad(data) {
      this.addWarnDialog = true;
      this.watchPadType = 'prestep';
      this.prestepWatchTableData = data;
    },
    //添加全局监视项
    saveGlobalWarn() {
      let that = this;
      if(this.globalWarnTitle == '' || this.globalWarnContent == '') {
        this.$message.error("请输入内容！");
        return
      }
      let content = '<p style="text-align: center;font-weight: bolder;">' + this.globalWarnTitle + '</p><p>' + this.globalWarnContent + '</p>';
      if(this.watchPadType == 'global') {
        axios({
          url: '/regulations/addGlobalWatchpadTable',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            fileNum: this.fileNum,
            table_content: content
          }
        }).then(function (res) {
          if(res.data && res.data.state == 0) {
            that.addWarnDialog = false;
            that.$message.success("添加监视项成功！");
            that.getTree()
            that.getWatchPad()
            that.annexRequest();//所有附件的请求接口
            that.globalWarnTitle = '';
            that.globalWarnContent = '';
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      } else {
        axios({
          url: '/regulations/addPrestepWatchpadTable',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            fileNum: this.fileNum,
            pre_table_id: this.prestepWatchTableData.table_id,
            table_content: content
          }
        }).then(function (res) {
          if(res.data && res.data.state == 0) {
            that.addWarnDialog = false;
            that.$message.success("添加监视项成功！");
            that.getTree()
            that.getWatchPad()
            that.annexRequest();//所有附件的请求接口
            that.globalWarnTitle = '';
            that.globalWarnContent = '';
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },
    //添加附件
    saveAppendix() {
      let that = this;
      if(this.appendixName == '') {
        this.$message.error("请输入附件标题！");
        return
      }
      this.$request({
        url: '/regulations/addAppendix',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          appendixName: this.appendixName
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.addAppendixDialog = false;
          that.$message.success("添加附件成功！");
          that.getTree()
          that.getWatchPad()
          that.appendixName = '';
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    handleSelectionChange(val) {
      this.unicode = val.unicode;
    },
    handleEntryChange(curPage) {
      this.entryPageData.pageNo = curPage
      this.selectEntry()
    },
    //从列表库选择
    selectEntry() {
      this.seleEnterDialog = true;
      let search = {
        pageNo: this.entryPageData.pageNo || 1,
        pageCount: 10
      };
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
        this.entryData = result;
      }).catch((error) => {
        console.log(error)
      })
    },
    //入口条件 列表库选择
    saveEntrySelected() {
      console.log(this.unicode)
      let that = this;
      if(this.unicode == '') {
        this.$message.error("请选择一条信息！");
        return
      }
      this.$request({
        url: '/regulations/addEntryConditionBySelected',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          unicode: this.unicode
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.addEnterDialog = false;
          that.seleEnterDialog = false;
          that.$message.success("选择入口条件成功！");
          that.getTree()
          that.getWatchPad()
          that.annexRequest()
          that.unicode = '';
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //入口条件 简述信息
    saveEntryText() {
      let that = this;
      if(this.entryText == '') {
        this.$message.error("请输入简述信息！");
        return
      }
      this.$request({
        url: '/regulations/addEntryCondition',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          description: this.entryText
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.addEnterDialog = false;
          that.$message.success("添加入口条件成功！");
          that.getTree()
          that.getWatchPad()
          that.annexRequest()
          that.entryText = '';
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
        if(res && res.state == 0) {
          that.treeData = [];
          res.data.forEach(item => {
            if(item.type != 'entryCondition') {
              that.treeData.push(item)
            } else {
              that.enterData = item.content;
            }
          });
          that.treeData.forEach(item => {
            let step = item.content;
            let stmp = [];
            that.$set(item,'change', true);
            step.forEach(el => {
              that.$set(el,'change', true);
            });
          });
          
          // if(that.point) {
          //   that.$nextTick(() => {
          //     that.$refs.tree.setCurrentKey(that.point.anchor_point)
          //     that.getLogicExpression(that.point.rd_id)
          //     that.getUnexpected(that.point.rd_id)
          //   })
          // }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //获取监视板数据
    getWatchPad() {
      let that = this
      this.$request({
        url: '/regulations/getWatchPadTreeStructure',
        // url: '/api/list',
        method: 'post',
        data: {
          fileNum: this.fileNum
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.watchData = res.data;
          res.data.forEach(item => {
            that.$set(item,'text', '【' + item.title + '】,【' + item.configure+ '】,' + item.content);
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //获取一级树模型结构
    getOneTree() {
      let that = this
      this.$request({
        url: '/regulations/getRegulationOneAndTwoStructure',
        method: 'post',
        data: {
          fileNum: this.fileNum
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.optionsMainStep = [];
          res.data.forEach(item => {
            let step = item.content;
            let stmp = [];
            step.forEach(el => {
              stmp.push({
                value: el.anchor_point,
                label: el.title.replace(/<[^>]+>/g,"").substring(0,10) + '..'
              })
            });
            that.optionsMainStep.push({
              value: item.anchor_point,
              label: item.title.replace(/<[^>]+>/g,"").substring(0,4),
              steps: stmp
            })
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //编辑文字 内容文字  树模型
    editTreeText() {
      let that = this
      that.editTreeTextDialog = true;
      //左侧内容文字
      this.$request({
        url: '/regulations/getCheckedContentByID',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: this.rd_id
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.textContent = res.data
        }
      })
      .catch(function (error) {
        console.log(error);
      });
      //非预期文字
      this.$request({
        url: '/regulations/getUnexpectedByID',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: this.rd_id
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.textUnexpected = res.data
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //编辑文字 保存
    saveTreeText() {
      let that = this
      if(this.textContent == '') {
        this.$message.error("请输入预期内容！");
        return
      }
      if(this.textUnexpected == '') {
        this.textUnexpected = '<p></p>';
      }
      axios({
        url: '/regulations/updateCheckContentAndUnexpectedContent',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          fileNum: this.fileNum,
          rd_id: this.rd_id,
          check_content: this.textContent,
          unexpected_content: this.textUnexpected
        }
      }).then(function (res) {
        if(res.data && res.data.state == 0) {
          that.editTreeTextDialog = false;
          that.$message.success("保存成功！");
          that.getTree()
          that.annexRequest();
          window.setTimeout(function(){
              that.annexRequest();
              that.add();
          },1200);
          that.textContent = '';
          that.textUnexpected = '';
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    //增加检查项
    addTreeCheck(data) {
      this.showDialogCheck = true;
      this.addTitle = '增加检查项';
      this.rd_id = data.rd_id;
    },
    //增加处理步骤
    addTreeMain(data) {
      this.showDialogCheck = true;
      this.addTitle = '增加处理步骤';
      this.rd_id = data.rd_id;
    },
    //增加检查项 处理步骤  保存
    saveTreeCheck() {
      let that = this
      if(this.addCheckContent == '') {
        switch (this.addTitle) {
          case '增加检查项':
            this.$message.error("请输入检查项！");
            return
          case '增加处理步骤':
            this.$message.error("请输入处理步骤！");
            return
          default:
            break
        }
      }
      if(this.addCheckUnexpected == '') {
        this.addCheckUnexpected = '<p></p>';
      }
      axios({
        url: '/regulations/addCheckContentAndUnexpectedContent',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          fileNum: this.fileNum,
          add_type: this.addTitle == '增加检查项' ? 'items' : 'step',
          from_rd_id: this.rd_id,
          check_content: this.addCheckContent,
          unexpected_content: this.addCheckUnexpected
        }
      }).then(function (res) {
        if(res.data && res.data.state == 0) {
          that.showDialogCheck = false;
          that.$message.success("新增成功！");
          that.getTree()
          that.annexRequest();
          window.setTimeout(function(){
              that.annexRequest();
              that.add();
          },1200);
          that.addCheckContent = '';
          that.addCheckUnexpected = '';
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    removeEvent() { // 取消鼠标监听事件 菜单栏
      this.showAddMain = false;
      this.showAddCheck = false;
      this.showDelMain = false;
      this.showDeleteCheck = false;
      this.showDeleteWarn = false;
      this.showDeleteEnter = false;
      document.removeEventListener('click', this.removeEvent)
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
    },
    //添加条件型表达式
    addJudgeExpress() {
      // let main = this.optionsMainStep[0].value;
      // let step = this.optionsMainStep[0].steps[0].value;
      // this.$set(this.judgeData.setup,'skipFileValue', [main, step]);
      // this.$set(this.judgeData.insetup,'skipFileValue', [main, step]);
      this.logicData.push(JSON.parse(JSON.stringify(this.judgeData)))
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
      let rdid = '';
      let flag = false;
      if(this.logicType == 'global' && this.globalTrigger == 'times' && !this.globalTimes) {
        flag = true;
      }
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
              switch (item.else.value) {
                case 'digit':
                  if(!item.else.digit.input) {
                    flag = true;
                  }
                  break
                case 'analogy':
                  if(!item.else.analogy.input1 || !item.else.analogy.input2) {
                    flag = true;
                  }
                  break
                case 'skip':
                  if(!item.else.skip.input) {
                    flag = true;
                  }
                  if(item.else.skip.value == 'other' && !item.else.skip.linkTo) {
                    flag = true;
                  }
                  break
                case 'manual':
                  if(!item.else.manual.input) {
                    flag = true;
                  }
                  break
                case 'limits':
                  if(!item.else.limits.input1 || !item.else.limits.kksValue || !item.else.limits.input2) {
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

      switch (this.logicType) {
        case 'expect':
          rdid = this.rd_id;
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
          break
        case 'unexpect':
          rdid = this.rd_id_unexpect;
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
          break
        case 'global':
          axios({
            url: '/regulations/updateGlobalWatchpadTableConfigure',
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              fileNum: this.fileNum,
              table_id: this.table_id,
              table_configure: 'period;600',
              table_logicExpression: expression
            }
          }).then(function (res) {
            if(res && res.data.state == 0) {
              that.$message.success("逻辑保存成功！");
              that.getTree()
              that.getWatchPad()
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          break
        case 'prestep':
          axios({
            url: '/regulations/updatePrestepWatchpadTableConfigure',
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              fileNum: this.fileNum,
              table_id: this.table_id,
              table_configure: 'prestep;table_3f7abbb9-4f24-45b0-aac8-6e1acf38ba23__3.1',
              table_logicExpression: expression
            }
          }).then(function (res) {
            if(res && res.data.state == 0) {
              that.$message.success("逻辑保存成功！");
              that.getTree()
              that.getWatchPad()
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          break
        case 'enter':
          axios({
            url: '/regulations/saveLogicExpression',
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              fileNum: this.fileNum,
              rd_id: this.rd_id,
              expression: expression
            }
          }).then(function (res) {
            if(res && res.data.state == 0) {
              that.$message.success("逻辑保存成功！");
              that.getTree()
              that.getWatchPad()
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          break
        default:
          break
      }
    },
    backInfo() {
      this.$router.push({name: 'Info'})
    },
    //删除入口条件
    removeEntry() {
      let that = this
      this.$request({
        url: '/regulations/removeEntryCondition',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: this.rd_id
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.showDialogDelStep = false;
          that.showDialogDelCheck = false;
          that.showDialogDelWarn = false;
          that.showDialogDelEnter = false;
          that.$message.success("删除成功！");
          that.getTree()
          that.getWatchPad()
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
    //删除监视板项
    removeDelWarn() {
      let that = this
      this.$request({
        url: '/regulations/removeWatchpadTable',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          table_id: this.rd_id
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.showDialogDelStep = false;
          that.showDialogDelCheck = false;
          that.showDialogDelWarn = false;
          that.showDialogDelEnter = false;
          that.$message.success("删除成功！");
          that.getWatchPad()
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
    //删除附件
    removeAppendix() {
      let that = this
      this.$request({
        url: '/regulations/removeAppendix',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          appendix_rdid: this.rd_id
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.showDialogDelStep = false;
          that.showDialogDelCheck = false;
          that.showDialogDelMain = false;
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
    //删除检查项或者处理步骤
    removeChecked() {
      let that = this
      this.$request({
        url: '/regulations/removeChecked',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: this.rd_id
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.showDialogDelStep = false;
          that.showDialogDelCheck = false;
          that.showDialogDelMain = false;
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
    wordLink(type, index, val) {
      this.getLogicIndex = index;
      this.getLogicType = val;
      type == 'logic' ? this.isLogic = true : this.isLogic = false
      this.showDialogLink = true;
      this.unanticipatedText1 = '';
      this.unanticipatedText2 = '';
      this.goto_target = '';
      this.getAllRegulaionTreeStructure()
    },
    //链接至 选中树模型
    clickItemTreeLink(data, node, key) {
      if(data.type != 'list') {
        this.unanticipatedText1 = node.parent.data.title;
        this.unanticipatedText2 = node.data.title;
        this.goto_target = data.rd_id;
      }
    },
    //链接至 查询按钮
    searchLinks() {
      this.getAllRegulaionTreeStructure(this.searchLinkText)
    },
    //调序
    treeOrder(type) {
      this.showDialogOrder = true;
      this.currentOrder = this.rightData.data.rd_id;
      let relationshipArr = this.rightData.index.split('-');
      let mainName = this.treeData[relationshipArr[0]].title.replace(/<[^>]+>/g,"");
      let stepName = this.treeData[relationshipArr[0]].content[relationshipArr[1]].title.replace(/<[^>]+>/g,"");
      if(stepName.length > 15){
        stepName = stepName.substring(0,15)+"...";
      }
      switch (type) {
        case 'step':
          this.orderData.type = 'step';
          this.orderData.fatherData = JSON.parse(JSON.stringify(this.treeData[relationshipArr[0]]));
          this.orderData.data = JSON.parse(JSON.stringify(this.treeData[relationshipArr[0]].content));
          this.orderCurrentName = mainName + '-->' + '步骤级调整';
          this.orderIndex = parseInt(relationshipArr[1]);
          break
        case 'item':
          this.orderData.type = 'item';
          this.orderData.fatherData = JSON.parse(JSON.stringify(this.treeData[relationshipArr[0]].content[relationshipArr[1]]));
          this.orderData.data = JSON.parse(JSON.stringify(this.treeData[relationshipArr[0]].content[relationshipArr[1]].content));
          this.orderCurrentName = mainName + '-->' + stepName + '-->' +'检查项级调整';
          this.orderIndex = parseInt(relationshipArr[2]);
          break
        default:
          break
      }
    },
    getOrderIndex(val, index) {
      this.orderIndex = index;
    },
    //下调
    downOrder() {
      let arr = this.orderData.data;
      let index = this.orderIndex;
      if(this.orderIndex < arr.length-1) {
        [arr[index], arr[index+1]] = [arr[index+1], arr[index]];
        this.orderIndex ++;
        this.$forceUpdate()
      }
    },
    //上调
    upOrder() {
      let arr = this.orderData.data;
      let index = this.orderIndex;
      if(this.orderIndex > 0) {
        [arr[index], arr[index-1]] = [arr[index-1], arr[index]];
        this.orderIndex --
        this.$forceUpdate()
      }
    },
    //调序保存
    saveTreeOrder() {
      let that = this;
      let saveData = this.orderData;
      //true 处理步骤  false 附件
      let isMain = /^main/.test(saveData.fatherData.anchor_point);
      switch (saveData.type) {
        case 'item':
          let item_rd_ids = [];
          saveData.data.forEach(item => {
            item_rd_ids.push(item.rd_id)
          });

          axios({
            url: '/regulations/checkItemsOrder',
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              fileNum: this.fileNum,
              type: isMain ? '1' : '2',
              table_id: saveData.fatherData.table_id,
              rd_ids: item_rd_ids
            }
          }).then(function (res) {
            if(res && res.data.state == 0) {
              that.showDialogOrder = false;
              that.$message.success("保存成功！");
              that.getTree()
              that.getWatchPad()
              that.annexRequest();//所有附件的请求接口
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          break
        case 'step':
          let step_table_ids = [];
          saveData.data.forEach(item => {
            step_table_ids.push(item.table_id)
          });
          if(isMain) {
            axios({
              url: '/regulations/stepOrder',
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              data: {
                fileNum: this.fileNum,
                table_ids: step_table_ids
              }
            }).then(function (res) {
              if(res && res.data.state == 0) {
                that.showDialogOrder = false;
                that.$message.success("保存成功！");
                that.getTree()
                that.getWatchPad()
                that.annexRequest();//所有附件的请求接口
              }
            })
            .catch(function (error) {
              console.log(error);
            })
          } else {
            axios({
              url: '/regulations/appenddixStepOrder',
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              data: {
                fileNum: this.fileNum,
                rd_id: saveData.fatherData.rd_id,
                table_ids: step_table_ids
              }
            }).then(function (res) {
              if(res && res.data.state == 0) {
                that.showDialogOrder = false;
                that.$message.success("保存成功！");
                that.getTree()
                that.getWatchPad()
                that.annexRequest();//所有附件的请求接口
              }
            })
            .catch(function (error) {
              console.log(error);
            })
          }
          break
        default:
          break
      }
    },
    getEnterIndex(val, index) {
      this.orderEnterIndex = index;
    },
    downEnterOrder() {
      let arr = this.orderEnterData;
      let index = this.orderEnterIndex;
      if(this.orderEnterIndex < arr.length-1) {
        [arr[index], arr[index+1]] = [arr[index+1], arr[index]];
        this.orderEnterIndex ++;
        this.$forceUpdate()
      }
    },
    upEnterOrder() {
      let arr = this.orderEnterData;
      let index = this.orderEnterIndex;
      if(this.orderEnterIndex > 0) {
        [arr[index], arr[index-1]] = [arr[index-1], arr[index]];
        this.orderEnterIndex --;
        this.$forceUpdate()
      }
    },
    saveEnterOrder() {
      let that = this;
      let orderList = [];
      this.orderEnterData.forEach(item => {
        orderList.push(item.fileNum)
      });
      orderList = orderList.join(',')
      this.$request({
        url: '/regulations/adjustRegulationPriority',
        method: 'post',
        data: {
          fileNum: this.fileNum,
          rd_id: this.rd_id,
          relatedRegulationList: orderList
        }
      }).then(function (res) {
        if(res && res.state == 0) {
          that.showDialogEnterOrder = false;
          that.$message.success("修改规程优先级成功！");
          that.getTree()
          that.getWatchPad()
          that.renderEnterRegulation(that.rd_id)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
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
    //链接至 确定按钮
    saveLinkTo() {
      let that = this
      if(!this.goto_target) {
        that.$message.error("请选择目标链接！");
        return
      }
      if(this.isLogic) {   //逻辑编辑 链接至
        let main = this.unanticipatedText1.match(/[^><]+(?=<\/(b|p)>)/g).join(' > ').substring(0,5) + '.. >';
        let step = this.unanticipatedText2.match(/[^><]+(?=<\/(b|p)>)/g).join(' > ').substring(0,4);
        let index = this.getLogicIndex;
        let type = this.getLogicType;
        switch (type) {
          case 'rule':
            this.logicData[index].linkTo = main + step;
            break
          case 'setup':
            this.logicData[index].setup.linkTo = main + step;
            break
          case 'insetup':
            this.logicData[index].insetup.linkTo = main + step;
            break
          default:
            break
        }
        that.showDialogLink = false;
      } else {             //非预期  链接至
        if(!this.selectText) {
          that.$message.error("请选择要增加链接的文字！");
          return
        }
        axios({
          url: '/regulations/addLinktoByUnexpected',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            fileNum: this.fileNum,
            rd_id: this.rd_id,
            addLink_text: this.selectText,
            goto_target: this.goto_target
          }
        }).then(function (res) {
          if(res && res.data.state == 0) {
            that.showDialogLink = false;
            that.$message.success("非预期增加链接成功！");
            that.getUnexpected()
          }
        })
        .catch(function (error) {
          console.log(error);
        })
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

               // 规程文档预览 李康start

      // 征兆条件部分需要重新使用移入和移出函数
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
                    console.log(66665,document.getElementById(sx).style.background);
                    if(document.getElementById(sx).style.background=='rgb(204, 204, 204)') {
                        document.getElementById(sx).style = "border: 1px solid #008000;cursor: pointer;background:rgb(204, 204, 204);";
                    }
                }
            },
            mouseLeave1(e) {
                var sx=e.currentTarget.id;
                if(sx==""){

                }else {
                    console.log(55556,document.getElementById(sx).style.background);
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
                if(cxNum==66||cxNum==88){
                    this.substance=e.currentTarget.parentElement.nextElementSibling.outerHTML;
                    // console.log('cxNum==66||cxNum==88',this.substance);
                }else if (cxNum==1){
                    this.core=e.currentTarget.nextElementSibling.getAttribute('modeltype');
                    this.substance=e.currentTarget.nextElementSibling.innerHTML;
                    // console.log('cxNum==1',this.substance);
                }
                else if(cxNum==6){
                    this.evidenceId=e.currentTarget.nextElementSibling.children[0].getAttribute('rd_id')
                    if(e.currentTarget.nextElementSibling.children[0].style.background=='rgb(204, 204, 204)'){
                        this.substance=e.currentTarget.nextElementSibling.innerHTML.replace('rgb(204, 204, 204);"', 'transparent;"');
                    }else {
                        this.substance=e.currentTarget.nextElementSibling.innerHTML;
                    }
                }
                else {
                    // e.currentTarget.nextElementSibling.firstChild.style.background
                    if(e.currentTarget.nextElementSibling.firstChild.style.background=='rgb(204, 204, 204)'){
                        this.cornerId=e.currentTarget.nextElementSibling.firstChild.id;
                        // console.log(23000,this.cornerId);
                        // console.log(555);
                        // e.currentTarget.nextElementSibling.firstChild.style.background='transparent';
                        // console.log(4444,e.currentTarget.nextElementSibling.innerHTML.replace('style="background: rgb(204, 204, 204);" ', 'style="background: transparent;" data_op="1"'));
                        // this.substance=e.currentTarget.nextElementSibling.innerHTML.replace('rgb(204, 204, 204)', 'transparent')
                        // e.currentTarget.nextElementSibling.firstChild.setAttribute
                        this.substance=e.currentTarget.nextElementSibling.innerHTML.replace('rgb(204, 204, 204);"', 'transparent;"');
                        // console.log(3333,this.substance);
                        // var firsturl1 = firsturl.replace('#', '%23');
                    }else {
                        this.substance=e.currentTarget.nextElementSibling.innerHTML;
                    }
                    // console.log('else11',typeof (this.substance));
                }

                    if(cxNum==5){//当为修改说明部分的时候，禁止enter键的使用
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
                    this.specid=e.currentTarget.parentElement.getAttribute('id');
                }else if(cxNum==7){
                    this.specrd_id=e.currentTarget.nextElementSibling.firstElementChild.getAttribute('rd_id');
                }else if(cxNum==8){
                    // 对应的是步骤和附件中的注意和警告的单行纯文字
                    if(!dataCon.from_table_id){
                        this.dataId=dataCon.table_id
                    }else if(!dataCon.table_id){
                        this.dataId=dataCon.from_table_id
                    }
                }else if(cxNum==9){
                    this.dataId=e.currentTarget.parentElement.getAttribute('id');
                }else if(cxNum==10||cxNum==11){
                    this.table_id=e.currentTarget.getAttribute('table_id')
                    this.form_id=e.currentTarget.getAttribute('form_id')
                }else if(cxNum==66){
                    this.show11=true;
                    this.youjiLay1 = true
                    this.table_id=e.currentTarget.getAttribute('table_id')
                    this.form_id=e.currentTarget.getAttribute('form_id')
                }else if(cxNum==88){
                    this.table_id=e.currentTarget.getAttribute('table_id')
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
                // console.log(5555,this.substance);
                // 对处理
                // dataNum
                // if(this.substance.indexOf("padding")!=-1){
                //     console.log(44444,this.substance.indexOf("padding"));
                //     this.substance=this.substance.replace( 'style="background: transparent; padding: 0px;"','style="background:rgb(204, 204, 204);"');
                //     console.log(66666,this.substance);
                //     // console.log(5555,this.substance.replace( 'transparent;padding:0px;"','rgb(204, 204, 204);"'));
                // }else {
                //
                // }
                // indexOf
                if(wayNum=='1'){//文件编号和文件名字的修改
                    if(this.core=='3'){
                        var firsturl='regulations/updateRegulationNameAndCode?fileNum='+this.fileNum+'&regulaName='+this.substance;
                    }else if(this.core=='4'){
                        var firsturl='regulations/updateRegulationNameAndCode?fileNum='+this.fileNum+'&fileCode='+this.substance
                    }
                    var firsturl1 = firsturl.replace('#', '%23');
                    axios.post(firsturl1).then(res=>{
                    })
                        .catch((error) =>{
                        });
                }else if(wayNum=='2') {// 文件级别的修改
                    this.arrGrade=[
                        this.$refs.grade1.innerHTML,
                        this.$refs.grade2.innerHTML
                        ]
                    // console.log(78786,this.arrGrade);
                    axios.post('regulations/updateLevel', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'content': this.arrGrade,
                    }).then((response) => {
                        // console.log("3、返回的值",this.arrGrade,response)
                    }).catch((response) => {
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
                    }).then((response) => {
                        // console.log("2、返回的值"+response)
                    }).catch((response) => {
                        // console.log("2、错误"+response)
                    })
                }
                else if(wayNum=='4') {//对应的人名和日期的修改
                    this.tempconte=[this.$refs.tempcon.innerHTML]
                    axios.post('regulations/updateFileApprove', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'content': this.tempconte,
                    }).then((response) => {
                        // console.log("3、返回的值")
                    }).catch((response) => {
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
                    }).then((response) => {
                        // console.log("1、返回的值"+response)
                    }).catch((response) => {
                        // console.log("1、错误"+response)
                    })
                }else if(wayNum=='6'){//目的和征兆条件的接口
                    // 根据id的不同值给不同的值
                    // if(this.specid=='tj1'){
                    //     this.specnum='1'
                    // }else if(this.specid=='tj2'){
                    //     this.specnum='2'
                    // }
                    if(this.specid=='tj1'){
                        this.specnum='1'
                    }else {
                        this.specnum=this.evidenceId
                    }
                    // axios.post('regulations/updateCommonParagraph', {//原来是一大段进行修改现在要修改为一小段一小段的修改
                    //     'fileNum': this.fileNum,
                    //     'paragraph_type': this.specnum,
                    //     'paragraph_content': this.substance,
                    // }).then((response) => {
                    //     // console.log("1、返回的值"+response)
                    // }).catch((response) => {
                    //     // console.log("1、错误"+response)
                    // })

                    // 修改入口条件的文字
                    // http://localhost:12306/regulations/updateEntryConditionDescription
                    // {
                    //     "fileNum":"HS1-0JNGGZ00-TP-0421__fault",
                    //     "rd_id":"",
                    //     "description":""
                    // }
                    axios.post('regulations/updateEntryConditionDescription', {//小段的修改接口
                        'fileNum': this.fileNum,
                        'rd_id': this.specnum,
                        'description': this.substance,
                    }).then((response) => {
                        // console.log("1、返回的值"+response)
                    }).catch((response) => {
                        // console.log("1、错误"+response)
                    })
                }else if(wayNum=='7'){//步骤部分的修改  需要判断预期还是非预期的内容
                    if(this.substance==''){
                        this.substance='<p></p>'
                    }
                    axios.post('regulations/updateCheckContentAndUnexpectedContent', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'rd_id': this.specrd_id,
                        'check_content': this.substance,
                    }).then((response) => {
                        // console.log("1、返回的值"+response)
                    }).catch((response) => {
                        // console.log("1、错误"+response)
                    })
                }else if(wayNum=='8'){//步骤部分的修改  需要判断预期还是非预期的内容
                    axios.post('regulations/updateCommonExplainTable', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'table_id': this.dataId,
                        'table_content': this.substance,
                    }).then((response) => {
                        // console.log("1、返回的值"+response)
                    }).catch((response) => {
                        // console.log("1、错误"+response)
                    })
                }else if(wayNum=='9'){//附件名字的修改接口
                    axios.post('regulations/updateAppendixTitle?fileNum='+this.fileNum+'&rd_id='+this.dataId+'&title='+this.substance, {//发送请求 跳转页面
                    }).then((response) => {
                        // console.log("1、返回的值"+response)
                    }).catch((response) => {
                        // console.log("1、错误"+response)
                    })
                }else if(wayNum=='10'){//添加普通表格的接口
                    axios.post('regulations/addCommonTypeTable', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'from_appendix_rdid': this.form_id,
                        'table_content': this.newChart,
                    }).then((response) => {
                        // console.log("1、返回的值"+response)
                    }).catch((response) => {
                        // console.log("1、错误"+response)
                    })

                }else if(wayNum=='11'){//修改新添加的表格(附件中)
                    axios.post('regulations/updateCommonTypeTable', {//发送请求 跳转页面
                        'fileNum': this.fileNum,
                        'from_appendix_rdid': this.form_id,
                        'table_content': this.substance,
                        'table_id':this.table_id,
                    }).then((response) => {
                        // console.log("1、返回的值"+response)
                    }).catch((response) => {
                        // console.log("1、错误"+response)
                    })
                }else if(wayNum=='88'){//删除新添加的表格(附件中)
                    axios.post('regulations/removeCommonTypeTable?fileNum='+this.fileNum+'&table_id='+this.table_id, {//发送请求 跳转页面
                    }).then((response) => {
                        // console.log("1、返回的值"+response)
                    }).catch((response) => {
                        // console.log("1、错误"+response)
                    })

                }
                this.annexRequest();
                if(this.cornerId==""){
                    // 延时(setTimeout)后指针指向发生变化
                    var that = this;
                    window.setTimeout((function() {
                        that.annexRequest();
                        that.add();
                        that.handleTable();//表格部分的处理
                        that.substance='';
                    })(), 1200);
                }else {
                    document.getElementById(this.cornerId).style.background='rgb(204, 204, 204)';
                // 延时(setTimeout)后指针指向发生变化
                    var that = this;
                    window.setTimeout((function() {
                        that.annexRequest();
                        that.add();
                        that.handleTable();//表格部分的处理
                        that.substance='';
                        return function() {//这里是一个回调函数，在执行完毕setTimeout的函数以后，再执行return的函数
                            document.getElementById(that.cornerId).style.background='rgb(204, 204, 204)';
                        }
                    })(), 1200);

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
                            that.previews3 = response.data.data[2].content[0].content[0];
                            that.previews4 = response.data.data[3].content[0].content[0];
                            that.previewid = response.data.data[3].anchor_point;
                            that.previewsx = response.data.data[4];
                            that.fujian = response.data.data[5];
                            that.previewType = response.data.data[0].content[4].content;
                            // console.log(7913,that.previews4);
                            // 这里需要对《征兆和进入条件》previews4进行修改，把它分开单个修改,由于base64后面有个,所以替换为,.并且split也是,.
                            // console.log(700,that.previews4.replace(/<\/p>/g,'</p>,.').split(',.'));
                            that.newEvidenceObj=that.previews4.replace(/<\/p>/g,'</p>,.').split(',.');

                            // that.evidenceObj = that.previews4
                            // that.evidenceTempObj = []
                            // that.evidenceObj.forEach(item => {
                            // // </p>
                            // //     this.evidenceTempObj.push(item.replace(/\<\/p>/g, '</p>,'))
                            //     that.evidenceTempObj.push(item.replace(/<\/p>/g, '</p>,'))
                            //
                            // })
                            // that.evidenceObj = that.evidenceTempObj
                            // console.log(777,that.evidenceTempObj);


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
      background-color: #fff;
      /*height: 100%;*/
      margin-left: 5px;
      margin-bottom: 5px;
      margin-top: 5px;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      /*right: 100px;*/

      //box-shadow: 0px -7px 15px 0px #ccc,-7px 0px 15px 0px #ccc,0px 7px 15px 0px #ccc,7px 0px 15px 0px #ccc;
      .process {
        position: absolute;
        overflow-y: auto;
        top: 41px;
        left: 0;
        right: 0px;
        bottom: 0;
        padding: 0 8px;
        .enter {
          border: 1px solid #000;
          border-radius: 5px;
          margin: 10px 0;
          .enter-el {
            padding: 0 8px;
            border-radius: 3px;
            height: 100%;
          }
          .entersele {   //选中
            line-height: 26px;
            border: 2px solid #000;
            background: #ccc;
          }
          .enterinsele {   //非选中
            line-height: 28px;
            border: 1px solid #A4A4A4;
          }
          .highLight {
            background: #ccc;
          }
          .rotate {
            transform: rotate(-90deg)
          }
          .enterbox {
            height: 100%;
            box-sizing: border-box;
          }
          .enterwhite {
            border: 1px solid #A4A4A4;
          }
          .entergreen {
            background: green;
          }
          .enterccc {
            background: #ccc;
            border: 2px solid #000;
          }
        }
        .warn {
          border: 1px solid #000;
          border-radius: 5px;
          margin-bottom: 10px;
          background: #F4E390;
          .warn-el {
            padding: 0 8px;
            border-radius: 3px;
            height: 100%;
          }
          .warnsele {   //选中
            line-height: 26px;
            border: 2px solid #000;
            background: #ccc;
          }
          .warninsele {   //非选中
            line-height: 28px;
            border: 1px solid #A4A4A4;
          }
          .highLight {
            background: #ccc;
          }
          .rotate {
            transform: rotate(-90deg)
          }
          .warnbox {
            height: 100%;
            box-sizing: border-box;
          }
          .warnwhite {
            border: 1px solid #A4A4A4;
          }
          .warngreen {
            background: green;
          }
          .warnccc {
            background: #ccc;
            border: 2px solid #000;
          }
        }
        .tree {
          .item-tree {
            margin-bottom: 10px;
            border:1px solid #000;
            border-radius: 5px;
            .highLight {
              background: #ccc;
            }
            .rotate {
              transform: rotate(-90deg)
            }
            .tree-suffix {
              display: inline-block;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              text-align: center;
              color:#fff;
              cursor: pointer;
              // border: 1px solid #A4A4A4;
              font-size:14px;
            }
            .suffixgreen {
              background: green;
              color: #fff;
            }
            .suffixwhite {
              background: #fff;
              color: #000;
            }
            .suffixccc {
              background: #ccc;
              color: #000;
            }
          }
        }
      }
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
          .le-title{font-size: 16px;font-weight: bolder;line-height: 40px;text-indent: 2%;display: inline;padding: 3px;}
          .aim{overflow: hidden;border: 1px solid transparent;position: relative;}
          .aimbox{line-height: 40px;font-size: 16px;text-indent: 4%;overflow: hidden;}
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