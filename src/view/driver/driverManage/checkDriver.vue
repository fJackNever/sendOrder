<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >
                    <div style="margin:10px 0;">司机信息</div>
                    <FormItem label="姓名" prop="idName">
                        <Input v-model="formValidate.idName" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="手机号" prop="telephone" :label-width="120">
                        <Input v-model="formValidate.telephone" placeholder="请输入手机号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="身份证正面" prop="IdFrontPic" >
                        <div class="demo-upload-list" v-for="item in idFrontList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(1)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="idFrontUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeIdFront"
                            type="drag"
                            action=""
                            :style="{display: idFrontList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    <Modal title="图片预览" v-model="visible" :footer-hide="true">
                        <img :src="allPicModal" v-if="visible" style="width: 100%">
                    </Modal>

                    <div style="margin:10px 0;">驾驶证信息</div>
                    <FormItem label="驾驶证姓名" prop="driveName">
                        <Input v-model="formValidate.driveName" placeholder="请输入驾驶证姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="驾驶证领证日期" prop="getDriveDate" :label-width="120">
                        <DatePicker type="date" placeholder="驾驶证领证日期" v-model="formValidate.getDriveDate" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="准驾类型" prop="driveType" :label-width="120">
                        <Select v-model="formValidate.driveType" placeholder="请选择准驾类型" style="width:200px">
                            <Option value="A1">A1</Option>
                            <Option value="A2">A2</Option>
                            <Option value="A3">A3</Option>
                            <Option value="B1">B1</Option>
                            <Option value="B2">B2</Option>
                            <Option value="C1">C1</Option>
                            <Option value="C2">C2</Option>
                            <Option value="C3">C3</Option>
                            <Option value="C4">C4</Option>
                            <Option value="D">D</Option>
                            <Option value="E">E</Option>
                            <Option value="F">F</Option>
                            <Option value="M">M</Option>
                            <Option value="N">N</Option>
                            <Option value="P">P</Option>
                        </Select>
                    </FormItem>
                    
                    <FormItem label="驾驶证正本" prop="driveFrontPic" >
                        <div class="demo-upload-list" v-for="item in driveFontList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(2)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveFrontUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeDriveFront"
                            type="drag"
                            action=""
                            :style="{display: driveFontList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <!-- <FormItem style="visibility:hidden;">
                        <Upload :style="{display: 'inline-block',width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem> -->

                    <div style="margin:10px;">其他信息</div>

                    <FormItem label="网约车驾驶证(人证)" prop="webDrivePerPic" >
                        <div class="demo-upload-list" v-for="item in webDrivePerList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(3)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="webDrivePerUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeWebDrivePer"
                            type="drag"
                            action=""
                            :style="{display: webDrivePerList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    <FormItem label="是否通过审核" prop="checkPass" :label-width="120" >
                        <RadioGroup v-model="formValidate.checkPass" @on-change="changePassStatus">
                            <Radio :label="0" :disabled="disabledStatus">未审核</Radio>
                            <Radio :label="1" :disabled="disabledStatus">待审核</Radio>
                            <Radio :label="2" :disabled="disabledStatus">通过审核</Radio>
                            <Radio :label="3" :disabled="disabledStatus">审核拒绝</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="审核拒绝" prop="rejectDesc" :label-width="120" v-if="rejectVisible">
                        <Input v-model="formValidate.rejectDesc" type="textarea" :rows="8" :autosize="{minRows: 5,maxRows: 8}" placeholder="请输入审核拒绝理由..." style="width:400px"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handlePass()">修改审核状态</Button>
                    </FormItem>
                    <FormItem label="运营状态" prop="operateStatus" :label-width="120" >
                        <RadioGroup v-model="formValidate.operateStatus" @on-change="changeOperateStatus">
                            <Radio :label="0" :disabled="disabledStatus">停运</Radio>
                            <Radio :label="1" :disabled="disabledStatus">正常</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="停运" prop="stopDesc" :label-width="120" v-if="stopVisible">
                        <Input v-model="formValidate.stopDesc" type="textarea" :rows="8" :autosize="{minRows: 5,maxRows: 8}" placeholder="请输入停运理由..." style="width:400px"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleOperate()">修改运营状态</Button>
                    </FormItem>
                </Form>
                <Form ref="formBindValidate" :model="formBindValidate" :rules="ruleBindValidate" :label-width="120" >
                    <div style="margin:15px 0;">车辆信息</div>
                    <Row>
                        <Col span="3">
                            <FormItem v-if="car_info_show">
                                <Button type="error" @click="handleUnbind()" :disabled="disabledStatus">解绑</Button>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem>
                                <Button type="primary" @click="handleBind()" :disabled="disabledStatus">绑定</Button>
                            </FormItem>
                        </Col>
                    </Row>

                    <FormItem label="车牌号" prop="authCarNo" :label-width="120" v-if="car_info_show">
                        <Input v-model="formBindValidate.authCarNo" placeholder="请输入车牌号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="车架号" prop="authVin" :label-width="120" v-if="car_info_show">
                        <Input v-model="formBindValidate.authVin" placeholder="请输入车架号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="注册日期" prop="authCarRegisteredDate" :label-width="120" v-if="car_info_show">
                        <DatePicker type="date" placeholder="注册日期" v-model="formBindValidate.authCarRegisteredDate" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="车身颜色" prop="authCarColor" :label-width="120" v-if="car_info_show"> 
                        <Input v-model="formBindValidate.authCarColor" placeholder="车身颜色" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="行驶证正本面" prop="travelFrontPic" v-if="car_info_show">
                        <div class="demo-upload-list" v-for="item in travelFrontList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(2)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="travelFrontUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeTravelFront"
                            type="drag"
                            action=""
                            :style="{display: travelFrontList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                </Form>
                <Modal title="绑定车辆" v-model="bindVisible" :footer-hide="true">
                        <div style="text-align: center;">
                            <span style="font-size:14px;padding-right:10px;">绑定车辆</span>
                            <AutoComplete
                                v-model="bindCar"
                                @on-search="searchBindCar"
                                @on-select="selectBindCar"
                                placeholder="请输入绑定车牌号"
                                style="width:200px" transfer>
                                <Option v-for="item in bindCarGather" :value="item.id" :key="item.id" >{{ item.car_no }}</Option>
                            </AutoComplete>
                        </div>
                        <div style="text-align: center;margin:20px 0;">
                            <Button type="error" @click="handleSure()">确认</Button>
                        </div>
                </Modal>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                    
                    <div style="margin:10px 0;">&nbsp;</div>
                    <FormItem label="司机性别" prop="sex" :label-width="120" >
                        <RadioGroup v-model="formValidate.sex">
                            <Radio :label="0">女</Radio>
                            <Radio :label="1">男</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="司机住址" prop="address" :label-width="120">
                        <Input v-model="formValidate.address" placeholder="请输入司机住址" style="width:400px"></Input>
                    </FormItem>

                    <FormItem label="身份证反面" prop="IdBackPic" :label-width="120">
                        <div class="demo-upload-list" v-for="item in idBackList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(4)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="idBackUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeIdBack"
                            type="drag"
                            action=""
                            :style="{display: idBackList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <!-- <FormItem style="visibility:hidden;">
                        <Input placeholder="" ></Input>
                    </FormItem>

                    <FormItem style="visibility:hidden;">
                        <Input placeholder="" ></Input>
                    </FormItem> -->

                    <div style="margin:10px 0;">&nbsp;</div>
                    
                    <FormItem label="驾驶证号" prop="driveNo" :label-width="120">
                        <Input v-model="formValidate.driveNo" placeholder="请输入驾驶证号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="有效日期" prop="endDriveDate" :label-width="120">
                        <DatePicker type="date" placeholder="请输入有效日期" v-model="formValidate.endDriveDate" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="驾驶证副本" prop="driveBackPic" :label-width="120">
                        <div class="demo-upload-list" v-for="item in driveBackList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(5)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveBackUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeDriveBack"
                            type="drag"
                            action=""
                            :style="{display: driveBackList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    
                    <div style="margin:10px;">&nbsp;</div>
                    <FormItem style="visibility:hidden;">
                        <Input placeholder="" ></Input>
                    </FormItem>
                    <FormItem label="网约车运输证(车证)" prop="webDriveCarPic" :label-width="120">
                        <div class="demo-upload-list" v-for="item in webDriveCarList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(6)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="webDriveCarUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeWebDriveCar"
                            type="drag"
                            action=""
                            :style="{display: webDriveCarList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                </Form>
                <Form ref="formBindValidate" :model="formBindValidate" :rules="ruleBindValidate" :label-width="120" >
                    
                    <div style="margin:10px;">&nbsp;</div>
                    <FormItem style="visibility:hidden;">
                        <Button type="error" >&nbsp;</Button>
                    </FormItem>
                    <FormItem style="visibility:hidden;">
                        <RadioGroup>
                            <Radio label="1">&nbsp;</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="所有人" prop="authOwner" :label-width="120" v-if="car_info_show">
                        <Input v-model="formBindValidate.authOwner" placeholder="请输入所有人" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="发动机号" prop="authEngineNo" :label-width="120" v-if="car_info_show">
                        <Input v-model="formBindValidate.authEngineNo" placeholder="请输入发动机号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="用车类型" prop="authCarType" :label-width="120" v-if="car_info_show">
                        <Input v-model="formBindValidate.authCarType" placeholder="请输入用车类型" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="品牌车型" prop="authCarTemplate" :label-width="120" v-if="car_info_show">
                        <Input v-model="formBindValidate.authCarTemplate" placeholder="请输入品牌车型" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="人车合照" prop="carPerPic" :label-width="120" v-if="car_info_show">
                        <div class="demo-upload-list" v-for="item in carPerList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(7)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="carPerUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleCarPer"
                            type="drag"
                            action=""
                            :style="{display: carPerList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                </Form>
            </Col>
        </Row>
      </Card>
  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Form,FormItem,RadioGroup,Radio,Upload,Modal,Icon } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment' 
