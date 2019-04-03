<template>
  <div style="padding:0 24px 24px;">
    <Card shadow :title="cardTitle" class="indentCard">
        <Form ref="formValidate" :model="formValidate" :label-width="120">
            <FormItem label="提现方式" prop="withdraw_way" :label-width="120">
                <Input v-model="formValidate.withdraw_way" disabled></Input>
            </FormItem>
            <FormItem label="持卡人姓名" prop="cardName" :label-width="120" v-if="cardShow">
                <Input v-model="formValidate.cardName" disabled></Input>
            </FormItem>
            <FormItem label="储蓄卡卡号" prop="cardNum" :label-width="120" v-if="cardShow">
                <Input v-model="formValidate.cardNum" disabled></Input>
            </FormItem>
            <FormItem label="储蓄卡银行" prop="cardBank" :label-width="120" v-if="cardShow">
                <Input v-model="formValidate.cardBank" disabled></Input>
            </FormItem>

            <FormItem label="支付宝账号" prop="aliNum" :label-width="120" v-if="aliShow">
                <Input v-model="formValidate.aliNum" disabled></Input>
            </FormItem>
            <FormItem label="支付宝姓名" prop="aliName" :label-width="120" v-if="aliShow">
                <Input v-model="formValidate.aliName" disabled></Input>
            </FormItem>
            <FormItem label="提现金额" prop="withdraw_money" :label-width="120">
                <Input v-model="formValidate.withdraw_money" disabled></Input>
            </FormItem>
            <FormItem label="提现状态" prop="withdraw_status" :label-width="120">
                <Select v-model="formValidate.withdraw_status" style="width:100px;margin-right:10px;" transfer disabled>
                    <Option :value="0">未处理</Option>
                    <Option :value="1">提现成功</Option>
                    <Option :value="2">提现驳回</Option>
                </Select>
            </FormItem>
            <FormItem label="提现备注" prop="desc" style="width:400px;" v-if="withdraw_comment">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
            <FormItem label="驳回理由" prop="rejectDesc" style="width:400px;" v-if="reject_comment">
                <Input v-model="formValidate.rejectDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入驳回理由"></Input>
            </FormItem>
            <FormItem label="附加图片" prop="extraPic" >
                <div class="demo-upload-list" v-for="item in extraList">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(1)"></Icon>
                    </div>
                </div>
                <Upload
                    ref="codePicUpload"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError"
                    :before-upload="handleExtraFront"
                    type="drag"
                    action=""
                    :style="{display: extraList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="ios-camera" size="20"></Icon>
                    </div>
                </Upload>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')" v-if="btn_show">提现</Button>
                <Button type="error" style="margin-left:10px;" @click="reject_withdraw()" v-if="btn_show">驳回</Button>
            </FormItem>
        </Form>
    </Card>
    <Modal title="驳回理由" v-model="rejectVisible" :footer-hide="true">
        <Form ref="formRejectValidate" :model="formRejectValidate" :rules="ruleRejectValidate" :label-width="120" >
            <FormItem label="理由" prop="rejectDesc" style="width:400px;" >
                <Input v-model="formRejectValidate.rejectDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入驳回理由"></Input>
            </FormItem>
            <FormItem label="驳回图片" prop="rejectPic" >
                <div class="demo-upload-list" v-for="item in rejectList">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(2)"></Icon>
                    </div>
                </div>
                <Upload
                    ref="rejectPicUpload"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError"
                    :before-upload="handleRejectFront"
                    type="drag"
                    action=""
                    :style="{display: rejectList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="ios-camera" size="20"></Icon>
                    </div>
                </Upload>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formRejectValidate')">确认驳回</Button>
            </FormItem>
        </Form>
    </Modal>
    <Modal title="图片预览" v-model="picVisible" :footer-hide="true">
        <img :src="allPicModal" v-if="picVisible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,Upload,Select,Option,RadioGroup,Radio, } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'withdraw_detail',
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
        cardTitle:'司机提现详情',
        extraList:[],
        picVisible:false,
        rejectVisible:false,
        formValidate:{},
        formRejectValidate:{
            rejectDesc:'',
        },
        ruleRejectValidate:{
            rejectDesc: [
              { required: true, message: '请填写驳回理由', trigger: 'blur' }
          ]
        },
        rejectList:[],
        btn_show:true,
        cardShow:true,
        aliShow:false,
        withdraw_comment:true,
        reject_comment:false,
        permission_arr:'',
    }
  },
  methods: {
    ...mapActions([
      'uploadPic',
      'getDriverWithdrawLists',
      'manageDriverWithdraw',
      'rejectDriverWithdraw',
    ]),
    handleView (url) {
        this.allPicModal = url;
        this.picVisible = true;
    },
    handleRemove (type) {
        if(type === 1){
            this.extraList.splice(0,1)
        }else{
            this.rejectList.splice(0,1)
        }
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleExtraFront (file) {
        let check = this.extraList.length < 2;
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
                    this.$set(this.extraList,0, {
                        url:res.data.data.path,
                        name:'extraPic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    handleRejectFront (file) {
        let check = this.rejectList.length < 2;
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
                    this.$set(this.rejectList,0, {
                        url:res.data.data.path,
                        name:'rejectPic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    reject_withdraw(){
        this.get_pay_id = in_out_id;
        this.rejectVisible = true;
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(name === 'formValidate'){

                    let per_val = ''
                    if(this.permission_arr[0] !== '9999'){
                        for(let i=0; i<this.permission_arr[6000].length; i++){
                            if(this.permission_arr[6000][i] === '6004'){
                                per_val = 6004
                            }
                        }
                        if(per_val === 6004){
                            
                            let extraPic;
                            if(this.extraList && this.extraList.length>0){
                                extraPic = this.extraList[0].url
                            }else{
                                extraPic = ''
                            }

                            this.manageDriverWithdraw({ 
                                id:this.$route.query.id,
                                withdraw_comment:this.formValidate.desc,
                                withdraw_img_path:extraPic,
                            }).then((data) => {
                                if(data.data.code === 1){
                                    this.$Message.success('处理成功!');
                                    this.$router.push({ path:'withdraw' });
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
                        let extraPic;
                        if(this.extraList && this.extraList.length>0){
                            extraPic = this.extraList[0].url
                        }else{
                            extraPic = ''
                        }

                        this.manageDriverWithdraw({ 
                            id:this.$route.query.id,
                            withdraw_comment:this.formValidate.desc,
                            withdraw_img_path:extraPic,
                        }).then((data) => {
                            if(data.data.code === 1){
                                this.$Message.success('处理成功!');
                                this.$router.push({ path:'withdraw' });
                            }else{
                                this.$Notice.warning({
                                    title: '嘀友提醒',
                                    desc: data.data.msg
                                });
                            }
                        })
                    }

                }else{

                    let per_val = ''
                    if(this.permission_arr[0] !== '9999'){
                        for(let i=0; i<this.permission_arr[6000].length; i++){
                            if(this.permission_arr[6000][i] === '6005'){
                                per_val = 6005
                            }
                        }
                        if(per_val === 6005){
                            
                            let rejectPic;
                            if(this.rejectList && this.rejectList.length>0){
                                rejectPic = this.rejectList[0].url
                            }else{
                                rejectPic = ''
                            }
        
                            this.rejectDriverWithdraw({ 
                                id:this.$route.query.id,
                                withdraw_comment:this.formRejectValidate.rejectDesc,
                                withdraw_img_path:rejectPic,
                            }).then((data) => {
                                if(data.data.code === 1){
                                    this.$Message.success('驳回成功!');
                                    this.$router.push({ path:'withdraw' });
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
                        
                        let rejectPic;
                        if(this.rejectList && this.rejectList.length>0){
                            rejectPic = this.rejectList[0].url
                        }else{
                            rejectPic = ''
                        }
    
                        this.rejectDriverWithdraw({ 
                            id:this.$route.query.id,
                            withdraw_comment:this.formRejectValidate.rejectDesc,
                            withdraw_img_path:rejectPic,
                        }).then((data) => {
                            if(data.data.code === 1){
                                this.$Message.success('驳回成功!');
                                this.$router.push({ path:'withdraw' });
                            }else{
                                this.$Notice.warning({
                                    title: '嘀友提醒',
                                    desc: data.data.msg
                                });
                            }
                        })

                    }

                }
            } else {
                this.$Message.error('提交失败!');
            }
        })
    },
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getDriverWithdrawLists({ in_out_id:this.$route.query.id,driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10000 }).then((data) => {
        if(data.data.data.rows[0].withdraw_status === 0){
            this.btn_show = true;
        }else{
            this.btn_show = false; 
        }

        if(data.data.data.rows[0].withdraw_img_path){
            this.$set(this.extraList,0,{ url:data.data.data.rows[0].withdraw_img_path,name:'rejectPic1', });
        }

        this.$set(this.formValidate,'withdraw_status',data.data.data.rows[0].withdraw_status);
        
        if(data.data.data.rows[0].withdraw_type === 1){
            this.cardShow = true;
            this.aliShow = false;
            this.$set(this.formValidate,'withdraw_way','储蓄卡');
            this.$set(this.formValidate,'cardName',data.data.data.rows[0].withdraw_name);
            this.$set(this.formValidate,'cardNum',data.data.data.rows[0].account_no);
            this.$set(this.formValidate,'cardBank',data.data.data.rows[0].account_name);
            this.$set(this.formValidate,'withdraw_money',data.data.data.rows[0].amount/100);
        }else{
            this.cardShow = false;
            this.aliShow = true;
            this.$set(this.formValidate,'withdraw_way','支付宝');
            this.$set(this.formValidate,'aliNum',data.data.data.rows[0].account_no);
            this.$set(this.formValidate,'aliName',data.data.data.rows[0].withdraw_name);
            this.$set(this.formValidate,'withdraw_money',data.data.data.rows[0].amount/100);
        }

        if(data.data.data.rows[0].withdraw_status <= 1){
            this.withdraw_comment = true;
            this.reject_comment = false;
            this.$set(this.formValidate,'desc',data.data.data.rows[0].withdraw_comment || '');
        }else{
            this.withdraw_comment = false;
            this.reject_comment = true;
            this.$set(this.formValidate,'rejectDesc',data.data.data.rows[0].withdraw_comment || '');
        }
    })
  },
  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getDriverWithdrawLists({ in_out_id:this.$route.query.id,driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10000 }).then((data) => {
        if(data.data.data.rows[0].withdraw_status === 0){
            this.btn_show = true;
        }else{
            this.btn_show = false; 
        }

        if(data.data.data.rows[0].withdraw_img_path){
            this.$set(this.extraList,0,{ url:data.data.data.rows[0].withdraw_img_path,name:'rejectPic1', });
        }

        this.$set(this.formValidate,'withdraw_status',data.data.data.rows[0].withdraw_status);
        
        if(data.data.data.rows[0].withdraw_type === 1){
            this.cardShow = true;
            this.aliShow = false;
            this.$set(this.formValidate,'withdraw_way','储蓄卡');
            this.$set(this.formValidate,'cardName',data.data.data.rows[0].withdraw_name);
            this.$set(this.formValidate,'cardNum',data.data.data.rows[0].account_no);
            this.$set(this.formValidate,'cardBank',data.data.data.rows[0].account_name);
            this.$set(this.formValidate,'withdraw_money',data.data.data.rows[0].amount/100);
        }else{
            this.cardShow = false;
            this.aliShow = true;
            this.$set(this.formValidate,'withdraw_way','支付宝');
            this.$set(this.formValidate,'aliNum',data.data.data.rows[0].account_no);
            this.$set(this.formValidate,'aliName',data.data.data.rows[0].withdraw_name);
            this.$set(this.formValidate,'withdraw_money',data.data.data.rows[0].amount/100);
        }

        if(data.data.data.rows[0].withdraw_status <= 1){
            this.withdraw_comment = true;
            this.reject_comment = false;
            this.$set(this.formValidate,'desc',data.data.data.rows[0].withdraw_comment || '');
        }else{
            this.withdraw_comment = false;
            this.reject_comment = true;
            this.$set(this.formValidate,'rejectDesc',data.data.data.rows[0].withdraw_comment || '');
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
