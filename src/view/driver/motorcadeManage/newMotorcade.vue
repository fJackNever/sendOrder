<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" >

                <FormItem label="车队名称" prop="teamName">
                    <Input v-model="formValidate.teamName" placeholder="请输入车队名称" style="width:200px"></Input>
                </FormItem>

                <FormItem label="车队详情" prop="desc">
                    <Input v-model="formValidate.desc" type="textarea" style="width:300px;" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入车队详情..."></Input>
                </FormItem>

                <FormItem label="车队标志" prop="teamSignPic" >
                    <div class="demo-upload-list" v-for="item in teamSignList">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(1)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="teamSignUpload"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png']"
                        :on-format-error="handleFormatError"
                        :before-upload="handleTeamSignFront"
                        type="drag"
                        action=""
                        :style="{display: teamSignList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                </FormItem>
                <Modal title="图片预览" v-model="visible" :footer-hide="true">
                    <img :src="allPicModal" v-if="visible" style="width: 100%">
                </Modal>

                <FormItem label="车队人数" prop="max">
                    <InputNumber :min="0" v-model="formValidate.max"></InputNumber>
                </FormItem>

                <FormItem label="车队状态" prop="teamStatus" >
                    <Select v-model="formValidate.teamStatus" placeholder="请选择车队状态" style="width:200px">
                        <Option :value="0">停用</Option>
                        <Option :value="1">正常</Option>
                    </Select>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
                </FormItem>

            </Form>
      </Card>
  </div>
</template>

<script>
import { Row,Card,Input,Button,Select,Option,Form,FormItem,InputNumber,Upload,Icon,Modal,Table,Page, } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment'   
export default {
  name: 'newMotorcade',
  components: {
    Row,
    Card,
    Input,
    Button,
    Select,
    Option,
    Form,
    FormItem,
    InputNumber,
    Upload,
    Icon,
    Modal,
    Table,
    Page,
  },
  data () {
    return {
      formValidate: {
          teamName: '',
          desc:'',
          max:0,
          teamStatus:0,
      },
      visible:false,
      allPicModal:'',
      teamSignList:[],
      taskIdArr:[],
      cardTitle:'创建车队',
      ruleValidate: {},
        member_order_data:[],
        pageMemberTotal:0,
        pageMemberSize:10,
        pageMemberCurrent:1,
        msg_order_data:[],
        pageMsgTotal:0,
        pageMsgSize:10,
        pageMsgCurrent:1,
    }
  },
  methods: {
    ...mapActions([
      'uploadPic',
      'addFleet',
      'editFleet',
      'getFleetLists',
    ]),
    handleView(){
        this.allPicModal = url;
        this.visible = true;
    },
    handleRemove(){
        this.teamSignList.splice(0,1)
    },
    handleFormatError(){
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleTeamSignFront(file){
        let check = this.teamSignList.length < 2;
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
                    this.$set(this.teamSignList,0, {
                        url:res.data.data.path,
                        name:'teamSignPic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                let teamSignPic;
                if(this.teamSignList && this.teamSignList.length>0){
                    teamSignPic = this.teamSignList[0].url
                }else{
                    teamSignPic = ''
                }

                this.addFleet({ 
                    fleet_name: this.formValidate.teamName || 0,
                    comment:this.formValidate.desc || 0,
                    logo_path:teamSignPic,
                    max_member:this.formValidate.max || 0,
                    status:this.formValidate.teamStatus,
                }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('新增成功!');
                        this.$refs['formValidate'].resetFields();
                        this.$router.push({path:'motorcadeManage'});
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

  },
  activated () {

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
