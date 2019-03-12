<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="countHostData" :style="{ cursor:'pointer'}"></topHost>
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;">订单开始时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <span style="font-size:14px;padding-right:10px;padding-left:30px;">订单结束时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">订单编号</span>
        <Input v-model="indentNum" placeholder="请输入订单编号" style="width:200px"></Input>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        :data="driverGather"
        @on-search="searchName"
        placeholder="请输入司机姓名"
        style="width:200px;" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">客户名称</span>
        <AutoComplete
        v-model="cusName"
        :data="cusGather"
        @on-search="searchCus"
        placeholder="请输入客户名称"
        style="width:200px;" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <AutoComplete
        v-model="cusPhone"
        :data="cusPhoneGather"
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
                <Button type="error" @click="count(index+1)">结算</Button>
            </template>
        </Table>
    </Card>
    <Modal title="结算" v-model="countVisible" :footer-hide="true">
        <Form ref="formValidate" :model="formValidate" :label-width="120" >
            <div style="margin:10px 0;">订单自动结算</div>
            <FormItem label="订单价格" prop="autoPrice" :label-width="120">
                <InputNumber :min="0" v-model="formValidate.autoPrice"></InputNumber>
            </FormItem>
            <FormItem label="司机收入" prop="autoIncome" :label-width="120">
                <InputNumber :min="0" v-model="formValidate.autoIncome"></InputNumber>
            </FormItem>
            <FormItem label="平台费用" prop="autoCharge" :label-width="120">
                <InputNumber :min="0" v-model="formValidate.autoCharge"></InputNumber>
            </FormItem>
            <div style="margin:10px 0;">人工结算</div>
            <FormItem label="订单价格" prop="humanPrice" :label-width="120">
                <InputNumber :min="0" v-model="formValidate.humanPrice"></InputNumber>
            </FormItem>
            <FormItem label="司机收入" prop="humanIncome" :label-width="120">
                <InputNumber :min="0" v-model="formValidate.humanIncome"></InputNumber>
            </FormItem>
            <FormItem label="平台费用" prop="humanCharge" :label-width="120">
                <InputNumber :min="0" v-model="formValidate.humanCharge"></InputNumber>
            </FormItem>
            <FormItem label="备注" prop="desc" style="width:400px;">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Modal,Form,FormItem,InputNumber, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'countList',
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
    InputNumber,
  },
  data () {
    return {
      driverName:'',
      driverGather:[],
      cusName:'',
      cusGather:[],
      cusPhone:'',
      cusPhoneGather:[],
      indentNum:'',
      countHostData: [
        { title:'未结算订单',colSpan:3,value:60,em:true},
        { title:'已结算订单',colSpan:3,value:8,em:true},
        { title:'未结算金额',colSpan:3,value:8,em:true},
        { title:'已结算金额',colSpan:3,value:60,em:false},
      ],
      order_columns: [
            {
                title: '城市',
                key: 'id'
            },
            {
                title: '订单编号',
                key: 'name'
            },
            {
                title: '订单开始时间',
                key: 'name'
            },
            {
                title: '订单起点',
                key: 'start_address'
            },
            {
                title: '订单终点',
                key: 'start_address'
            },
            {
                title: '乘客',
                key: 'name'
            },
            {
                title: '客户名称',
                key: 'telephone'
            },
            {
                title: '状态',
                key: 'status'
            },
            {
                title: '司机',
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
        order_data: [],
        countVisible:false,
        formValidate:{
            autoPrice:0,
            autoIncome:0,
            autoCharge:0,
            humanPrice:0,
            humanIncome:0,
            humanCharge:0,
        }
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
    searchCus(value){
      this.cusGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    searchPhone(value){
      this.cusPhoneGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    edit_indent(index,type){
        this.$router.push({path:'check_indent',query:{id:index,type}});
    },
    count(index){
        this.countVisible = true;
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
