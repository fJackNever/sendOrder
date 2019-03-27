<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="countHostData" @transferdata="updateTable"></topHost>
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;">时间筛选</span>
        <DatePicker type="daterange" @on-change="changeDate" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <span style="font-size:14px;padding-right:10px;">客户名称</span>
        <AutoComplete
        v-model="cusName"
        @on-search="searchCusName"
        @on-select="selectCusName"
        placeholder="请输入客户名称"
        style="width:200px;" transfer>
          <Option v-for="(item,index) in cusNameGather" :value="item.id" :key="index" >{{ item.name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">客户手机号</span>
        <Input v-model="phone" placeholder="请输入联系人手机号" style="width:200px;"></Input>

        <Button type="success" style="margin-left:30px;" @click="find_bill()">查询</Button>
        <Button type="success" style="margin-left:30px;" @click="create_bill()">生成对账单</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="edit_bill(row.id)">详情</Button>
                <Button type="error" style="margin-right: 5px" @click="sure_gathering(row.id)" v-if="row.confirm_status === 0">确认收款</Button>
                <Button type="error" style="margin-right: 5px" v-if="row.confirm_status === 1"  disabled >已确认</Button>
                <Button type="error" @click="deleteBill(row.id)">删除</Button>
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
                title: '客户姓名',
                key: 'name'
            },
            {
                title: '客户电话',
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
        permission_arr:'',
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        inpuCusShake:'',
        date_val:['',''],
        cus_id:'',
        permission_arr:''
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
    searchCusName(value){
      if(this.inpuCusShake) clearTimeout(this.inputCusShake)
        this.inpuCusShake = setTimeout(()=>{
            this.getCustomerLists({ id:'',status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
                this.cusNameGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.cusNameGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectCusName(val){
        this.getCustomerLists({ id:val,status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
            this.cusName = data.data.data.rows[0].name;
            this.phone = data.data.data.rows[0].telephone;
            this.cus_id = data.data.data.rows[0].id;
        })
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
    create_bill(){

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[6000].length; i++){
                if(this.permission_arr[6000][i] === '6007'){
                    per_val = 6007
                }
            }
            if(per_val === 6007){
                
                this.createCustomerReconciliation({ customer_id:this.cus_id,start_date:this.date_val[0],end_date:this.date_val[1] }).then((data) => {
                    return data;
                }).then(data=>{
                    if(data.data.code === 1){
                        this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
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

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.createCustomerReconciliation({ customer_id:this.cus_id,start_date:this.date_val[0],end_date:this.date_val[1] }).then((data) => {
                return data;
            }).then(data=>{
                if(data.data.code === 1){
                    this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
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
        }

        
    },
    edit_bill(index){
        this.$router.push({path:'edit_count',query:{id:index}});
    },
    sure_gathering(index){

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[6000].length; i++){
                if(this.permission_arr[6000][i] === '6008'){
                    per_val = 6008
                }
            }
            if(per_val === 6008){
                
                 this.confirmCustomerReconciliation({ id:index }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('确认成功!');
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                    return data;
                }).then(data=>{
                    if(data.data.code === 1){
                        this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                            this.order_data = [];
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.pageTotal = data.data.data.total
                        })
                    }
                })

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
             this.confirmCustomerReconciliation({ id:index }).then((data) => {
                if(data.data.code === 1){
                    this.$Message.success('确认成功!');
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
                return data;
            }).then(data=>{
                if(data.data.code === 1){
                    this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                        this.order_data = [];
                        for(let i=0; i<data.data.data.rows.length; i++){
                            this.$set(this.order_data,i,data.data.data.rows[i])
                        }
                        this.pageTotal = data.data.data.total
                    })
                }
            })
        }
        
       
    },
    deleteBill(index){
        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[6000].length; i++){
                if(this.permission_arr[6000][i] === '6009'){
                    per_val = 6009
                }
            }

            if(per_val === 6009){

                this.delCustomerReconciliation({ id:index }).then((data) => {
                    if(data.data.code === 1){
                        for(let i=0; i<this.order_data.length;){
                            if(index === this.order_data[i].id){
                                this.order_data.splice(i,1)
                            }else{
                                i++
                            }
                        }
                        this.$Message.success('删除成功!');
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                    return data;
                }).then((data)=>{
                    if(data.data.code === 1){
                        if(this.order_data.length === 0){
                            if(this.pageCurrent > 1){
                                this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.pageTotal = data.data.data.total
                                })
                            }
                        }
                    }
                })

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.delCustomerReconciliation({ id:index }).then((data) => {
                if(data.data.code === 1){
                    for(let i=0; i<this.order_data.length;){
                        if(index === this.order_data[i].id){
                            this.order_data.splice(i,1)
                        }else{
                            i++
                        }
                    }
                    this.$Message.success('删除成功!');
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
                return data;
            }).then((data)=>{
                if(data.data.code === 1){
                    if(this.order_data.length === 0){
                        if(this.pageCurrent > 1){
                            this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                this.pageTotal = data.data.data.total
                            })
                        }else{
                            this.getCustomerReconciliayionLists({ id:'',name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                        }
                    }
                }
            })
        }
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
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
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
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
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
