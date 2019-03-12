<template>
    <div style="padding:0 24px 24px;">
        <Card shadow style="margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">城市</span>
            <Select v-model="citySelected" style="width:80px;margin-right:10px;" transfer>
                <Option v-for="(item,key) in cityOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <span style="font-size:14px;padding-right:10px;padding-left:20px;">推荐人手机号</span>
            <AutoComplete
            v-model="driverPhone"
            :data="phoneGather"
            @on-search="searchPhone"
            placeholder="请输入司机手机号"
            style="width:200px" transfer></AutoComplete>

            <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择注册时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

            <Button type="success" style="margin-left:30px;">查询</Button>

            <Divider />

            <Row>
               <Col span="4">
                    <Button type="success" @click="showAwardModal()">招募推广奖励</Button>
               </Col>
               <Col span="20">
                    <div :style="{display:codeShow}">
                        <div id='code'></div>
                        <canvas id="canvas"></canvas>
                        <div style="margin-top:-5px;">http://www.baidu.com</div>
                        <div style="margin-top:-5px;width:132px;text-align:center;">推广二维码</div>
                    </div>
               </Col>
            </Row>
            
        </Card>
        <Modal title="当前招募推广奖励" v-model="visible" :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="120" >
                <FormItem label="注册" prop="registerAward" :label-width="120">
                    <InputNumber :min="0" v-model="formValidate.registerAward"></InputNumber>
                </FormItem>
                <FormItem label="审核通过" prop="passAward" :label-width="120">
                    <InputNumber :min="0" v-model="formValidate.passAward"></InputNumber>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                </FormItem>
            </Form>
        </Modal>
        <Card shadow>
            <Table border :columns="order_columns" :data="order_data">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" style="margin-right: 5px" @click="checkDriver(index+1)">详情</Button>
                    <Button type="error" @click="remove(index)">删除</Button>
                </template>
            </Table>
        </Card>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { Row,Col,Card,Button,Table,Select,Option,AutoComplete,DatePicker,Divider,InputNumber,Modal,Form,FormItem, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'customerRecruit',
  components: {
    Row,
    Col,
    Card,
    Button,
    Table,
    QRCode,
    Select,
    Option,
    AutoComplete,
    DatePicker,
    Divider,
    InputNumber,
    Modal,
    Form,
    FormItem,
  },
  data () {
    return {
      citySelected:1,
      cityOptions:[
        {label:'上海',value:1},
        {label:'南京',value:2}
      ],
      driverPhone:'',
      phoneGather:[],
      order_columns: [
            {
                title: '客户名称',
                key: 'start_address'
            },
            {
                title: '客户电话',
                key: 'name'
            },
            {
                title: '客户联系人',
                key: 'telephone'
            },
            {
                title: '注册时间',
                key: 'telephone'
            },
            {
                title: '状态',
                key: 'time'
            },
            {
                title: '推荐人',
                key: 'time'
            },
            {
                title: '奖励',
                key: 'time'
            },
            {
                title: '操作',
                slot: 'action',
                width: 200,
                align: 'center'
            }
        ],
        visible:false,
        formValidate:{
            registerAward:0,
            passAward:0,
        },
        order_data: [],
        codeShow:'none'
    }
  },
  methods: {
    ...mapActions([
      'getOrderData',
    ]),
    searchPhone(value){
      this.phoneGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    createUrl(){
        let canvas = document.getElementById('canvas')

        QRCode.toCanvas(canvas, 'http://www.baidu.com',(error)=>{
          if (error){
              console.error(error)
          }else{
              this.codeShow = 'block'
          }
        })
    },
    showAwardModal(){
        this.visible = true;
    },
    handleSubmit(name){
        this.visible = false;
    },
    checkDriver(index){
        this.$router.push({name:'checkDriver',query:{id:index}});
    },
    remove(index){

    }
  },
  mounted () {
    this.createUrl();
    // this.getOrderData().then((data) => {
    //   for(let i=0; i<data.data.data.rows.length; i++){
    //     this.$set(this.order_data,i,data.data.data.rows[i])
    //   }
    // })
  }
}
</script>

<style lang="less">

</style>
