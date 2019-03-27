<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="moneyHostData" :style="{ cursor:'pointer',marginBottom:'10px'}" ></topHost>
    <topHost :itemCol="shouldHasHostData" :style="{ cursor:'pointer',marginBottom:'10px'}" ></topHost>
    <topHost :itemCol="indentPlatformHostData" :style="{ cursor:'pointer'}" ></topHost>
    <Card shadow style="margin-top:10px;">

        <span style="font-size:14px;padding-right:10px;">查询方式</span>
        <Select v-model="check_way" placeholder="请选择查询方式" style="width:80px">
            <Option :value="0">全部</Option>
            <Option :value="1">本年</Option>
            <Option :value="2">本月</Option>
            <Option :value="3">本周</Option>
            <Option :value="4">本日</Option>
        </Select>

        <DatePicker type="daterange" @on-change="changeDate" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;" transfer></DatePicker>

        <!-- <Button type="success" style="margin-left:30px;">打印</Button> -->
        <Button type="success" style="margin-left:30px;" @click="exportData">导出</Button>

    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page, } from 'iview'
import { mapActions } from 'vuex'
import FileSaver from 'file-saver';
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
    Page,
  },
  data () {
    return {
      moneyHostData: [],
      shouldHasHostData:[],
      indentPlatformHostData:[],
      check_way:0,
      date_val:['',''],
      order_columns: [
            {
                title: '日期',
                key: 'today'
            },
            {
                title: '已收入',
                key: 'get_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.get_amount/100),
                    ]);
                }
            },
            {
                title: '已支出',
                key: 'put_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.put_amount/100),
                    ]);
                }
            },
            {
                title: '应收入',
                key: 'should_get_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.should_get_amount/100),
                    ]);
                }
            },
            {
                title: '应支出',
                key: 'should_put_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.should_put_amount/100),
                    ]);
                }
            },
            {
                title: '总收入',
                key: 'total_get_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.total_get_amount/100),
                    ]);
                }
            },
            {
                title: '总支出',
                key: 'total_put_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.total_put_amount/100),
                    ]);
                }
            },
            {
                title: '利润',
                key: 'profit',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.profit/100),
                    ]);
                }
            },
            {
                title: '订单数',
                key: 'finish_order'
            },
        ],
        order_data: [],
        gather_word:'确认收款',
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
    }
  },
  methods: {
    ...mapActions([
      'getFinanceHost',
      'getFinanceLists',
    ]),

    exportData(){
        this.getFinanceLists({ start_time:'',end_time:'',offset:0,limit:100000 }).then((data) => {
            let result = data.data.data.rows[0];
            let str = '日期,已收入,已支出,应收入,应支出,总收入,总支出,利润,订单数';
            for (let i=0; i<result.length; i++) {
                    str += '\n' +
                    result[i].today + ',' +
                    result[i].get_amount/100 + ',' +
                    result[i].put_amount/100 + ',' +
                    result[i].should_get_amount/100 + ',' +
                    result[i].should_put_amount/100 + ',' +
                    result[i].total_get_amount/100 + ',' +
                    result[i].total_put_amount/100 + ',' +
                    result[i].profit/100 + ',' +
                    result[i].finish_order
            }
            let exportContent = "\uFEFF";
            let blob = new Blob([exportContent + str], {
                type: "text/plain;charset=utf-8"
            });
            FileSaver.saveAs(blob, "财务记录列表.xls");

        })
        
    },

    changeDate(date){
        this.getFinanceLists({ start_time:date[0],end_time:date[1],offset:0,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    changePage(page){
        this.pageCurrent = page;
        this.getFinanceLists({ start_time:'',end_time:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getFinanceLists({ start_time:'',end_time:'',offset:0,limit:size }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
  },
  mounted () {
    this.check_way = 0;
    this.getFinanceHost().then((data) => {
        this.$set(this.moneyHostData,0,{ title:'总收入',colSpan:4,value:data.data.data.total_get/100,em:true})
        this.$set(this.moneyHostData,1,{ title:'总支出',colSpan:4,value:data.data.data.total_put/100,em:true})
        this.$set(this.moneyHostData,2,{ title:'利润',colSpan:4,value:data.data.data.profit/100,em:false})

        this.$set(this.shouldHasHostData,0,{ title:'应收',colSpan:4,value:data.data.data.should_get/100,em:true})
        this.$set(this.shouldHasHostData,1,{ title:'已收',colSpan:4,value:data.data.data.get/100,em:true})
        this.$set(this.shouldHasHostData,2,{ title:'应付',colSpan:4,value:data.data.data.should_put/100,em:true})
        this.$set(this.shouldHasHostData,3,{ title:'已付',colSpan:4,value:data.data.data.put/100,em:false})
        
        this.$set(this.indentPlatformHostData,0,{ title:'订单金额',colSpan:4,value:data.data.data.total_order/100,em:true})
        this.$set(this.indentPlatformHostData,1,{ title:'订单司机结算金额',colSpan:4,value:data.data.data.total_driver/100,em:true})
        this.$set(this.indentPlatformHostData,2,{ title:'平台费总金额',colSpan:4,value:data.data.data.total_plat/100,em:true})
        if(data.data.data.plat.plat_amount_type === 1){
            let new_num = data.data.data.plat.plat_amount/100
            this.$set(this.indentPlatformHostData,3,{ title:'平台费',colSpan:4,value:new_num,em:false})
        }else{
            let new_percent = data.data.data.plat.plat_amount + '%'
            this.$set(this.indentPlatformHostData,3,{ title:'平台费',colSpan:4,value:new_percent,em:false})
        }
    })

    this.getFinanceLists({ start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })

  },
  activated () {
    this.check_way = 0;
    this.getFinanceHost().then((data) => {
        this.$set(this.moneyHostData,0,{ title:'总收入',colSpan:3,value:data.data.data.total_get/100,em:true})
        this.$set(this.moneyHostData,1,{ title:'总支出',colSpan:3,value:data.data.data.total_put/100,em:true})
        this.$set(this.moneyHostData,2,{ title:'利润',colSpan:3,value:data.data.data.profit/100,em:false})

        this.$set(this.shouldHasHostData,0,{ title:'应收',colSpan:3,value:data.data.data.should_get/100,em:true})
        this.$set(this.shouldHasHostData,1,{ title:'已收',colSpan:3,value:data.data.data.get/100,em:true})
        this.$set(this.shouldHasHostData,2,{ title:'应付',colSpan:3,value:data.data.data.should_put/100,em:true})
        this.$set(this.shouldHasHostData,3,{ title:'已付',colSpan:3,value:data.data.data.put/100,em:false})
        
        this.$set(this.indentPlatformHostData,0,{ title:'订单金额',colSpan:3,value:data.data.data.total_order/100,em:true})
        this.$set(this.indentPlatformHostData,1,{ title:'订单司机结算金额',colSpan:3,value:data.data.data.total_driver/100,em:true})
        this.$set(this.indentPlatformHostData,2,{ title:'平台费总金额',colSpan:3,value:data.data.data.total_plat/100,em:true})
        if(data.data.data.plat.plat_amount_type === 1){
            let new_num = data.data.data.plat.plat_amount/100
            this.$set(this.indentPlatformHostData,3,{ title:'平台费',colSpan:3,value:new_num,em:false})
        }else{
            let new_percent = data.data.data.plat.plat_amount + '%'
            this.$set(this.indentPlatformHostData,3,{ title:'平台费',colSpan:3,value:new_percent,em:false})
        }
    })

    this.getFinanceLists({ start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
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
