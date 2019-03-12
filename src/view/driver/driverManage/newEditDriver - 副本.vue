<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >
                    <FormItem label="自定义司机类型" prop="driverType">
                        <Select v-model="formValidate.driverType" placeholder="请选择自定义司机类型" style="width:200px">
                            <Option v-for="item in driverIdArr" :value="item.driverTypeId" >{{item.name}}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="状态" prop="status">
                        <Select v-model="formValidate.status" placeholder="请选择状态" style="width:200px">
                            <Option value="0">异常</Option>
                            <Option value="1">正常</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="类型" prop="type">
                        <Select v-model="formValidate.type" placeholder="请选择类型" style="width:200px">
                            <Option value="1">租车司机</Option>
                            <Option value="2">加盟司机</Option>
                            <Option value="3">对公司机</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="昵称" prop="nickName">
                        <Input v-model="formValidate.nickName" placeholder="请输入昵称" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="钱包（元）" prop="amount">
                        <InputNumber :min="0" v-model="formValidate.amount"></InputNumber>
                    </FormItem>

                    <FormItem label="身份证姓名" prop="idName">
                        <Input v-model="formValidate.idName" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="身份证照片" prop="IdFrontPic" >
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

                    <FormItem label="身份证号" prop="idNo">
                        <Input v-model="formValidate.idNo" placeholder="请输入身份证号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="驾驶证姓名" prop="driveName">
                        <Input v-model="formValidate.driveName" placeholder="请输入驾驶证姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="驾驶证图片" prop="driveFrontPic" >
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

                    <FormItem label="网约车驾驶证" prop="webDrivePerPic" >
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

                     <FormItem label="司机性别" prop="sex" :label-width="120" >
                        <RadioGroup v-model="formValidate.sex">
                            <Radio label="1">男</Radio>
                            <Radio label="2">女</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="驾驶证号" prop="driveNo" :label-width="120">
                        <Input v-model="formValidate.driveNo" placeholder="请输入驾驶证号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="驾驶证领证日期" prop="getDriveDate" :label-width="120">
                        <DatePicker type="date" placeholder="驾驶证领证日期" v-model="formValidate.getDriveDate" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="驾驶证有效日期" prop="endDriveDate" :label-width="120">
                        <DatePicker type="date" placeholder="驾驶证有效日期" v-model="formValidate.endDriveDate" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="手机号" prop="telephone" :label-width="120">
                        <Input v-model="formValidate.telephone" placeholder="请输入手机号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="密码" prop="password" :label-width="120">
                        <Input v-model="formValidate.password" placeholder="请输入密码" style="width:200px"></Input>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >

                    <FormItem label="司机住址" prop="address" :label-width="120">
                        <Input v-model="formValidate.address" placeholder="请输入司机住址" style="width:400px"></Input>
                    </FormItem>

                    <FormItem label="准驾类型" prop="driveType" :label-width="120">
                        <Select v-model="formValidate.driveType" placeholder="请选择准驾类型" style="width:200px">
                            <Option value="1">A1</Option>
                            <Option value="2">A2</Option>
                            <Option value="3">A3</Option>
                            <Option value="4">B1</Option>
                            <Option value="5">B2</Option>
                            <Option value="6">C1</Option>
                            <Option value="7">C2</Option>
                            <Option value="8">C3</Option>
                            <Option value="9">C4</Option>
                            <Option value="10">D</Option>
                            <Option value="11">E</Option>
                            <Option value="12">F</Option>
                            <Option value="13">M</Option>
                            <Option value="14">N</Option>
                            <Option value="15">P</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="网约车运输证" prop="webDriveCarPic" :label-width="120">
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

                    <FormItem label="司机认证状态" prop="authCustomerStatus" :label-width="120">
                        <Select v-model="formValidate.authCustomerStatus" placeholder="请选择司机认证状态" style="width:200px">
                            <Option value="0">未认证</Option>
                            <Option value="1">认证中</Option>
                            <Option value="2">已认证</Option>
                            <Option value="3">认证失败</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="认证车牌号" prop="authCarNo" :label-width="120">
                        <Input v-model="formValidate.authCarNo" placeholder="请输入认证车牌号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="认证车辆类型" prop="authCarType" :label-width="120">
                        <Select v-model="formValidate.authCarType" placeholder="请选择认证车辆类型" style="width:200px">
                            <Option value="1">快车</Option>
                            <Option value="2">专车</Option>
                            <Option value="3">商务</Option>
                            <Option value="4">豪华</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="认证车辆车主" prop="authOwner" :label-width="120">
                        <Input v-model="formValidate.authOwner" placeholder="请输入认证车辆车主" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="认证车辆车架号" prop="authVin" :label-width="120">
                        <Input v-model="formValidate.authVin" placeholder="请输入认证车辆车架号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="认证车辆发动机号" prop="authEngineNo" :label-width="120">
                        <Input v-model="formValidate.authEngineNo" placeholder="请输入认证车辆发动机号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="认证车辆注册日期" prop="authCarRegisteredDate" :label-width="120">
                        <DatePicker type="date" placeholder="认证车辆注册日期" v-model="formValidate.authCarRegisteredDate" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="认证车辆品牌车型" prop="authCarTemplate" :label-width="120">
                        <Select v-model="formValidate.authCarTemplate" placeholder="请选择认证车辆品牌车型" style="width:200px">
                            <Option v-for="item in authCMIdArr" :value="item.authCarTemplateId" >{{item.brand}} - {{item.model}}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="认证车辆车身颜色" prop="authCarColor" :label-width="120">
                        <Input v-model="formValidate.authCarColor" placeholder="认证车辆车身颜色" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="认证车辆状态" prop="authCarStatus" :label-width="120">
                        <Select v-model="formValidate.authCarStatus" placeholder="请选择认证车辆状态" style="width:200px">
                            <Option value="0">未认证</Option>
                            <Option value="1">认证中</Option>
                            <Option value="2">已认证</Option>
                            <Option value="3">认证失败</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="认证车辆行驶证" prop="IdBackPic" :label-width="120">
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

                    <FormItem label="认证车辆人车合一图" prop="driveBackPic" :label-width="120">
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

                    <FormItem label="推送消息预约播放" prop="noticeBt" :label-width="120">
                        <Select v-model="formValidate.noticeBt" placeholder="请选择推送消息预约播放" style="width:200px">
                            <Option value="0">未开启</Option>
                            <Option value="1">已开启</Option>
                        </Select>
                    </FormItem>

                    <FormItem v-if="add_edit === 1">
                        <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
                    </FormItem>
                    <FormItem v-if="add_edit === 2">
                        <Button type="primary" @click="handleSubmit('formValidate')">修改</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
      </Card>
  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Form,FormItem,RadioGroup,Radio,Upload,Modal,Icon,InputNumber } from 'iview'
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
    InputNumber,
  },
  data () {
    return {
      formValidate: {
          status:'0',
          type:'1',
          driveType:'1',
          authCustomerStatus:'0',
          authCarType:'1',
          authCarStatus:'0',
          noticeBt:'0',
          sex:'1',
          amount:0,
          getDriveDate:moment().format('YYYY-MM-DD'),
          endDriveDate:moment().format('YYYY-MM-DD'),
          authCarRegisteredDate:moment().format('YYYY-MM-DD'),
      },
      add_edit:1,
      cardTitle:'新增加盟司机',
      ruleValidate: {
          nickName:[
              { required: true, message: '请填写昵称', trigger: 'blur' }
          ],
      },
      driverIdArr:[],
      authCMIdArr:[],
      allPicModal: '',
      visible: false,
      idFrontList: [],
      idFrontBase64:'',
      driveFontList: [],
      driveFontBase64:'',
      webDrivePerList: [],
      webDrivePerBase64:'',
      idBackList: [],
      idBackBase64:'',
      driveBackList: [],
      driveBackBase64:'',
      webDriveCarList: [],
      webDriveCarBase64:'',
    }
  },
  methods: {
    ...mapActions([
      'uploadPic',
      'getDriverTypeList',
      'getAuthCarTemplateList',
      'addDriver',
      'editDriver',
      'getDriverList',
    ]),
    handleView (url) {
        this.allPicModal = url;
        this.visible = true;
    },
    handleRemove (type) {
        if(type === 1){
            this.idFrontList.splice(0,1)
            this.idFrontBase64 = ''
        }else if(type === 2){
            this.driveFontList.splice(0,1)
            this.driveFontBase64 = ''
        }else if(type === 3){
            this.webDrivePerList.splice(0,1)
            this.webDrivePerBase64 = ''
        }else if(type === 4){
            this.idBackList.splice(0,1)
            this.idBackBase64 = ''
        }else if(type === 5){
            this.driveBackList.splice(0,1)
            this.driveBackBase64 = ''
        }else if(type === 6){
            this.webDriveCarList.splice(0,1)
            this.webDriveCarBase64 = ''
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
                this.idFrontBase64 = base64Img;
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
                this.driveFontBase64 = base64Img;
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
                this.webDrivePerBase64 = base64Img;
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
                this.idBackBase64 = base64Img;
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
                this.driveBackBase64 = base64Img;
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
                this.webDriveCarBase64 = base64Img;
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

    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(this.add_edit === 1){
                    let driverTypeArr = [],momGDDate,momEDDate,momACGDate;
                    driverTypeArr.push(this.formValidate.driverType);

                    if(this.formValidate.getDriveDate){
                        momGDDate = moment(this.formValidate.getDriveDate).format('YYYY-MM-DD')
                    }else{
                        momGDDate = ''
                    }

                    if(this.formValidate.endDriveDate){
                        momEDDate = moment(this.formValidate.endDriveDate).format('YYYY-MM-DD')
                    }else{
                        momEDDate = ''
                    }

                    if(this.formValidate.authCarRegisteredDate){
                        momACGDate = moment(this.formValidate.authCarRegisteredDate).format('YYYY-MM-DD')
                    }else{
                        momACGDate = ''
                    }

                    this.addDriver({ 
                        status:parseInt(this.formValidate.status),
                        driverTypeIds:driverTypeArr,
                        type:this.formValidate.type,
                        nickName:this.formValidate.nickName,
                        amount:this.formValidate.amount * 100 ,
                        idName:this.formValidate.idName || '',
                        idNoImg:this.idFrontBase64,
                        driveName:this.formValidate.driveName || '',
                        driveImg:this.driveFontBase64,
                        netCarDriveImg:this.webDrivePerBase64,
                        sex:parseInt(this.formValidate.sex),
                        driveNo:this.formValidate.driveNo || '',
                        getDriveDate:momGDDate,
                        endDriveDate:momEDDate,
                        telephone:this.formValidate.telephone || '',
                        password:this.formValidate.password || '',
                        address:this.formValidate.address || '',
                        driveType:parseInt(this.formValidate.driveType),
                        netCarImg:this.webDriveCarBase64,
                        authCustomerStatus:parseInt(this.formValidate.authCustomerStatus),
                        authCarNo:this.formValidate.authCarNo || '',
                        authCarType:parseInt(this.formValidate.authCarType),
                        authOwner:this.formValidate.authOwner || '',
                        authVin:this.formValidate.authVin || '',
                        authEngineNo:this.formValidate.authEngineNo || '',
                        authCarRegisteredDate:momACGDate,
                        authCarTemplateId:this.formValidate.authCarTemplate,
                        authCarColor:this.formValidate.authCarColor || '',
                        authCarStatus:parseInt(this.formValidate.authCarStatus),
                        authTravelImg:this.idBackBase64,
                        authCpImg:this.driveBackBase64,
                        noticeBt:parseInt(this.formValidate.noticeBt),
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('新增成功!');
                            this.$router.push({path:'driverManage'});
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else{

                    let driverTypeArr = [],momGDDate,momEDDate,momACGDate;
                    driverTypeArr.push(this.formValidate.driverType);

                    if(this.formValidate.getDriveDate){
                        momGDDate = moment(this.formValidate.getDriveDate).format('YYYY-MM-DD')
                    }else{
                        momGDDate = moment().format('YYYY-MM-DD')
                    }

                    if(this.formValidate.endDriveDate){
                        momEDDate = moment(this.formValidate.endDriveDate).format('YYYY-MM-DD')
                    }else{
                        momEDDate = moment().format('YYYY-MM-DD')
                    }

                    if(this.formValidate.authCarRegisteredDate){
                        momACGDate = moment(this.formValidate.authCarRegisteredDate).format('YYYY-MM-DD')
                    }else{
                        momACGDate = moment().format('YYYY-MM-DD')
                    }

                    this.editDriver({ 
                        driverId:this.$route.query.id,
                        status:parseInt(this.formValidate.status),
                        driverTypeIds:driverTypeArr,
                        type:this.formValidate.type,
                        nickName:this.formValidate.nickName,
                        amount:this.formValidate.amount * 100 ,
                        idName:this.formValidate.idName || '',
                        idNoImg:this.idFrontBase64,
                        driveName:this.formValidate.driveName || '',
                        driveImg:this.driveFontBase64,
                        netCarDriveImg:this.webDrivePerBase64,
                        sex:parseInt(this.formValidate.sex),
                        driveNo:this.formValidate.driveNo || '',
                        getDriveDate:momGDDate,
                        endDriveDate:momEDDate,
                        telephone:this.formValidate.telephone || '',
                        password:this.formValidate.password || '',
                        address:this.formValidate.address || '',
                        driveType:parseInt(this.formValidate.driveType),
                        netCarImg:this.webDriveCarBase64,
                        authCustomerStatus:parseInt(this.formValidate.authCustomerStatus),
                        authCarNo:this.formValidate.authCarNo || '',
                        authCarType:parseInt(this.formValidate.authCarType),
                        authOwner:this.formValidate.authOwner || '',
                        authVin:this.formValidate.authVin || '',
                        authEngineNo:this.formValidate.authEngineNo || '',
                        authCarRegisteredDate:momACGDate,
                        authCarTemplateId:this.formValidate.authCarTemplate,
                        authCarColor:this.formValidate.authCarColor || '',
                        authCarStatus:parseInt(this.formValidate.authCarStatus),
                        authTravelImg:this.idBackBase64,
                        authCpImg:this.driveBackBase64,
                        noticeBt:parseInt(this.formValidate.noticeBt),
                     }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            this.$router.push({path:'driverManage'});
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }
            } else {
                this.$Message.error('提交失败!');
            }
        })
    },
  },
  mounted () {
        if(this.$route.query.id){
            this.add_edit = 2;
            this.cardTitle = '修改加盟司机';
            this.getDriverTypeList({ driverTypeId:'',search:'',offset:0,limit:100000 }).then((data) => {
                let driverTypeNewArr = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        driverTypeNewArr.push(data.data.data.rows[i])
                    } 
                }
                for(let i=0; i<driverTypeNewArr.length; i++){
                    this.$set(this.driverIdArr,i,driverTypeNewArr[i]);
                }
            }).then(()=>{
                this.getDriverList({ driverId:this.$route.query.id,search:'',status:'',type:'',sex:'',driveType:'',authCustomerStatus:'',authCarType:'',authCarTemplateId:'',authCarStatus:'',noticeBt:'',offset:0,limit:10 }).then((data) => {
                    this.$set(this.formValidate,'driverType',JSON.parse(data.data.data.rows[0].driverTypeIds)[0]);
                    this.$set(this.formValidate,'status',data.data.data.rows[0].status.toString());
                    this.$set(this.formValidate,'type',data.data.data.rows[0].type.toString());
                    this.$set(this.formValidate,'nickName',data.data.data.rows[0].nickName);
                    this.$set(this.formValidate,'amount',data.data.data.rows[0].amount);
                    this.$set(this.formValidate,'idName',data.data.data.rows[0].idName);
                    this.$set(this.formValidate,'driveName',data.data.data.rows[0].driveName);
                    this.$set(this.formValidate,'idNo',data.data.data.rows[0].idNo);
                    this.$set(this.formValidate,'sex',data.data.data.rows[0].sex);
                    this.$set(this.formValidate,'driveNo',data.data.data.rows[0].driveNo);
                    this.$set(this.formValidate,'getDriveDate',data.data.data.rows[0].getDriveDate);
                    this.$set(this.formValidate,'endDriveDate',data.data.data.rows[0].endDriveDate);
                    this.$set(this.formValidate,'telephone',data.data.data.rows[0].telephone);
                    this.$set(this.formValidate,'password',data.data.data.rows[0].password);
                    this.$set(this.formValidate,'address',data.data.data.rows[0].address);
                    this.$set(this.formValidate,'driveType',data.data.data.rows[0].driveType.toString());
                    this.$set(this.formValidate,'authCustomerStatus',data.data.data.rows[0].authCustomerStatus.toString());
                    this.$set(this.formValidate,'authCarNo',data.data.data.rows[0].authCarNo);
                    this.$set(this.formValidate,'authCarType',data.data.data.rows[0].authCarType.toString());
                    this.$set(this.formValidate,'authOwner',data.data.data.rows[0].authOwner);
                    this.$set(this.formValidate,'authVin',data.data.data.rows[0].authVin);
                    this.$set(this.formValidate,'authEngineNo',data.data.data.rows[0].authEngineNo);
                    this.$set(this.formValidate,'authCarRegisteredDate',data.data.data.rows[0].authCarRegisteredDate);
                    this.$set(this.formValidate,'authCarColor',data.data.data.rows[0].authCarColor);
                    this.$set(this.formValidate,'authCarStatus',data.data.data.rows[0].authCarStatus.toString());
                    this.$set(this.formValidate,'noticeBt',data.data.data.rows[0].noticeBt.toString());

                    if(data.data.data.rows[0].idNoOssPath){
                        this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].idNoOssPath, name:'idFrontPic' + data.data.data.rows[0].idNoOss, });
                    }

                    if(data.data.data.rows[0].driveOssPath){
                        this.$set(this.driveFontList,0,{ url:data.data.data.rows[0].driveOssPath,name:'driveFontPic' + data.data.data.rows[0].driveOss, });
                    }

                    if(data.data.data.rows[0].netCarDriveOssPath){
                        this.$set(this.webDrivePerList,0,{ url:data.data.data.rows[0].netCarDriveOssPath,name:'webDrivePerPic' + data.data.data.rows[0].netCarDriveOssPath, });
                    }

                    if(data.data.data.rows[0].netCarOssPath){
                        this.$set(this.webDriveCarList,0,{ url:data.data.data.rows[0].netCarOssPath,name:'webDriveCarPic' + data.data.data.rows[0].netCarOss, });
                    }

                    if(data.data.data.rows[0].authTravelOssPath){
                        this.$set(this.idBackList,0,{ url:data.data.data.rows[0].authTravelOssPath,name:'idBackPic' + data.data.data.rows[0].authTravelOss, });
                    }

                    if(data.data.data.rows[0].authCpOssPath){
                        this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].authCpOssPath,name:'driveBackPic' + data.data.data.rows[0].authCpOss, });
                    }

                })
            })

            this.getAuthCarTemplateList({ authCarTemplateId:'',search:'',offset:0,limit:10 }).then((data) => {
                data.data.data.rows.map((item,index)=>{
                    this.$set(this.authCMIdArr,index,item);
                })
            }).then((data)=>{
                this.getDriverList({ driverId:this.$route.query.id,search:'',status:'',type:'',sex:'',driveType:'',authCustomerStatus:'',authCarType:'',authCarTemplateId:'',authCarStatus:'',noticeBt:'',offset:0,limit:10 }).then((data) => {
                    this.$set(this.formValidate,'authCarTemplate',data.data.data.rows[0].authCarTemplateId);
                })
            })

        }else{
            this.add_edit = 1;
            this.$refs['formValidate'].resetFields()
            this.getDriverTypeList({ driverTypeId:'',search:'',offset:0,limit:100000 }).then((data) => {
                return data
            }).then((data)=>{
                let driverTypeNewArr = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        driverTypeNewArr.push(data.data.data.rows[i])
                    } 
                }
                for(let i=0; i<driverTypeNewArr.length; i++){
                    this.$set(this.driverIdArr,i,driverTypeNewArr[i]);
                }
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        this.$set(this.formValidate,'driverType',data.data.data.rows[i].driverTypeId);
                        break;
                    }
                }
            })

            this.getAuthCarTemplateList({ authCarTemplateId:'',search:'',offset:0,limit:10 }).then((data) => {
                return data
            }).then((data)=>{
                let authCarNewArr = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        authCarNewArr.push(data.data.data.rows[i])
                    } 
                }
                for(let i=0; i<authCarNewArr.length; i++){
                    this.$set(this.authCMIdArr,i,authCarNewArr[i]);
                }
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        this.$set(this.formValidate,'authCarTemplate',data.data.data.rows[i].authCarTemplateId);
                        break;
                    }
                }
            })
        }
  },
  activated () {
        if(this.$route.query.id){
            this.add_edit = 2;
            this.cardTitle = '修改加盟司机';
            this.getDriverTypeList({ driverTypeId:'',search:'',offset:0,limit:100000 }).then((data) => {
                let driverTypeNewArr = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        driverTypeNewArr.push(data.data.data.rows[i])
                    } 
                }
                for(let i=0; i<driverTypeNewArr.length; i++){
                    this.$set(this.driverIdArr,i,driverTypeNewArr[i]);
                }
            }).then(()=>{
                this.getDriverList({ driverId:this.$route.query.id,search:'',status:'',type:'',sex:'',driveType:'',authCustomerStatus:'',authCarType:'',authCarTemplateId:'',authCarStatus:'',noticeBt:'',offset:0,limit:10 }).then((data) => {
                    this.$set(this.formValidate,'driverType',JSON.parse(data.data.data.rows[0].driverTypeIds)[0]);
                    this.$set(this.formValidate,'status',data.data.data.rows[0].status.toString());
                    this.$set(this.formValidate,'type',data.data.data.rows[0].type.toString());
                    this.$set(this.formValidate,'nickName',data.data.data.rows[0].nickName);
                    this.$set(this.formValidate,'amount',data.data.data.rows[0].amount);
                    this.$set(this.formValidate,'idName',data.data.data.rows[0].idName);
                    this.$set(this.formValidate,'idNo',data.data.data.rows[0].idNo);
                    this.$set(this.formValidate,'driveName',data.data.data.rows[0].driveName);
                    this.$set(this.formValidate,'sex',data.data.data.rows[0].sex);
                    this.$set(this.formValidate,'driveNo',data.data.data.rows[0].driveNo);
                    this.$set(this.formValidate,'getDriveDate',data.data.data.rows[0].getDriveDate);
                    this.$set(this.formValidate,'endDriveDate',data.data.data.rows[0].endDriveDate);
                    this.$set(this.formValidate,'telephone',data.data.data.rows[0].telephone);
                    this.$set(this.formValidate,'password',data.data.data.rows[0].password);
                    this.$set(this.formValidate,'address',data.data.data.rows[0].address);
                    this.$set(this.formValidate,'driveType',data.data.data.rows[0].driveType.toString());
                    this.$set(this.formValidate,'authCustomerStatus',data.data.data.rows[0].authCustomerStatus.toString());
                    this.$set(this.formValidate,'authCarNo',data.data.data.rows[0].authCarNo);
                    this.$set(this.formValidate,'authCarType',data.data.data.rows[0].authCarType.toString());
                    this.$set(this.formValidate,'authOwner',data.data.data.rows[0].authOwner);
                    this.$set(this.formValidate,'authVin',data.data.data.rows[0].authVin);
                    this.$set(this.formValidate,'authEngineNo',data.data.data.rows[0].authEngineNo);
                    this.$set(this.formValidate,'authCarRegisteredDate',data.data.data.rows[0].authCarRegisteredDate);
                    this.$set(this.formValidate,'authCarColor',data.data.data.rows[0].authCarColor);
                    this.$set(this.formValidate,'authCarStatus',data.data.data.rows[0].authCarStatus.toString());
                    this.$set(this.formValidate,'noticeBt',data.data.data.rows[0].noticeBt.toString());

                    if(data.data.data.rows[0].idNoOssPath){
                        this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].idNoOssPath, name:'idFrontPic' + data.data.data.rows[0].idNoOss, });
                    }

                    if(data.data.data.rows[0].driveOssPath){
                        this.$set(this.driveFontList,0,{ url:data.data.data.rows[0].driveOssPath,name:'driveFontPic' + data.data.data.rows[0].driveOss, });
                    }

                    if(data.data.data.rows[0].netCarDriveOssPath){
                        this.$set(this.webDrivePerList,0,{ url:data.data.data.rows[0].netCarDriveOssPath,name:'webDrivePerPic' + data.data.data.rows[0].netCarDriveOssPath, });
                    }

                    if(data.data.data.rows[0].netCarOssPath){
                        this.$set(this.webDriveCarList,0,{ url:data.data.data.rows[0].netCarOssPath,name:'webDriveCarPic' + data.data.data.rows[0].netCarOss, });
                    }

                    if(data.data.data.rows[0].authTravelOssPath){
                        this.$set(this.idBackList,0,{ url:data.data.data.rows[0].authTravelOssPath,name:'idBackPic' + data.data.data.rows[0].authTravelOss, });
                    }

                    if(data.data.data.rows[0].authCpOssPath){
                        this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].authCpOssPath,name:'driveBackPic' + data.data.data.rows[0].authCpOss, });
                    }

                })
            })

            this.getAuthCarTemplateList({ authCarTemplateId:'',search:'',offset:0,limit:10 }).then((data) => {
                data.data.data.rows.map((item,index)=>{
                    this.$set(this.authCMIdArr,index,item);
                })
            }).then((data)=>{
                this.getDriverList({ driverId:this.$route.query.id,search:'',status:'',type:'',sex:'',driveType:'',authCustomerStatus:'',authCarType:'',authCarTemplateId:'',authCarStatus:'',noticeBt:'',offset:0,limit:10 }).then((data) => {
                    this.$set(this.formValidate,'authCarTemplate',data.data.data.rows[0].authCarTemplateId);
                })
            })

        }else{
            this.add_edit = 1;
            this.cardTitle = '新增加盟司机'; 
            this.getDriverTypeList({ driverTypeId:'',search:'',offset:0,limit:100000 }).then((data) => {
                this.$refs['formValidate'].resetFields() 
                return data
            }).then((data)=>{
                let newArr = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        newArr.push(data.data.data.rows[i])
                    } 
                }
                for(let i=0; i<newArr.length; i++){
                    this.$set(this.driverIdArr,i,newArr[i]);
                }
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        this.$set(this.formValidate,'driverType',data.data.data.rows[i].driverTypeId);
                        break;
                    }
                }
            })

            this.getAuthCarTemplateList({ authCarTemplateId:'',search:'',offset:0,limit:10 }).then((data) => {
                this.$refs['formValidate'].resetFields() 
                return data
            }).then((data)=>{
                let newArr = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        newArr.push(data.data.data.rows[i])
                    } 
                }
                for(let i=0; i<newArr.length; i++){
                    this.$set(this.authCMIdArr,i,newArr[i]);
                }
                for(let i=0; i<data.data.data.rows.length; i++){
                    if(data.data.data.rows[i].status === 1){
                        this.$set(this.formValidate,'authCarTemplate',data.data.data.rows[i].authCarTemplateId);
                        break;
                    }
                }
            })
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
