<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="countHostData" @transferdata="updateTable"></topHost>
    <Card shadow style="margin-top:10px;">
        <!-- <span style="font-size:14px;">订单开始时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;" transfer></DatePicker>

        <span style="font-size:14px;padding-right:10px;padding-left:30px;">订单结束时间</span>
        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;" transfer></DatePicker>

        <Divider /> -->

        <span style="font-size:14px;padding-right:10px;">订单编号</span>
        <Input v-model="indentNum" placeholder="请输入订单编号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="find_indent(1)">查询</Button>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入司机姓名"
        style="width:200px;" transfer>
            <Option v-for="(item,index) in driverGather" :value="item.id" :key="index" >{{ item.id_name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <Input v-model="driverPhone" placeholder="请输入乘客手机号" style="width:200px"></Input>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">客户名称</span>
        <AutoComplete
        v-model="cusName"
        @on-search="searchCusName"
        @on-select="selectCusName"
        placeholder="请输入客户名称"
        style="width:200px;" transfer>
            <Option v-for="(item,index) in cusNameGather" :value="item.id" :key="index" >{{ item.name }}</Option>
        </AutoComplete>

        <Button type="success" style="margin-left:30px;" @click="find_indent(2)">查询</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 10px" @click="edit_indent(row.id)">详情</Button>
                <Button type="error" @click="count_order(row.id)" v-if="row.driver_settle_status === 0">结算</Button>
                <Button type="error" v-if="row.driver_settle_status === 1" disabled>已结算</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
    <Modal title="结算" v-model="countVisible" :footer-hide="true">
        <Form ref="formValidate" :model="formValidate" :label-width="120" >
            <Row>
                <Col span="12">
                    <div style="margin:24px 0;text-align:center;">订单自动结算</div>
                    <FormItem label="订单价格" prop="autoPrice" :label-width="120">
                        <InputNumber :min="0" v-model="formValidate.autoPrice" disabled></InputNumber>
                    </FormItem>
                    <FormItem label="司机收入" prop="autoIncome" :label-width="120">
                        <InputNumber :min="0" v-model="formValidate.autoIncome" disabled></InputNumber>
                    </FormItem>
                    <FormItem label="平台费用" prop="autoCharge" :label-width="120">
                        <InputNumber :min="0" v-model="formValidate.autoCharge" disabled></InputNumber>
                    </FormItem>
                </Col>
                <Col span="12">
                    <div style="margin:24px 0;text-align:center;">人工结算</div>
                    <FormItem label="订单价格" prop="humanPrice" :label-width="120">
                        <InputNumber :min="0" v-model="formValidate.humanPrice" @on-change="changeHuman"></InputNumber>
                    </FormItem>
                    <FormItem label="司机收入" prop="humanIncome" :label-width="120">
                        <InputNumber :min="0" v-model="formValidate.humanIncome" @on-change="changeHuman"></InputNumber>
                    </FormItem>
                    <FormItem label="平台费用" prop="humanCharge" :label-width="120">
                        <InputNumber :min="0" v-model="formValidate.humanCharge" @on-change="changeHuman"></InputNumber>
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="备注" prop="desc" style="width:400px;">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Modal,Form,FormItem,InputNumber,Page, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'countList',
  components: {
    Row,
    Col,
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
    Modal,
    Form,
    FormItem,
    InputNumber,
    Page,
  },
  data () {
    return {
      driverName:'',
      driverGather:[],
      cusName:'',
      cusNameGather:[],
      driverPhone:'',
      indentNum:'',
      countHostData: [],
      order_columns: [
            {
                title: '城市',
                key: 'city',
                width:100,
            },
            {
                title: '订单编号',
                key: 'order_entity_id'
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
                title: '平台费',
                key: 'plat_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.plat_amount/100),
                    ]);
                }
            },
            {
                title: '司机',
                key: 'driver_name'
            },
            {
                title: '订单价格',
                key: 'amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.amount/100),
                    ]);
                }
            },
            {
                title: '司机价格',
                key: 'driver_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.driver_amount/100),
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
        countVisible:false,
        formValidate:{
            autoPrice:0,
            autoIncome:0,
            autoCharge:0,
            humanPrice:0,
            humanIncome:0,
            humanCharge:0,
        },
        human_val:0,
        count_id:'',
        permission_arr:''
    }
  },
  methods: {
    ...mapActions([
      'getSettleHost',
      'getSettleOrderLists',
      'preDriverSettle',
      'driverSettle',
      'getDriverLists',
    ]),
    updateTable(index){
        if(index === 0){
            this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:0,customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
            this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:1,customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
            this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:0,customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
        }else if(index === 3){
            this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:1,customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
            this.driverPhone = data.data.data.rows[0].telephone;
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
    find_indent(type){
        if(type === 1){
            this.getSettleOrderLists({ id:'',order_entity_id:this.indentNum,driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
        }else{
            this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:this.driverName,customer_name:this.cusName,driver_tel:this.driverPhone,driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
    edit_indent(index){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[5000].length; i++){
                if(this.permission_arr[5000][i] === '5003'){
                    per_val = 5003
                }
            }
            if(per_val === 5003){
                this.$router.push({name:'count_detail',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({name:'count_detail',query:{id:index}});
        }

    },
    count_order(index){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[6000].length; i++){
                if(this.permission_arr[6000][i] === '6001'){
                    per_val = 6001
                }
            }
            if(per_val === 6001){
                this.countVisible = true;
                this.count_id = index;
                this.formValidate.humanPrice = 0;
                this.formValidate.humanIncome = 0;
                this.formValidate.humanCharge = 0;
                this.preDriverSettle({ id:index }).then((data) => {
                    this.$set(this.formValidate,'autoPrice',data.data.data.order_amount/100)
                    this.$set(this.formValidate,'autoIncome',data.data.data.driver_amount/100)
                    this.$set(this.formValidate,'autoCharge',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'humanPrice',data.data.data.order_amount/100)
                    this.$set(this.formValidate,'humanIncome',data.data.data.driver_amount/100)
                    this.$set(this.formValidate,'humanCharge',data.data.data.plat_amount/100)
                })
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.countVisible = true;
            this.count_id = index;
            this.formValidate.humanPrice = 0;
            this.formValidate.humanIncome = 0;
            this.formValidate.humanCharge = 0;
            this.preDriverSettle({ id:index }).then((data) => {
                this.$set(this.formValidate,'autoPrice',data.data.data.order_amount/100)
                this.$set(this.formValidate,'autoIncome',data.data.data.driver_amount/100)
                this.$set(this.formValidate,'autoCharge',data.data.data.plat_amount/100)
                this.$set(this.formValidate,'humanPrice',data.data.data.order_amount/100)
                this.$set(this.formValidate,'humanIncome',data.data.data.driver_amount/100)
                this.$set(this.formValidate,'humanCharge',data.data.data.plat_amount/100)
            })
        }

    },
    changePage(page){
        this.pageCurrent = page;
        this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:size }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    changeHuman(){
        this.human_val = 1;
    },
    handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(this.human_val === 0){
                    this.driverSettle({ 
                        id:this.count_id,
                        order_amount:this.formValidate.autoPrice*100,
                        driver_amount:this.formValidate.autoIncome*100,
                        plat_amount:this.formValidate.autoCharge*100,
                        driver_settle_comment:this.formValidate.desc || '',
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('结算成功!');
                            this.countVisible = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                        return data;
                    }).then((data)=>{
                        if(data.data.code === 1){
                            if(this.pageCurrent > 1){
                                this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.pageTotal = data.data.data.total
                                })
                            }
                        }
                    })
                }else{
                    this.driverSettle({ 
                        id:this.count_id,
                        order_amount:this.formValidate.humanPrice*100,
                        driver_amount:this.formValidate.humanIncome*100,
                        plat_amount:this.formValidate.humanCharge*100,
                        driver_settle_comment:this.formValidate.desc || '',
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('结算成功!');
                            this.countVisible = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                        return data;
                    }).then((data)=>{
                        if(data.data.code === 1){
                            if(this.pageCurrent > 1){
                                this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.pageTotal = data.data.data.total
                                })
                            }
                        }
                    })
                }
            } else {
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '提交失败'
                });
            }
        })
    },
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getSettleHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.countHostData,0,{ title:'未结算订单',colSpan:3,value:data.data.data.unsettle_count,em:true})
            this.$set(this.countHostData,1,{ title:'已结算订单',colSpan:3,value:data.data.data.settled_count,em:true})
            this.$set(this.countHostData,2,{ title:'未结算金额',colSpan:3,value:data.data.data.unsettle_amount/100,em:true})
            this.$set(this.countHostData,3,{ title:'已结算金额',colSpan:3,value:data.data.data.settled_amount/100,em:false})
        }else{
            this.$set(this.countHostData,0,{ title:'未结算订单',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,1,{ title:'已结算订单',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,2,{ title:'未结算金额',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,3,{ title:'已结算金额',colSpan:3,value:0,em:false})
        }
        
    })

    this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
    this.getSettleHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.countHostData,0,{ title:'未结算订单',colSpan:3,value:data.data.data.unsettle_count,em:true})
            this.$set(this.countHostData,1,{ title:'已结算订单',colSpan:3,value:data.data.data.settled_count,em:true})
            this.$set(this.countHostData,2,{ title:'未结算金额',colSpan:3,value:data.data.data.unsettle_amount/100,em:true})
            this.$set(this.countHostData,3,{ title:'已结算金额',colSpan:3,value:data.data.data.settled_amount/100,em:false})
        }else{
            this.$set(this.countHostData,0,{ title:'未结算订单',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,1,{ title:'已结算订单',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,2,{ title:'未结算金额',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,3,{ title:'已结算金额',colSpan:3,value:0,em:false})
        }
    })

    this.getSettleOrderLists({ id:'',order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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

</style>
