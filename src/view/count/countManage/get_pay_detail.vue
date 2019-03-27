<template>
  <div style="padding:0 24px 24px;">
      <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">司机收支类型</span>
        <Select v-model="get_pay_type" style="width:150px;margin-right:10px;" transfer @on-change="changeType">
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in get_pay_options" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机收支记录</span>
        <Select v-model="get_pay_record" style="width:150px;margin-right:10px;" transfer @on-change="changeRecord">
            <Option :value="1">全部</Option>
            <Option :value="2">指定时间段</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">日期范围</span>
        <DatePicker type="daterange" @on-change="changeDate" :disabled="dateDis" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Button type="success" style="margin-left:30px;" @click="penalty_award(driverId,1)">奖励</Button>
        <Button type="success" style="margin-left:30px;" @click="penalty_award(driverId,2)">惩罚</Button>
        
      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
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
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page,Modal,Form,FormItem,InputNumber } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'get_pay_detail',
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
    FormItem,
    InputNumber
  },
  data () {
    return {
      get_pay_type:-1,
      get_pay_options:[
        {label:'订单收入',value:1},
        {label:'奖励收入',value:2},
        {label:'罚款支出',value:3},
        {label:'提现收入',value:4},
      ],
      get_pay_record:1,
      dateDis:true,
      date_val:['',''],
      order_columns: [
            {
                title: '时间',
                key: 'driver_name'
            },
            {
                title: '收支类型',
                key: 'type',
                render: (h, params) => {
                    return h('div', [
                        h('div',this.getType(params.row.type)),
                    ]);
                }
            },
            {
                title: '收支金额',
                key: 'amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.amount/100),
                    ]);
                }
            },
            {
                title: '说明',
                key: 'body'
            },
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        get_pay_type:'',
        visible:false,
        formValidate:{
            penalty_award_price:0,
        },
        ruleValidate:{},
        modalTitle:'司机罚款',
        labelTitle:'罚款金额',
        driverId:'',
    }
  },
  methods: {
    ...mapActions([
      'getDriverInoutLists',
      'rewardDriver',
      'fineDriver',
    ]),
    getType(type){
        if(type === 1){
            return '订单结算'
        }else if(type === 2){
            return '奖励'
        }else if(type === 3){
            return '罚款支出'
        }else if(type === 4){
            return '提现'
        }
    },
    changeType(val){
        this.$set(this.date_val,0,'')
        this.$set(this.date_val,1,'')
        this.get_pay_type = val;
        if(val === -1){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:'',type:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(val === 1){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:1,type:1,id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(val === 2){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:1,type:2,id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(val === 3){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:2,type:3,id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(val === 4){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:1,type:4,id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeRecord(val){
        if(val === 1){
            this.dateDis = true
            this.$set(this.date_val,0,'')
            this.$set(this.date_val,1,'')
        }else{
            this.dateDis = false
        }
    },
    changeDate(date){
        if(this.get_pay_type === -1){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:'',type:'',id_name:'',telephone:'',start_time:date[0],end_time:date[1],offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(this.get_pay_type === 1){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:1,type:1,id_name:'',telephone:'',start_time:date[0],end_time:date[1],offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(this.get_pay_type === 2){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:1,type:2,id_name:'',telephone:'',start_time:date[0],end_time:date[1],offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(this.get_pay_type === 3){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:2,type:3,id_name:'',telephone:'',start_time:date[0],end_time:date[1],offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else if(this.get_pay_type === 4){
            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:1,type:4,id_name:'',telephone:'',start_time:date[0],end_time:date[1],offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    penalty_award(index,type){
        this.visible = true;
        this.penalty_award_id = index;
        this.$refs['formValidate'].resetFields();
        if(type === 1){
            this.penalty_award_type = 1;
            this.modalTitle = '司机奖励';
            this.labelTitle = '奖励金额';
        }else{
            this.penalty_award_type = 2;
            this.modalTitle = '司机罚款';
            this.labelTitle = '罚款金额';
        }
    },
    handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(this.penalty_award_type === 1){
                    this.rewardDriver({ 
                        driver_id:this.$route.query.id,
                        amount: this.formValidate.penalty_award_price * 100,
                        body:this.formValidate.desc
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
                            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:'',type:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
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
                        driver_id:this.$route.query.id,
                        amount: this.formValidate.penalty_award_price * 100,
                        body:this.formValidate.desc
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
                            this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:'',type:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
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
    },
    changePage(page){
        this.pageCurrent = page;
        this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:'',type:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:'',type:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:size }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
  },
  mounted () {
    this.get_pay_type = -1;
    this.get_pay_record = 1;
    this.driverId = this.$route.query.id;
    this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:'',type:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })
  },
  activated () {
    this.citySelected = -1;
    this.indentStatus = -1;
    this.driverId = this.$route.query.id;
    this.getDriverInoutLists({ driver_id:this.$route.query.id,in_out:'',type:'',id_name:'',telephone:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
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