export default {
  name: 'newDriver',
  components: {
    Row,
    Col,
    Card,
    Input,
    Button,
    Divider,
    DatePicker,
    Select,
    Option,
    Table,
    AutoComplete,
    Form,
    FormItem,
    RadioGroup,
    Radio,
    Upload,
    Modal,
    Icon,
  },
  data () {
    return {
      formValidate: {
          getDriveDate:moment().format('YYYY-MM-DD'),
          endDriveDate:moment().format('YYYY-MM-DD'),
      },
      formBindValidate:{

      },
      cardTitle:'查看加盟司机',
      ruleValidate: {

      },
      ruleBindValidate:{

      },
      ruleSelectValidate:{
          bindVisible:[ 
              {required: true, message: '请填写绑定车辆', trigger: 'blur'} 
          ]
      },
      disabledStatus:false,
      allPicModal: '',
      visible: false,
      bindVisible:false,
      bindCar:'',
      bindCarGather:[],
      idFrontList: [],
      driveFontList: [],
      webDrivePerList: [],
      idBackList: [],
      driveBackList: [],
      webDriveCarList: [],
      travelFrontList:[],
      carPerList:[],
      rejectVisible:false,
      rejectDesc:'',
      stopVisible:false,
      stopDesc:'',
      car_info_show:true,
      inputCarShake:'',
      carId:'',
      auth_status:'',
      is_server:'',
      permission_arr:'',
    }
  },
  methods: {
    ...mapActions([
      'uploadPic',
      'getCarTemplateLists',
      'addDriver',
      'editDriver',
      'getDriverLists',
      'getCarLists',
      'bindingCar',
      'unbindingCar',
      'authDriverStatus',
      'editDriverStatus',
    ]),
    changePassStatus(val){
        this.auth_status = val;
        if(val === 3){
            this.rejectVisible = true;
        }else{
            this.rejectVisible = false;
        }
    },
    changeOperateStatus(val){
        console.log(val)
        this.is_server = val;
        if(val === 3){
            this.stopVisible = true;
        }else{
            this.stopVisible = false;
        }
    },
    handlePass(){
        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2003'){
                    per_val = 2003
                }
            }
            if(per_val === 2003){
                
                if(this.rejectVisible){
                    this.authDriverStatus({ id:this.$route.query.id,auth_status:this.auth_status,auth_comment:this.formValidate.rejectDesc }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else{
                    this.authDriverStatus({ id:this.$route.query.id,auth_status:this.auth_status,auth_comment:'' }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            if(this.rejectVisible){
                this.authDriverStatus({ id:this.$route.query.id,auth_status:this.auth_status,auth_comment:this.formValidate.rejectDesc }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('修改成功!');
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })
            }else{
                this.authDriverStatus({ id:this.$route.query.id,auth_status:this.auth_status,auth_comment:'' }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('修改成功!');
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })
            }
        }
        
    },
    handleOperate(){
        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2006'){
                    per_val = 2006
                }
            }
            if(per_val === 2006){
                if(this.stopVisible){
                    this.editDriverStatus({ id:this.$route.query.id,status:this.is_server,server_comment:this.formValidate.stopDesc }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else{
                    this.editDriverStatus({ id:this.$route.query.id,status:this.is_server,server_comment:'' }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            if(this.stopVisible){
                this.editDriverStatus({ id:this.$route.query.id,status:this.is_server,server_comment:this.formValidate.stopDesc }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('修改成功!');
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })
            }else{
                this.editDriverStatus({ id:this.$route.query.id,status:this.is_server,server_comment:'' }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('修改成功!');
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })
            }
        }
    },
    handleView (url) {
        this.allPicModal = url;
        this.visible = true;
    },
    handleRemove (type) {
        if(type === 1){
            this.idFrontList.splice(0,1)
        }else if(type === 2){
            this.driveFontList.splice(0,1)
        }else if(type === 3){
            this.webDrivePerList.splice(0,1)
        }else if(type === 4){
            this.idBackList.splice(0,1)
        }else if(type === 5){
            this.driveBackList.splice(0,1)
        }else if(type === 6){
            this.webDriveCarList.splice(0,1)
        }
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },

    handleBeforeIdFront (file) {
        let check = this.idFrontList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.idFrontList,0, {
                        url:res.data.data.path,
                        name:'idFrontPic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    handleBeforeDriveFront (file) {
        let check = this.driveFontList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.driveFontList,0, {
                        url:res.data.data.path,
                        name:'driveFontPic' + res.data.data.ossId,
                    })
                })
            };
        }

        return check;
    },
    handleBeforeWebDrivePer (file) {
        let check = this.webDrivePerList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.webDrivePerList,0, {
                        url:res.data.data.path,
                        name:'webDrivePerPic' + res.data.data.ossId,
                    })
                })
            };
        }

        return check;
    },
    handleBeforeTravelFront(){
        let check = this.travelFrontList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.travelFrontList,0, {
                        url:res.data.data.path,
                        name:'travelFrontPic' + res.data.data.ossId,
                    })
                })
            };
        }

        return check;
    },
    handleBeforeIdBack (file) {
        let check = this.idBackList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.idBackList,0, {
                        url:res.data.data.path,
                        name:'idBackPic' + res.data.data.ossId,
                    })
                })
            };
        }

        return check;
    },
    handleBeforeDriveBack (file) {
        let check = this.driveBackList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.driveBackList,0, {
                        url:res.data.data.path,
                        name:'driveBackPic' + res.data.data.ossId,
                    })
                })
            };
        }

        return check;
    },
    handleBeforeWebDriveCar (file) {
        let check = this.webDriveCarList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.webDriveCarList,0, {
                        url:res.data.data.path,
                        name:'webDriveCarPic' + res.data.data.ossId,
                    })
                })
            };
        }

        return check;
    },

    handleCarPer(file){
        let check = this.carPerList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.carPerList,0, {
                        url:res.data.data.path,
                        name:'carPerPic' + res.data.data.ossId,
                    })
                })
            };
        }

        return check;
    },
    searchBindCar(value){
      if(this.inputCarShake) clearTimeout(this.inputCarShake)
        this.inputCarShake = setTimeout(()=>{
            this.getCarLists({ id:'',status:'',car_template_id:'',start_time:'',end_time:'',car_no:value,search:'',offset:0,limit:10 }).then((data) => {
                this.bindCarGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.bindCarGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectBindCar(val){
        this.getCarLists({ id:val,status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10 }).then((data) => {
            this.bindCar = data.data.data.rows[0].car_no
            this.carId = val
        })
    },
    handleBind(){
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2004'){
                    per_val = 2004
                }
            }
            if(per_val === 2004){
                this.bindVisible = true;
                this.bindCar = '';
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.bindVisible = true;
            this.bindCar = '';
        }
        
    },
    handleUnbind(){

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2005'){
                    per_val = 2005
                }
            }
            if(per_val === 2005){
                this.unbindingCar({ 
                    car_id:this.carId,
                    driver_id:this.$route.query.id,
                }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('解绑成功!');
                        this.bindVisible = false;
                        this.car_info_show = false;
                        this.$refs['formBindValidate'].resetFields();
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.unbindingCar({ 
                car_id:this.carId,
                driver_id:this.$route.query.id,
            }).then((data) => {
                if(data.data.code === 1){
                    this.$Message.success('解绑成功!');
                    this.bindVisible = false;
                    this.car_info_show = false;
                    this.$refs['formBindValidate'].resetFields();
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }

        
    },
    handleSure(){
        this.bindingCar({ 
            car_id:this.carId,
            driver_id:this.$route.query.id,
        }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('绑定成功!');
                this.bindVisible = false;
                this.getDriverLists({ id:this.$route.query.id,fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10000 }).then((data) => {

                    this.car_info_show = true
                    this.$set(this.formBindValidate,'authCarNo',data.data.data.rows[0].binding_info.car_no);
                    this.$set(this.formBindValidate,'authVin',data.data.data.rows[0].binding_info.frame_no);
                    this.$set(this.formBindValidate,'authCarRegisteredDate',data.data.data.rows[0].binding_info.register_date);
                    this.$set(this.formBindValidate,'authCarColor',data.data.data.rows[0].binding_info.car_color);
                    if(data.data.data.rows[0].binding_info.travel_img_path){
                        this.$set(this.travelFrontList,0,{ url:data.data.data.rows[0].binding_info.travel_img_path, name:'travelFrontPic1' });
                    }
                    this.$set(this.formBindValidate,'authOwner',data.data.data.rows[0].binding_info.owner);
                    this.$set(this.formBindValidate,'authEngineNo',data.data.data.rows[0].binding_info.engine_no);
                    this.$set(this.formBindValidate,'authCarType',data.data.data.rows[0].binding_info.use_car_type_name);
                    this.$set(this.formBindValidate,'authCarTemplate',data.data.data.rows[0].binding_info.brand_model);

                    if(data.data.data.rows[0].binding_info.car_person_img_path){
                        this.$set(this.carPerList,0,{ url:data.data.data.rows[0].binding_info.car_person_img_path, name:'carPerPic1' });
                    }
                    
                })

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    }
  },
  mounted () {

      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))

        this.getDriverLists({ id:this.$route.query.id,fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {

            this.carId = data.data.data.rows[0].binding_id;
            this.$set(this.formValidate,'idName',data.data.data.rows[0].id_name);
            this.$set(this.formValidate,'telephone',data.data.data.rows[0].telephone);
            if(data.data.data.rows[0].id_img_path){
                this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].id_img_path, name:'idFrontPic1', });
            }
            this.$set(this.formValidate,'driveName',data.data.data.rows[0].driver_name);
            this.$set(this.formValidate,'getDriveDate',data.data.data.rows[0].driver_get_date);
            this.$set(this.formValidate,'driveType',data.data.data.rows[0].driver_type);
            if(data.data.data.rows[0].driver_img_path){
                this.$set(this.driveFontList,0,{ url:data.data.data.rows[0].driver_img_path,name:'driveFontPic1', });
            }
            if(data.data.data.rows[0].net_driver_img_path){
                this.$set(this.webDrivePerList,0,{ url:data.data.data.rows[0].net_driver_img_path,name:'webDrivePerPic1', });
            }
            this.$set(this.formValidate,'checkPass',data.data.data.rows[0].auth_status);
            this.$set(this.formValidate,'operateStatus',data.data.data.rows[0].status);

            if(data.data.data.rows[0].auth_status === 3 ){
                this.rejectVisible = true;
                this.$set(this.formValidate,'rejectDesc',data.data.data.rows[0].auth_status);
            }

            if(data.data.data.rows[0].status === 0 ){
                this.stopVisible = true;
                this.$set(this.formValidate,'stopDesc',data.data.data.rows[0].auth_status);
            }

            this.auth_status = data.data.data.rows[0].auth_status;
            this.is_server = data.data.data.rows[0].status;
            
            if(data.data.data.rows[0].binding_info.car_no === ''){
                    this.car_info_show = false
            }else{
                this.car_info_show = true;
                this.$set(this.formBindValidate,'authCarNo',data.data.data.rows[0].binding_info.car_no);
                this.$set(this.formBindValidate,'authVin',data.data.data.rows[0].binding_info.frame_no);
                this.$set(this.formBindValidate,'authCarRegisteredDate',data.data.data.rows[0].binding_info.register_date);
                this.$set(this.formBindValidate,'authCarColor',data.data.data.rows[0].binding_info.car_color);
                if(data.data.data.rows[0].binding_info.travel_img_path){
                    this.$set(this.travelFrontList,0,{ url:data.data.data.rows[0].binding_info.travel_img_path,name:'travelFrontPic1', });
                }
                this.$set(this.formBindValidate,'authOwner',data.data.data.rows[0].binding_info.owner);
                this.$set(this.formBindValidate,'authEngineNo',data.data.data.rows[0].binding_info.engine_no);
                this.$set(this.formBindValidate,'authCarType',data.data.data.rows[0].binding_info.use_car_type_name);
                this.$set(this.formBindValidate,'authCarTemplate',data.data.data.rows[0].binding_info.brand_model);
                if(data.data.data.rows[0].binding_info.car_person_img_path){
                    this.$set(this.carPerList,0,{ url:data.data.data.rows[0].binding_info.car_person_img_path,name:'carPerPic1', });
                }
            }
            
            this.$set(this.formValidate,'sex',data.data.data.rows[0].id_sex);
            this.$set(this.formValidate,'address',data.data.data.rows[0].id_address);
            if(data.data.data.rows[0].id_back_img_path){
                this.$set(this.idBackList,0,{ url:data.data.data.rows[0].id_back_img_path,name:'idBackPic1', });
            }
            this.$set(this.formValidate,'driveNo',data.data.data.rows[0].driver_no);
            this.$set(this.formValidate,'endDriveDate',data.data.data.rows[0].driver_valid_date);
            if(data.data.data.rows[0].driver_copy_img_path){
                this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].driver_copy_img_path,name:'driveBackPic1', });
            }
            if(data.data.data.rows[0].net_car_img_path){
                this.$set(this.webDriveCarList,0,{ url:data.data.data.rows[0].net_car_img_path,name:'webDriveCarPic1', });
            }
        })

        if(this.$route.query.type === 'expand'){
            this.disabledStatus = true;
        }
  },
  activated () {

      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))

        this.getDriverLists({ id:this.$route.query.id,fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {

            this.carId = data.data.data.rows[0].binding_id;
            this.$set(this.formValidate,'idName',data.data.data.rows[0].id_name);
            this.$set(this.formValidate,'telephone',data.data.data.rows[0].telephone);
            if(data.data.data.rows[0].id_img_path){
                this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].id_img_path, name:'idFrontPic1', });
            }
            this.$set(this.formValidate,'driveName',data.data.data.rows[0].driver_name);
            this.$set(this.formValidate,'getDriveDate',data.data.data.rows[0].driver_get_date);
            this.$set(this.formValidate,'driveType',data.data.data.rows[0].driver_type);
            if(data.data.data.rows[0].driver_img_path){
                this.$set(this.driveFontList,0,{ url:data.data.data.rows[0].driver_img_path,name:'driveFontPic1', });
            }
            if(data.data.data.rows[0].net_driver_img_path){
                this.$set(this.webDrivePerList,0,{ url:data.data.data.rows[0].net_driver_img_path,name:'webDrivePerPic1', });
            }
            this.$set(this.formValidate,'checkPass',data.data.data.rows[0].auth_status);
            this.$set(this.formValidate,'operateStatus',data.data.data.rows[0].status);

            if(data.data.data.rows[0].auth_status === 3 ){
                this.rejectVisible = true;
                this.$set(this.formValidate,'rejectDesc',data.data.data.rows[0].auth_status);
            }

            if(data.data.data.rows[0].status === 0 ){
                this.stopVisible = true;
                this.$set(this.formValidate,'stopDesc',data.data.data.rows[0].auth_status);
            }

            this.auth_status = data.data.data.rows[0].auth_status;
            this.is_server = data.data.data.rows[0].status;

            if(data.data.data.rows[0].binding_info.car_no === ''){
                    this.car_info_show = false
            }else{
                this.$set(this.formBindValidate,'authCarNo',data.data.data.rows[0].binding_info.car_no);
                this.$set(this.formBindValidate,'authVin',data.data.data.rows[0].binding_info.frame_no);
                this.$set(this.formBindValidate,'authCarRegisteredDate',data.data.data.rows[0].binding_info.register_date);
                this.$set(this.formBindValidate,'authCarColor',data.data.data.rows[0].binding_info.car_color);
                if(data.data.data.rows[0].binding_info.travel_img_path){
                    this.$set(this.travelFrontList,0,{ url:data.data.data.rows[0].binding_info.travel_img_path,name:'travelFrontPic1', });
                }
                this.$set(this.formBindValidate,'authOwner',data.data.data.rows[0].binding_info.owner);
                this.$set(this.formBindValidate,'authEngineNo',data.data.data.rows[0].binding_info.engine_no);
                this.$set(this.formBindValidate,'authCarType',data.data.data.rows[0].binding_info.use_car_type_name);
                this.$set(this.formBindValidate,'authCarTemplate',data.data.data.rows[0].binding_info.brand_model);
                if(data.data.data.rows[0].binding_info.car_person_img_path){
                    this.$set(this.carPerList,0,{ url:data.data.data.rows[0].binding_info.car_person_img_path,name:'carPerPic1', });
                }
            }
            
            this.$set(this.formValidate,'sex',data.data.data.rows[0].id_sex);
            this.$set(this.formValidate,'address',data.data.data.rows[0].id_address);
            if(data.data.data.rows[0].id_back_img_path){
                this.$set(this.idBackList,0,{ url:data.data.data.rows[0].id_back_img_path,name:'idBackPic1', });
            }
            this.$set(this.formValidate,'driveNo',data.data.data.rows[0].driver_no);
            this.$set(this.formValidate,'endDriveDate',data.data.data.rows[0].driver_valid_date);
            if(data.data.data.rows[0].driver_copy_img_path){
                this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].driver_copy_img_path,name:'driveBackPic1', });
            }
            if(data.data.data.rows[0].net_car_img_path){
                this.$set(this.webDriveCarList,0,{ url:data.data.data.rows[0].net_car_img_path,name:'webDriveCarPic1', });
            }
        })

        if(this.$route.query.type === 'expand'){
            this.disabledStatus = true;
        }
  }
}
</script>

<style lang="less">
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
