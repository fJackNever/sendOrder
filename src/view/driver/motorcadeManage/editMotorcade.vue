<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" >

                <FormItem label="车队名称" prop="teamName">
                    <Input v-model="formValidate.teamName" placeholder="请输入车队名称" style="width:200px"></Input>
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

                <FormItem label="车队状态" prop="teamStatus" >
                    <Select v-model="formValidate.teamStatus" placeholder="请选择车队状态" style="width:200px">
                        <Option :value="0">停用</Option>
                        <Option :value="1">正常</Option>
                    </Select>
                </FormItem>

                <FormItem>
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
                <Button type="primary" style="margin-right: 5px" @click="new_edit_driver(row.driver_id)">详情</Button>
                <Button type="error" style="margin-right: 5px" @click="remove(row.driver_id)">踢出</Button>
                <!-- <Button type="error" @click="forbidChat(row.roomId)">禁言一天</Button> -->
            </template>
          </Table>
          <Page ref="PaginaMembertion" :total="pageMemberTotal" show-sizer show-total @on-change="changeMemberPage" @on-page-size-change="changeMemberPageSize" style="margin-top:15px;"/>
      </Card>

      <!-- <Card shadow style="margin-top:30px;" title="车队消息">
          <Table border :columns="msg_order_columns" :data="msg_order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
          </Table>
          <Page ref="PaginaMsgtion" :total="pageMsgTotal" show-sizer show-total @on-change="changeMsgPage" @on-page-size-change="changeMsgPageSize" style="margin-top:15px;"/>
      </Card> -->
  </div>
</template>

