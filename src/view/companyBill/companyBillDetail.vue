<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" class="indentCard">
            <Form ref="formValidate" :model="formValidate" :label-width="80" >

                <FormItem label="对账时间" prop="accountDate">
                    <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择对账时间范围" v-model="formValidate.accountDate" style="width: 200px;"></DatePicker>
                </FormItem>

                <FormItem label="总计订单数" prop="indentNum">
                    <InputNumber :min="0" v-model="formValidate.indentNum"></InputNumber>
                </FormItem>

                <FormItem label="总计金额（元）" prop="indentMoney" :label-width="100">
                    <InputNumber :min="0" v-model="formValidate.indentMoney"></InputNumber>
                </FormItem>

                <FormItem label="支付状态" prop="payStatus">
                    <Select v-model="formValidate.payStatus" placeholder="请选择支付状态" style="width:200px" >
                        <Option :value="0" >未支付</Option>
                        <Option :value="1" >已支付</Option>
                    </Select>
                </FormItem>

                <FormItem label="确认状态" prop="confirmStatus">
                    <Select v-model="formValidate.confirmStatus" placeholder="请选择确认状态" style="width:200px" >
                        <Option :value="0" >未确认</Option>
                        <Option :value="1" >已确认</Option>
                    </Select>
                </FormItem>

                
                    <FormItem>
                        <Button type="primary" @click="handleSubmit">确认支付</Button>
                    </FormItem>

            </Form>
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
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,InputNumber,Upload,Divider,Select,Option } from 'iview'
import { mapActions } from 'vuex'
import FileSaver from 'file-saver';
export default {
  name: 'companyBillDetail',
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
    Divider,
    Select,
    Option
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
                title: '订单开始日期',
                key: 'start_date'
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
    }
  },
  methods: {
    ...mapActions([
      'getCustomerReconciliayionLists',
      'payCustomerReconciliation',
    ]),
    exportData(){
        this.getCustomerReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:1000000 }).then((data) => {
            let result = data.data.data.rows[0].settles;
            result.push({
                start_date:'客户名称: '+ data.data.data.rows[0].name,
                start_address:'对账日期: '+ data.data.data.rows[0].start_date + ' 至 ' + data.data.data.rows[0].end_date,
                end_address:'总订单数: '+ data.data.data.rows[0].count_order,
                amount:'总计金额: '+ data.data.data.rows[0].count_amount/100,
                passenger_name:''
            })
            let str = '订单开始日期,订单起点,订单终点,订单价格,乘客';
            for (let i=0; i<result.length; i++) {
                if(i === result.length-1){
                    str += '\n' +
                    result[i].start_date + ',' +
                    result[i].start_address + ',' +
                    result[i].end_address + ',' +
                    result[i].amount + ',' +
                    result[i].passenger_name
                }else{
                    str += '\n' +
                    result[i].start_date + ',' +
                    result[i].start_address + ',' +
                    result[i].end_address + ',' +
                    result[i].amount/100 + ',' +
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

                this.payCustomerReconciliation({ id:this.$route.query.id }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('确认成功!');
                        this.$router.push({path:'companyBill'});
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                    return data;
                })
                
    },
  },
  mounted () {
        this.getCustomerReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {
            this.$set(this.formValidate.accountDate,0,data.data.data.rows[0].start_date);
            this.$set(this.formValidate.accountDate,1,data.data.data.rows[0].end_date);
            this.$set(this.formValidate,'indentNum',data.data.data.rows[0].count_order);
            this.$set(this.formValidate,'indentMoney',data.data.data.rows[0].count_amount/100);
            this.$set(this.formValidate,'payStatus',data.data.data.rows[0].pay_status);
            this.$set(this.formValidate,'confirmStatus',data.data.data.rows[0].confirm_status);
            
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
      this.getCustomerReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',pay_status:'',confirm_status:'',start_time:'',end_time:'',offset:0,limit:10 }).then((data) => {

            this.$set(this.formValidate.accountDate,0,data.data.data.rows[0].start_date);
            this.$set(this.formValidate.accountDate,1,data.data.data.rows[0].end_date);
            this.$set(this.formValidate,'indentNum',data.data.data.rows[0].count_order);
            this.$set(this.formValidate,'indentMoney',data.data.data.rows[0].count_amount/100);
            this.$set(this.formValidate,'payStatus',data.data.data.rows[0].pay_status);
            this.$set(this.formValidate,'confirmStatus',data.data.data.rows[0].confirm_status);


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
