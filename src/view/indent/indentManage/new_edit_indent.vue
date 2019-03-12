<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" class="indentCard">
        <div v-if="add_edit === 2" slot="title" class="cardSlot">
            <div style="width:200px;margin-top:6px;">{{cardTitle}}</div>
            <Steps :current="current">
                <Step title="步骤1"></Step>
                <Step title="步骤2"></Step>
                <Step title="步骤3"></Step>
                <Step title="步骤4"></Step>
                <Step title="步骤5"></Step>
                <Step title="步骤6"></Step>
                <Step title="步骤7"></Step>
                <Step title="步骤8"></Step>
            </Steps>
        </div>
        <Row>
            <Col span="8">
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

                    <FormItem label="客户名称" prop="cusName">
                        <Input v-model="formValidate.cusName" placeholder="请输入客户名称" style="width:200px"></Input>
                    </FormItem>


                    <div style="margin:10px 0;">乘客信息</div>
                    <FormItem label="乘客称呼" prop="passengerName">
                        <Input v-model="formValidate.passengerName" placeholder="请输入乘客称呼" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="乘客电话" prop="passengerPhone">
                        <Input v-model="formValidate.passengerPhone" placeholder="请输入乘客电话" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="注意事项" prop="desc" style="width:400px;">
                        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入注意事项"></Input>
                    </FormItem>

                    <FormItem v-if="add_edit === 1">
                        <Button type="primary" @click="handleSubmit('formValidate')">新增</Button>
                    </FormItem>

                    <FormItem v-if="add_edit === 2">
                        <Button type="primary" @click="handleSubmit('formValidate')">修改</Button>
                    </FormItem>

                </Form>
            </Col>
            <Col span="16">
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
            </Col>
        </Row>
      </Card>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation,BmDriving,BmMarker } from 'vue-baidu-map'
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Form,FormItem,RadioGroup,Radio,Modal,Icon,Steps,Step,InputNumber, } from 'iview'
import { mapActions } from 'vuex'
import driverLogo from '@/assets/images/driver.png'
export default {
  name: 'editIndent',
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
      driverLogo,
      cardTitle:'新增订单',
      add_edit:1,
      current: 0,
      formValidate: {
          indentType: '1',
          indentStartDate: '',
          startAddress: '',
          endAddress: '',
          indentPrice: '',
          cusName:'',
          modelRequire: '1',
          indentCity:1,
          passengerName: '',
          passengerPhone: '',
          desc: '',
      },
      cityArr:[
          { id:1,name:'上海' },
          { id:2,name:'南京' }
      ],
      ruleValidate: {

      },
    }
  },
  methods: {
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
      if(this.$route.query.id){
          this.add_edit = 2;
          this.cardTitle = '修改订单';
      }else{
          this.add_edit = 1;
          this.cardTitle = '新增订单';
      }
  },
  activated () {
      if(this.$route.query.id){
          this.add_edit = 2;
          this.cardTitle = '修改订单';
      }else{
          this.add_edit = 1;
          this.cardTitle = '新增订单';
      }
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
</style>
