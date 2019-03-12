<template>
    <div style="padding:0 24px 24px;">
        <Card shadow style="margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">城市</span>
            <Select v-model="citySelected" style="width:80px;margin-right:10px;" transfer>
                <Option v-for="(item,key) in cityOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <span style="font-size:14px;padding-right:10px;padding-left:20px;">推荐人手机号</span>
            <AutoComplete
            v-model="driverPhone"
            :data="phoneGather"
            @on-search="searchPhone"
            placeholder="请输入司机手机号"
            style="width:200px" transfer></AutoComplete>

            <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择注册时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

            <Button type="success" style="margin-left:30px;">查询</Button>
            
        </Card>

        <Card shadow>
            <Table border :columns="order_columns" :data="order_data">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" style="margin-right: 5px" @click="checkCus(index+1,'check')">查看并审核</Button>
                    <Button type="primary" style="margin-right: 5px" @click="editCus(index+1)">编辑</Button>
                    <Button type="error" @click="remove(index)">删除</Button>
                </template>
            </Table>
        </Card>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { Row,Col,Card,Button,Table,Select,Option,AutoComplete,DatePicker,} from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'customerAudit',
  components: {
    Row,
    Col,
    Card,
    Button,
    Table,
    QRCode,
    Select,
    Option,
    AutoComplete,
    DatePicker,
  },
  data () {
    return {
      citySelected:1,
      cityOptions:[
        {label:'上海',value:1},
        {label:'南京',value:2}
      ],
      driverPhone:'',
      phoneGather:[],
      order_columns: [
            {
                title: '客户名称',
                key: 'start_address'
            },
            {
                title: '客户电话',
                key: 'name'
            },
            {
                title: '邮箱',
                key: 'telephone'
            },
            {
                title: '注册时间',
                key: 'telephone'
            },
            {
                title: '推荐人',
                key: 'time'
            },
            {
                title: '推荐奖励',
                key: 'time'
            },
            {
                title: '审核状态',
                key: 'time'
            },
            {
                title: '操作',
                slot: 'action',
                width: 200,
                align: 'center'
            }
        ],
        order_data: [],
    }
  },
  methods: {
    ...mapActions([
      'getOrderData',
    ]),
    searchPhone(value){
      this.phoneGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    checkCus(index,type){
        this.$router.push({name:'new_edit_customer',query:{id:index,type}});
    },
    editCus(index){
        this.$router.push({name:'new_edit_customer',query:{id:index}});
    },
    remove(index){

    }
  },
  mounted () {
    this.createUrl();
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
