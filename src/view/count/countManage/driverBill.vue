<template>
  <div style="padding:0 24px 24px;">
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;">时间筛选</span>
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

        <span style="font-size:14px;padding-right:10px;padding-left:10px;">司机手机号</span>
        <Input v-model="driverPhone" placeholder="请输入乘客手机号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="find_indent()">查询</Button>

        <Divider />

        <Button type="success" @click="create_bill()">生成结算单</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 10px" @click="edit_indent(row.id)">详情</Button>
                <Button type="error" @click="deleteBill(row.id)">删除</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
    <Modal title="生成结算单" v-model="countVisible" :footer-hide="true">
        <Form ref="formValidate" :model="formValidate" :label-width="120" >
            <FormItem label="指定时间" prop="date_val" :label-width="120">
                <DatePicker type="daterange" @on-change="changeModalDate" :value="formValidate.date_val" transfer :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;"></DatePicker>
            </FormItem>
            <FormItem label="司机姓名" prop="driverName" :label-width="120">
                <AutoComplete
                v-model="formValidate.driverName"
                @on-search="searchModalName"
                @on-select="selectModalName"
                placeholder="请输入司机姓名"
                style="width:200px;" transfer>
                    <Option v-for="(item,index) in driverModalGather" :value="item.id" :key="index" >{{ item.id_name }}</Option>
                </AutoComplete>
            </FormItem>
            <FormItem label="司机手机号" prop="driverPhone" :label-width="120">
                <Input v-model="formValidate.driverPhone" placeholder="请输入司机手机号" style="width:200px"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
            </FormItem>
        </Form>
    </Modal>
    <Modal 
        title="是否删除"
        v-model="deleteVisible" 
        @on-ok="confirmDelete"
        ok-text="是"
        cancel-text="否"
        class="reassignModal"
    >
    </Modal>
  </div>
</template>

<script>
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page,Modal,Form,FormItem } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment' 
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
    Modal,
    Form,
    FormItem
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
                key: 'name',
                width:100,
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
                width: 260,
                align: 'center'
            }
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        driver_id:'',
        permission_arr:'',
        driverPhone:'',
        countVisible:false,
        driverModalGather:[],
        formValidate:{
            date_val:['',''],
            driverName:'',
            driverPhone:'',
        },
        inputNameShake:'',
        inputNameModalShake:'',
        deleteVisible:false,
        deleteId:'',
    }
  },
  methods: {
    ...mapActions([
      'getDriverLists',
      'getDriverReconciliayionLists',
      'createDriverReconciliation',
      'delDriverReconciliation',
      'getDriverId',
    ]),
    changeDate(val){
        this.$set(this.date_val,0,moment(val[0]).format('YYYY-MM-DD'))
        this.$set(this.date_val,1,moment(val[1]).format('YYYY-MM-DD'))
    },
    changeModalDate(val){
        this.$set(this.formValidate.date_val,0,moment(val[0]).format('YYYY-MM-DD'))
        this.$set(this.formValidate.date_val,1,moment(val[1]).format('YYYY-MM-DD'))
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
    find_indent(){
        this.getDriverReconciliayionLists({ id:'',name:this.driverName,telephone:this.driverPhone,start_time:this.date_val[0],end_time:this.date_val[1],search:'',offset:0,limit:10 }).then((data) => {
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
    create_bill(){
        this.countVisible = true;  
    },
    searchModalName(value){
        if(this.inputNameModalShake) clearTimeout(this.inputNameModalShake)
        this.inputNameModalShake = setTimeout(()=>{
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:value,telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                this.driverModalGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.driverModalGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectModalName(val){
        this.getDriverLists({ id:val,fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
            this.$set(this.formValidate,'driverName',data.data.data.rows[0].id_name)
            this.$set(this.formValidate,'driverPhone',data.data.data.rows[0].telephone)
        })
    },
    handleSubmit(name){

        if(this.formValidate.driverPhone !== ''){

            let momGDDate,momEDDate;
            if(this.formValidate.date_val[0]){
                momGDDate = moment(this.formValidate.date_val[0]).format('YYYY-MM-DD')
            }else{
                momGDDate = ''
            }

            if(this.formValidate.date_val[1]){
                momEDDate = moment(this.formValidate.date_val[1]).format('YYYY-MM-DD')
            }else{
                momEDDate = ''
            }

            this.getDriverId({ name:this.formValidate.driverName,telephone:this.formValidate.driverPhone }).then((data) => {
                return data;
            }).then(data=>{
                if(data.data.code === 1){

                    this.createDriverReconciliation({ driver_id:data.data.data.id,start_date:momGDDate,end_date:momEDDate }).then((data) => {
                        return data;
                    }).then(data=>{
                        if(data.data.code === 1){
                            this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
                                if(data.data.code === 1){
                                    this.order_data = [];
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$Message.success('生成成功!');
                                    this.pageTotal = data.data.data.total;
                                    this.countVisible = false;
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
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })

                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '司机姓名和电话号码有误'
                    });
                }
            })
            
        }else{
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: '请填写手机号'
            });
        }
    },
    deleteBill(index){
        this.deleteVisible = true;
        this.deleteId = index;
    },
    confirmDelete(){
        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[6000].length; i++){
                if(this.permission_arr[6000][i] === '6009'){
                    per_val = 6009
                }
            }

            if(per_val === 6009){

                this.delDriverReconciliation({ id:this.deleteId }).then((data) => {
                    if(data.data.code === 1){
                        for(let i=0; i<this.order_data.length;){
                            if(this.deleteId === this.order_data[i].id){
                                this.order_data.splice(i,1)
                            }else{
                                i++
                            }
                        }
                        this.$Message.success('删除成功!');
                        this.deleteVisible = false;
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
                                this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.delDriverReconciliation({ id:this.deleteId }).then((data) => {
                if(data.data.code === 1){
                    for(let i=0; i<this.order_data.length;){
                        if(this.deleteId === this.order_data[i].id){
                            this.order_data.splice(i,1)
                        }else{
                            i++
                        }
                    }
                    this.$Message.success('删除成功!');
                    this.deleteVisible = false;
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
                            this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                this.pageTotal = data.data.data.total
                            })
                        }else{
                            this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',end_time:'',offset:0,limit:this.pageSize }).then((data) => {
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
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
    this.getDriverReconciliayionLists({ id:'',name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
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
