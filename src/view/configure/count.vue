<template>
  <div style="padding:0 24px 24px;">

      <Card shadow title="发单配置(距离发单时间多久前的订单可以发出)" style="margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">订单改派费</span>
            <InputNumber :min="0" placeholder="请输入费用" v-model="changeCharge" style="width:80px;"></InputNumber>
      </Card>

      <Card shadow title="订单平台费" style="margin-top:10px;">
            <div style="margin:15px 0;margin-top:10px;">
                <span style="font-size:14px;padding-right:10px;">平台费类型</span>
                <Select v-model="chargeType" placeholder="请选择类型" style="width:100px;" @on-change="changeType">
                    <Option :value="1">固定平台费</Option>
                    <Option :value="2">百分比平台费</Option>
                </Select>
            </div>

            <div style="margin:15px 0;">
                <span style="font-size:14px;padding-right:10px;" v-if="chargeType === 1">平台费价格( 元 )</span>
                <InputNumber :min="0" placeholder="请输入价格" v-model="platformPrice" v-if="chargeType === 1" style="width:80px;"></InputNumber>

                <span style="font-size:14px;padding-right:10px;" v-if="chargeType === 2">平台费率( % )</span>
                <InputNumber :min="0" placeholder="请输入费率" v-model="platformRate" v-if="chargeType === 2" style="width:80px;"></InputNumber>
            </div>
      </Card>
      
      <Card shadow title="商家取消费" style="margin-top:10px;">
        <div style="margin:15px 0;margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">商家取消订单费用</span>
            <InputNumber :min="0" placeholder="请输入费用" v-model="cancelCharge" style="width:80px;"></InputNumber>
        </div>
        <div style="margin:15px 0;margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">商家在订单开始时间</span>
            <InputNumber :min="0" placeholder="请输入时间" v-model="cancelTime" style="width:80px;"></InputNumber>
            <span style="font-size:14px;padding-left:10px;">多少分钟前可以取消订单</span>
        </div>
      </Card>

      <Card shadow title="自动结算周期" style="margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">订单完成后</span>
            <InputNumber :min="0" placeholder="请输入费用" v-model="countDay" style="width:80px;"></InputNumber>
            <span style="font-size:14px;padding-left:10px;">天自动结算</span>
      </Card>

      <Card shadow title="提现配置" style="margin-top:10px;margin-bottom:20px;">
            <span style="font-size:14px;padding-right:10px;">提现时间</span>
            <Select v-model="withdrawType" placeholder="请选择类型" style="width:100px;margin-right:10px;" @on-change="changeWithdrawType">
                <Option :value="1">按月</Option>
                <Option :value="2">按周</Option>
                <Option :value="3">按天</Option>
            </Select>

            <Select v-model="monthVal" placeholder="请选择时间" style="width:100px;margin-right:10px;" v-if="withdrawType === '1'">
                <Option :value="0">1号</Option>
                <Option :value="1">2号</Option>
                <Option :value="2">3号</Option>
                <Option :value="3">4号</Option>
                <Option :value="4">5号</Option>
                <Option :value="5">6号</Option>
                <Option :value="6">7号</Option>
                <Option :value="7">8号</Option>
                <Option :value="8">9号</Option>
                <Option :value="9">10号</Option>
                <Option :value="10">11号</Option>
                <Option :value="11">12号</Option>
                <Option :value="12">13号</Option>
                <Option :value="13">14号</Option>
                <Option :value="14">15号</Option>
                <Option :value="15">16号</Option>
                <Option :value="16">17号</Option>
                <Option :value="17">18号</Option>
                <Option :value="18">19号</Option>
                <Option :value="19">20号</Option>
                <Option :value="20">21号</Option>
                <Option :value="21">22号</Option>
                <Option :value="22">23号</Option>
                <Option :value="23">24号</Option>
                <Option :value="24">25号</Option>
                <Option :value="25">26号</Option>
                <Option :value="26">27号</Option>
                <Option :value="27">28号</Option>
            </Select>
            <Select v-model="weekVal" placeholder="请选择时间" style="width:100px;margin-right:10px;"  v-if="withdrawType === 2">
                <Option :value="0">周一</Option>
                <Option :value="1">周二</Option>
                <Option :value="2">周三</Option>
                <Option :value="3">周四</Option>
                <Option :value="4">周五</Option>
                <Option :value="5">周六</Option>
                <Option :value="6">周日</Option>
            </Select>
            <TimePicker type="timerange" @on-change="changeTime" :value="date_val" placement="bottom-end" placeholder="请选择时间" style="width:168px;margin-right:10px;" ></TimePicker>
            
      </Card>

      <Card shadow style="text-align:center;">
          <Button type="primary" @click="saveChange()">保存</Button>
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
      chargeType:1,
      platformPrice:0,
      platformRate:0,
      cancelCharge:0,
      cancelTime:0,
      countDay:0,
      withdrawType:1,
      monthVal:0,
      weekVal:0,
      date_val:['00:00:00','00:00:00'],
    }
  },
  methods: {
    ...mapActions([
      'setCompanySettleConfig',
      'getCompanySettleConfig',
    ]),
    changeType(val){
        this.chargeType = val;
    },
    changeWithdrawType(val){
        this.withdrawType = val
    },
    changeTime(val){
        this.$set(this.date_val,0,val[0])
        this.$set(this.date_val,1,val[1])
    },
    saveChange(){
      let plat_amount_rate,cash_date;
      if(this.chargeType === 1){
        plat_amount_rate = this.platformPrice * 100
      }else{
        plat_amount_rate = this.platformRate
      }
      if(this.withdraw_type === 1){
        this.setCompanySettleConfig({
          change_order_amount:this.changeCharge * 100,
          plat_amount_type: this.chargeType,
          plat_amount:plat_amount_rate,
          customer_cancel_amount: this.cancelCharge * 100,
          customer_cancel_time: this.cancelTime,
          auto_settle: this.countDay,
          withdraw_type: this.withdrawType,
          withdraw_date: this.monthVal,
          withdraw_start_time:this.date_val[0],
          withdraw_end_time:this.date_val[1],
          }).then((data) => {
          if(data.data.code === 1){
              this.$Message.success('保存成功!');
          }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: data.data.msg
              });
          }
        })
      }else if(this.withdraw_type === 2){
        this.setCompanySettleConfig({
          change_order_amount:this.changeCharge * 100,
          plat_amount_type: this.chargeType,
          plat_amount:plat_amount_rate,
          customer_cancel_amount: this.cancelCharge * 100,
          customer_cancel_time: this.cancelTime,
          auto_settle: this.countDay,
          withdraw_type: this.withdrawType,
          withdraw_date: this.weekVal,
          withdraw_start_time:this.date_val[0],
          withdraw_end_time:this.date_val[1],
          }).then((data) => {
          if(data.data.code === 1){
              this.$Message.success('保存成功!');
          }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: data.data.msg
              });
          }
        })
      }else{
        this.setCompanySettleConfig({
          change_order_amount:this.changeCharge * 100,
          plat_amount_type: this.chargeType,
          plat_amount:plat_amount_rate,
          customer_cancel_amount: this.cancelCharge * 100,
          customer_cancel_time: this.cancelTime,
          auto_settle: this.countDay,
          withdraw_type: this.withdrawType,
          withdraw_date: '',
          withdraw_start_time:this.date_val[0],
          withdraw_end_time:this.date_val[1],
          }).then((data) => {
          if(data.data.code === 1){
              this.$Message.success('保存成功!');
          }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: data.data.msg
              });
          }
        })
      }
    }
  },
  mounted () {
    this.getCompanySettleConfig().then((data) => {
        this.changeCharge = data.data.data.change_order_amount/100
        this.chargeType = data.data.data.plat_amount_type
        if(data.data.data.plat_amount_type === 1){
          this.platformPrice = data.data.data.plat_amount/100
        }else{
          this.platformRate = data.data.data.plat_amount
        }
        this.cancelCharge = data.data.data.customer_cancel_amount/100
        this.cancelTime = data.data.data.customer_cancel_time
        this.countDay = data.data.data.auto_settle

        this.withdrawType = data.data.data.withdraw_type

        if(data.data.data.withdraw_type === 1){
          this.monthVal = data.data.data.withdraw_date
        }else if(data.data.data.withdraw_type === 2){
          this.weekVal = data.data.data.withdraw_date
        }

        this.$set(this.date_val,0,data.data.data.withdraw_start_time)
        this.$set(this.date_val,1,data.data.data.withdraw_end_time)
    })
  },
  activated () {
    this.getCompanySettleConfig().then((data) => {
        this.changeCharge = data.data.data.change_order_amount/100
        this.chargeType = data.data.data.plat_amount_type
        if(data.data.data.plat_amount_type === 1){
          this.platformPrice = data.data.data.plat_amount/100
        }else{
          this.platformRate = data.data.data.plat_amount
        }
        this.cancelCharge = data.data.data.customer_cancel_amount/100
        this.cancelTime = data.data.data.customer_cancel_time
        this.countDay = data.data.data.auto_settle

        this.withdrawType = data.data.data.withdraw_type

        if(data.data.data.withdraw_type === 1){
          this.monthVal = data.data.data.withdraw_date
        }else if(data.data.data.withdraw_type === 2){
          this.weekVal = data.data.data.withdraw_date
        }

        this.$set(this.date_val,0,data.data.data.withdraw_start_time)
        this.$set(this.date_val,1,data.data.data.withdraw_end_time)
    })
  }
}
</script>

<style lang="less">

</style>
