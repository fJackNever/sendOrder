<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="countHostData" :style="{ cursor:'pointer'}"></topHost>
    <Card shadow style="margin-top:10px;">

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

        <Button type="success" style="margin-left:30px;" @click="find_indent()">查询</Button>

    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 10px" @click="get_pay_record(row.driver_id)">收支记录</Button>
                <Button type="success" style="margin-right: 10px" @click="penalty_award(row.driver_id,1)">奖励</Button>
                <Button type="error" @click="penalty_award(row.driver_id,2)">罚款</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
    <Modal :title="modalTitle" v-model="visible" :footer-hide="true">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >
            <FormItem :label="labelTitle" prop="penalty_award_price" :label-width="120">
                <InputNumber :min="0" v-model="formValidate.penalty_award_price"></InputNumber>
            </FormItem>
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
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Modal,Form,FormItem,InputNumber,Page, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'driverWallet',
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
      driverPhone:'',
      countHostData: [
        { title:'所有司机',colSpan:3,value:60,em:true},
        { title:'已结算金额',colSpan:3,value:8,em:true},
        { title:'未结算金额',colSpan:3,value:8,em:true},
      ],
      order_columns: [
            {
                title: '司机姓名',
                key: 'driver_name',
                width:100,
            },
            {
                title: '司机手机号',
                key: 'telephone'
            },
            {
                title: '司机已结算',
                key: 'settled_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.settled_amount/100),
                    ]);
                }
            },
            {
                title: '司机未结算',
                key: 'unsettle_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.unsettle_amount/100),
                    ]);
                }
            },
            {
                title: '司机已提现',
                key: 'withdrawed_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.withdrawed_amount/100),
                    ]);
                }
            },
            {
                title: '提现中',
                key: 'withdrawing_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.withdrawing_amount/100),
                    ]);
                }
            },
            {
                title: '奖励金额',
                key: 'reward_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.reward_amount/100),
                    ]);
                }
            },
            {
                title: '罚款金额',
                key: 'fine_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.fine_amount/100),
                    ]);
                }
            },
            {
                title: '钱包余额',
                key: 'amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.amount/100),
                    ]);
                }
            },
            {
                title: '操作',
                slot: 'action',
                width: 280,
                align: 'center'
            }
        ],
        order_data: [],
        visible:false,
        formValidate:{
            penalty_award_price:0,
        },
        ruleValidate:{},
        modalTitle:'司机罚款',
        labelTitle:'罚款金额',
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        penalty_award_id:'',
        penalty_award_type:1,
        permission_arr:'',
    }
  },
  methods: {
    ...mapActions([
      'getDriverAmountLists',
      'getDriverLists',
      'rewardDriver',
      'fineDriver',
      'getSettleHost'
    ]),
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
        this.getDriverAmountLists({ driver_id:'',id_name:this.driverName,telephone:this.driverPhone,offset:0,limit:10 }).then((data) => {
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
    get_pay_record(index){
        this.$router.push({path:'get_pay_detail',query:{id:index}});
    },
    penalty_award(index,type){

        let per_val = '' 
        
        if(type === 1){

            if(this.permission_arr[0] !== '9999'){
                for(let i=0; i<this.permission_arr[6000].length; i++){
                    if(this.permission_arr[6000][i] === '6012'){
                        per_val = 6012
                    }
                }
                if(per_val === 6012){
                    this.visible = true;
                    this.penalty_award_id = index;
                    this.$refs['formValidate'].resetFields();
                    this.penalty_award_type = 1;
                    this.modalTitle = '司机奖励';
                    this.labelTitle = '奖励金额';
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '暂无权限访问！'
                    });
                }
            }else{
                this.visible = true;
                this.penalty_award_id = index;
                this.$refs['formValidate'].resetFields();
                this.penalty_award_type = 1;
                this.modalTitle = '司机奖励';
                this.labelTitle = '奖励金额';
            }

            
        }else{

            if(this.permission_arr[0] !== '9999'){
                for(let i=0; i<this.permission_arr[6000].length; i++){
                    if(this.permission_arr[6000][i] === '6011'){
                        per_val = 6011
                    }
                }
                if(per_val === 6011){
                    this.visible = true;
                    this.penalty_award_id = index;
                    this.$refs['formValidate'].resetFields();
                    this.penalty_award_type = 2;
                    this.modalTitle = '司机罚款';
                    this.labelTitle = '罚款金额';
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '暂无权限访问！'
                    });
                }
            }else{
                this.visible = true;
                this.penalty_award_id = index;
                this.$refs['formValidate'].resetFields();
                this.penalty_award_type = 2;
                this.modalTitle = '司机罚款';
                this.labelTitle = '罚款金额';
            }

            
        }
    },
    changePage(page){
        this.pageCurrent = page;
        this.getDriverAmountLists({ driver_id:'',id_name:'',telephone:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getDriverAmountLists({ driver_id:'',id_name:'',telephone:'',offset:0,limit:size }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(this.penalty_award_type === 1){
                    this.rewardDriver({ 
                        driver_id:this.penalty_award_id,
                        amount: this.formValidate.penalty_award_price * 100,
                        comment:this.formValidate.desc || '',
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('奖励成功!');
                            this.visible = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }

                        return data;
                    }).then(data => {
                        if(data.data.code === 1){
                            this.getDriverAmountLists({ driver_id:'',id_name:'',telephone:'',offset:0,limit:10 }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                        }
                    })
                }else{
                    this.fineDriver({ 
                        driver_id:this.penalty_award_id,
                        amount: this.formValidate.penalty_award_price * 100,
                        comment:this.formValidate.desc || '',
                     }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('罚款成功!');
                            this.visible = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }

                        return data;
                    }).then(data => {
                        if(data.data.code === 1){
                            this.getDriverAmountLists({ driver_id:'',id_name:'',telephone:'',offset:0,limit:10 }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                        }
                    })
                }
            } else {
                this.$Message.error('提交失败!');
            }
        })
    }
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getSettleHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.countHostData,0,{ title:'所有司机',colSpan:3,value:data.data.data.total_driver,em:true})
            this.$set(this.countHostData,1,{ title:'未结算金额',colSpan:3,value:data.data.data.unsettle_amount/100,em:true})
            this.$set(this.countHostData,2,{ title:'已结算金额',colSpan:3,value:data.data.data.settled_amount/100,em:false})
        }else{
            this.$set(this.countHostData,0,{ title:'所有司机',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,1,{ title:'未结算金额',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,2,{ title:'已结算金额',colSpan:3,value:0,em:false})
        }
    })

    this.getDriverAmountLists({ driver_id:'',id_name:'',telephone:'',offset:0,limit:10 }).then((data) => {
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
            this.$set(this.countHostData,0,{ title:'所有司机',colSpan:3,value:data.data.data.total_driver,em:true})
            this.$set(this.countHostData,1,{ title:'未结算金额',colSpan:3,value:data.data.data.unsettle_amount/100,em:true})
            this.$set(this.countHostData,2,{ title:'已结算金额',colSpan:3,value:data.data.data.settled_amount/100,em:false})
        }else{
            this.$set(this.countHostData,0,{ title:'所有司机',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,1,{ title:'未结算金额',colSpan:3,value:0,em:true})
            this.$set(this.countHostData,2,{ title:'已结算金额',colSpan:3,value:0,em:false})
        }
        
    })

    this.getDriverAmountLists({ driver_id:'',id_name:'',telephone:'',offset:0,limit:10 }).then((data) => {
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
