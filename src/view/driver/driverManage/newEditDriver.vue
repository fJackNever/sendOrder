<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >

                    <FormItem label="司机电话" prop="driverTelephone" :label-width="120">
                        <Input v-model="formValidate.driverTelephone" placeholder="请输入司机电话" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="司机城市" prop="city">
                        <Select v-model="formValidate.city" placeholder="请选择司机城市" style="width:200px">
                            <Option v-for="(item,index) in city_arr" :value="item.id" :key="index">{{item.city}}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="司机头像" prop="driveHeadPic" >
                        <div class="demo-upload-list" v-for="item in driveHeadList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(7)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveHeadUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeDriveHead"
                            type="drag"
                            action=""
                            :style="{display: driveHeadList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <!-- <FormItem label="邀请人电话" prop="inviteTelephone" :label-width="120">
                        <Input v-model="formValidate.inviteTelephone" placeholder="请输入邀请人电话" style="width:200px"></Input>
                    </FormItem> -->

                    <div style="margin:10px 0;">身份证信息</div>
                    <FormItem label="司机姓名" prop="idName">
                        <Input v-model="formValidate.idName" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="身份证号" prop="idNo">
                        <Input v-model="formValidate.idNo" placeholder="请输入身份证号" style="width:200px"></Input>
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
                    <FormItem label="司机姓名" prop="driveName">
                        <Input v-model="formValidate.driveName" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="领证日期" prop="getDriveDate" :label-width="120">
                        <DatePicker type="date" placeholder="领证日期" v-model="formValidate.getDriveDate" style="width:200px"></DatePicker>
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

                    <div style="margin:10px 0;">其他信息</div>
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

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                    
                    <FormItem label="司机运营状态" prop="operateStatus" :label-width="120">
                        <Select v-model="formValidate.operateStatus" placeholder="请选择司机运营状态" style="width:200px">
                            <Option :value="0">停运</Option>
                            <Option :value="1">正常运营</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="visibility:hidden;">
                        <Input placeholder="" ></Input>
                    </FormItem>
                    <FormItem >
                        <Upload
                            ref=""
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: 'inline-block' ,width:'58px',visibility:'hidden'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

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

                    <div style="margin:10px 0;">&nbsp;</div>
                    <FormItem label="驾驶证号" prop="driveNo" :label-width="120">
                        <Input v-model="formValidate.driveNo" placeholder="请输入驾驶证号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="有效日期" prop="endDriveDate" :label-width="120">
                        <DatePicker type="date" placeholder="有效日期" v-model="formValidate.endDriveDate" style="width:200px"></DatePicker>
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

                    <div style="margin:10px 0;">&nbsp;</div>
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
import { Row,Col,Card,Input,Button,DatePicker,Select,Option,Table,AutoComplete,Form,FormItem,RadioGroup,Radio,Upload,Modal,Icon } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment' 
export default {
  name: 'newEditDriver',
  components: {
    Row,
    Col,
    Card,
    Input,
    Button,
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
          operateStatus:1,
          sex:1,
      },
      add_edit:1,
      cardTitle:'新增加盟司机',
      ruleValidate: {
          driverTelephone:[
              { required: true, message: '请填写司机电话', trigger: 'blur' }
          ]
      },
      city_arr:[],
      driverIdArr:[],
      allPicModal: '',
      visible: false,
      idFrontList: [],
      driveFontList: [],
      webDrivePerList: [],
      idBackList: [],
      driveBackList: [],
      webDriveCarList: [],
      driveHeadList:[],
      
    }
  },
  methods: {
    ...mapActions([
      'uploadPic',
      'addDriver',
      'editDriver',
      'getDriverLists',
      'getCompanyCityLists',
    ]),
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
        }else if(type === 7){
            this.driveHeadList.splice(0,1)
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

    handleBeforeDriveHead(file){
        let check = this.driveHeadList.length < 2;
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
                    this.$set(this.driveHeadList,0, {
                        url:res.data.data.path,
                        name:'driveHeadPic' + res.data.data.ossId,
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

    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(this.add_edit === 1){
                    let momGDDate,momEDDate;
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

                    this.addDriver({ 
                        auth_status:1,
                        city_id:this.formValidate.city,
                        header_img_path:this.driveHeadList[0].url,
                        telephone:this.formValidate.driverTelephone || '',
                        id_name:this.formValidate.idName || '',
                        id_no:this.formValidate.idNo || '',
                        id_img_path:this.idFrontList[0].url,
                        driver_name:this.formValidate.driveName || '',
                        driver_get_date:momGDDate,
                        driver_type:this.formValidate.driveType,
                        driver_img_path:this.driveFontList[0].url,
                        net_driver_img_path:this.webDrivePerList[0].url,
                        status:this.formValidate.operateStatus,
                        id_sex:this.formValidate.sex,
                        id_address:this.formValidate.address || '',
                        id_back_img_path:this.idBackList[0].url,
                        driver_no:this.formValidate.driveNo || '',
                        driver_valid_date:momEDDate,
                        driver_copy_img_path:this.driveBackList[0].url,
                        net_car_img_path:this.webDriveCarList[0].url,
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('新增成功!');
                            this.$router.push({ path:'driverManage' });
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else{
                    let momGDDate,momEDDate;
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

                    this.editDriver({ 
                        id:this.$route.query.id,
                        auth_status:1,
                        city_id:this.formValidate.city,
                        header_img_path:this.driveHeadList[0].url,
                        telephone:this.formValidate.driverTelephone || '',
                        id_name:this.formValidate.idName || '',
                        id_no:this.formValidate.idNo || '',
                        id_img_path:this.idFrontList[0].url,
                        driver_name:this.formValidate.driveName || '',
                        driver_get_date:momGDDate,
                        driver_type:this.formValidate.driveType,
                        driver_img_path:this.driveFontList[0].url,
                        net_driver_img_path:this.webDrivePerList[0].url,
                        status:this.formValidate.operateStatus,
                        id_sex:this.formValidate.sex,
                        id_address:this.formValidate.address || '',
                        id_back_img_path:this.idBackList[0].url,
                        driver_no:this.formValidate.driveNo || '',
                        driver_valid_date:momEDDate,
                        driver_copy_img_path:this.driveBackList[0].url,
                        net_car_img_path:this.webDriveCarList[0].url,
                     }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            this.$router.push({ path:'driverManage' });
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
        this.$refs['formValidate'].resetFields();
        if(this.$route.query.id){
            this.add_edit = 2;
            this.cardTitle = '修改加盟司机';
            this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.city_arr,i,data.data.data.rows[i])
                }
            }).then(()=>{
                this.getDriverLists({ id:this.$route.query.id,status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                    
                    this.$set(this.formValidate,'driverTelephone',data.data.data.rows[0].telephone);
                    this.$set(this.formValidate,'city',data.data.data.rows[0].city_id);
                    if(data.data.data.rows[0].header_img_path){
                        this.$set(this.driveHeadList,0,{ url:data.data.data.rows[0].header_img_path, name:'driveHeadPic1' });
                    }
                    this.$set(this.formValidate,'idName',data.data.data.rows[0].id_name);
                    this.$set(this.formValidate,'idNo',data.data.data.rows[0].id_no);
                    if(data.data.data.rows[0].id_img_path){
                        this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].id_img_path, name:'idFrontPic1' });
                    }
                    this.$set(this.formValidate,'driveName',data.data.data.rows[0].driver_name);
                    this.$set(this.formValidate,'getDriveDate',data.data.data.rows[0].driver_get_date);
                    this.$set(this.formValidate,'driveType',data.data.data.rows[0].driver_type);
                    if(data.data.data.rows[0].driver_img_path){
                        this.$set(this.driveFontList,0,{ url:data.data.data.rows[0].driver_img_path,name:'driveFontPic1', });
                    }
                    if(data.data.data.rows[0].net_driver_img_path){
                        this.$set(this.webDrivePerList,0,{ url:data.data.data.rows[0].net_driver_img_path,name:'webDrivePerPic1' });
                    }
                    this.$set(this.formValidate,'operateStatus',data.data.data.rows[0].status);
                    this.$set(this.formValidate,'sex',data.data.data.rows[0].id_sex);
                    this.$set(this.formValidate,'address',data.data.data.rows[0].id_address);
                    if(data.data.data.rows[0].id_back_img_path){
                        this.$set(this.idBackList,0,{ url:data.data.data.rows[0].id_back_img_path,name:'idBackPic1' });
                    }
                    this.$set(this.formValidate,'driveNo',data.data.data.rows[0].driver_no);
                    this.$set(this.formValidate,'endDriveDate',data.data.data.rows[0].driver_valid_date);
                    if(data.data.data.rows[0].driver_copy_img_path){
                        this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].driver_copy_img_path,name:'driveBackPic1' });
                    }
                    if(data.data.data.rows[0].net_car_img_path){
                        this.$set(this.webDriveCarList,0,{ url:data.data.data.rows[0].net_car_img_path,name:'webDriveCarPic1', });
                    
                    }

                })
            })

        }else{
            this.add_edit = 1;
            this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.city_arr,i,data.data.data.rows[i])
                }
            })
        }
  },
  activated () {
        this.$refs['formValidate'].resetFields();
        if(this.$route.query.id){
            this.add_edit = 2;
            this.cardTitle = '修改加盟司机';
            this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.city_arr,i,data.data.data.rows[i])
                }
            }).then(()=>{
                this.getDriverLists({ id:this.$route.query.id,status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                    
                    this.$set(this.formValidate,'driverTelephone',data.data.data.rows[0].telephone);
                    this.$set(this.formValidate,'city',data.data.data.rows[0].city_id);
                    if(data.data.data.rows[0].header_img_path){
                        this.$set(this.driveHeadList,0,{ url:data.data.data.rows[0].header_img_path, name:'driveHeadPic1' });
                    }
                    this.$set(this.formValidate,'idName',data.data.data.rows[0].id_name);
                    this.$set(this.formValidate,'idNo',data.data.data.rows[0].id_no);
                    if(data.data.data.rows[0].id_img_path){
                        this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].id_img_path, name:'idFrontPic1' });
                    }
                    this.$set(this.formValidate,'driveName',data.data.data.rows[0].driver_name);
                    this.$set(this.formValidate,'getDriveDate',data.data.data.rows[0].driver_get_date);
                    this.$set(this.formValidate,'driveType',data.data.data.rows[0].driver_type);
                    if(data.data.data.rows[0].driver_img_path){
                        this.$set(this.driveFontList,0,{ url:data.data.data.rows[0].driver_img_path,name:'driveFontPic1', });
                    }
                    if(data.data.data.rows[0].net_driver_img_path){
                        this.$set(this.webDrivePerList,0,{ url:data.data.data.rows[0].net_driver_img_path,name:'webDrivePerPic1' });
                    }
                    this.$set(this.formValidate,'operateStatus',data.data.data.rows[0].status);
                    this.$set(this.formValidate,'sex',data.data.data.rows[0].id_sex);
                    this.$set(this.formValidate,'address',data.data.data.rows[0].id_address);
                    if(data.data.data.rows[0].id_back_img_path){
                        this.$set(this.idBackList,0,{ url:data.data.data.rows[0].id_back_img_path,name:'idBackPic1' });
                    }
                    this.$set(this.formValidate,'driveNo',data.data.data.rows[0].driver_no);
                    this.$set(this.formValidate,'endDriveDate',data.data.data.rows[0].driver_valid_date);
                    if(data.data.data.rows[0].driver_copy_img_path){
                        this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].driver_copy_img_path,name:'driveBackPic1' });
                    }
                    if(data.data.data.rows[0].net_car_img_path){
                        this.$set(this.webDriveCarList,0,{ url:data.data.data.rows[0].net_car_img_path,name:'webDriveCarPic1', });
                    
                    }

                })
            })
        }else{
            this.add_edit = 1;
            this.cardTitle = '新增加盟司机'; 
            this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.city_arr,i,data.data.data.rows[i])
                }
            })
        }
  },
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
