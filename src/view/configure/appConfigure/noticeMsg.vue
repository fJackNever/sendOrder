<template>
  <div style="padding:0 24px 24px;">
    <Row style="margin-top:10px;">
      <Card shadow>
        <topHost :itemCol="CheckHostData" :style="{ cursor:'pointer'}"></topHost>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">发布日期</span>
        <DatePicker type="daterange" :value="dateRange" :start-date="new Date()" placement="bottom-end" placeholder="请选择发布日期范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Input v-model="searchValue" placeholder="请输入公告标题关键字" style="width:200px;margin-left:30px;"></Input>

        <Button type="success" style="margin-left:30px;" @click="checkNotice()">查询</Button>

        <span style="font-size:14px;padding-right:10px;margin-left:30px;">浏览广告奖励 {{award}} 元</span>
        <Button type="success" style="margin-left:30px;" @click="new_edit_award(1)">设置奖励</Button>

      </Card>
      <Card shadow style="margin-top:30px;">
            <Table border :columns="order_columns" :data="order_data">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" style="margin-right: 5px" @click="new_edit_award(2,index+1)">编辑</Button>
                    <Button type="primary" style="margin-right: 5px" @click="blockUp(index+1)">停用</Button>
                </template>
            </Table>
      </Card>
      <Modal
            v-model="awardModal"
            title="奖励设置"
            :footer-hide="true"
      >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" >

                <FormItem label="当前浏览公告奖励（元）" prop="awardValue">
                    <InputNumber :min="0" v-model="formValidate.awardValue"></InputNumber>
                </FormItem>

                <FormItem v-if="add_edit === 1">
                    <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
                </FormItem>
                <FormItem v-if="add_edit === 2">
                    <Button type="primary" @click="handleSubmit('formValidate')">修改</Button>
                </FormItem>

            </Form>
      </Modal>
    </Row>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Row,Card,Input,Button,Divider,Table,Form,FormItem,Modal,DatePicker,InputNumber, } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment' 
export default {
  name: 'noticeMsg',
  components: {
    Row,
    Card,
    Input,
    Button,
    Divider,
    Table,
    topHost,
    Form,
    FormItem,
    Modal,
    DatePicker,
    InputNumber,
  },
  data () {
    return {
      CheckHostData: [
        { title:'全部公告',colSpan:4,value:60,em:false},
      ],
      award:0,
      dateRange:[moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
      searchValue:'',
      order_columns: [
            {
                title: '公告编号',
                key: 'id'
            },
            {
                title: '公告标题',
                key: 'title'
            },
            {
                title: '公告内容',
                key: 'content',
                render: (h, params) => {
                    return h('div', [
                        h('div', {
                            style: {
                                overflow:'hidden',
                                textOverflow:'ellipsis',
                                whiteSpace:'nowrap'
                            },
                        }, params.row.content),
                    ]);
                }
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', [
                        h('div', params.row.status === 1 ? '正常' : '异常'),
                    ]);
                }
            },
            {
                title: '浏览人数',
                key: 'num'
            },
            {
                title: '操作',
                slot: 'action',
                width: 280,
                align: 'center'
            }
        ],
        order_data: [],
        formValidate:{
            awardValue:0,
        },
        ruleValidate: {
            awardValue: [
                { required: true, message: '请填写奖励', trigger: 'blur' }
            ],
        },
        awardModal:false,
        add_edit:1,
    }
  },
  methods: {
    ...mapActions([
      'getOrderData',
    ]),
    checkNotice(){

    },
    new_edit_award(type,index){
        this.awardModal = true;
        if(index){
            this.add_edit = 2
        }else{
            this.add_edit = 1
        }

    },
    blockUp(index){

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
