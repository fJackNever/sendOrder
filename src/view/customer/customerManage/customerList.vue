<template>
  <div style="padding:0 24px 24px;">
      <Card shadow style="margin-top:10px;">

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">客户名称</span>
        <AutoComplete
        v-model="cusName"
        :data="cusNameGather"
        @on-search="searchCusName"
        placeholder="请输入车牌号"
        style="width:200px;" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">联系人</span>
        <AutoComplete
        v-model="contactPer"
        :data="contactPerGather"
        @on-search="searchContactPer"
        placeholder="请输入联系人"
        style="width:200px;" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">联系人手机号</span>
        <Input v-model="phone" placeholder="请输入联系人手机号" style="width:400px"></Input>

        <Button type="success" style="margin-left:30px;">查询</Button>
        <Button type="success" style="margin-left:30px;" @click="new_edit_indent(1)">添加客户</Button>
        <Button type="success" style="margin-left:30px;">推广二维码</Button>

        <Divider />
        
      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="checkVehicle(index+1,'check')">查看与审核</Button>
                <Button type="primary" style="margin-right: 5px" @click="new_edit_vehicle(2,index+1)">编辑</Button>
                <Button type="error" @click="deleteRecord(index+1)">删除</Button>
            </template>
        </Table>
      </Card>
  </div>
</template>

<script>
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'customerList',
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
      cusName:'',
      cusNameGather:[],
      contactPer:'',
      contactPerGather:[],
      phone:'',
      order_columns: [
            {
                title: '客户名称',
                key: 'id'
            },
            {
                title: '联系人',
                key: 'name'
            },
            {
                title: '联系人手机号',
                key: 'name'
            },
            {
                title: '邮箱',
                key: 'start_address'
            },
            {
                title: '注册时间',
                key: 'start_address'
            },
            {
                title: '审核状态',
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
    searchCusName(value){
      this.cusNameGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    searchContactPer(value){
      this.contactPerGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    checkVehicle(index,type){
      this.$router.push({path:'new_edit_customer',query:{id:index,type}});
    },
    new_edit_indent(type,index){
      if(index){
        this.$router.push({path:'new_edit_customer',query:{id:index}});
      }else{
        this.$router.push({path:'new_edit_customer'});
      }
    },
    deleteRecord(index){

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
