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
                    <Button type="success" @click="showAwardModal()">设置加盟推广奖励</Button>
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
        <Card shadow>
            <Table border :columns="order_columns" :data="order_data">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" style="margin-right: 5px" @click="editDriver(index+1)">详情</Button>
                    <Button type="error" @click="remove(index)">删除</Button>
                </template>
            </Table>
        </Card>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { Row,Col,Card,Button,Table,Select,Option,AutoComplete,DatePicker,Divider } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'expandManage',
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
                title: '注册城市',
                key: 'start_address'
            },
            {
                title: '司机姓名',
                key: 'name'
            },
            {
                title: '手机号',
                key: 'telephone'
            },
            {
                title: '车牌号',
                key: 'telephone'
            },
            {
                title: '注册时间',
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
                title: '状态',
                key: 'status'
            },
            {
                title: '操作',
                slot: 'action',
                width: 200,
                align: 'center'
            }
        ],
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

    },
    editDriver(index){
        this.$router.push({path:'checkDriver',query:{id:index,type:'expand'}});
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
