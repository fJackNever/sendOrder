<template>
  <div style="padding:0 24px 24px;">
      <topHost :itemCol="indentHostData" :style="{ cursor:'pointer'}"></topHost>
      <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">城市</span>
        <Select v-model="citySelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in cityOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">订单筛选</span>
        <Select v-model="indentStatus" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">订单开始时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">订单结束时间</span>
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

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">乘客手机号</span>
        <AutoComplete
        v-model="cusPhone"
        :data="cusPhoneGather"
        @on-search="searchPhone"
        placeholder="请输入司机手机号"
        style="width:200px" transfer></AutoComplete>

        <Button type="success" style="margin-left:30px;">查询</Button>
        <Button type="success" style="margin-left:30px;" @click="new_edit_indent(1)">新增</Button>

        <Divider />
        
      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" style="margin-right: 5px" @click="checkDriver(index+1,'check')">查看并处理</Button>
                <Button type="primary" style="margin-right: 5px" @click="new_edit_indent(2,index+1)">编辑</Button>
                <Button type="error" @click="cancel(index+1)">取消</Button>
            </template>
        </Table>
      </Card>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'indentManage',
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
      citySelected:1,
      cityOptions:[
        {label:'上海',value:1},
        {label:'南京',value:2}
      ],
      indentStatus:1,
      statusOptions:[
        {label:'待处理的订单',value:1},
        {label:'待抢单的订单',value:2},
        {label:'已接单的订单',value:3},
        {label:'进行中的订单',value:4},
        {label:'已完成的订单',value:5},
        {label:'未进行的订单',value:6},
      ],
      driverName:'',
      driverGather:[],
      cusName:'',
      cusGather:[],
      cusPhone:'',
      cusPhoneGather:[],
      indentNum:'',
      indentHostData: [
        { title:'待处理订单',colSpan:3,value:60,em:true},
        { title:'待抢单订单',colSpan:3,value:8,em:true},
        { title:'进行中订单',colSpan:3,value:8,em:true},
        { title:'已完成订单',colSpan:3,value:60,em:true},
        { title:'已取消订单',colSpan:3,value:60,em:true},
        { title:'所有订单',colSpan:3,value:60,em:false},
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
        order_data: []
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
    checkDriver(index,type){
      this.$router.push({path:'check_indent',query:{id:index,type}});
    },
    new_edit_indent(type,index){
      if(index){
        this.$router.push({path:'new_edit_indent',query:{id:index}});
      }else{
        this.$router.push({path:'new_edit_indent'});
      }
    },
    cancel(index){

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
