<template>
  <div style="padding:0 24px 24px;">
        <Card shadow class="checkCard" v-if="driver_news_show">
            <div slot="title">
                司机信息列表
            </div>
            <div slot="extra">
                <Input v-model="driverMsg" placeholder="请输入司机信息" style="width:200px;margin-right:10px;"></Input>
                <Button type="primary" @click="becomeBusyIndent()">成为抢单</Button>
            </div>
            <Table border :columns="order_columns" :data="order_data">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" style="margin-right: 5px" @click="selectAssigned()">选择指派</Button>
                </template>
            </Table>
        </Card>
        <Card shadow class="indentCard" >
            <div slot="title" class="cardSlot">
                <div style="width:200px;margin-top:6px;">{{cardTitle}}</div>
                <Steps :current="current" v-if="check_type === 1">
                    <Step title="步骤1"></Step>
                    <Step title="步骤2"></Step>
                    <Step title="步骤3"></Step>
                    <Step title="步骤4"></Step>
                    <Step title="步骤5"></Step>
                    <Step title="步骤6"></Step>
                    <Step title="步骤7"></Step>
                    <Step title="步骤8"></Step>
                </Steps>
                <Steps :current="current" v-if="check_type === 2">
                    <Step title="步骤1"></Step>
                    <Step title="步骤2"></Step>
                    <Step title="步骤3"></Step>
                </Steps>
            </div>
            <Row>
                <Col span="12">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                        <div style="margin:10px 0;">订单信息</div>
                        <FormItem label="订单类型" prop="indentType">
                            <Select v-model="formValidate.indentType" placeholder="请选择订单类型" style="width:200px">
                                <Option value="1">点对点用车</Option>
                                <Option value="2">日租包车</Option>
                                <Option value="3">半日租包车</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="车型要求" prop="modelRequire">
                            <Select v-model="formValidate.modelRequire" placeholder="请选择车型要求" style="width:200px">
                                <Option value="1">经济型</Option>
                                <Option value="2">舒适型</Option>
                                <Option value="3">商务型</Option>
                                <Option value="4">豪华型</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="订单开始时间" prop="indentStartDate">
                            <DatePicker type="date" placeholder="请选择领证日期" v-model="formValidate.indentStartDate" style="width:200px"></DatePicker>
                        </FormItem>

                        <FormItem label="订单城市" prop="indentCity">
                            <Select v-model="formValidate.indentCity" placeholder="请选择订单城市" style="width:200px">
                                <Option v-for="item in cityArr" :value="item.id" >{{item.name}}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="订单起点" prop="startAddress">
                            <Input v-model="formValidate.startAddress" placeholder="请输入订单起点" style="width:200px"></Input>
                            <Icon type="ios-pin" :size="25" style="margin-left:10px;cursor:pointer;"/>
                        </FormItem>

                        <FormItem label="订单终点" prop="endAddress">
                            <Input v-model="formValidate.endAddress" placeholder="请输入订单终点" style="width:200px"></Input>
                            <Icon type="ios-pin" :size="25" style="margin-left:10px;cursor:pointer;"/>
                        </FormItem>

                        <FormItem label="订单价格" prop="indentPrice">
                            <InputNumber :min="0" v-model="formValidate.indentPrice"></InputNumber>
                        </FormItem>

                        <FormItem label="结算价格" prop="countPrice">
                            <InputNumber :min="0" v-model="formValidate.countPrice"></InputNumber>
                        </FormItem>

                        <div style="margin:10px 0;">乘客信息</div>
                        <FormItem label="乘客称呼" prop="passengerName">
                            <Input v-model="formValidate.passengerName" placeholder="请输入乘客称呼" style="width:200px"></Input>
                        </FormItem>

                        <FormItem label="乘客电话" prop="passengerPhone">
                            <Input v-model="formValidate.passengerPhone" placeholder="请输入乘客电话" style="width:200px"></Input>
                        </FormItem>

                    </Form>
                </Col>
                <Col span="12">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                        <div style="margin:10px 0;">司机信息</div>
                        <FormItem label="司机姓名" prop="driverName">
                            <Input v-model="formValidate.driverName" placeholder="请输入司机姓名" style="width:200px"></Input>
                        </FormItem>

                        <FormItem label="司机电话" prop="driverPhone">
                            <Input v-model="formValidate.driverPhone" placeholder="请输入司机电话" style="width:200px"></Input>
                        </FormItem>

                        <FormItem label="车牌号" prop="carNum">
                            <Input v-model="formValidate.carNum" placeholder="请输入车牌号" style="width:200px"></Input>
                        </FormItem>

                        <FormItem label="品牌车型" prop="brandModel">
                            <Input v-model="formValidate.brandModel" placeholder="请输入品牌车型" style="width:200px"></Input>
                        </FormItem>

                        <FormItem label="用车类型" prop="carType">
                            <Input v-model="formValidate.carType" placeholder="请输入用车类型" style="width:200px"></Input>
                        </FormItem>

                        <FormItem label="车身颜色" prop="carType">
                            <Input v-model="formValidate.carType" placeholder="请输入车身颜色" style="width:200px"></Input>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formValidate')" v-if="deal_button">确认处理</Button>
                        </FormItem>

                    </Form>
                </Col>
            </Row>
        </Card>
        <Card shadow style="margin-top:30px;" >
            <div class="indext_detail" v-if="indext_detail_show">
                <div style="margin:10px 0;">订单详情</div>

                <span class="indentTitle">距离订单开始时间:</span>
                <span class="indentData">还有15分钟</span>

                <span class="indentTitle">订单状态:</span>
                <span class="indentData">司机前往起点接乘客</span>

                <span class="indentTitle">乘车时长:</span>
                <span class="indentData">1小时15分钟</span>

                <span class="indentTitle">乘车里程:</span>
                <span class="indentData">35.6 km</span>

                <span class="indentTitle">司机当前位置</span>
                <Input v-model="driverLocation" placeholder="请输入车牌号" style="width:200px"></Input>

                <span class="indentTitle">距离乘客起始点:</span>
                <span class="indentData">500米</span>
                <span class="indentData" style="padding-left:10px;">5分钟车程</span>

                <Divider />
            </div>

            <baidu-map class="bm-view" center="上海" ak="A1KbCD1wUrTDiAxu46BtmVhI">
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-driving
                    start="广兰路(地铁站)"
                    end="三林(地铁站)"
                    :auto-viewport="true"
                    policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
                    :panel="false"
                    location="上海"
                    :waypoints="[]">
                </bm-driving>
                <bm-marker :position="{lng: 121.540749, lat: 31.159538}" title="三林世博家园b区" :icon="{url: driverLogo, size: {width: 35, height: 30}}"></bm-marker>
            </baidu-map>
        </Card>
        <Modal 
            title="是否成为抢单"
            v-model="busyVisible" 
            @on-ok="confirmBusy"
            @on-cancel="cancelBusy"
            ok-text="是"
            cancel-text="否"
            class="busyModal"
        >
        </Modal>
        <Modal 
            title="是否指派该司机"
            v-model="sendVisible" 
            @on-ok="confirmSend"
            @on-cancel="cancelSend"
            ok-text="是"
            cancel-text="否"
            class="busyModal"
        >
            
        </Modal>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation,BmDriving,BmMarker } from 'vue-baidu-map'
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Form,FormItem,RadioGroup,Radio,Modal,Icon,Steps,Step,InputNumber, } from 'iview'
import { mapActions } from 'vuex'
import driverLogo from '@/assets/images/driver.png'
export default {
  name: 'check_indent',
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
    Form,
    FormItem,
    RadioGroup,
    Radio,
    Modal,
    Icon,
    BaiduMap,
    BmNavigation,
    BmDriving,
    BmMarker,
    Steps,
    Step,
    InputNumber,
  },
  data () {
    return {
      driver_news_show:true,
      driverLogo,
      cardTitle:'查看订单',
      current: 0,
      driverMsg:'',
      order_columns: [
            {
                title: '司机姓名',
                key: 'id'
            },
            {
                title: '品牌车型',
                key: 'name'
            },
            {
                title: '用车类型',
                key: 'name'
            },
            {
                title: '车身颜色',
                key: 'start_address'
            },
            {
                title: '操作',
                slot: 'action',
                width: 100,
                align: 'center'
            }
      ],
      order_data: [],
      formValidate: {
          indentType: '1',
          indentStartDate: '',
          startAddress: '',
          endAddress: '',
          indentPrice: '',
          modelRequire: '1',
          indentCity:1,
          passengerName: '',
          passengerPhone: '',
      },
      cityArr:[
          { id:1,name:'上海' },
          { id:2,name:'南京' }
      ],
      ruleValidate: {

      },
      busyVisible:false,
      sendVisible:false,
      deal_button:true,
      indext_detail_show:true,
      driverLocation:'asdpadoasdnoasdnokias哦啊是的念佛阿森纳的',
    }
  },
  methods: {
    becomeBusyIndent(){
        this.busyVisible = true;
    },
    selectAssigned(){

    },
    confirmBusy(){
        this.busyVisible = false;
    },
    cancelBusy(){
        this.busyVisible = false;
    },
    confirmSend(){
        this.sendVisible = false;
    },
    cancelSend(){
        this.sendVisible = false;
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    },
  },
  mounted () {
      if(this.$route.query.type === 'check'){
          this.check_type = 1;
          this.cardTitle = '处理订单';
          this.indext_detail_show = true;
      }else if(this.$route.query.type === 'reassign'){
          this.check_type = 2;
          this.cardTitle = '改派详情';
          this.indext_detail_show = false;
      }else{
          this.check_type = 1;
          this.cardTitle = '订单详情';
          this.indext_detail_show = true;
          this.driver_news_show = false;
          this.deal_button = false;
      }
  },
  activated () {

  }
}
</script>

<style lang="less">
.bm-view {
  width: 100%;
  height: 700px;
}
.checkCard{
    margin-top:10px;
    .ivu-card-head{
        padding:20px 16px;
    }
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
.busyModal{
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

.indentTitle{
    font-size:14px;
    padding-right:10px;
    padding-left:20px;
}
.indentData{
    font-weight: bold;
}
</style>
