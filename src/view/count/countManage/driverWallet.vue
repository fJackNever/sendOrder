<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="countHostData" :style="{ cursor:'pointer'}"></topHost>
    <Card shadow style="margin-top:10px;">

        <span style="font-size:14px;padding-right:10px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        :data="driverGather"
        @on-search="searchName"
        placeholder="请输入司机姓名"
        style="width:200px;" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <AutoComplete
        v-model="driverPhone"
        :data="driverPhoneGather"
        @on-search="searchPhone"
        placeholder="请输入乘客手机号"
        style="width:200px" transfer></AutoComplete>

        <Button type="success" style="margin-left:30px;">查询</Button>

    </Card>
    <Card shadow style="margin-top:30px;">
    <Table border :columns="order_columns" :data="order_data">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" style="margin-right: 5px" @click="check_record(index+1,'count')">收支记录</Button>
            <Button type="error" @click="penalty_award(index+1,1)">罚款</Button>
            <Button type="error" @click="penalty_award(index+1,2)">罚款</Button>
        </template>
    </Table>
    </Card>
    <Modal :title="modalTitle" v-model="visible" :footer-hide="true">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >
            <FormItem :label="labelTitle" prop="penalty_award_price" :label-width="120">
                <InputNumber :min="0" v-model="formValidate.penalty_award_price"></InputNumber>
            </FormItem>
            <FormItem label="备注" prop="desc" style="width:400px;">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Modal,Form,FormItem,InputNumber, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'driverWallet',
  components: {
    Card,
    Input,
    Button,
    Divider,
    DatePicker,
    Select,
    Option,
    Table,
    AutoComplete,
    topHost,
    Modal,
    Form,
    FormItem,
    InputNumber,
  },
  data () {
    return {
      driverName:'',
      driverGather:[],
      driverPhone:'',
      driverPhoneGather:[],
      countHostData: [
        { title:'所有司机',colSpan:3,value:60,em:true},
        { title:'已结算金额',colSpan:3,value:8,em:true},
        { title:'未结算金额',colSpan:3,value:8,em:true},
      ],
      order_columns: [
            {
                title: '司机姓名',
                key: 'id'
            },
            {
                title: '司机手机号',
                key: 'name'
            },
            {
                title: '司机已结算',
                key: 'name'
            },
            {
                title: '司机已体现',
                key: 'start_address'
            },
            {
                title: '提现中',
                key: 'start_address'
            },
            {
                title: '奖励金额',
                key: 'name'
            },
            {
                title: '罚款金额',
                key: 'telephone'
            },
            {
                title: '钱包余额',
                key: 'status'
            },
            {
                title: '操作',
                slot: 'action',
                width: 230,
                align: 'center'
            }
        ],
        order_data: [],
        visible:false,
        formValidate:{
            autoPrice:0,
        },
        modalTitle:'司机罚款',
        labelTitle:'罚款金额',
    }
  },
  methods: {
    ...mapActions([
      
    ]),
    searchName(value){
      this.driverGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    searchPhone(value){
      this.driverPhoneGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    check_record(index,type){
        this.$router.push({path:'check_indent',query:{id:index,type}});
    },
    penalty_award(index,type){
        this.visible = true;
        if(type === 1){
            this.modalTitle = '司机罚款';
            this.labelTitle = '罚款金额';
        }else{
            this.modalTitle = '司机奖励';
            this.labelTitle = '奖励金额';
        }
    },
    handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    }
  },
  mounted () {
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
