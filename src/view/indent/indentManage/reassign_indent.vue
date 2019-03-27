<template>
  <div style="padding:0 24px 24px;">
      <topHost :itemCol="indentHostData" @transferdata="updateTable"></topHost>
      <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">城市</span>
        <Select v-model="citySelected" style="width:150px;margin-right:10px;" transfer @on-change="changeCity">
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in cityOptions" :value="item.id" :key="index">{{ item.city }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">状态筛选</span>
        <Select v-model="indentStatus" style="width:150px;margin-right:10px;" transfer @on-change="changeOrder">
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in statusOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <!-- <span style="font-size:14px;padding-right:10px;padding-left:20px;">订单开始时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">订单结束时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker> -->

        <Divider />

        <span style="font-size:14px;padding-right:10px;">订单编号</span>
        <Input v-model="indentNum" placeholder="请输入订单编号" style="width:200px"></Input>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入司机姓名"
        style="width:200px;" transfer>
            <Option v-for="(item,index) in driverGather" :value="item.id" :key="index" >{{ item.id_name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">客户名称</span>
        <AutoComplete
        v-model="cusName"
        @on-search="searchCusName"
        @on-select="selectCusName"
        placeholder="请输入客户名称"
        style="width:200px;" transfer>
            <Option v-for="(item,index) in cusNameGather" :value="item.id" :key="index" >{{ item.name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">乘客手机号</span>
        <Input v-model="passengerPhone" placeholder="请输入乘客手机号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="find_indent">查询</Button>

        <Divider />
        
      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="reassign_indent(row.entity_id)" v-if="row.reassign_manage_status === 0">同意改派</Button>
                <Button type="error" style="margin-right: 5px" @click="refuse_reassign(row.order_id)" v-if="row.reassign_manage_status === 0">驳回改派</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
      </Card>
      <Modal 
            title="是否改派"
            v-model="reassignVisible" 
            @on-ok="confirmReassign"
            @on-cancel="cancelReassign"
            ok-text="是"
            cancel-text="否"
            class="reassignModal"
      >
      </Modal>
      <Modal 
            title="是否驳回改派"
            v-model="refuseVisible" 
            @on-ok="confirmRefuse"
            @on-cancel="cancelRefuse"
            ok-text="是"
            cancel-text="否"
            class="reassignModal"
      >
      </Modal>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page,Modal } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'reassign_indent',
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
    Modal
  },
  data () {
    return {
      citySelected:-1,
      cityOptions:[],
      indentStatus:-1,
      statusOptions:[
        {label:'待改派',value:0},
        {label:'已改派',value:1},
        {label:'已驳回',value:2},
      ],
      driverName:'',
      driverGather:[],
      cusName:'',
      cusNameGather:[],
      passengerPhone:'',
      indentNum:'',
      indentHostData: [],
      order_columns: [
            {
                title: '城市',
                key: 'city'
            },
            {
                title: '订单编号',
                key: 'entity_id'
            },
            {
                title: '订单开始日期',
                key: 'start_date'
            },
            {
                title: '订单开始时间',
                key: 'start_time'
            },
            {
                title: '订单起点',
                key: 'start_address'
            },
            {
                title: '订单终点',
                key: 'end_address'
            },
            {
                title: '乘客',
                key: 'passenger_name'
            },
            {
                title: '乘客电话',
                key: 'passenger_tel'
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', [
                        h('div',this.getStatus(params.row.status)),
                    ]);
                }
            },
            {
                title: '改派状态',
                key: 'reassign_status',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.reassign_status === 0 ? '未改派':'已改派'),
                    ]);
                }
            },
            {
                title: '司机姓名',
                key: 'driver_name'
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
        inputNameShake:'',
        inpuCusShake:'',
        reassignVisible:false,
        reassign_entity_id:'',
        permission_arr:'',
        refuseVisible:false,
        refuse_order_id:'',
    }
  },
  methods: {
    ...mapActions([
      'getResaaignHost',
      'getReassignApplyLists',
      'getCompanyCityLists',
      'reassignOrder',
      'rejectReassignApply',
      'getDriverLists',
    ]),
    updateTable(index){
        if(index === 0){
            this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:0,start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(index === 1){
            this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:1,start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(index === 2){
            this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:2,start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    getStatus(status){
        if(status === 1){
            return '待处理'
        }else if(status === 2){
            return '待抢单'
        }else if(status === 3){
            return '已接单'
        }else if(status === 4){
            return '出发接乘客'
        }else if(status === 5){
            return '已接到乘客'
        }else if(status === 6){
            return '已完成'
        }else if(status === 7){
            return '已取消'
        }
    },
    changeCity(val){
        if(val === -1){
            this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:val,reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeOrder(val){
        if(val === -1){
            this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:val,start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
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
            this.driverName = data.data.data.rows[0].id_name
        })
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
            this.cusName = data.data.data.rows[0].name
        })
    },
    find_indent(){
        this.getReassignApplyLists({ order_id:'',order_entity_id:this.indentNum,customer_id,city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:this.driverName,customer_name:this.cusName,passenger_tel:this.passengerPhone,offset:0,limit:10 }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    reassign_indent(index){

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[5000].length; i++){
                if(this.permission_arr[5000][i] === '5006'){
                    per_val = 5006
                }
            }
            if(per_val === 5006){
                this.reassign_entity_id = index;
                this.reassignVisible = true;
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.reassign_entity_id = index;
            this.reassignVisible = true;
        }

        //this.$router.push({path:'reassign_detail',query:{id:index}});
    },
    refuse_reassign(){
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr.length; i++){
                if(this.permission_arr[i] === '5006'){
                    per_val = 5006
                }
            }
            if(per_val === 5006){
                this.refuse_order_id = index;
                this.refuseVisible = true;
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.refuse_order_id = index;
            this.refuseVisible = true;
        }
    },
    confirmReassign(){
        this.reassignOrder({ entity_id:this.reassign_order_id }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('改派成功!');
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
            return data;
        }).then(data => {
            if(data.data.code === 1){
                this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                    this.order_data = []
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total
                })
            }
        })
    },
    cancelReassign(){
        this.reassignVisible = false;
    },
    confirmRefuse(){
        this.rejectReassignApply({ id:this.refuse_order_id }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('驳回成功!');
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
            return data;
        }).then(data => {
            if(data.data.code === 1){
                this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                    this.order_data = []
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total
                })
            }
        })
    },
    cancelRefuse(){
        this.refuseVisible = false;
    },
    changePage(page){
        this.pageCurrent = page;
        this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:size }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getResaaignHost().then((data) => {
        this.$set(this.indentHostData,0,{ title:'待改派订单',colSpan:3,value:data.data.data.wait_resaaign,em:true})
        this.$set(this.indentHostData,1,{ title:'已改派订单',colSpan:3,value:data.data.data.resaaigned,em:true})
        this.$set(this.indentHostData,2,{ title:'已驳回订单',colSpan:3,value:data.data.data.reject_resaaign,em:false})
    })
    
    this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })

    this.getCompanyCityLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.cityOptions,i,data.data.data.rows[i])
        }
    })
  },
  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getResaaignHost().then((data) => {
        this.$set(this.indentHostData,0,{ title:'待改派订单',colSpan:3,value:data.data.data.wait_resaaign,em:true})
        this.$set(this.indentHostData,1,{ title:'已改派订单',colSpan:3,value:data.data.data.resaaigned,em:true})
        this.$set(this.indentHostData,2,{ title:'已驳回订单',colSpan:3,value:data.data.data.reject_resaaign,em:false})
    })
    
    this.getReassignApplyLists({ order_id:'',order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })

    this.getCompanyCityLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.cityOptions,i,data.data.data.rows[i])
        }
    })
  }
}
</script>

<style lang="less">
.reassignModal{
    .ivu-modal{
        width: 300px !important;
    }
    .ivu-modal-header{
        border-bottom:none;
        .ivu-modal-header-inner{
            text-align: center;
        }
    }
    .ivu-modal-body{
        display: none;
    }
    .ivu-modal-footer{
        border-top:none;
        text-align: center;
    }
}
</style>
