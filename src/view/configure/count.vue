<template>
  <div style="padding:0 24px 24px;">

      <Card shadow title="发单配置(距离发单时间多久前的订单可以发出)" style="margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">订单改派费</span>
            <InputNumber :min="0" placeholder="请输入费用" v-model="changeCharge" style="width:80px;"></InputNumber>
            <Button type="primary" @click="saveChangeCharge()" style="margin-left:20px;">保存</Button>
      </Card>

      <Card shadow title="订单平台费" style="margin-top:10px;">
            <div style="margin:15px 0;margin-top:10px;">
                <span style="font-size:14px;padding-right:10px;">平台费类型</span>
                <Select v-model="chargeType" placeholder="请选择类型" style="width:100px;" @on-change="changeType">
                    <Option value="1">固定平台费</Option>
                    <Option value="2">百分比平台费</Option>
                </Select>
            </div>

            <div style="margin:15px 0;">
                <span style="font-size:14px;padding-right:10px;" v-if="chargeType === '1'">平台费价格( 元 )</span>
                <InputNumber :min="0" placeholder="请输入价格" v-model="platformPrice" v-if="chargeType === '1'" style="width:80px;"></InputNumber>

                <span style="font-size:14px;padding-right:10px;" v-if="chargeType === '2'">平台费率( % )</span>
                <InputNumber :min="0" placeholder="请输入费率" v-model="platformRate" v-if="chargeType === '2'" style="width:80px;"></InputNumber>
            </div>

            <Button type="primary" @click="savePlatformCharge()">保存</Button>
      </Card>
      
      <Card shadow title="商家取消费" style="margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">商家取消订单费用</span>
            <InputNumber :min="0" placeholder="请输入费用" v-model="cancelCharge" style="width:80px;"></InputNumber>
            <Button type="primary" @click="saveCancelCharge()" style="margin-left:20px;">保存</Button>
      </Card>

      <Card shadow title="自动结算周期" style="margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">订单完成后</span>
            <InputNumber :min="0" placeholder="请输入费用" v-model="countDay" style="width:80px;"></InputNumber>
            <span style="font-size:14px;padding-left:10px;">天自动结算</span>
            <Button type="primary" @click="saveChange()" style="margin-left:20px;">保存</Button>
      </Card>

      <Card shadow title="提现配置" style="margin-top:10px;margin-bottom:70px;">
            <span style="font-size:14px;padding-right:10px;">提现时间</span>
            <Select v-model="withdrawType" placeholder="请选择类型" style="width:100px;" @on-change="changeWithdrawType">
                <Option value="1">按月</Option>
                <Option value="2">按周</Option>
                <Option value="3">按天</Option>
            </Select>

            <Select v-model="monthVal" placeholder="请选择时间" style="width:100px;margin:0 10px;" v-if="withdrawType === '1'">
                <Option value="1">1号</Option>
                <Option value="2">2号</Option>
                <Option value="3">3号</Option>
                <Option value="1">1号</Option>
                <Option value="2">2号</Option>
                <Option value="3">3号</Option>
                <Option value="1">1号</Option>
                <Option value="2">2号</Option>
                <Option value="3">3号</Option>
                <Option value="1">1号</Option>
                <Option value="2">2号</Option>
                <Option value="3">3号</Option>
            </Select>
            <TimePicker type="timerange" placement="bottom-end" placeholder="请选择时间" style="width:168px;margin-right:10px;" v-if="withdrawType === '1'"></TimePicker>

            <Select v-model="monthVal" placeholder="请选择时间" style="width:100px;margin:0 10px;"  v-if="withdrawType === '2'">
                <Option value="1">周一</Option>
                <Option value="2">周二</Option>
                <Option value="3">周三</Option>
                <Option value="4">周四</Option>
                <Option value="5">周五</Option>
                <Option value="6">周六</Option>
                <Option value="7">周日</Option>
            </Select>
            <TimePicker type="timerange" placement="bottom-end" placeholder="请选择时间" style="width:168px;margin-right:10px;" v-if="withdrawType === '2'"></TimePicker>

            <TimePicker type="timerange" placement="bottom-end" placeholder="请选择时间" style="width:168px;margin-right:10px;" v-if="withdrawType === '3'"></TimePicker>

            <Button type="primary" @click="saveWithdraw()">保存</Button>
      </Card>

  </div>
</template>

<script>
import { Row,Card,Input,Button,Select,Option,RadioGroup,Radio,InputNumber,TimePicker, } from 'iview'
import { mapActions } from 'vuex' 
export default {
  name: 'countConfigure',
  components: {
    Row,
    Card,
    Input,
    Button,
    Select,
    Option,
    RadioGroup,
    Radio,
    InputNumber,
    TimePicker,
  },
  data () {
    return {
      cardTitle:'订单基础配置',
      changeCharge:0,
      chargeType:'1',
      platformPrice:0,
      platformRate:0,
      cancelCharge:0,
      countDay:0,
      withdrawType:'1',
      monthVal:'1',
    }
  },
  methods: {
    ...mapActions([
      'eidtAuthCarTemplate',
      'getAuthCarTemplateList',
    ]),
    saveChangeCharge(){

    },
    changeType(val){
        this.chargeType = val;
    },

    savePlatformCharge(){

    },
    saveCancelCharge(){

    },
    saveChange(){

    },
    changeWithdrawType(val){
        this.withdrawType = val
    },
    saveWithdraw(){

    },
  },
  mounted () {
    // this.getAuthCarTemplateList({ authCarTemplateId:this.$route.query.id,search:'',offset:0,limit:10 }).then((data) => {
    //     this.$set(this.formValidate,'brand',data.data.data.rows[0].brand)
    //     this.$set(this.formValidate,'model',data.data.data.rows[0].model)
    //     this.$set(this.formValidate,'status',data.data.data.rows[0].status.toString())
    // })
  },
  activated () {
    // this.getAuthCarTemplateList({ authCarTemplateId:this.$route.query.id,search:'',offset:0,limit:10 }).then((data) => {
    //     this.$set(this.formValidate,'brand',data.data.data.rows[0].brand)
    //     this.$set(this.formValidate,'model',data.data.data.rows[0].model)
    //     this.$set(this.formValidate,'status',data.data.data.rows[0].status.toString())
    // })
  }
}
</script>

<style lang="less">

</style>
