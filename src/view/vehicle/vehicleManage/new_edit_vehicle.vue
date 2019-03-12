<template>
  <div style="padding:0 24px 24px;">
    <Card shadow :title="cardTitle" class="indentCard">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >
                    <FormItem label="审核状态" prop="status" v-if="add_edit === 1">
                        <Select v-model="formValidate.status" placeholder="请选择审核状态" style="width:200px">
                            <Option value="0">待审核</Option>
                            <Option value="1">审核通过</Option>
                            <Option value="2">审核拒绝</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="行驶证正面照" prop="drivePic" :label-width="100">
                        <div class="demo-upload-list" v-for="item in driveList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleDrive"
                            type="drag"
                            action=""
                            :style="{display: driveList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    <Modal title="图片预览" v-model="visible" :footer-hide="true">
                        <img :src="allPicModal" v-if="visible" style="width: 100%">
                    </Modal>

                    <FormItem label="车牌号" prop="licensePlateNum">
                        <Input v-model="formValidate.licensePlateNum" placeholder="请输入车牌号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="所有人" prop="owner">
                        <Input v-model="formValidate.owner" placeholder="请输入所有人" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="车架号" prop="VIN" >
                        <Input v-model="formValidate.VIN" placeholder="请输入车架号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="发动机号" prop="engineNum">
                        <Input :min="0" v-model="formValidate.engineNum"></Input>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="人车找合照" prop="mancarPic" >
                        <div class="demo-upload-list" v-for="item in mancarList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="mancarUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleMancar"
                            type="drag"
                            action=""
                            :style="{display: mancarList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <FormItem label="注册日期" prop="registerData">
                        <DatePicker type="date" placeholder="注册日期" v-model="formValidate.registerData" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="品牌车型" prop="brandModel">
                        <Input v-model="formValidate.brandModel" placeholder="请输入品牌车型" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="用车车型" prop="useModel">
                        <Input v-model="formValidate.useModel" placeholder="请输入用车车型" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="车身颜色" prop="carColor">
                        <Input v-model="formValidate.carColor" placeholder="请输入车身颜色" style="width:200px"></Input>
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

    <Card shadow title="绑定司机信息" class="indentCard" v-if="add_edit === 2">
        <Row>
            <Col span="12">
                
                <Form ref="formDriverValidate" :model="formDriverValidate" :label-width="80" >
                    <div style="margin:10px 0;">司机信息</div>
                    <FormItem label="司机姓名" prop="driverName">
                        <Input v-model="formDriverValidate.driverName" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="司机电话" prop="phone">
                        <Input v-model="formDriverValidate.phone" placeholder="请输入司机电话" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="是否通过审核" prop="driverCheck" :label-width="100">
                        <RadioGroup v-model="formValidate.driverCheck">
                            <Radio label="1">通过审核</Radio>
                            <Radio label="2">未审核</Radio>
                            <Radio label="3">待审核</Radio>
                            <Radio label="4">审核拒绝</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="身份证正面" prop="idFrontPic" >
                        <div class="demo-upload-list" v-for="item in idFrontList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="idFrontUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: idFrontList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    
                    <div style="margin:10px 0;">驾驶证信息</div>
                    <FormItem label="司机姓名" prop="driveName">
                        <Input v-model="formDriverValidate.driveName" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="领证日期" prop="getPaperData">
                        <DatePicker type="date" placeholder="领证日期" v-model="formDriverValidate.getPaperData" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="准驾车型" prop="carModel">
                        <Input v-model="formDriverValidate.carModel" placeholder="请输入准驾车型" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="驾驶证正面" prop="driveFrontPic" >
                        <div class="demo-upload-list" v-for="item in driveFrontList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveFrontUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: driveFrontList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <div style="margin:10px 0;">其他信息</div>
                    <FormItem label="网约车驾驶证(人证)" prop="webPerPic" :label-width="120">
                        <div class="demo-upload-list" v-for="item in webPerList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="webPerUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: webPerList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formDriverValidate" :model="formDriverValidate" :label-width="80" >
                    
                    <div style="margin:10px 0;">&nbsp;</div>
                    <FormItem label="司机性别" prop="sex" >
                        <RadioGroup v-model="formDriverValidate.sex">
                            <Radio label="1">男</Radio>
                            <Radio label="2">女</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="司机身份证号" prop="idNum" :label-width="100">
                        <Input v-model="formDriverValidate.idNum" placeholder="请输入司机身份证号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="司机住址" prop="address">
                        <Input v-model="formDriverValidate.address" placeholder="请输入司机住址" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="身份证反面" prop="idBackPic" >
                        <div class="demo-upload-list" v-for="item in idBackList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="idBackUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: idBackList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <div style="margin:10px 0;">&nbsp;</div>
                    <FormItem label="驾驶证号" prop="driveNum">
                        <Input v-model="formDriverValidate.driveNum" placeholder="请输入驾驶证号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="有效日期" prop="registerData">
                        <DatePicker type="date" placeholder="注册日期" v-model="formDriverValidate.registerData" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem style="visibility:hidden;">
                        <Input style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="驾驶证反面" prop="driveBackPic" >
                        <div class="demo-upload-list" v-for="item in driveBackList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveBackUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: driveBackList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <div style="margin:10px 0;">&nbsp;</div>
                    <FormItem label="网约车驾驶证(车证)" prop="webDrivePic" :label-width="120">
                        <div class="demo-upload-list" v-for="item in webDriveList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="webDriveUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: webDriveList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
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
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,Upload,Select,Option,RadioGroup,Radio, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'new_edit_vehicle',
  components: {
    Row,
    Col,
    Card,
    Input,
    Button,
    DatePicker,
    Table,
    AutoComplete,
    Form,
    FormItem,
    Modal,
    Icon,
    Upload,
    Select,
    Option,
    RadioGroup,
    Radio,
  },
  data () {
    return {
      cardTitle:'添加车辆',
      add_edit:1,
      formValidate: {},
      ruleValidate: {
          brandModel:[
              { required: true, message: '请填写司品牌车型', trigger: 'blur' }
          ]
      },
      visible:false,
      driveList:[],
      mancarList:[],
      formDriverValidate:{},
      idFrontList:[],
      driveFrontList:[],
      webPerList:[],
      idBackList:[],
      driveBackList:[],
      webDriveList:[],
    }
  },
  methods: {

    handleView (url) {
        this.allPicModal = url;
        this.visible = true;
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleDrive (file) {
        // let check = this.idFrontList.length < 2;
        // if (!check) {
        //     this.$Notice.warning({
        //         title: '只能上传一张图片'
        //     });
        // }else{
        //     let reader = new FileReader();
        //     reader.readAsDataURL(file);
        //     reader.onloadend = () => {
        //         let base64Img = reader.result.split('base64,')[1];
        //         this.idFrontBase64 = base64Img;
        //         this.uploadPic({ base64Img }).then(res => {
        //             this.$set(this.idFrontList,0, {
        //                 url:res.data.data.path,
        //                 name:'idFrontPic' + res.data.data.ossId,
        //             })
        //         })
        //     };
        // }
        
        // return check;
    },
    handleMancar(file){

    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    },
  },
  mounted () {
    if(this.$route.query.id){
        this.add_edit = 2;
        this.cardTitle = '编辑车辆';
    }else{
        this.add_edit = 1;
    }
  },
  activated () {
    if(this.$route.query.id){
        this.add_edit = 2;
        this.cardTitle = '编辑车辆';
    }else{
        this.add_edit = 1;
    }
  }
}
</script>

<style lang="less">
.bm-view {
  width: 100%;
  height: 700px;
}
.indentCard{
    margin-top:10px;
    .cardSlot{
        display: flex;
        .ivu-steps{
            .ivu-steps-main{
                display: block;
                margin-top: 25px;
            }
        }
    }
}
</style>
