<template>
  <div style="padding:0 24px 24px;">

      <Card shadow title="发单配置(距离发单时间多久前的订单可以发出)" style="margin-top:10px;">

            <span style="font-size:14px;">开始时间段段配置</span>
            <InputNumber :min="0" placeholder="请输入小时" v-model="pre_create_order_limit_time" style="width:80px;margin-left:10px;"></InputNumber>
            <span style="font-size:14px;padding-left:10px;padding-right:10px;">小时至</span>
            <InputNumber :min="0" placeholder="请输入小时" v-model="pre_create_order_time" style="width:80px;"></InputNumber>
            <span style="font-size:14px;padding-left:10px;">小时之间的订单允许发单</span>

            <Divider />

            <span style="font-size:14px;padding-right:10px;">发单时间段段配置</span>
            <TimePicker @on-change="changeTime" :value="date_val" format="HH:mm:ss" type="timerange" placement="bottom-end" placeholder="请选择注册时间范围" style="width: 200px" transfer></TimePicker>
            <span style="font-size:14px;padding-left:10px;">之间允许调度发单</span>

            <Divider />

            <span style="font-size:14px;padding-right:10px;">	订单价格显示类型</span>
            <Select v-model="priceStatus" style="width:100px;margin-right:10px;" transfer>
                <Option :value="1" >订单原价</Option>
                <Option :value="2" >扣除平台费</Option>
                <Option :value="3" >不显示</Option>
            </Select>
      </Card>

      <Card shadow title="调度员提醒配置" style="margin-top:10px;">

            <div style="margin:15px 0;margin-top:10px;">
                <span style="font-size:14px;padding-right:10px;">客户发布订单提醒</span>
                    <RadioGroup v-model="sendIndentRemind">
                        <Radio :label="0">不提醒</Radio>
                        <Radio :label="1">提醒</Radio>
                    </RadioGroup>
            </div>
            
            <div style="margin:15px 0;">
                <span style="font-size:14px;padding-right:10px;">自动进入抢单池</span>
                <RadioGroup v-model="autoEntrance">
                    <Radio :label="0">否</Radio>
                    <Radio :label="1" >是</Radio>
                </RadioGroup>
            </div>
            
            <div style="margin:15px 0;">
                <span style="font-size:14px;padding-right:10px;">发布订单(分钟)</span>
                <InputNumber :min="0" placeholder="请输入时间" v-model="sendTime" style="width:80px;margin-left:20px;"></InputNumber>
                <span style="font-size:14px;padding-left:10px;">{{ autoEntrance === 0 ? '后自动提醒调度':'后自动进入订单池成为抢单模式并提醒调度' }}</span>
            </div>

            <div style="margin:15px 0;">
                <span style="font-size:14px;padding-right:10px;">订单在订单池(分钟)</span>
                <InputNumber :min="0" placeholder="请输入时间" v-model="stayTime" style="width:80px;margin-left:20px;"></InputNumber>
                <span style="font-size:14px;padding-left:10px;">后没有司机抢单，自动提醒调度</span>
            </div>

      </Card>
      
      <Card shadow title="司机订单提醒配置" style="margin-top:10px;">
            <div style="margin:15px 0;margin-top:10px;">
                <span style="font-size:14px;padding-right:10px;">短信提醒</span>
                <RadioGroup v-model="msgRemind">
                    <Radio :label="0">不提醒</Radio>
                    <Radio :label="1">提醒</Radio>
                </RadioGroup>
            </div>

            <div style="margin:15px 0;">
                <span style="font-size:14px;padding-right:10px;">距离订单开始时间提前</span>
                <InputNumber :min="0" placeholder="请输入时间" v-model="aheadRemindTime" style="width:80px;margin-left:20px;"></InputNumber>
                <span style="font-size:14px;padding-left:10px;">提醒司机做单</span>
            </div>

      </Card>

      <Card shadow title="改派配置" style="margin-top:10px;">
            <div style="margin:15px 0;margin-top:10px;">
                <span style="font-size:14px;padding-right:10px;">是否允许司机改派</span>
                <RadioGroup v-model="permission">
                    <Radio :label="0">否</Radio>
                    <Radio :label="1">是</Radio>
                </RadioGroup>
            </div>

            <div style="margin:15px 0;">
                <span style="font-size:14px;padding-right:10px;">订单提前时间</span>
                <InputNumber :min="0" placeholder="请输入时间" v-model="aheadTime" style="width:80px;margin-left:20px;"></InputNumber>
                <span style="font-size:14px;padding-left:10px;">可以改派</span>
            </div>

      </Card>

      <Card shadow title="" style="margin-top:10px;text-align:center;">
            <Button type="primary" @click="saveIndent()">保存</Button>
      </Card>

  </div>
