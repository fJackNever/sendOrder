<template>
  <div style="padding:0 24px 24px;">
    <Card shadow :title="cardTitle" class="indentCard">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >
                    
                    <FormItem label="司机姓名" prop="driver_name">
                        <Input v-model="formValidate.driver_name" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="车牌号" prop="licensePlateNum">
                        <Input v-model="formValidate.licensePlateNum" placeholder="请输入车牌号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="对账时间" prop="date_val">
                        <DatePicker type="daterange" :value="formValidate.date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;" transfer></DatePicker>
                    </FormItem>

                    <FormItem label="总订单数" prop="total_indent" >
                        <Input v-model="formValidate.total_indent" placeholder="请输入车架号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="总计金额" prop="total_money">
                        <Input v-model="formValidate.total_money" placeholder="请输入车身颜色" style="width:200px"></Input>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="司机电话" prop="driver_phone">
                        <Input v-model="formValidate.driver_phone" placeholder="请输入车身颜色" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="司机性别" prop="sex" :label-width="120" >
                        <RadioGroup v-model="formValidate.sex">
                            <Radio :label="0">女</Radio>
                            <Radio :label="1">男</Radio>
                        </RadioGroup>
                    </FormItem>

                </Form>
            </Col>
        </Row>
    </Card>

    <Card shadow title="对账单" class="indentCard">
        <div slot="extra">
            <Button type="primary" @click="exportData">导出</Button>
        </div>

        <div class="indext_detail">

            <span class="indentTitle">司机姓名:</span>
            <span class="indentData">{{driver_name}}</span>

            <span class="indentTitle">车牌号:</span>
            <span class="indentData">{{car_num}}</span>

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
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,Upload,Select,Option,RadioGroup,Radio,Divider,Page } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment'
import FileSaver from 'file-saver';
export default {
  name: 'driver_bill_detail',
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
    Upload,
    Select,
    Option,
    RadioGroup,
    Radio,
    Divider,
    Page,
  },
  data () {
    return {
      cardTitle:'司机帐单详情',
      formValidate: {
          date_val:['','']
      },
      ruleValidate: {},
      visible:false,
      driveList:[],
      perCarList:[],
      brandModelArr:[],
      driver_info_show:true,
      driver_name:'',
      car_num:'',
      start_date:'',
      end_date:'',
      total_indent:'',
      total_money:'',
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
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
    }
  },
  methods: {
    ...mapActions([
      'getDriverReconciliayionLists',
      'getCarTemplateLists',
      'addCar',
      'editCar',
      'getCarLists',
    ]),
    exportData(){
        this.getDriverReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:1000000 }).then((data) => {
            let result = data.data.data.rows[0].settles;
            result.push({
                start_date:'司机姓名: '+ data.data.data.rows[0].name,
                start_address:'车牌号: '+ data.data.data.rows[0].car_no,
                end_address:'对账日期: '+ data.data.data.rows[0].start_date + ' 至 ' + data.data.data.rows[0].end_date,
                amount:'总订单数: '+ data.data.data.rows[0].count_order,
                passenger_name:'总计金额: '+ data.data.data.rows[0].count_amount/100
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
            FileSaver.saveAs(blob, "司机对账单列表.xls");

        })
        
    },
    changePage(page){
        this.pageCurrent = page;
        this.getDriverReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',start_time:'',end_time:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows[0].settles.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[0].settles[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getDriverReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:size }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows[0].settles.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[0].settles[i])
            }
            this.pageTotal = data.data.data.rows[0].settles_total
        })
    },

  },
  mounted () {

            this.getDriverReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
                this.$set(this.formValidate,'driver_name',data.data.data.rows[0].name);
                this.$set(this.formValidate,'licensePlateNum',data.data.data.rows[0].car_no);
                this.$set(this.formValidate.date_val,0,data.data.data.rows[0].start_date);
                this.$set(this.formValidate.date_val,1,data.data.data.rows[0].end_date);
                this.$set(this.formValidate,'total_indent',data.data.data.rows[0].count_order);
                this.$set(this.formValidate,'total_money',data.data.data.rows[0].count_amount/100);
                this.$set(this.formValidate,'driver_phone',data.data.data.rows[0].telephone);
                this.$set(this.formValidate,'sex',data.data.data.rows[0].sex);

                this.driver_name = data.data.data.rows[0].name;
                this.car_num = data.data.data.rows[0].car_no;
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

             this.getDriverReconciliayionLists({ id:this.$route.query.id,name:'',telephone:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {
                this.$set(this.formValidate,'driver_name',data.data.data.rows[0].name);
                this.$set(this.formValidate,'licensePlateNum',data.data.data.rows[0].car_no);
                this.$set(this.formValidate.date_val,0,data.data.data.rows[0].start_date);
                this.$set(this.formValidate.date_val,1,data.data.data.rows[0].end_date);
                this.$set(this.formValidate,'total_indent',data.data.data.rows[0].count_order);
                this.$set(this.formValidate,'total_money',data.data.data.rows[0].count_amount/100);
                this.$set(this.formValidate,'driver_phone',data.data.data.rows[0].telephone);
                this.$set(this.formValidate,'sex',data.data.data.rows[0].sex);

                this.driver_name = data.data.data.rows[0].name;
                this.car_num = data.data.data.rows[0].car_no;
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
        top: 6px;
    }
}
</style>
