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
        <Button type="success" style="margin-left:30px;">生成对账单</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="edit_indent(index+1,'count')">详情</Button>
                <Button type="error" @click="sure_gathering(index+1)" :disabled="withDis">{{ gather_word }}</Button>
                <Button type="error" @click="deleteBill(index+1)">删除</Button>
            </template>
        </Table>
    </Card>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'createBill',
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
  },
  data () {
    return {
      driverName:'',
      driverGather:[],
      driverPhone:'',
      driverPhoneGather:[],
      countHostData: [
        { title:'未支付金额',colSpan:3,value:60,em:true},
        { title:'已支付金额',colSpan:3,value:8,em:false},
      ],
      order_columns: [
            {
                title: '客户姓名',
                key: 'name'
            },
            {
                title: '客户电话',
                key: 'start_address'
            },
            {
                title: '结算时间',
                key: 'start_address'
            },
            {
                title: '结算金额',
                key: 'name'
            },
            {
                title: '订单数',
                key: 'status'
            },
            {
                title: '支付状态',
                key: 'name'
            },
            {
                title: '确认状态',
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
        gather_word:'确认收款'
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
    sure_gathering(index){
        
    },
    deleteBill(index){

    },
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
