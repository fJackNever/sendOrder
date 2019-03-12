<template>
  <div style="padding:0 24px 24px;">
        <Card shadow style="margin-top:10px;">
            <span style="font-size:14px;padding-right:10px;">选择车队</span>
            <Select v-model="teamSelected" style="width:150px;margin-right:20px;" transfer>
                <Option v-for="(item,key) in teamOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <span style="font-size:14px;padding-right:10px;">车队人数</span>
            <InputNumber :min="0" v-model="max"></InputNumber>

            <div style="margin-top:30px;display:flex;align-items:center;">
                <span style="font-size:14px;padding-right:10px;">车队标志</span>
                <div class="demo-upload-list" v-for="item in teamSignList">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                    </div>
                </div>
                <Upload
                    ref="teamSignUpload"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png']"
                    type="drag"
                    action=""
                    :style="{display: teamSignList.length === 1 ? 'none' : 'inline-block' ,width:'58px',marginRight:'20px',}">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="ios-camera" size="20"></Icon>
                    </div>
                </Upload>
            </div>

            <div style="margin-top:30px;">
                <span style="font-size:14px;padding-right:10px;">车队详情</span>
                <Input v-model="desc" type="textarea" style="width:300px;" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入车队详情..."></Input>
            </div>
            
        </Card>
        <Card shadow style="margin-top:30px;">
          <Table border :columns="order_columns" :data="order_data">
              <template slot-scope="{ row }" slot="name">
                  <strong>{{ row.name }}</strong>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                  <Button type="primary" style="margin-right: 5px" @click="new_edit_driver(row.roomId)">详情</Button>
                  <Button type="error" @click="awardTeam(row.roomId)">奖励</Button>
              </template>
          </Table>
          <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
        </Card>
        <Modal title="车队奖励" v-model="awardVisible" :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="120" >
                <FormItem label="奖励金额" prop="teamAward" :label-width="120">
                    <InputNumber :min="0" v-model="formValidate.teamAward"></InputNumber>
                </FormItem>
                <FormItem>
                    <Button type="primary">确定</Button>
                </FormItem>
            </Form>
        </Modal>
  </div>
</template>

<script>
import { Card,Input,Button,Select,Option,Table,Page,Upload,Icon,InputNumber,Modal,Form,FormItem, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'motorcadeAward',
  components: {
    Card,
    Input,
    Button,
    Select,
    Option,
    Table,
    Page,
    Upload,
    Icon,
    InputNumber,
    Modal,
    Form,
    FormItem,
  },
  data () {
    return {
      teamSelected:1,
      teamOptions:[
        {label:'车队1',value:1},
        {label:'车队2',value:2}
      ],
      desc:'',
      max:0,
      teamSignList:[],
      order_columns: [
            {
                title: '司机姓名',
                key: 'name'
            },
            {
                title: '车队名称',
                key: 'roomName'
            },
            {
                title: '车队排名',
                key: 'name'
            },
            {
                title: '司机排名',
                key: 'name'
            },
            {
                title: '今日收入',
                key: 'name'
            },
            {
                title: '本月收入',
                key: 'name'
            },
            {
                title: '收入总数',
                key: 'name'
            },
            {
                title: '加入时间',
                key: 'name'
            },
            {
                title: '奖励金额',
                key: 'max'
            },
            {
                title: '操作',
                slot: 'action',
                width: 200,
                align: 'center'
            }
        ],
        order_data: [],
        awardVisible:false,
        formValidate:{
            teamAward:0
        },
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
    }
  },
  methods: {
    ...mapActions([
      'getRoomList',
      'delRoom',
    ]),
    handleView(){

    },
    new_edit_driver(index){
        this.$router.push({path:'newEditDriver',query:{id:index}});
    },
    awardTeam(index){
        this.awardVisible = true
    //   this.delRoom({ roomId:index }).then((data) => {
    //         if(data.data.code === 1){
    //             for(let i=0; i<this.order_data.length;){
    //                 if(index === this.order_data[i].roomId){
    //                     this.order_data.splice(i,1)
    //                 }else{
    //                     i++
    //                 }
    //             }
    //             this.$Message.success('删除成功!');
    //         }else{
    //             this.$Notice.warning({
    //                 title: '嘀友提醒',
    //                 desc: data.data.msg
    //             });
    //         }
    //         return data;
    //     }).then((data)=>{
    //         if(data.data.code === 1){
    //             if(this.order_data.length === 0){
    //                 if(this.pageCurrent > 1){
    //                     this.getRoomList({ roomId:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
    //                         this.order_data = []
    //                         for(let i=0; i<data.data.data.rows.length; i++){
    //                             this.$set(this.order_data,i,data.data.data.rows[i])
    //                         }
    //                         this.$refs.Pagination.currentPage = this.pageCurrent - 1;
    //                         this.pageTotal = data.data.data.total
    //                     })
    //                 }else{
    //                     this.getRoomList({ roomId:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
    //                         this.order_data = []
    //                         for(let i=0; i<data.data.data.rows.length; i++){
    //                             this.$set(this.order_data,i,data.data.data.rows[i])
    //                         }
    //                         this.pageTotal = data.data.data.total
    //                     })
    //                 }
                    
    //             }
    //         }
    //     })
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
