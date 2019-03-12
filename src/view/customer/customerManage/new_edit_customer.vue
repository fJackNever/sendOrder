<template>
  <div style="padding:0 24px 24px;">
    <Card shadow :title="cardTitle" class="indentCard">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >
                    <FormItem label="客户状态" prop="status">
                        <Select v-model="formValidate.status" placeholder="请选择客户状态" style="width:200px" :disabled="statusDis">
                            <Option value="0">待审核</Option>
                            <Option value="1">审核通过</Option>
                            <Option value="2">审核拒绝</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="客户类型" prop="cusType">
                        <Select v-model="formValidate.cusType" placeholder="请选择客户类型" style="width:200px" :disabled="formDis">
                            <Option value="1">公司</Option>
                            <Option value="2">个人</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="客户名称" prop="cusName">
                        <Input v-model="formValidate.cusName" placeholder="请输入客户名称" style="width:200px" :disabled="formDis"></Input>
                    </FormItem>

                    <FormItem label="客户地址" prop="address">
                        <Input v-model="formValidate.address" placeholder="请输入客户地址" style="width:200px" :disabled="formDis"></Input>
                    </FormItem>

                    <FormItem label="客户备注信息" prop="desc" :label-width="100" style="width:400px;">
                        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入客户备注信息" :disabled="formDis"></Input>
                    </FormItem>

                    <FormItem label="客户余额(元)" prop="balance">
                        <InputNumber :min="0" v-model="formValidate.balance" :disabled="formDis"></InputNumber>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="联系人" prop="contactPer">
                        <Input v-model="formValidate.contactPer" placeholder="请输入联系人" style="width:200px" :disabled="formDis"></Input>
                    </FormItem>

                    <FormItem label="联系人手机号" prop="contactPhone" :label-width="100">
                        <Input v-model="formValidate.contactPhone" placeholder="请输入联系人手机号" style="width:200px" :disabled="formDis"></Input>
                    </FormItem>

                    <FormItem label="邮箱" prop="mailBox">
                        <Input v-model="formValidate.mailBox" placeholder="请输入邮箱" style="width:200px" :disabled="formDis"></Input>
                    </FormItem>

                    <FormItem label="营业执照" prop="operationPic" >
                        <div class="demo-upload-list" v-for="item in operationList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(1)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="operationUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleOperation"
                            type="drag"
                            action=""
                            :style="{display: operationList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    <Modal title="图片预览" v-model="visible" :footer-hide="true">
                        <img :src="allPicModal" v-if="visible" style="width: 100%">
                    </Modal>

                    <FormItem label="其他证件" prop="otherPic" >
                        <div class="demo-upload-list" v-for="item in otherList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(2)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="otherUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleOther"
                            type="drag"
                            action=""
                            :style="{display: otherList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
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
                    <FormItem v-if="add_edit === 3">
                        <Button type="primary" @click="handleSubmit('formValidate')">确认审核</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
    </Card>
  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,InputNumber,Upload,Select,Option,RadioGroup,Radio, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'new_edit_customer',
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
    InputNumber,
    Upload,
    Select,
    Option,
    RadioGroup,
    Radio,
  },
  data () {
    return {
      cardTitle:'添加客户',
      statusDis:false,
      formDis:false,
      add_edit:1,
      formValidate: {},
      ruleValidate: {
          contactPer:[
              { required: true, message: '请填写联系人', trigger: 'blur' }
          ],
          contactPhone:[
              { required: true, message: '请填写联系人手机号', trigger: 'blur' }
          ],
      },
      balance:0,
      visible:false,
      operationList:[],
      operationBase64:'',
      otherList:[],
      otherBase64:'',
    }
  },
  methods: {

    handleView (url) {
        this.allPicModal = url;
        this.visible = true;
    },
    handleRemove (type) {
        if(type === 1){
            this.operationList.splice(0,1)
            this.operationBase64 = ''
        }else if(type === 2){
            this.otherList.splice(0,1)
            this.otherBase64 = ''
        }
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleOperation (file) {
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
    handleOther(file){

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
    if(this.$route.query.type){
        this.add_edit = 3;
        this.cardTitle = '查看并审核客户';
        this.statusDis = false;
        this.formDis = true;
    }else{
        this.formDis = false;
        if(this.$route.query.id){
            this.add_edit = 2;
            this.cardTitle = '编辑客户';
            this.statusDis = true;
        }else{
            this.add_edit = 1;
            this.statusDis = false;
        }
    }
  },
  activated () {
    if(this.$route.query.type){
        this.add_edit = 3;
        this.cardTitle = '查看并审核客户';
        this.statusDis = false;
        this.formDis = true;
    }else{
        this.formDis = false;
        if(this.$route.query.id){
            this.add_edit = 2;
            this.cardTitle = '编辑客户';
            this.statusDis = true;
        }else{
            this.add_edit = 1;
            this.statusDis = false;
        }
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
