<template>
  <div style="padding:0 24px 24px;">
      <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">用车车型</span>
        <Select v-model="modelSelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,index) in modelOptions" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">审核状态</span>
        <Select v-model="statusSelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">注册日期</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">车牌号</span>
        <AutoComplete
        v-model="licenseNum"
        :data="licenseNumGather"
        @on-search="searchLicenseNum"
        placeholder="请输入车牌号"
        style="width:200px;" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">品牌车型</span>
        <AutoComplete
        v-model="brandModel"
        :data="brandModelGather"
        @on-search="searchBrandModel"
        placeholder="请输入客户名称"
        style="width:200px;" transfer></AutoComplete>

        <Button type="success" style="margin-left:30px;">查询</Button>
        <Button type="success" style="margin-left:30px;" @click="new_edit_indent(1)">添加车辆</Button>
        <Button type="success" style="margin-left:30px;">导入车辆</Button>
        <Button type="success" style="margin-left:30px;">导出车辆</Button>

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
  name: 'vehicleList',
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
      modelSelected:'',
      modelOptions:[],
      statusSelected:0,
      statusOptions:[
        {label:'全部',value:0},
        {label:'待审核',value:1},
        {label:'审核通过',value:2},
        {label:'审核拒绝',value:3},
      ],
      licenseNum:'',
      licenseNumGather:[],
      brandModel:'',
      brandModelGather:[],
      order_columns: [
            {
                title: '车牌号',
                key: 'id'
            },
            {
                title: '所有人',
                key: 'name'
            },
            {
                title: '品牌车型',
                key: 'name'
            },
            {
                title: '车身颜色',
                key: 'start_address'
            },
            {
                title: '车辆注册日期',
                key: 'start_address'
            },
            {
                title: '绑定司机',
                key: 'name'
            },
            {
                title: '司机手机号',
                key: 'telephone'
            },
            {
                title: '审核状态',
                key: 'status'
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
      'getUseCarTypeLists'
    ]),
    searchLicenseNum(value){
      this.licenseNumGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    searchBrandModel(value){
      this.brandModelGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    checkVehicle(index,type){
      this.$router.push({path:'check_vehicle',query:{id:index,type}});
    },
    new_edit_indent(type,index){
      if(index){
        this.$router.push({path:'new_edit_vehicle',query:{id:index}});
      }else{
        this.$router.push({path:'new_edit_vehicle'});
      }
    },
    deleteRecord(index){

    }
  },
  mounted () {
    this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.modelOptions,i,data.data.data.rows[i])
        }
    })
  },
  activated () {
    this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.modelOptions,i,data.data.data.rows[i])
        }
    })
  }
}
</script>

<style lang="less">

</style>