</template>

<script>
import { Row,Card,Input,Button,Select,Option,RadioGroup,Radio,InputNumber,TimePicker,Divider, } from 'iview'
import { mapActions } from 'vuex' 
export default {
  name: 'indentDefaultConfigure',
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
    Divider,
  },
  data () {
    return {
      cardTitle:'订单基础配置',
      pre_create_order_limit_time:0,
      pre_create_order_time:0,
      date_val:['00:00:00','00:00:00'],
      sendIndentRemind:1,
      autoEntrance:1,
      sendTime:0,
      stayTime:0,
      msgRemind:1,
      aheadRemindTime:0,
      permission:1,
      aheadTime:0,
      priceStatus:1
    }
  },
  methods: {
    ...mapActions([
      'setCompanyOrderBaseConfig',
      'getCompanyOrderBaseConfig',
    ]),
    changeTime(val){
        this.$set(this.date_val,0,val[0])
        this.$set(this.date_val,1,val[1])
    },
    saveIndent(){

        let remindTime = '',autoRemindTime = '';

        if(this.autoEntrance === 1){
            remindTime = ''
            autoRemindTime = this.sendTime;
        }else{
            remindTime = this.sendTime;
            autoRemindTime = '';
        }
        this.setCompanyOrderBaseConfig({
            pre_create_order_limit_time:this.pre_create_order_limit_time,
            pre_create_order_time: this.pre_create_order_time,
            create_order_start_time:this.date_val[0],
            create_order_end_time:this.date_val[1],
            create_order_notice:this.sendIndentRemind,
            is_auto_change_order:this.autoEntrance,
            create_order_notice_time:remindTime,
            auto_change_order_time:autoRemindTime,
            order_wait_limit_time:this.stayTime,
            driver_mess_order_notice:this.msgRemind,
            distance_order_start_time:this.aheadRemindTime,
            is_allow_driver_change_order:this.permission,
            can_change_order_time:this.aheadTime,
            order_amount_show:this.priceStatus,
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
    },

  },
  mounted () {
    this.getCompanyOrderBaseConfig().then((data) => {
        this.pre_create_order_limit_time = data.data.data.pre_create_order_limit_time
        this.pre_create_order_time = data.data.data.pre_create_order_time
        this.$set(this.date_val,0,data.data.data.create_order_start_time)
        this.$set(this.date_val,1,data.data.data.create_order_end_time)
        this.sendIndentRemind = data.data.data.create_order_notice
        this.autoEntrance = data.data.data.is_auto_change_order
        if(data.data.data.is_auto_change_order === 1){
            this.sendTime = data.data.data.auto_change_order_time
        }else{
            this.sendTime = data.data.data.create_order_notice_time
        }
        this.stayTime = data.data.data.order_wait_limit_time
        this.msgRemind = data.data.data.driver_mess_order_notice
        this.aheadRemindTime = data.data.data.distance_order_start_time
        this.permission = data.data.data.is_allow_driver_change_order
        this.aheadTime = data.data.data.can_change_order_time
        this.priceStatus = data.data.data.order_amount_show
    })
  },
  activated () {
    this.getCompanyOrderBaseConfig().then((data) => {
        this.pre_create_order_limit_time = data.data.data.pre_create_order_limit_time
        this.pre_create_order_time = data.data.data.pre_create_order_time
        this.$set(this.date_val,0,data.data.data.create_order_start_time)
        this.$set(this.date_val,1,data.data.data.create_order_end_time)
        this.sendIndentRemind = data.data.data.create_order_notice
        this.autoEntrance = data.data.data.is_auto_change_order
        if(data.data.data.is_auto_change_order === 1){
            this.sendTime = data.data.data.auto_change_order_time
        }else{
            this.sendTime = data.data.data.create_order_notice_time
        }
        this.stayTime = data.data.data.order_wait_limit_time
        this.msgRemind = data.data.data.driver_mess_order_notice
        this.aheadRemindTime = data.data.data.distance_order_start_time
        this.permission = data.data.data.is_allow_driver_change_order
        this.aheadTime = data.data.data.can_change_order_time
        this.priceStatus = data.data.data.order_amount_show
    })
  }
}
</script>

<style lang="less">

</style>
