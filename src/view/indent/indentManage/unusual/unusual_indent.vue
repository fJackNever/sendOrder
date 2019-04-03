<template>
  <div style="padding:0 24px 24px;">
      <topHost :itemCol="indentHostData"  @transferdata="updateTable"></topHost>
      <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">城市</span>
        <Select v-model="citySelected" style="width:150px;margin-right:10px;" transfer @on-change="changeCity">
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in cityOptions" :value="item.id" :key="index">{{ item.city }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">订单筛选</span>
        <Select v-model="indentStatus" style="width:150px;margin-right:10px;" transfer @on-change="changeOrder">
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

        <!-- <span style="font-size:14px;padding-right:10px;padding-left:20px;">乘客手机号</span>
        <Input v-model="passengerPhone" placeholder="请输入乘客手机号" style="width:200px"></Input> -->

        <Button type="success" style="margin-left:30px;" @click="find_indent">查询</Button>

        <Divider />
        
      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" style="margin-right: 10px" @click="checkDriver(row.id)">查看</Button>
              <Button type="primary" style="margin-right: 10px" @click="edit_indent(row.id)">编辑</Button>
              <Button type="primary" style="margin-right: 10px" @click="deal_indent(row.id)" v-if="row.status <= 2">处理</Button>
              <Button type="error" style="margin-right: 10px" @click="stop_indent(row.entity_id)" v-if="row.status === 3">强制结束</Button>
              <Button type="error" @click="cancel(row.entity_id)" v-if="row.status === 2">取消</Button>
            </template>
        </Table>
      </Card>
      <Modal 
            title="是否强制结束"
            v-model="stopVisible" 
            @on-ok="confirmStop"
            ok-text="是"
            cancel-text="否"
            class="reassignModal"
      >
      </Modal>
      <Modal 
            title="是否取消"
            v-model="cancelVisible" 
            @on-ok="confirmCancel"
            ok-text="是"
            cancel-text="否"
            class="reassignModal"
      >
      </Modal>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Modal } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'unusual_indent',
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
    Modal
  },
  data () {
    return {
      citySelected:-1,
      cityOptions:[],
      indentStatus:1,
      statusOptions:[
        {label:'待处理的异常订单',value:1},
        {label:'待抢单的异常订单',value:2},
        {label:'进行中的异常订单',value:3},
      ],
      driverName:'',
      driverGather:[],
      cusName:'',
      cusNameGather:[],
      indentNum:'',
      indentHostData: [],
      order_columns: [
            {
                title: '城市',
                key: 'city',
                width:100,
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
                title: '客户名称',
                key: 'customer_name'
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
                title: '司机',
                key: 'driver_name'
            },
            {
                title: '车牌号',
                key: 'car_no'
            },
            {
                title: '操作',
                slot: 'action',
                width: 410,
                align: 'center'
            }
        ],
        order_data: [],
        inputNameShake:'',
        inpuCusShake:'',
        order_status:1,
        permission_arr:'',
        stopVisible:false,
        stop_entity_id:'',
        cancelVisible:false,
        cancel_entity_id:'',
    }
  },
  methods: {
    ...mapActions([
      'getAbnormalHost',
      'getCompanyCityLists',
      'getAbnormalOrderLists',
      'forcedEndOrder',
      'cancelOrder',
      'getDriverLists',
    ]),
    updateTable(index){
        if(index === 0){
            this.getAbnormalOrderLists({ entity_id:'',status:1,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
                if(data.data.code === 1){
                    this.order_data = [];
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total;
                }else{
                    this.order_data = [];
                    this.pageTotal = 0;
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }else if(index === 1){
            this.getAbnormalOrderLists({ entity_id:'',status:2,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
                if(data.data.code === 1){
                    this.order_data = [];
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total;
                }else{
                    this.order_data = [];
                    this.pageTotal = 0;
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }else if(index === 2){
            this.getAbnormalOrderLists({ entity_id:'',status:3,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
                if(data.data.code === 1){
                    this.order_data = [];
                    for(let i=0; i<data.data.data.rows.length; i++){
                        this.$set(this.order_data,i,data.data.data.rows[i])
                    }
                    this.pageTotal = data.data.data.total;
                }else{
                    this.order_data = [];
                    this.pageTotal = 0;
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }
    },
    changeCity(val){
        this.getAbnormalOrderLists({ entity_id:'',status:this.order_status,city_id:val,driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    changeOrder(val){
        this.citySelected = -1;
        this.order_status = val
        this.getAbnormalOrderLists({ entity_id:'',status:val,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
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
        this.getAbnormalOrderLists({ entity_id:this.indentNum,status:this.order_status,city_id:'',driver_name:this.driverName,customer_name:this.cusName,start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    checkDriver(index,type){
      this.$router.push({path:'check_unusual',query:{id:index}});
    },
    edit_indent(index){
        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[5000].length; i++){
                if(this.permission_arr[5000][i] === '5002'){
                    per_val = 5002
                }
            }
            if(per_val === 5002){
                this.$router.push({path:'edit_indent',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'edit_indent',query:{id:index}});
        }
        
    },
    deal_indent(index){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[5000].length; i++){
                if(this.permission_arr[5000][i] === '5004'){
                    per_val = 5004
                }
            }
            if(per_val === 5004){
                this.$router.push({path:'check_indent',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'check_indent',query:{id:index}});
        }
        
    },
    stop_indent(entity_id){
        this.stopVisible = true;
        this.stop_entity_id = entity_id;

    },
    confirmStop(){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[5000].length; i++){
                if(this.permission_arr[5000][i] === '5008'){
                    per_val = 5008
                }
            }
            if(per_val === 5008){
                
                this.forcedEndOrder({ entity_id:this.stop_entity_id }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('结束成功!');
                        this.stopVisible = false;
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                    return data;
                }).then(data=>{
                    if(data.data.code === 1){
                        this.getAbnormalOrderLists({ entity_id:'',status:1,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
                            this.order_data = [];
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
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
            
            this.forcedEndOrder({ entity_id:this.stop_entity_id }).then((data) => {
                if(data.data.code === 1){
                    this.$Message.success('结束成功!');
                    this.stopVisible = false;
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
                return data;
            }).then(data=>{
                if(data.data.code === 1){
                    this.getAbnormalOrderLists({ entity_id:'',status:1,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
                        this.order_data = [];
                        for(let i=0; i<data.data.data.rows.length; i++){
                            this.$set(this.order_data,i,data.data.data.rows[i])
                        }
                    })
                }
            })

        }
    },
    cancel(index){
        this.cancelVisible = true;
        this.cancel_entity_id = index;

    },
    confirmCancel(){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[5000].length; i++){
                if(this.permission_arr[5000][i] === '5005'){
                    per_val = 5005
                }
            }
            if(per_val === 5005){
                
                this.cancelOrder({ entity_id:this.cancel_entity_id }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('取消成功!');
                        this.cancelVisible = false;
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                    return data;
                }).then(data=>{
                    if(data.data.code === 1){
                        this.getAbnormalOrderLists({ entity_id:'',status:1,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
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
            this.cancelOrder({ entity_id:this.cancel_entity_id }).then((data) => {
                if(data.data.code === 1){
                    this.$Message.success('取消成功!');
                    this.cancelVisible = false;
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
                return data;
            }).then(data=>{
                if(data.data.code === 1){
                    this.getAbnormalOrderLists({ entity_id:'',status:1,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
                        this.order_data = [];
                        for(let i=0; i<data.data.data.rows.length; i++){
                            this.$set(this.order_data,i,data.data.data.rows[i])
                        }
                        this.pageTotal = data.data.data.total
                    })
                }
            })
        }
    }
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.citySelected = -1;
    this.indentStatus = 1;
    this.getAbnormalHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.indentHostData,0,{ title:'待处理的异常订单',colSpan:3,value:data.data.data.wait_manage,em:true})
            this.$set(this.indentHostData,1,{ title:'待抢单的异常订单',colSpan:3,value:data.data.data.wait_order,em:true})
            this.$set(this.indentHostData,2,{ title:'进行中的异常订单',colSpan:3,value:data.data.data.running,em:false})
        }else{
            this.$set(this.indentHostData,0,{ title:'待处理的异常订单',colSpan:3,value:0,em:true})
            this.$set(this.indentHostData,1,{ title:'待抢单的异常订单',colSpan:3,value:0,em:true})
            this.$set(this.indentHostData,2,{ title:'进行中的异常订单',colSpan:3,value:0,em:false})
        }
        
    })

    this.getCompanyCityLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.cityOptions,i,data.data.data.rows[i])
        }
    })

    this.getAbnormalOrderLists({ entity_id:'',status:1,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
        if(data.data.code === 1){
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total;
        }else{
            this.order_data = [];
            this.pageTotal = 0;
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: data.data.msg
            });
        }
    })
      
  },
  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.citySelected = -1;
    this.indentStatus = 1;
    this.getAbnormalHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.indentHostData,0,{ title:'待处理的异常订单',colSpan:3,value:data.data.data.wait_manage,em:true})
            this.$set(this.indentHostData,1,{ title:'待抢单的异常订单',colSpan:3,value:data.data.data.wait_order,em:true})
            this.$set(this.indentHostData,2,{ title:'进行中的异常订单',colSpan:3,value:data.data.data.running,em:false})
        }else{
            this.$set(this.indentHostData,0,{ title:'待处理的异常订单',colSpan:3,value:0,em:true})
            this.$set(this.indentHostData,1,{ title:'待抢单的异常订单',colSpan:3,value:0,em:true})
            this.$set(this.indentHostData,2,{ title:'进行中的异常订单',colSpan:3,value:0,em:false})
        }
        
    })

    this.getCompanyCityLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.cityOptions,i,data.data.data.rows[i])
        }
    })

    this.getAbnormalOrderLists({ entity_id:'',status:1,city_id:'',driver_name:'',customer_name:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'' }).then((data) => {
        if(data.data.code === 1){
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total;
        }else{
            this.order_data = [];
            this.pageTotal = 0;
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: data.data.msg
            });
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
