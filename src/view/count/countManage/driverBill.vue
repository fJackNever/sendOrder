<template>
  <div style="padding:0 24px 24px;">
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;">订单开始时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <span style="font-size:14px;padding-right:10px;padding-left:30px;">订单结束时间</span>
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
        v-model="cusPhone"
        :data="cusPhoneGather"
        @on-search="searchPhone"
        placeholder="请输入司机手机号"
        style="width:200px" transfer></AutoComplete>

        <Button type="success" style="margin-left:30px;">查询</Button>
        <Button type="success" style="margin-left:30px;">生成结算单</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
    <Table border :columns="order_columns" :data="order_data">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" style="margin-right: 5px" @click="edit_indent(index+1,'count')">详情</Button>
            <Button type="error" @click="deleteBill(index+1)">删除</Button>
        </template>
    </Table>
    </Card>
  </div>
</template>

<script>
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'driverBill',
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
  },
  data () {
    return {
      driverName:'',
      driverGather:[],
      cusName:'',
      cusGather:[],
      cusPhone:'',
      cusPhoneGather:[],
      order_columns: [
            {
                title: '开始时间',
                key: 'name'
            },
            {
                title: '结束时间',
                key: 'name'
            },
            {
                title: '结算金额',
                key: 'start_address'
            },
            {
                title: '司机姓名',
                key: 'name'
            },
            {
                title: '司机电话',
                key: 'name'
            },
            {
                title: '订单数',
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
    deleteBill(index){

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
