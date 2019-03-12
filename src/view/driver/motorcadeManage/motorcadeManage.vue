<template>
  <div style="padding:0 24px 24px;">
    <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">城市</span>
        <Select v-model="citySelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in cityOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">收入筛选</span>
        <Select v-model="incomeSelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in incomeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">车队名称</span>
        <AutoComplete
        v-model="troopsName"
        :data="troopsGather"
        @on-search="searchName"
        placeholder="请输入车队名称"
        style="width:200px" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">车队编号</span>
        <AutoComplete
        v-model="troopsNum"
        :data="NumGather"
        @on-search="searchNum"
        placeholder="请输入司机手机号"
        style="width:200px" transfer></AutoComplete>

        <Button type="success" style="margin-left:30px;">查询</Button>

        <Divider />
        
        <Button type="primary" style="margin-right:30px;" @click="new_edit_troops(1)">创建车队</Button>
        <Button type="primary" style="margin-right:30px;" @click="skip_award()">车队奖励</Button>

    </Card>
    
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="new_edit_troops(2,row.roomId)">详情</Button>
                <Button type="primary" style="margin-right: 5px" @click="sendMsg(row.roomId)">发送消息</Button>
                <Button type="primary" style="margin-right: 5px" @click="sendAward(row.roomId)">奖励</Button>
                <Button type="error" @click="remove(row.roomId)">解散</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
    <Modal 
    title="发送消息" 
    v-model="msgVisible"
    @on-ok="confirmSend"
    @on-cancel="cancelSend"
    >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >
            <FormItem label="消息" prop="msgContent" :label-width="120">
                <Input v-model="formValidate.msgContent" type="textarea" style="width:300px;" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入消息内容..."></Input>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page,Modal,Form,FormItem, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'motorcadeManage',
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
    Page,
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
      incomeSelected:1,
      incomeOptions:[
        {label:'收入最高',value:1},
        {label:'收入最低',value:2},
      ],
      troopsName:'',
      troopsGather:[],
      troopsNum:'',
      NumGather:[],
      searchValue:'',
      order_columns: [
            {
                title: '车队编号',
                key: 'id'
            },
            {
                title: '车队名称',
                key: 'roomName'
            },
            {
                title: '最大成员数',
                key: 'max'
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', [
                        h('div', params.row.status === 0 ? '停止' : '正常'),
                    ]);
                }
            },
            {
                title: '类型',
                key: 'roomType',
                render: (h, params) => {
                    return h('div', [
                        h('div', params.row.roomType === 1 ? '公开车队' : '私密车队'),
                    ]);
                }
            },
            {
                title: '类型',
                key: 'type',
                render: (h, params) => {
                    return h('div', [
                        h('div', params.row.type === 1 ? '普通车队' : '语音车队'),
                    ]);
                }
            },
            {
                title: '操作',
                slot: 'action',
                width: 400,
                align: 'center'
            }
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        msgVisible:false,
        formValidate:{

        },
        ruleValidate:{
            msgContent: [
              { required: true, message: '请填写消息内容', trigger: 'blur' }
            ],
        }
    }
  },
  methods: {
    ...mapActions([
      'getRoomList',
      'delRoom',
    ]),
    searchName(value){
      this.troopsGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    searchNum(value){
      this.NumGather = !value ? [] : [
          value,
          value + value,
          value + value + value
      ];
    },
    new_edit_troops(type,index){
      if(index){
        this.$router.push({path:'newEditMotorcade',query:{id:index}});
      }else{
        this.$router.push({path:'newEditMotorcade'});
      }
    },
    sendMsg(index){
        this.msgVisible = true;
    },
    sendAward(index){

    },
    skip_award(){
        this.$router.push({path:'motorcadeAward'});
    },
    remove(index){
      this.delRoom({ roomId:index }).then((data) => {
            if(data.data.code === 1){
                for(let i=0; i<this.order_data.length;){
                    if(index === this.order_data[i].roomId){
                        this.order_data.splice(i,1)
                    }else{
                        i++
                    }
                }
                this.$Message.success('删除成功!');
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
            return data;
        }).then((data)=>{
            if(data.data.code === 1){
                if(this.order_data.length === 0){
                    if(this.pageCurrent > 1){
                        this.getRoomList({ roomId:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                            this.order_data = []
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                            this.pageTotal = data.data.data.total
                        })
                    }else{
                        this.getRoomList({ roomId:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                            this.order_data = []
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.pageTotal = data.data.data.total
                        })
                    }
                    
                }
            }
        })
    },
    changePage(page){
        this.pageCurrent = page;
        this.getRoomList({ roomId:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getRoomList({ roomId:'',search:'',offset:0,limit:size }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    confirmSend(){
        this.msgVisible = false;
    },
    cancelSend(){
        this.msgVisible = false;
    }
  },
  mounted () {
    this.getRoomList({ roomId:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
      for(let i=0; i<data.data.data.rows.length; i++){
        this.$set(this.order_data,i,data.data.data.rows[i])
      }
      this.pageTotal = data.data.data.total
    })
  },
  activated () {
    this.getRoomList({ roomId:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
      for(let i=0; i<data.data.data.rows.length; i++){
        this.$set(this.order_data,i,data.data.data.rows[i])
      }
      this.$refs.Pagination.currentPage = 1;
      this.pageTotal = data.data.data.total
    })
  }
}
</script>

<style lang="less">
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
