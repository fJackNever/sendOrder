<template>
  <div style="padding:0 24px 24px;">
    <Card shadow style="margin-top:10px;">
        <!-- <span style="font-size:14px;padding-right:10px;">城市</span>
        <Select v-model="citySelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in cityOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">收入筛选</span>
        <Select v-model="incomeSelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in incomeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Divider /> -->

        <span style="font-size:14px;padding-right:10px;">车队名称</span>
        <AutoComplete
        v-model="troopsName"
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入车队名称"
        style="width:200px" transfer>
            <Option v-for="(item,index) in troopsGather" :value="item.id" :key="index" >{{ item.fleet_name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">车队编号</span>
        <Input v-model="troopsNum" placeholder="请输入车队编号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="findTroops">查询</Button>

        <Divider />
        
        <Button type="primary" style="margin-right:30px;" @click="new_troops('new')">创建车队</Button>

    </Card>
    
    <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 10px" @click="new_edit_troops(2,row.id)">详情</Button>
                <!-- <Button type="primary" style="margin-right: 5px" @click="sendMsg(row.id)">发送消息</Button>
                <Button type="primary" style="margin-right: 5px" @click="sendAward(row.id)">奖励</Button> -->
                <Button type="primary" style="margin-right: 10px" @click="addTeamMember(row.id)">添加成员</Button>
                <Button type="error" @click="remove(row.id)">解散</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
    <Modal 
    title="发送消息" 
    v-model="msgVisible"
    footer-hide
    >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >
            <FormItem label="消息" prop="msgContent" :label-width="120">
                <Input v-model="formValidate.msgContent" type="textarea" style="width:300px;" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入消息内容..."></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
            </FormItem>
        </Form>
    </Modal>
    <Modal 
    title="添加司机"
    v-model="addVisible"
    footer-hide
    >
        <Form ref="formAddValidate" :model="formAddValidate" :label-width="120" >
            <FormItem label="添加车队成员" prop="addMember">

                <AutoComplete
                v-model="formAddValidate.addMember"
                @on-search="searchMember"
                @on-select="selectMember"
                placeholder="请输入成员名称"
                style="width:200px" transfer>
                    <Option v-for="(item,index) in memberList" :value="item.id + ',' + item.id_name" :key="index" >{{ item.id_name }} - {{ item.car_no }} - {{ item.brand_model }}</Option>
                </AutoComplete>

            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formAddValidate')">添加</Button>
            </FormItem>
        </Form>
    </Modal>
    <Modal 
            title="是否解散"
            v-model="dissolveVisible" 
            @on-ok="confirmDissolve"
            ok-text="是"
            cancel-text="否"
            class="reassignModal"
      >
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
      searchValue:'',
      order_columns: [
            {
                title: '车队编号',
                key: 'fleet_no'
            },
            {
                title: '车队名称',
                key: 'fleet_name'
            },
            {
                title: '车队实际人数',
                key: 'member_count'
            },
            {
                title: '车队最大成员数',
                key: 'max_member'
            },
            {
                title: '收入总数',
                key: 'member',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.member.total_amount),
                    ]);
                }
            },
            {
                title: '创建时间',
                key: 'create_time'
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
        },
        addVisible:false,
        formAddValidate:{},
        addMember:'',
        memberList:[],
        fleet_id:'',
        inputNameShake:'',
        permission_arr:'',
        inputMemberShake:'',
        addMemberId:'',
        dissolveVisible:false,
        dissolveId:'',
    }
  },
  methods: {
    ...mapActions([
      'getFleetLists',
      'addMemberToFleet',
      'delFleet',
      'getCanJoinFleetDriverLists',
    ]),
    findTroops(){
        this.getFleetLists({ id:'',status:'',fleet_no:this.troopsNum,fleet_name:this.troopsName,search:'',offset:0,limit:10 }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
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
    searchName(value){
      if(this.inputNameShake) clearTimeout(this.inputNameShake)
        this.inputNameShake = setTimeout(()=>{
            this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:value,search:'',offset:0,limit:10 }).then((data) => {
                this.troopsGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.troopsGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectName(val){
        this.getFleetLists({ id:val,status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:10 }).then((data) => {
            this.troopsName = data.data.data.rows[0].fleet_name
            this.troopsNum = data.data.data.rows[0].fleet_no
        })
    },
    searchMember(value){
      if(this.inputMemberShake) clearTimeout(this.inputMemberShake)
        this.inputMemberShake = setTimeout(()=>{

            this.getCanJoinFleetDriverLists({ id:'',search:value,offset:0,limit:10000 }).then((data) => {
                this.memberList = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.memberList,i,data.data.data.rows[i])
                }
            })

        },600)
    },
    selectMember(val){
        this.$set(this.formAddValidate,'addMember',val.split(",")[1])
        this.addMemberId = val.split(",")[0]
    },
    new_troops(new_type){
        let per_val = '' ;
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[4000].length; i++){
                if(this.permission_arr[4000][i] === '4001'){
                    per_val = 4001
                }
            }
            if(per_val === 4001){
                this.$router.push({path:'newMotorcade',query:{type:new_type}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'newMotorcade',query:{type:new_type}});
        }
    },
    new_edit_troops(type,index){
      let per_val = '' ;
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[4000].length; i++){
                if(this.permission_arr[4000][i] === '4007'){
                    per_val = 4007
                }
            }
            if(per_val === 4007){
                this.$router.push({path:'editMotorcade',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'editMotorcade',query:{id:index}});
        }
    },
    sendMsg(index){

        let per_val = '' 

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr.length; i++){
                if(this.permission_arr[i] === '4002'){
                    per_val = 4002
                }
            }
            if(per_val === 4002){
                this.msgVisible = true;
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.msgVisible = true;
        }
  
    },
    sendAward(index){
        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr.length; i++){
                if(this.permission_arr[i] === '4003'){
                    per_val = 4003
                }
            }
            if(per_val === 4003){
                this.$router.push({path:'motorcadeAward',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'motorcadeAward',query:{id:index}});
        }
    },
    addTeamMember(index){
        let per_val = '';
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[4000].length; i++){
                if(this.permission_arr[4000][i] === '4004'){
                    per_val = 4004
                }
            }
            if(per_val === 4004){
                this.addVisible = true;
                this.fleet_id = index
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.addVisible = true;
            this.fleet_id = index
        }
    },
    handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(name === 'formAddValidate'){
                    this.addMemberToFleet({ 
                        fleet_id: this.fleet_id,
                        driver_id:this.addMemberId,
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('新增成功!');
                            this.addVisible = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                        return data;
                    }).then((data)=>{
                        
                        if(data.data.code === 1){
                            this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                                if(data.data.code === 1){
                                    this.order_data = [];
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.pageTotal = data.data.data.total
                                }else{
                                    this.order_data = [];
                                    this.pageTotal = 0;
                                    this.$Notice.warning({
                                        title: '嘀友提醒',
                                        desc: data.data.msg
                                    });
                                }
                            })
                        }
                        
                    })
                }else{
                    
                }
            } else {
                this.$Message.error('提交失败!');
            }
        })
    },
    remove(index){
        this.dissolveVisible = true;
        this.dissolveId = index
    },
    confirmDissolve(){
        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[4000].length; i++){
                if(this.permission_arr[4000][i] === '4005'){
                    per_val = 4005
                }
            }
            if(per_val === 4005){
                
                this.delFleet({ id:this.dissolveId }).then((data) => {
                    if(data.data.code === 1){
                        for(let i=0; i<this.order_data.length;){
                            if(this.dissolveId === this.order_data[i].id){
                                this.order_data.splice(i,1)
                            }else{
                                i++
                            }
                        }
                        this.$Message.success('解散成功!');
                        this.dissolveVisible = false;
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
                                this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            
            this.delFleet({ id:this.dissolveId }).then((data) => {
                if(data.data.code === 1){
                    for(let i=0; i<this.order_data.length;){
                        if(this.dissolveId === this.order_data[i].id){
                            this.order_data.splice(i,1)
                        }else{
                            i++
                        }
                    }
                    this.$Message.success('解散成功!');
                    this.dissolveVisible = false;
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
                            this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                this.pageTotal = data.data.data.total
                            })
                        }else{
                            this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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

        }
    },
    changePage(page){
        this.pageCurrent = page;
        this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:size }).then((data) => {
            if(data.data.code === 1){
                this.order_data = [];
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
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
    this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
        if(data.data.code === 1){
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
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
    this.getFleetLists({ id:'',status:'',fleet_no:'',fleet_name:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
      if(data.data.code === 1){
            this.order_data = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        }else{
            this.order_data = [];
            this.pageTotal = 0;
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: data.data.msg
            });
        }
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

.reassignModal{
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
