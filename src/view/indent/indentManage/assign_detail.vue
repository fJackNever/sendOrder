<template>
  <div style="padding:0 24px 24px;">
    <Card shadow style="margin-top:10px;">

        <span style="font-size:14px;padding-right:10px;margin-left:10px;">关键词</span>
        <AutoComplete
        v-model="driverAuto"
        @on-search="searchAuto"
        placeholder="司机姓名，车牌号或品牌车型"
        style="width:200px;" transfer>
            <Option v-for="(item,index) in autoGather" :value="item.driver_name" :key="index" >{{ item.driver_name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">车身颜色</span>
        <Input v-model="car_color" placeholder="请输入车身颜色" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="find_indent()">查询</Button>

        <Divider />
    </Card>
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" @click="assignOrder(row.id)" v-if="row.is_order < 1">选择指派</Button>
                <Button type="primary" v-if="row.is_order === 1" disabled>已指派</Button>
            </template>
        </Table>
        <!-- <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/> -->
    </Card>
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
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page,Modal } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'assign_detail',
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
    Page,
    Modal,
  },
  data () {
    return {
      driverAuto:'',
      autoGather:[],
      order_columns: [
            {
                title: '司机姓名',
                key: 'driver_name'
            },
            {
                title: '品牌车型',
                key: 'car_template',
            },
            {
                title: '用车类型',
                key: 'use_car_type_name',
            },
            {
                title: '车身颜色',
                key: 'car_color',
            },
            {
                title: '操作',
                slot: 'action',
                width: 200,
                align: 'center'
            }
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        driver_id:'',
        permission_arr:'',
        driverPhone:'',
        inputNameShake:'',
        sendVisible:false,
        car_color:''
    }
  },
  methods: {
    ...mapActions([
      'getDriverLists',
      'getDriverReconciliayionLists',
      'createDriverReconciliation',
      'orderToDriver',
      'getOrderDriverLists',
    ]),
    searchAuto(value){
      if(this.inputNameShake) clearTimeout(this.inputNameShake)
        this.inputNameShake = setTimeout(()=>{
            this.getOrderDriverLists({ order_id:this.$route.query.id,key_words:value,car_color:'' }).then((data) => {
                this.autoGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.autoGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    find_indent(){
        this.getOrderDriverLists({ order_id:this.$route.query.id,key_words:this.driverAuto,car_color:this.car_color }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    assignOrder(index){
        this.driver_id = index
        this.sendVisible = true;
    },
    confirmSend(){
        this.orderToDriver({ entity_id:this.$route.query.order_entity_id,driver_id:this.driver_id }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('指派成功!');
                this.sendVisible = false;
                this.$router.push({path:'check_indent',query:{id:this.$route.query.id}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    cancelSend(){
        this.sendVisible = false;
    },
    changePage(page){
        this.pageCurrent = page;
        this.getOrderDriverLists({ order_id:this.$route.query.id,offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getOrderDriverLists({ order_id:this.$route.query.id,offset:0,limit:size }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
  },
  mounted () {
        this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
        this.getOrderDriverLists({ order_id:this.$route.query.id,key_words:'',car_color:'' }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
  },
  activated () {
        this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
        this.getOrderDriverLists({ order_id:this.$route.query.id,key_words:'',car_color:'' }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total;
            }else{
                this.order_data = [];
                this.pageTotal = 0;
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
  },
}
</script>

<style lang="less">
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
</style>
