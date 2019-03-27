<template>
  <div style="padding:0 24px 24px;">
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;">指定时间</span>
        <DatePicker type="daterange" @on-change="changeDate" :value="date_val" transfer :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <span style="font-size:14px;padding-right:10px;margin-left:10px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入司机姓名"
        style="width:200px;" transfer>
            <Option v-for="(item,index) in driverGather" :value="item.id" :key="index" >{{ item.id_name }}</Option>
        </AutoComplete>

        <Button type="success" style="margin-left:30px;" @click="find_indent()">查询</Button>
        <Button type="success" style="margin-left:30px;" @click="create_bill()">生成结算单</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="edit_indent(row.id)">详情</Button>
                <!-- <Button type="error" @click="deleteBill(row.id)">删除</Button> -->
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
  </div>
</template>

<script>
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page } from 'iview'
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
    Page,
  },
  data () {
    return {
      date_val:['',''],
      driverName:'',
      driverGather:[],
      order_columns: [
            {
                title: '开始时间',
                key: 'start_date'
            },
            {
                title: '结束时间',
                key: 'end_date'
            },
            {
                title: '结算金额',
                key: 'count_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.count_amount/100),
                    ]);
                }
            },
            {
                title: '司机姓名',
                key: 'name'
            },
            {
                title: '司机电话',
                key: 'telephone'
            },
            {
                title: '订单数',
                key: 'count_order'
            },
            {
                title: '操作',
                slot: 'action',
                width: 230,
                align: 'center'
            }
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        driver_id:'',
    }
  },
  methods: {
    ...mapActions([
      'getDriverLists',
      'getDriverReconciliayionLists',
      'createDriverReconciliation',
    ]),
    changeDate(val){
        this.$set(this.date_val,0,val[0])
        this.$set(this.date_val,1,val[1])
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
            this.driver_id = data.data.data.rows[0].id;
        })
    },
    find_indent(){
        this.getDriverReconciliayionLists({ id:'',name:this.driverName,telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    create_bill(){
        this.createDriverReconciliation({ driver_id:this.driver_id,start_date:this.date_val[0],end_date:this.date_val[1] }).then((data) => {
            return data;
        }).then(data=>{
            if(data.data.code === 1){
                this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total
                })
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    edit_indent(index){
        this.$router.push({path:'driver_bill_detail',query:{id:index}});
    },
    changePage(page){
        this.pageCurrent = page;
        this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:size }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
  },
  mounted () {
    this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })
  },
  activated () {
    this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })
  },
}
</script>

<style lang="less">

</style>
