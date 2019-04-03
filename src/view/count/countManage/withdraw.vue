<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="countHostData" @transferdata="updateTable"></topHost>
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;">时间筛选</span>
        <DatePicker type="daterange" transfer @on-change="changeDate" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入司机姓名"
        style="width:200px;" transfer>
            <Option v-for="(item,index) in driverGather" :value="item.id" :key="index" >{{ item.id_name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <Input v-model="driverPhone" placeholder="请输入乘客手机号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="find_indent()">查询</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 10px" @click="edit_indent(row.in_out_id)">详情</Button>
                <Button type="error" style="margin-right: 10px" @click="withdraw_deal_bank(row.in_out_id,row.withdraw_type,row.withdraw_name,row.account_no,row.account_name,row.amount/100,row.withdraw_comment,row.withdraw_img_path)" v-if="row.withdraw_status === 0 && row.withdraw_type === 1">提现处理</Button>
                <Button type="error" style="margin-right: 10px" @click="withdraw_deal_ali(row.in_out_id,row.withdraw_type,row.account_no,row.withdraw_name,row.amount/100,row.withdraw_comment,row.withdraw_img_path)" v-if="row.withdraw_status === 0 && row.withdraw_type === 2">提现处理</Button>
                <Button type="error" style="margin-right: 10px" disabled v-if="row.withdraw_status === 1">已提现</Button>
                <Button type="error" v-if="row.withdraw_status === 0" @click="reject_withdraw(row.in_out_id)">驳回</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
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
                <Input v-model="formValidate.cardBank"></Input>
            </FormItem>

            <FormItem label="支付宝账号" prop="aliNum" :label-width="120" v-if="aliShow">
                <Input v-model="formValidate.aliNum"></Input>
            </FormItem>
            <FormItem label="支付宝姓名" prop="aliName" :label-width="120" v-if="aliShow">
                <Input v-model="formValidate.aliName"></Input>
            </FormItem>
            <FormItem label="提现金额" prop="withdraw_money" :label-width="120">
                <Input v-model="formValidate.withdraw_money"></Input>
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
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Modal,Form,FormItem,Icon,Upload,Page } from 'iview'
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
    Page
  },
  data () {
    return {
      date_val:['',''],
      driverName:'',
      driverGather:[],
      driverPhone:'',
      countHostData: [],
      order_columns: [
            {
                title: '提现时间',
                key: 'withdraw_time'
            },
            {
                title: '提现司机',
                key: 'driver_name',
                width:100,
            },
            {
                title: '司机手机号',
                key: 'telephone'
            },
            {
                title: '提现方式',
                key: 'withdraw_type',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.withdraw_type === 1 ? '储蓄卡':'支付宝'),
                    ]);
                }
            },
            {
                title: '状态',
                key: 'withdraw_status',
                render: (h, params) => {
                    return h('div', [
                        h('div',this.getStatus(params.row.withdraw_status)),
                    ]);
                }
            },
            {
                title: '提现金额',
                key: 'amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.amount/100),
                    ]);
                }
            },
            {
                title: '操作',
                slot: 'action',
                width: 310,
                align: 'center'
            }
        ],
        order_data: [],
        countVisible:false,
        formValidate:{},
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
        rejectList:[],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        inputNameShake:'',
        allPicModal:'',
        get_pay_id:'',
        permission_arr:''
    }
  },
  methods: {
    ...mapActions([
      'getDriverWithdrawHost',
      'getDriverWithdrawLists',
      'manageDriverWithdraw',
      'rejectDriverWithdraw',
      'uploadPic',
      'getDriverLists',
    ]),
    updateTable(index){
        if(index === 0){
            this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:0,id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                if(data.data.code === 1){
                    this.order_data = [];
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total;
                }else{
                    this.order_data = [];
                    this.pageTotal = 0;
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }else if(index === 1){
            this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:1,id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                if(data.data.code === 1){
                    this.order_data = [];
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total;
                }else{
                    this.order_data = [];
                    this.pageTotal = 0;
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }else if(index === 2){
            this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:0,id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                if(data.data.code === 1){
                    this.order_data = [];
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total;
                }else{
                    this.order_data = [];
                    this.pageTotal = 0;
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }else if(index === 3){
            this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:1,id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                if(data.data.code === 1){
                    this.order_data = [];
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total;
                }else{
                    this.order_data = [];
                    this.pageTotal = 0;
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }
    },
    getStatus(status){
        if(status === 0){
            return '未处理'
        }else if(status === 1){
            return '提现成功'
        }else if(status === 2){
            return '提现驳回'
        }
    },
    changeDate(date){
        this.driverName = '';
        this.driverPhone = '';
        this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:date[0],end_time:date[1],offset:0,limit:this.pageSize }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    searchName(value){
      if(this.inputNameShake) clearTimeout(this.inputNameShake)
        this.inputNameShake = setTimeout(()=>{
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:value,telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                this.driverGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.driverGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectName(val){
        this.getDriverLists({ id:val,fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
            this.driverName = data.data.data.rows[0].id_name;
            this.driverPhone = data.data.data.rows[0].telephone;
        })
    },
    find_indent(){
        this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:'',id_name:this.driverName,telephone:this.driverPhone,start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    edit_indent(index){
        this.$router.push({path:'withdraw_detail',query:{id:index}});
    },
    withdraw_deal_bank(in_out_id,withdraw_type,withdraw_name,account_no,account_name,amount,withdraw_comment,withdraw_img_path){
        let per_val = ''

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[6000].length; i++){
                if(this.permission_arr[6000][i] === '6004'){
                    per_val = 6004
                }
            }
            if(per_val === 6004){
                this.countVisible = true;
                this.cardShow = true;
                this.aliShow = false;
                this.get_pay_id = in_out_id;
                this.$set(this.formValidate,'withdraw_way','储蓄卡');
                this.$set(this.formValidate,'cardName',withdraw_name);
                this.$set(this.formValidate,'cardNum',account_no);
                this.$set(this.formValidate,'cardBank',account_name);
                this.$set(this.formValidate,'withdraw_money',amount);
                this.$set(this.formValidate,'desc',withdraw_comment);
                if(withdraw_img_path){
                    this.$set(this.extraList,0,{ url:withdraw_img_path,name:'extraPic1', });
                }
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.countVisible = true;
            this.cardShow = true;
            this.aliShow = false;
            this.get_pay_id = in_out_id;
            this.$set(this.formValidate,'withdraw_way','储蓄卡');
            this.$set(this.formValidate,'cardName',withdraw_name);
            this.$set(this.formValidate,'cardNum',account_no);
            this.$set(this.formValidate,'cardBank',account_name);
            this.$set(this.formValidate,'withdraw_money',amount);
            this.$set(this.formValidate,'desc',withdraw_comment);
            if(withdraw_img_path){
                this.$set(this.extraList,0,{ url:withdraw_img_path,name:'extraPic1', });
            }
        }

        
    },
    withdraw_deal_ali(in_out_id,withdraw_type,account_no,withdraw_name,amount,withdraw_comment,withdraw_img_path){
        let per_val = ''

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[6000].length; i++){
                if(this.permission_arr[6000][i] === '6004'){
                    per_val = 6004
                }
            }
            if(per_val === 6004){
                
                this.countVisible = true;
                this.cardShow = false;
                this.aliShow = true;
                this.get_pay_id = in_out_id;
                this.$set(this.formValidate,'withdraw_way','支付宝');
                this.$set(this.formValidate,'aliNum',account_no);
                this.$set(this.formValidate,'aliName',withdraw_name);
                this.$set(this.formValidate,'withdraw_money',amount);
                this.$set(this.formValidate,'desc',withdraw_comment);
                if(withdraw_img_path){
                    this.$set(this.rejectList,0,{ url:withdraw_img_path,name:'rejectPic1', });
                }

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.countVisible = true;
            this.cardShow = false;
            this.aliShow = true;
            this.get_pay_id = in_out_id;
            this.$set(this.formValidate,'withdraw_way','支付宝');
            this.$set(this.formValidate,'aliNum',account_no);
            this.$set(this.formValidate,'aliName',withdraw_name);
            this.$set(this.formValidate,'withdraw_money',amount);
            this.$set(this.formValidate,'desc',withdraw_comment);
            if(withdraw_img_path){
                this.$set(this.rejectList,0,{ url:withdraw_img_path,name:'rejectPic1', });
            }
        }
  
    },
    reject_withdraw(index){
        let per_val = ''

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[6000].length; i++){
                if(this.permission_arr[6000][i] === '6005'){
                    per_val = 6005
                }
            }
            if(per_val === 6005){
                this.get_pay_id = index;
                this.rejectVisible = true;
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.get_pay_id = index;
            this.rejectVisible = true;
        }

        
    },
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
    changePage(page){
        this.pageCurrent = page;
        this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:size }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(name === 'formValidate'){

                    let extraPic;
                    if(this.extraList && this.extraList.length>0){
                        extraPic = this.extraList[0].url
                    }else{
                        extraPic = ''
                    }

                    this.manageDriverWithdraw({ 
                        id:this.get_pay_id,
                        withdraw_comment:this.formValidate.desc || '',
                        withdraw_img_path:extraPic,
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('提现成功!');
                            this.countVisible = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                        return data;
                    }).then(data => {
                        if(data.data.code === 1){
                            this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                        }
                    })
                }else{

                    let rejectPic;
                    if(this.rejectList && this.rejectList.length>0){
                        rejectPic = this.rejectList[0].url
                    }else{
                        rejectPic = ''
                    }

                    this.rejectDriverWithdraw({ 
                        id:this.get_pay_id,
                        withdraw_comment:this.formRejectValidate.rejectDesc || '',
                        withdraw_img_path:rejectPic,
                     }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('驳回成功!');
                            this.rejectVisible = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                        return data;
                    }).then(data => {
                        if(data.data.code === 1){
                            this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                        }
                    })
                }
            } else {
                this.$Message.error('提交失败!');
            }
        })
    }
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getDriverWithdrawHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.countHostData,0,{ title:'待提现数',colSpan:3,value:data.data.data.unwithdraw_count,em:true})
            this.$set(this.countHostData,1,{ title:'已提现数',colSpan:3,value:data.data.data.withdrawed_count,em:true})
            this.$set(this.countHostData,2,{ title:'待提现金额',colSpan:3,value:data.data.data.unwithdraw_amount/100,em:true})
            this.$set(this.countHostData,3,{ title:'已提现金额',colSpan:3,value:data.data.data.withdrawed_amount/100,em:false})
        }else{
            this.$set(this.countHostData,0,{ title:'待提现数',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,1,{ title:'已提现数',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,2,{ title:'待提现金额',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,3,{ title:'已提现金额',colSpan:3,value:0,em:false})
        }
        
    })

    this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
        if(data.data.code === 1){
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total;
        }else{
            this.order_data = [];
            this.pageTotal = 0;
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: data.data.msg
            });
        }
    })

  },
  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getDriverWithdrawHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.countHostData,0,{ title:'待提现数',colSpan:3,value:data.data.data.unwithdraw_count,em:true})
            this.$set(this.countHostData,1,{ title:'已提现数',colSpan:3,value:data.data.data.withdrawed_count,em:true})
            this.$set(this.countHostData,2,{ title:'待提现金额',colSpan:3,value:data.data.data.unwithdraw_amount/100,em:true})
            this.$set(this.countHostData,3,{ title:'已提现金额',colSpan:3,value:data.data.data.withdrawed_amount/100,em:false})
        }else{
            this.$set(this.countHostData,0,{ title:'待提现数',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,1,{ title:'已提现数',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,2,{ title:'待提现金额',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,3,{ title:'已提现金额',colSpan:3,value:0,em:false})
        }
        
    })

    this.getDriverWithdrawLists({ in_out_id:'',driver_id:'',withdraw_type:'',withdraw_status:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
        if(data.data.code === 1){
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total;
        }else{
            this.order_data = [];
            this.pageTotal = 0;
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: data.data.msg
            });
        }
    })
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
