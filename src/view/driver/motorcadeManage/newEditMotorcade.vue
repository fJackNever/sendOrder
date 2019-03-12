<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" >

                <FormItem label="车队名称" prop="roomName">
                    <Input v-model="formValidate.roomName" placeholder="请输入车队名称" style="width:200px"></Input>
                </FormItem>

                <FormItem label="车队详情" prop="desc">
                    <Input v-model="formValidate.desc" type="textarea" style="width:300px;" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入车队详情..."></Input>
                </FormItem>

                <FormItem label="车队标志" prop="teamSignPic" >
                    <div class="demo-upload-list" v-for="item in teamSignList">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(1)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="teamSignUpload"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png']"
                        :on-format-error="handleFormatError"
                        :before-upload="handleTeamSignFront"
                        type="drag"
                        action=""
                        :style="{display: teamSignList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                </FormItem>
                <Modal title="图片预览" v-model="visible" :footer-hide="true">
                    <img :src="allPicModal" v-if="visible" style="width: 100%">
                </Modal>

                <FormItem label="车队人数" prop="max">
                    <InputNumber :min="0" v-model="formValidate.max"></InputNumber>
                </FormItem>

                <FormItem label="舔加车队成员" prop="addMember">
                    <Select v-model="addMember" multiple style="width:260px">
                        <Option v-for="item in memberList" :value="item.value" :key="item.value">{{ item.name }}  {{ item.carNum }}  {{ item.brandModel }}</Option>
                    </Select>
                </FormItem>

                <FormItem v-if="add_edit === 1">
                    <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
                </FormItem>
                <FormItem v-if="add_edit === 2">
                    <Button type="primary" @click="handleSubmit('formValidate')">修改</Button>
                </FormItem>

            </Form>
      </Card>
      <Card shadow style="margin-top:30px;" title="车队成员">
          <Table border :columns="member_order_columns" :data="member_order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="new_edit_driver(row.roomId)">详情</Button>
                <Button type="error" @click="remove(row.roomId)">踢出</Button>
                <Button type="error" @click="forbidChat(row.roomId)">禁言一天</Button>
            </template>
          </Table>
          <Page ref="Pagination" :total="pageMemberTotal" show-sizer show-total @on-change="changeMemberPage" @on-page-size-change="changeMemberPageSize" style="margin-top:15px;"/>
      </Card>

      <Card shadow style="margin-top:30px;" title="车队消息">
          <Table border :columns="msg_order_columns" :data="msg_order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
          </Table>
          <Page ref="Pagination" :total="pageMsgTotal" show-sizer show-total @on-change="changeMsgPage" @on-page-size-change="changeMsgPageSize" style="margin-top:15px;"/>
      </Card>
  </div>
</template>

<script>
import { Row,Card,Input,Button,Select,Option,Form,FormItem,InputNumber,Upload,Icon,Modal,Table,Page, } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment'   
export default {
  name: 'newEditMotorcade',
  components: {
    Row,
    Card,
    Input,
    Button,
    Select,
    Option,
    Form,
    FormItem,
    InputNumber,
    Upload,
    Icon,
    Modal,
    Table,
    Page,
  },
  data () {
    return {
      formValidate: {
          roomName: '',
          desc:'',
          max:0,
      },
      memberList:[
          {
              value:1,
              name:'成风',
              carNum:'沪A123456',
              brandModel:'东风日产12'
          },
          {
              value:2,
              name:'小城',
              carNum:'沪A134234',
              brandModel:'东风日产34'
          }
      ],
      visible:false,
      allPicModal:'',
      teamSignList:[],
      taskIdArr:[],
      add_edit:1,
      cardTitle:'创建车队',
      ruleValidate: {},
      member_order_columns: [
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
        member_order_data:[],
        pageMemberTotal:0,
        pageMemberSize:10,
        pageMemberCurrent:1,
        msg_order_columns:[
            {
                title: '司机姓名',
                key: 'name'
            },
            {
                title: '车队名称',
                key: 'roomName'
            },
            {
                title: '发布时间',
                key: 'name'
            },
            {
                title: '发布内容',
                key: 'name'
            },
        ],
        msg_order_data:[],
        pageMsgTotal:0,
        pageMsgSize:10,
        pageMsgCurrent:1,
    }
  },
  methods: {
    ...mapActions([
      'addRoom',
      'editRoom',
      'getRoomList',
    ]),
    handleTeamSignFront(){

    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(this.add_edit === 1){
                    this.addRoom({ 
                        roomName: this.formValidate.roomName,
                        max:this.formValidate.max || 0,
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('新增成功!');
                            this.$router.push({path:'motorcadeManage'});
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else{
                    this.editRoom({ 
                        roomId:this.$route.query.id,
                        roomName: this.formValidate.roomName,
                        max:this.formValidate.max || 0,
                     }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            this.$router.push({path:'motorcadeManage'});
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }
            } else {
                this.$Message.error('提交失败!');
            }
        })
    },
    new_edit_driver(){

    },
    remove(){

    },
    forbidChat(){

    },
    changeMemberPage(){

    },
    changeMemberPageSize(){

    },
    changeMsgPage(){

    },
    changeMsgPageSize(){

    }
  },
  mounted () {
        if(this.$route.query.id){
            this.add_edit = 2;
            this.cardTitle = '修改车队';
            this.getRoomList({ roomId:this.$route.query.id,search:'',offset:0,limit:10 }).then((data) => {
                this.$set(this.formValidate,'roomName',data.data.data.rows[0].roomName);
                this.$set(this.formValidate,'max',data.data.data.rows[0].max);
            })
        }else{
            this.add_edit = 1;
        }
  },
  activated () {
        if(this.$route.query.id){
            this.add_edit = 2;
            this.cardTitle = '修改车队';
            this.getRoomList({ roomId:this.$route.query.id,search:'',offset:0,limit:10 }).then((data) => {
                this.$set(this.formValidate,'roomName',data.data.data.rows[0].roomName);
                this.$set(this.formValidate,'max',data.data.data.rows[0].max);
            })
        }else{
            this.add_edit = 1;
            this.cardTitle = '创建车队'; 
        }
  }
}
</script>

<style lang="less">

</style>
