<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="countHostData" @transferdata="updateTable"></topHost>
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;">时间筛选</span>
        <DatePicker type="daterange" @on-change="changeDate" transfer :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Button type="success" style="margin-left:30px;" @click="find_bill()">查询</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="edit_bill(row.id)">详情</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'companyBill',
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
    Page
  },
  data () {
    return {
      withDis:false,
      cusName:'',
      cusNameGather:[],
      phone:'',
      countHostData: [],
      order_columns: [
            {
                title: '公司名称',
                key: 'name'
            },
            {
                title: '公司电话',
                key: 'telephone'
            },
            {
                title: '结算时间',
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
                title: '订单数',
                key: 'count_order'
            },
            {
                title: '支付状态',
                key: 'pay_status',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.pay_status === 0 ? '未支付':'已支付'),
                    ]);
                }
            },
            {
                title: '确认状态',
                key: 'confirm_status',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.confirm_status === 0 ? '未确认':'已确认'),
                    ]);
                }
            },
            {
                title: '操作',
                slot: 'action',
                width: 260,
                align: 'center'
            }
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        inpuCusShake:'',
        date_val:['',''],
        cus_id:'',
    }
  },
  methods: {
    ...mapActions([
      'getCutsomerReconciliationHost',
      'getCustomerLists',
      'createCustomerReconciliation',
      'getCustomerReconciliayionLists',
      'confirmCustomerReconciliation',
      'delCustomerReconciliation',
    ]),
    updateTable(index){
        if(index === 0){
            this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:0,confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(index === 1){
            this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:1,confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeDate(val){
        this.$set(this.date_val,0,val[0])
        this.$set(this.date_val,1,val[1])
    },
    find_bill(){
        this.getCustomerReconciliayionLists({ id:'',name:this.cusName,telephone:this.phone,pay_status:'',confirm_status:'',start_time:this.date_val[0],end_time:this.date_val[1],offset:0,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    edit_bill(index){
        this.$router.push({path:'companyBillDetail',query:{id:index}});
    },
    changePage(page){
        this.pageCurrent = page;
        this.getCustomerReconciliayionLists({ id:'',name:this.cusName,telephone:this.phone,pay_status:'',confirm_status:'',start_time:this.date_val[0],end_time:this.date_val[1],offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getCustomerReconciliayionLists({ id:'',name:this.cusName,telephone:this.phone,pay_status:'',confirm_status:'',start_time:this.date_val[0],end_time:this.date_val[1],offset:0,limit:size }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
  },
  mounted () {
    this.getCutsomerReconciliationHost().then((data) => {
        this.$set(this.countHostData,0,{ title:'未支付金额',colSpan:3,value:data.data.data.unpay_amount/100,em:true})
        this.$set(this.countHostData,1,{ title:'已支付金额',colSpan:3,value:data.data.data.pay_amount/100,em:false})
    })

    this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })

  },
  activated () {
    this.getCutsomerReconciliationHost().then((data) => {
        this.$set(this.countHostData,0,{ title:'未支付金额',colSpan:3,value:data.data.data.unpay_amount/100,em:true})
        this.$set(this.countHostData,1,{ title:'已支付金额',colSpan:3,value:data.data.data.pay_amount/100,em:false})
    })

    this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })

  }
}
</script>

<style lang="less">

</style>
