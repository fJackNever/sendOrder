<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" class="indentCard">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="客户名称" prop="cusName">
                        <Input v-model="formValidate.cusName" placeholder="请输入客户名称" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="客户邮箱" prop="mailbox">
                        <Input v-model="formValidate.mailbox" placeholder="请输入客户邮箱" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="对账时间" prop="accountDate">
                        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择对账时间范围" v-model="formValidate.accountDate" style="width: 200px;"></DatePicker>
                    </FormItem>

                    <FormItem label="总计订单数" prop="indentNum">
                        <InputNumber :min="0" v-model="formValidate.indentNum"></InputNumber>
                    </FormItem>

                    <FormItem label="总计金额" prop="indentMoney">
                        <InputNumber :min="0" v-model="formValidate.indentMoney"></InputNumber>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="客户电话" prop="cusPhone">
                        <Input v-model="formValidate.cusPhone" placeholder="请输入客户电话" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="客户地址" prop="cusAddress">
                        <Input v-model="formValidate.cusAddress" placeholder="请输入客户地址" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="支付状态" prop="payStatus">
                        <Input v-model="formValidate.payStatus" placeholder="请输入支付状态" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="确认状态" prop="confirmStatus">
                        <Input v-model="formValidate.confirmStatus" placeholder="请输入确认状态" style="width:200px"></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')" v-if="btn_show">确认收款</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
      </Card>
      
      <Card shadow title="对账单" class="indentCard">
        <div slot="extra">
            <Button type="primary" @click="exportData">导出</Button>
        </div>

        <div class="indext_detail" >

            <span class="indentTitle">客户名称:</span>
            <span class="indentData">{{driver_name}}</span>

            <span class="indentTitle">对账日期:</span>
            <span class="indentData">{{start_date}} - {{end_date}}</span>

            <span class="indentTitle">总订单数:</span>
            <span class="indentData">{{total_indent}}</span>

            <span class="indentTitle">总计金额</span>
            <span class="indentData">{{total_money}}</span>

            <Divider />
        </div>

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
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,InputNumber,Upload,Divider } from 'iview'
import { mapActions } from 'vuex'
import FileSaver from 'file-saver';
export default {
  name: 'edit_count',
  components: {
    Row,
    Col,
    Card,
    Input,
    Button,
    DatePicker,
    Table,
    AutoComplete,
    Form,
    FormItem,
    Modal,
    Icon,
    InputNumber,
    Upload,
    Divider
  },
  data () {
    return {
        btn_show:true,
      cardTitle:'客户对账单详情',
      formValidate: {
          accountDate:['','']
      },
      order_data:[],
      order_columns: [
            {
                title: '订单开始时间',
                key: 'start_time'
            },
            {
                title: '订单结束时间',
                key: 'end_time'
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
                title: '订单价格',
                key: 'amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.amount/100),
                    ]);
                }
            },
            {
                title: '订单类型',
                key: 'order_type',
                render: (h, params) => {
                    return h('div', [
                        h('div',this.getType(params.row.order_type)),
                    ]);
                }
            },
            {
                title: '品牌车型',
                key: 'car_template',
            },
            {
                title: '乘客',
                key: 'passenger_name'
            },
        ],
      evidenceList:[],
      visible:false,
      driver_name:'',
      start_date:'',
      end_date:'',
      total_indent:'',
      total_money:'',
      pageTotal:0,
      pageSize:10,
      pageCurrent:1,
      permission_arr:''
    }
  },
  methods: {
    ...mapActions([
      'getCustomerReconciliayionLists',
      'confirmCustomerReconciliation',
    ]),
    getType(type){
        if(type === 1){
            return '日租'
        }else if(type === 2){
            return '半日租'
        }else{
            return '点对点'
        }
    },
    exportData(){
        this.getCustomerReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:1000000 }).then((data) => {
            let result = data.data.data.rows[0].settles;
            result.push({
                start_time:'客户名称: '+ data.data.data.rows[0].name,
                end_time:'对账日期: '+ data.data.data.rows[0].start_date + ' 至 ' + data.data.data.rows[0].end_date,
                start_address:'总订单数: '+ data.data.data.rows[0].count_order,
                end_address:'总计金额: '+ data.data.data.rows[0].count_amount/100,
                amount:'',
                order_type:'',
                car_template:'',
                passenger_name:'',
            })
            let str = '订单开始时间,订单结束时间,订单起点,订单终点,订单价格,订单类型,品牌车型,乘客';
            for (let i=0; i<result.length; i++) {
                let indent_type = '';

                if(result[i].order_type === 1){
                    indent_type = '日租'
                }else if(result[i].order_type === 2){
                    indent_type = '半日租'
                }else if(result[i].order_type === 3){
                    indent_type = '点对点'
                }else{
                    indent_type = ''
                }

                if(i === result.length-1){
                    str += '\n' +
                    result[i].start_time + ',' +
                    result[i].end_time + ',' +
                    result[i].start_address + ',' +
                    result[i].end_address + ',' +
                    result[i].amount + ',' +
                    indent_type + ',' + 
                    result[i].car_template + ',' +
                    result[i].passenger_name
                }else{
                    str += '\n' +
                    result[i].start_time + ',' +
                    result[i].end_time + ',' +
                    result[i].start_address + ',' +
                    result[i].end_address + ',' +
                    result[i].amount/100 + ',' +
                    indent_type + ',' +
                    result[i].car_template + ',' +
                    result[i].passenger_name
                }
            }
            let exportContent = "\uFEFF";
            let blob = new Blob([exportContent + str], {
                type: "text/plain;charset=utf-8"
            });
            FileSaver.saveAs(blob, "客户对账单列表.xls");

        })
        
    },
    changePage(page){
        this.pageCurrent = page;
        this.getCustomerReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows[0].settles.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[0].settles[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getCustomerReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:size }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows[0].settles.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[0].settles[i])
            }
            this.pageTotal = data.data.data.rows[0].settles_total
        })
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {

                if(this.permission_arr[0] !== '9999'){
                    for(let i=0; i<this.permission_arr.length; i++){
                        if(this.permission_arr[i] === '6008'){
                            per_val = 6008
                        }
                    }
                    if(per_val === 6008){
                        
                        this.confirmCustomerReconciliation({ id:this.$route.query.id }).then((data) => {
                            if(data.data.code === 1){
                                this.$Message.success('确认成功!');
                                this.$router.push({path:'createBill'});
                            }else{
                                this.$Notice.warning({
                                    title: '嘀友提醒',
                                    desc: data.data.msg
                                });
                            }
                            return data;
                        })

                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: '暂无权限访问！'
                        });
                    }
                }else{
                    this.confirmCustomerReconciliation({ id:this.$route.query.id }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('确认成功!');
                            this.$router.push({path:'createBill'});
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                        return data;
                    })
                }
                
            } else {
                this.$Message.error('确认失败');
            }
        })
    },
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
        this.getCustomerReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
            this.$set(this.formValidate,'cusName',data.data.data.rows[0].name);
            this.$set(this.formValidate,'mailbox',data.data.data.rows[0].email);
            this.$set(this.formValidate.accountDate,0,data.data.data.rows[0].start_date);
            this.$set(this.formValidate.accountDate,1,data.data.data.rows[0].end_date);
            this.$set(this.formValidate,'indentNum',data.data.data.rows[0].count_order);
            this.$set(this.formValidate,'indentMoney',data.data.data.rows[0].count_amount/100);
            this.$set(this.formValidate,'payStatus',data.data.data.rows[0].pay_status === 0 ? '未支付':'已支付');
            this.$set(this.formValidate,'confirmStatus',data.data.data.rows[0].confirm_status === 0 ? '未确认':'已确认');
            this.$set(this.formValidate,'cusPhone',data.data.data.rows[0].telephone);
            this.$set(this.formValidate,'cusAddress',data.data.data.rows[0].address);
            
            if(data.data.data.rows[0].confirm_status === 0){
                this.btn_show = true;
            }else{
                this.btn_show = false;
            }

            this.driver_name = data.data.data.rows[0].name;
            this.start_date = data.data.data.rows[0].start_date;
            this.end_date = data.data.data.rows[0].end_date;
            this.total_indent = data.data.data.rows[0].count_order;
            this.total_money = data.data.data.rows[0].count_amount/100;

            for(let i=0; i<data.data.data.rows[0].settles.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[0].settles[i])
            }
            this.pageTotal = data.data.data.rows[0].settles_total
        })
  },
  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
      this.getCustomerReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
            this.$set(this.formValidate,'cusName',data.data.data.rows[0].name);
            this.$set(this.formValidate,'mailbox',data.data.data.rows[0].email);
            this.$set(this.formValidate.accountDate,0,data.data.data.rows[0].start_date);
            this.$set(this.formValidate.accountDate,1,data.data.data.rows[0].end_date);
            this.$set(this.formValidate,'indentNum',data.data.data.rows[0].count_order);
            this.$set(this.formValidate,'indentMoney',data.data.data.rows[0].count_amount/100);
            this.$set(this.formValidate,'payStatus',data.data.data.rows[0].pay_status === 0 ? '未支付':'已支付');
            this.$set(this.formValidate,'confirmStatus',data.data.data.rows[0].confirm_status === 0 ? '未确认':'已确认');
            this.$set(this.formValidate,'cusPhone',data.data.data.rows[0].telephone);
            this.$set(this.formValidate,'cusAddress',data.data.data.rows[0].address);

            if(data.data.data.rows[0].confirm_status === 0){
                this.btn_show = true;
            }else{
                this.btn_show = false;
            }

            this.driver_name = data.data.data.rows[0].name;
            this.start_date = data.data.data.rows[0].start_date;
            this.end_date = data.data.data.rows[0].end_date;
            this.total_indent = data.data.data.rows[0].count_order;
            this.total_money = data.data.data.rows[0].count_amount/100;

            for(let i=0; i<data.data.data.rows[0].settles.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[0].settles[i])
            }
            this.pageTotal = data.data.data.rows[0].settles_total
        })
  }
}
</script>

<style lang="less">
.bm-view {
  width: 100%;
  height: 700px;
}
.indentCard{
    margin-top:10px;
    .cardSlot{
        display: flex;
        .ivu-steps{
            .ivu-steps-main{
                display: block;
                margin-top: 25px;
            }
        }
    }
}

.indentTitle{
    font-size:14px;
    padding-right:10px;
    padding-left:20px;
}
.indentData{
    font-weight: bold;
}

.indentCard{
    .ivu-card-extra{
        top: 8px;
    }
}
</style>
