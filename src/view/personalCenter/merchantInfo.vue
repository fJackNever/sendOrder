<template>
  <div style="padding:0 24px 24px;">
    <Card shadow :title="cardTitle" class="indentCard">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >
                    <FormItem label="商家状态" prop="status">
                        <Select v-model="formValidate.status" placeholder="请选择审核状态" style="width:200px" disabled>
                            <Option :value="0">待审核</Option>
                            <Option :value="1">审核通过</Option>
                            <Option :value="2">审核拒绝</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="类型" prop="type">
                        <Select v-model="formValidate.type" placeholder="请选择审核状态" style="width:200px" >
                            <Option :value="1">公司</Option>
                            <Option :value="2">个人</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="商家名称" prop="name">
                        <Input v-model="formValidate.name" placeholder="请输入商家名称" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="商家电话" prop="phone">
                        <Input v-model="formValidate.phone" placeholder="请输入商家电话" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="商家地址" prop="address" >
                        <Input v-model="formValidate.address" placeholder="请输入商家地址" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="商家备注信息" prop="desc" :label-width="100" style="width:400px;">
                        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入商家备注信息" disabled></Input>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="联系人" prop="contactPer">
                        <Input v-model="formValidate.contactPer" placeholder="请输入联系人" style="width:200px" ></Input>
                    </FormItem>

                    <FormItem label="邮箱" prop="mailBox">
                        <Input v-model="formValidate.mailBox" placeholder="请输入邮箱" style="width:200px" ></Input>
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

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">保存并提交</Button>
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
import moment from 'moment'
export default {
  name: 'merchantInfo',
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
      cardTitle:'商家信息',
      formValidate: {
          status:0,
      },
      visible:false,
      operationList:[],
      otherList:[],
      brandModelArr:[],
      formDriverValidate:{},
    }
  },
  methods: {
    ...mapActions([
      'uploadPic',
      'getCarTemplateLists',
      'addCar',
      'editCar',
      'getCarLists',
      'getCustomerInfo',
      'setCustomer'
    ]),
    handleView (url) {
        this.allPicModal = url;
        this.visible = true;
    },
    handleRemove (type) {
        if(type === 1){
            this.operationList.splice(0,1)
        }else if(type === 2){
            this.otherList.splice(0,1)
        }
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleOperation (file) {
        let check = this.operationList.length < 2;
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
                    this.$set(this.operationList,0, {
                        url:res.data.data.path,
                        name:'operationPic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    handleOther(file){
        let check = this.otherList.length < 2;
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
                    this.$set(this.otherList,0, {
                        url:res.data.data.path,
                        name:'otherPic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    handleSubmit (name) {
        
        this.$refs[name].validate((valid) => {
            if (valid) {

                    let other_img_arr = [];
                    if(this.otherList && this.otherList.length > 0){
                        other_img_arr = JSON.stringify(other_img_arr.push(this.otherList[0].ur))
                    }else{
                        other_img_arr = ''
                    }

                    let operationPic;
                    if(this.operationList && this.operationList.length>0){
                        operationPic = this.operationList[0].url
                    }else{
                        operationPic = ''
                    }
                    this.setCustomer({ 
                        name:this.formValidate.name,
                        type:this.formValidate.type,
                        telephone:this.formValidate.phone,
                        address:this.formValidate.address,
                        contact:this.formValidate.contactPer,
                        email:this.formValidate.mailBox,
                        bussiness_path:operationPic,
                        other_img_path:other_img_arr,
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
            } else {
                this.$Message.error('提交失败!');
            }
        })
    },
  },
  mounted () {
        this.getCustomerInfo().then((data) => {
            
            this.$set(this.formValidate,'status',data.data.data.status);
            this.$set(this.formValidate,'type',data.data.data.type);
            
            this.$set(this.formValidate,'name',data.data.data.name);

            this.$set(this.formValidate,'phone',data.data.data.telephone);
            this.$set(this.formValidate,'address',data.data.data.address);

            this.$set(this.formValidate,'desc',data.data.data.comment);
            this.$set(this.formValidate,'contactPer',data.data.data.contact);

            this.$set(this.formValidate,'mailBox',data.data.data.email);

            if(data.data.data.bussiness_path){
                this.$set(this.operationList,0,{ url:data.data.data.bussiness_path,name:'operationPic1' });
            }

            if(data.data.data.other_img_path && data.data.data.other_img_path.length>0){
                this.$set(this.otherList,0,{ url:data.data.data.other_img_path[0],name:'otherPic1' });
            }

        })
  },
  activated () {
        this.getCustomerInfo().then((data) => {
            
            this.$set(this.formValidate,'status',data.data.data.status);
            this.$set(this.formValidate,'type',data.data.data.type);
            this.$set(this.formValidate,'name',data.data.data.name);

            this.$set(this.formValidate,'phone',data.data.data.telephone);
            this.$set(this.formValidate,'address',data.data.data.address);

            this.$set(this.formValidate,'desc',data.data.data.comment);
            this.$set(this.formValidate,'contactPer',data.data.data.contact);

            this.$set(this.formValidate,'mailBox',data.data.data.email);

            if(data.data.data.bussiness_path){
                this.$set(this.operationList,0,{ url:data.data.data.bussiness_path,name:'operationPic1' });
            }

            if(data.data.data.other_img_path && data.data.data.other_img_path.length>0){
                this.$set(this.otherList,0,{ url:data.data.data.other_img_path[0],name:'otherPic1' });
            }

        })
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