<script>
import { Row,Card,Input,Button,Select,Option,Form,FormItem,InputNumber,Upload,Icon,Modal,Table,Page, } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment'   
export default {
  name: 'editMotorcade',
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
          teamName: '',
          desc:'',
          max:0,
      },
      visible:false,
      allPicModal:'',
      teamSignList:[],
      taskIdArr:[],
      cardTitle:'修改车队',
      ruleValidate: {},
      member_order_columns: [
            {
                title: '司机姓名',
                key: 'id_name'
            },
            {
                title: '今日收入',
                key: 'today_amount'
            },
            {
                title: '本月收入',
                key: 'month_amount'
            },
            {
                title: '收入总数',
                key: 'total_amount'
            },
            {
                title: '加入时间',
                key: 'create_time'
            },
            {
                title: '操作',
                slot: 'action',
                width: 250,
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
                key: 'teamName'
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
        permission_arr:'',
    }
  },
  methods: {
    ...mapActions([
      'uploadPic',
      'addFleet',
      'editFleet',
      'getFleetLists',
      'removeMemberToFleet',
    ]),
    handleView(){
        this.allPicModal = url;
        this.visible = true;
    },
    handleRemove(){
        this.teamSignList.splice(0,1)
    },
    handleFormatError(){
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleTeamSignFront(file){
        let check = this.teamSignList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.teamSignList,0, {
                        url:res.data.data.path,
                        name:'teamSignPic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    handleSubmit (name) {
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[4000].length; i++){
                if(this.permission_arr[4000][i] === '4008'){
                    per_val = 4008
                }
            }
            if(per_val === 4008){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let teamSignPic;
                        if(this.teamSignList && this.teamSignList.length>0){
                            teamSignPic = this.teamSignList[0].url
                        }else{
                            teamSignPic = ''
                        }

                        this.editFleet({ 
                            id:this.$route.query.id,
                            fleet_name: this.formValidate.teamName || 0,
                            comment:this.formValidate.desc || 0,
                            logo_path:teamSignPic,
                            max_member:this.formValidate.max || 0,
                            status:this.formValidate.teamStatus,
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
                    } else {
                        this.$Message.error('提交失败!');
                    }
                })
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let teamSignPic;
                    if(this.teamSignList && this.teamSignList.length>0){
                        teamSignPic = this.teamSignList[0].url
                    }else{
                        teamSignPic = ''
                    }

                    this.editFleet({ 
                        id:this.$route.query.id,
                        fleet_name: this.formValidate.teamName || 0,
                        comment:this.formValidate.desc || 0,
                        logo_path:teamSignPic,
                        max_member:this.formValidate.max || 0,
                        status:this.formValidate.teamStatus,
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
                } else {
                    this.$Message.error('提交失败!');
                }
            })
        }
        
    },
    new_edit_driver(index){
        this.$router.push({path:'editDriver',query:{id:index}});
    },
    remove(id){
        let per_val = '';
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[4000].length; i++){
                if(this.permission_arr[4000][i] === '4005'){
                    per_val = 4005
                }
            }
            if(per_val === 4005){
                this.removeMemberToFleet({ fleet_id:this.$route.query.id,driver_id:id }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('踢出成功!');
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                }).then(()=>{
                    this.getFleetLists({ id:this.$route.query.id,status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:10 }).then((data) => {
                        this.member_order_data = []
                        for(let i=0; i<data.data.data.rows[0].member.length; i++){
                            this.$set(this.member_order_data,i,data.data.data.rows[0].member[i])
                        }
                        //this.pageMemberTotal = data.data.data.total
                    })
                })
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.removeMemberToFleet({ fleet_id:this.$route.query.id,driver_id:id }).then((data) => {
                if(data.data.code === 1){
                    this.$Message.success('踢出成功!');
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            }).then(()=>{
                this.getFleetLists({ id:this.$route.query.id,status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:10 }).then((data) => {
                    this.member_order_data = []
                    for(let i=0; i<data.data.data.rows[0].member.length; i++){
                        this.$set(this.member_order_data,i,data.data.data.rows[0].member[i])
                    }
                    //this.pageMemberTotal = data.data.data.total
                })
            })
        }

    },
    // forbidChat(){

    // },
    changeMemberPage(page){
        this.pageMemberCurrent = page;
        this.getFleetLists({ id:this.$route.query.id,status:'',fleet_no:'',fleet_name:'',search:'',offset:(page-1)*this.pageMemberSize,limit:this.pageMemberSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changeMemberPageSize(size){
        this.pageMemberSize = size;
        this.getFleetLists({ id:this.$route.query.id,status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:size }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageMemberTotal = data.data.data.total
        })
    },
    changeMsgPage(){

    },
    changeMsgPageSize(){

    }
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
        this.getFleetLists({ id:this.$route.query.id,status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:10 }).then((data) => {
            this.$set(this.formValidate,'teamName',data.data.data.rows[0].fleet_name);
            this.$set(this.formValidate,'desc',data.data.data.rows[0].comment);
            if(data.data.data.rows[0].logo_path){
                this.$set(this.teamSignList,0,{ url:data.data.data.rows[0].logo_path, name:'teamSignPic1' });
            }
            this.$set(this.formValidate,'max',data.data.data.rows[0].max_member);
            this.$set(this.formValidate,'teamStatus',data.data.data.rows[0].status);

            for(let i=0; i<data.data.data.rows[0].member.length; i++){
                this.$set(this.member_order_data,i,data.data.data.rows[0].member[i])
            }
            this.pageMemberTotal = data.data.data.total
        })
  },
  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
        this.getFleetLists({ id:this.$route.query.id,status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:10 }).then((data) => {
            this.$set(this.formValidate,'teamName',data.data.data.rows[0].fleet_name);
            this.$set(this.formValidate,'desc',data.data.data.rows[0].comment);
            if(data.data.data.rows[0].logo_path){
                this.$set(this.teamSignList,0,{ url:data.data.data.rows[0].logo_path, name:'teamSignPic1' });
            }
            this.$set(this.formValidate,'max',data.data.data.rows[0].max_member);
            this.$set(this.formValidate,'teamStatus',data.data.data.rows[0].status);

            for(let i=0; i<data.data.data.rows[0].member.length; i++){
                this.$set(this.member_order_data,i,data.data.data.rows[0].member[i])
            }
            this.pageMemberTotal = data.data.data.total
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
