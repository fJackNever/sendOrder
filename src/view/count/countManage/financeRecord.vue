<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="moneyHostData" :style="{ cursor:'pointer',marginBottom:'10px'}" @transferdata="getTableData"></topHost>
    <topHost :itemCol="shouldHasHostData" :style="{ cursor:'pointer',marginBottom:'10px'}" @transferdata="getTableData"></topHost>
    <topHost :itemCol="indentPlatformHostData" :style="{ cursor:'pointer'}" @transferdata="getTableData"></topHost>
    <Card shadow style="margin-top:10px;">

        <span style="font-size:14px;padding-right:10px;">查询方式</span>
        <Select v-model="check_way" placeholder="请选择查询方式" style="width:80px">
            <Option value="0">全部</Option>
            <Option value="1">本年</Option>
            <Option value="2">本月</Option>
            <Option value="3">本周</Option>
            <Option value="4">本日</Option>
        </Select>

        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;" transfer></DatePicker>

        <Divider />

        <Button type="success" style="margin-left:30px;">查询</Button>
        <Button type="success" style="margin-left:30px;">打印</Button>
        <Button type="success" style="margin-left:30px;">导出</Button>

    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
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
  name: 'financeRecord',
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
      moneyHostData: [
        { title:'总收入',colSpan:3,value:60,em:true},
        { title:'总支出',colSpan:3,value:60,em:true},
        { title:'利润',colSpan:3,value:8,em:false},
      ],
      shouldHasHostData:[
        { title:'应收',colSpan:3,value:60,em:true},
        { title:'已收',colSpan:3,value:60,em:true},
        { title:'应付',colSpan:3,value:8,em:true},
        { title:'已付',colSpan:3,value:8,em:false},
      ],
      indentPlatformHostData:[
        { title:'订单金额',colSpan:3,value:60,em:true},
        { title:'订单司机结算金额',colSpan:3,value:60,em:true},
        { title:'平台费总金额',colSpan:3,value:8,em:true},
        { title:'平台费',colSpan:3,value:8,em:false},
      ],
      check_way:'0',
      order_columns: [
            {
                title: '日期',
                key: 'name'
            },
            {
                title: '已收入',
                key: 'start_address'
            },
            {
                title: '已支出',
                key: 'start_address'
            },
            {
                title: '应收入',
                key: 'name'
            },
            {
                title: '应支出',
                key: 'status'
            },
            {
                title: '总收入',
                key: 'name'
            },
            {
                title: '总支出',
                key: 'name'
            },
            {
                title: '利润',
                key: 'name'
            },
            {
                title: '订单数',
                key: 'name'
            },
        ],
        order_data: [],
        gather_word:'确认收款'
    }
  },
  methods: {
    ...mapActions([
      
    ]),
    getTableData(data){
        console.log(data);
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
