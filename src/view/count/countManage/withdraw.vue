<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="countHostData" :style="{ cursor:'pointer'}"></topHost>
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;">时间筛选</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        :data="driverGather"
        @on-search="searchName"
        placeholder="请输入司机姓名"
        style="width:200px;" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <AutoComplete
        v-model="driverPhone"
        :data="driverPhoneGather"
        @on-search="searchPhone"
        placeholder="请输入司机手机号"
        style="width:200px" transfer></AutoComplete>

        <Button type="success" style="margin-left:30px;">查询</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="edit_indent(index+1,'count')">详情</Button>
                <Button type="error" @click="withdraw(index+1)" :disabled="withDis">{{ withWord }}</Button>
                <Button type="error" @click="reject(index+1)">驳回</Button>
            </template>
        </Table>
    </Card>
    <Modal title="结算" v-model="countVisible" :footer-hide="true">
        <Form ref="formValidate" :model="formValidate" :label-width="120" >
            <FormItem label="提现方式" prop="withdraw_way" :label-width="120">
                <Input v-model="formValidate.withdraw_way"></Input>
            </FormItem>
            <FormItem label="持卡人姓名" prop="cardName" :label-width="120" v-if="cardShow">
                <Input v-model="formValidate.cardName"></Input>
            </FormItem>
            <FormItem label="储蓄卡卡号" prop="cardNum" :label-width="120" v-if="cardShow">
                <Input v-model="formValidate.cardNum"></Input>
            </FormItem>
            <FormItem label="储蓄卡银行" prop="cardBank" :label-width="120" v-if="cardShow">
                <Input v-model="formValidate.cardNum"></Input>
            </FormItem>
            <FormItem label="提现金额" prop="withdraw_money" :label-width="120">
                <Input v-model="formValidate.cardNum"></Input>
            </FormItem>
            
            <FormItem label="支付宝账号" prop="aliNum" :label-width="120" v-if="aliShow">
                <Input v-model="formValidate.aliNum"></Input>
            </FormItem>
            <FormItem label="支付宝姓名" prop="aliName" :label-width="120" v-if="aliShow">
                <Input v-model="formValidate.aliName"></Input>
            </FormItem>
            <FormItem label="备注" prop="desc" style="width:400px;" >
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
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
                <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
            </FormItem>
        </Form>
    </Modal>
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
                        <Icon type="ios-trash-outline" @click.native="handleRemove(1)"></Icon>
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
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Modal,Form,FormItem,Icon,Upload, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'withdraw',
  components: {
    Card,
    Input,
    Button,
    Divider,
    DatePicker,
    Select,
    Option,
    Table,
    AutoComplete,
    topHost,
    Modal,
    Form,
    FormItem,
    Icon,
    Upload,
  },
  data () {
    return {
      driverName:'',
      driverGather:[],
      driverPhone:'',
      driverPhoneGather:[],
      countHostData: [
        { title:'待提现数',colSpan:3,value:60,em:true},
        { title:'已提现数',colSpan:3,value:8,em:true},
        { title:'待提现金额',colSpan:3,value:8,em:true},
        { title:'已提现金额',colSpan:3,value:60,em:false},
      ],
      order_columns: [
            {
                title: '提现时间',
                key: 'name'
            },
            {
                title: '提现司机',
                key: 'start_address'
            },
            {
                title: '司机手机号',
                key: 'start_address'
            },
            {
                title: '提现方式',
                key: 'name'
            },
            {
                title: '状态',
                key: 'status'
            },
            {
                title: '提现金额',
                key: 'name'
            },
            {
                title: '车牌号',
                key: 'name'
            },
            {
                title: '操作',
                slot: 'action',
                width: 230,
                align: 'center'
            }
        ],
        withWord:'提现处理',
        order_data: [],
        withDis:false,
        countVisible:false,
        formValidate:{
            autoPrice:0,
            autoIncome:0,
            autoCharge:0,
            humanPrice:0,
            humanIncome:0,
            humanCharge:0,
        },
        cardShow:true,
        aliShow:false,
        extraList:[],
        picVisible:false,
        rejectVisible:false,
        formRejectValidate:{
            rejectDesc:'',
        },
        ruleRejectValidate:{
            rejectDesc: [
              { required: true, message: '请填写驳回理由', trigger: 'blur' }
          ]
        },
        rejectList:[]
    }
  },
  methods: {
    ...mapActions([
      
    ]),
    searchName(value){
      this.driverGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    searchPhone(value){
      this.driverPhoneGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    edit_indent(index,type){
        this.$router.push({path:'check_indent',query:{id:index,type}});
    },
    withdraw(index){
        this.countVisible = true;
    },
    reject(index){

    },

    handleView (url) {
        this.allPicModal = url;
        this.picVisible = true;
    },
    handleRemove (type) {
        this.codeList.splice(0,1)
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },

    handleExtraFront (file) {
        // let check = this.codeList.length < 2;
        // if (!check) {
        //     this.$Notice.warning({
        //         title: '只能上传一张图片'
        //     });
        // }else{
        //     let reader = new FileReader();
        //     reader.readAsDataURL(file);
        //     reader.onloadend = () => {
        //         let base64Img = reader.result.split('base64,')[1];
        //         this.codePicBase64 = base64Img;
        //         this.uploadPic({ base64Img }).then(res => {
        //             this.$set(this.codeList,0, {
        //                 url:res.data.data.path,
        //                 name:'codePic' + res.data.data.ossId,
        //             })
        //         })
        //     };
        // }
        
        // return check;
    },

    handleRejectFront(file){

    },

    handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    }
  },
  mounted () {
    // this.getOrderData().then((data) => {
    //   for(let i=0; i<data.data.data.rows.length; i++){
    //     this.$set(this.order_data,i,data.data.data.rows[i])
    //   }
    // })
  }
}
</script>

<style lang="less">

</style>
