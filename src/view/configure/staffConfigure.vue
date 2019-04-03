<template>
  <div style="padding:0 24px 24px;">
    <Row style="margin-top:10px;">
      <Card shadow>
        <topHost :itemCol="CheckHostData" ></topHost>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">员工姓名</span>
        <AutoComplete
        v-model="inputName"
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入员工姓名"
        style="width:200px" transfer>
            <Option v-for="item in nameGather" :value="item.id" :key="item.id" >{{ item.name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">员工手机号</span>
        <Input v-model="inputPhone" placeholder="请输入员工手机号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="check_staff">查询</Button>
        <Button type="success" style="margin-left:30px;" @click="new_edit_staff(1)">新增</Button>

      </Card>
      <Card shadow style="margin-top:30px;">
            <Table border :columns="order_columns" :data="order_data">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" style="margin-right: 5px" @click="new_edit_staff(2,row.id,row.name,row.telephone,row.role,row.password,row.permission,row.status)" v-if="row.type !== 3">编辑</Button>
                    <Button type="primary" style="margin-right: 5px" @click="edit_cus(row.id,row.name,row.telephone,row.role,row.password,row.status)" v-if="row.type === 3">编辑</Button>
                </template>
            </Table>
            <Page ref="Pagination" show-sizer @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
      </Card>
      <Modal
            v-model="staffModal"
            title="员工配置"
            :footer-hide="true"
      >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" >

                <FormItem label="员工姓名" prop="staffName">
                    <Input v-model="formValidate.staffName" placeholder="请输入员工姓名" style="width:200px"></Input>
                </FormItem>

                <FormItem label="员工手机号" prop="staffTelephone">
                    <Input v-model="formValidate.staffTelephone" placeholder="请输入员工手机号" style="width:200px"></Input>
                </FormItem>

                <FormItem label="员工角色" prop="staffRole">
                    <Input v-model="formValidate.staffRole" placeholder="请输入员工角色" style="width:200px"></Input>
                </FormItem>

                <FormItem label="员工密码" prop="staffPwd">
                    <Input type="password" v-model="formValidate.staffPwd" placeholder="请输入员工密码" style="width:200px;margin-right:10px;" :disabled="pwdDisabled"></Input>
                    <Button type="primary" @click="changePwd">修改密码</Button>
                </FormItem>

                <FormItem label="权限" prop="permission" v-if="per_show">
                    <Tree :data="permisssion_arr" show-checkbox multiple @on-check-change="getCheckVal"></Tree>
                </FormItem>

                <FormItem label="状态" prop="status">
                    <Select v-model="formValidate.status" placeholder="请选择状态" style="width:200px">
                        <Option :value="0">停用</Option>
                        <Option :value="1">正常</Option>
                    </Select>
                </FormItem>

                <FormItem v-if="add_edit === 1">
                    <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
                </FormItem>
                <FormItem v-if="add_edit === 2">
                    <Button type="primary" @click="handleSubmit('formValidate')">修改</Button>
                </FormItem>

            </Form>
      </Modal>
      <Modal
            v-model="cusModal"
            title="员工配置"
            :footer-hide="true"
      >
            <Form ref="formCusValidate" :model="formCusValidate" :label-width="160" >

                <FormItem label="员工姓名" prop="staffName">
                    <Input v-model="formCusValidate.staffName" placeholder="请输入员工姓名" style="width:200px"></Input>
                </FormItem>

                <FormItem label="员工手机号" prop="staffTelephone">
                    <Input v-model="formCusValidate.staffTelephone" placeholder="请输入员工手机号" style="width:200px"></Input>
                </FormItem>

                <FormItem label="员工角色" prop="staffRole">
                    <Input v-model="formCusValidate.staffRole" placeholder="请输入员工角色" style="width:200px"></Input>
                </FormItem>

                <FormItem label="员工密码" prop="staffPwd">
                    <Input type="password" v-model="formCusValidate.staffPwd" placeholder="请输入员工密码" style="width:200px;margin-right:10px;" :disabled="pwdCusDisabled"></Input>
                    <Button type="primary" @click="changeCusPwd">修改密码</Button>
                </FormItem>

                <FormItem label="状态" prop="status">
                    <Select v-model="formCusValidate.status" placeholder="请选择状态" style="width:200px">
                        <Option :value="0">停用</Option>
                        <Option :value="1">正常</Option>
                    </Select>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="handleCusSubmit('formCusValidate')">修改</Button>
                </FormItem>

            </Form>
      </Modal>
    </Row>
  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Row,Col,Card,Input,Button,Divider,Select,Option,Table,AutoComplete,Form,FormItem,Modal,Tree,Page } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'staffConfigure',
  components: {
    Row,
    Col,
    Card,
    Input,
    Button,
    Divider,
    Select,
    Option,
    Table,
    AutoComplete,
    topHost,
    Form,
    FormItem,
    Modal,
    Tree,
    Page
  },
  data () {
    return {
      inputName:'',
      nameGather:[],
      inputPhone:'',
      CheckHostData: [],

      order_columns: [
            {
                title: '员工编号',
                key: 'id'
            },
            {
                title: '员工姓名',
                key: 'name'
            },
            {
                title: '员工手机号',
                key: 'telephone'
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', [
                        h('div', params.row.status === 0 ? '停用' : '正常'),
                    ]);
                }
            },
            {
                title: '类型',
                key: 'type',
                render: (h, params) => {
                    return h('div', [
                        h('div', this.getType(params.row.type)),
                    ]);
                }
            },
            {
                title: '操作',
                slot: 'action',
                width: 280,
                align: 'center'
            }
        ],
        order_data: [],
        formValidate: {
          status: '1',
        },
        formCusValidate:{},
        ruleValidate: {},
        staffModal:false,
        cusModal:false,
        add_edit:1,
        indeterminate: false,
        checkAll: false,
        permisssion_arr:[],
        per_val_arr:[],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        edit_id:'',
        inputNameShake:'',
        new_permission_arr:[],
        pwdDisabled:true,
        pwdCusDisabled:true,
        per_show:true,
        permission_arr:''
    }
  },
  methods: {
    ...mapActions([
      'getPermissionLists',
      'addAdminUser',
      'editAdminUser',
      'editAdminUserNoPwdSuper',
      'editAdminUserSuper',
      'editAdminUserNoPwd',
      'getAdminUserLists',
      'getAdminUserHost',
    ]),
    getType(type){
        if(type === 1){
            return '超级管理员'
        }else if(type === 2){
            return '普通管理员'
        }else{
            return '客户'
        }
    },
    searchName(value){
      if(this.inputNameShake) clearTimeout(this.inputNameShake)
        this.inputNameShake = setTimeout(()=>{
            this.getAdminUserLists({ id:'',status:'',search:value,offset:0,limit:10, }).then((data) => {
                this.nameGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.nameGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectName(val){
        this.getAdminUserLists({ id:val,status:'',search:'',offset:0,limit:10, }).then((data) => {
            this.inputName = data.data.data.rows[0].name
            this.inputPhone = data.data.data.rows[0].telephone
        })
    },
    check_staff(){
        this.getAdminUserLists({ id:'',status:'',search:this.inputName,offset:0,limit:10, }).then((data) => {
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
    changePwd(){
        this.pwdDisabled = false;
    },
    changeCusPwd(){
        this.pwdCusDisabled = false;
    },
    new_edit_staff(type,index,name,telephone,role,password,permission,status){
        this.pwdDisabled = true,
        this.staffModal = true;
        if(index){
            this.add_edit = 2;
            this.edit_id = index;
            this.$set(this.formValidate,'staffName',name)
            this.$set(this.formValidate,'staffTelephone',telephone)
            this.$set(this.formValidate,'staffRole',role)
            this.$set(this.formValidate,'staffPwd',password)

            let new_arr = JSON.parse(permission);

            if(JSON.parse(permission)[0] === '9999'){
                this.per_show = false;
            }else{
                this.per_show = true;
            }

            for(let i=0; i<JSON.parse(permission).length; i++){
                this.new_permission_arr.push(JSON.parse(permission)[i])
            }
            
            
            for(let i=0; i<new_arr.length; i++){
                for(let j=0; j<this.permisssion_arr.length; j++){
                    if(new_arr[i] === this.permisssion_arr[j]['code']){
                        
                        this.$set(this.permisssion_arr[j],'checked',true)
                    }

                    for(let k=0; k<this.permisssion_arr[j]['children'].length; k++){
                        if(new_arr[i] === this.permisssion_arr[j]['children'][k]['code']){
                            this.$set(this.permisssion_arr[j]['children'][k],'checked',true)
                        }
                    }
                }
            }

            this.$set(this.formValidate,'status',status)

        }else{

            let per_val = ''
            if(this.permission_arr[0] !== '9999'){
                for(let i=0; i<this.permission_arr[7000].length; i++){
                    if(this.permission_arr[7000][i] === '7005'){
                        per_val = 7005
                    }
                }
                if(per_val === 7005){
                    
                    this.add_edit = 1;
                    this.$refs['formValidate'].resetFields();
                    for(let j=0; j<this.permisssion_arr.length; j++){
                        this.$set(this.permisssion_arr[j],'checked',false)

                        for(let k=0; k<this.permisssion_arr[j]['children'].length; k++){
                            this.$set(this.permisssion_arr[j]['children'][k],'checked',false)
                        }
                    }

                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '暂无权限访问！'
                    });
                }
            }else{
                
                this.add_edit = 1;
                this.$refs['formValidate'].resetFields();
                for(let j=0; j<this.permisssion_arr.length; j++){
                    this.$set(this.permisssion_arr[j],'checked',false)

                    for(let k=0; k<this.permisssion_arr[j]['children'].length; k++){
                        this.$set(this.permisssion_arr[j]['children'][k],'checked',false)
                    }
                }

            }
 
        }

    },
    edit_cus(index,name,telephone,role,password,status){
        this.edit_id = index;
        this.cusModal = true;
        this.pwdCusDisabled = true;
        this.$set(this.formCusValidate,'staffName',name)
        this.$set(this.formCusValidate,'staffTelephone',telephone)
        this.$set(this.formCusValidate,'staffRole',role)
        this.$set(this.formCusValidate,'staffPwd',password)
        this.$set(this.formCusValidate,'status',status)
    },
    handleCusSubmit(name){
        this.$refs[name].validate((valid) => {
            if(this.pwdCusDisabled){
                this.editAdminUserNoPwdSuper({ 
                    id:this.edit_id,
                    name:this.formCusValidate.staffName,
                    telephone:this.formCusValidate.staffTelephone,
                    role:this.formCusValidate.staffRole,
                    status:this.formCusValidate.status,
                    }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('修改成功!');
                        if(this.pointPageCurrent > 1){
                            this.getAdminUserLists({ id:'',status:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize, }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent;
                            })
                        }else{
                            this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:this.pageSize, }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                            })
                        }
                        this.cusModal = false;
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })
            }else{

                this.editAdminUserSuper({ 
                    id:this.edit_id,
                    name:this.formCusValidate.staffName,
                    telephone:this.formCusValidate.staffTelephone,
                    role:this.formCusValidate.staffRole,
                    password:this.formCusValidate.staffPwd,
                    status:this.formCusValidate.status,
                    }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('修改成功!');
                        if(this.pointPageCurrent > 1){
                            this.getAdminUserLists({ id:'',status:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize, }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent;
                            })
                        }else{
                            this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:this.pageSize, }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                            })
                        }
                        this.cusModal = false;
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })

            }
            
        })
    },
    getCheckVal(val){
        //console.log(val)
        for(let i=0; i<val.length; i++){
            this.$set(this.per_val_arr,i,val[i]['code']) 
        }
    },
    handleSubmit(name){
        this.$refs[name].validate((valid) => {
            if(this.add_edit === 1){
                    this.addAdminUser({ 
                        name:this.formValidate.staffName,
                        telephone:this.formValidate.staffTelephone,
                        role:this.formValidate.staffRole,
                        password:this.formValidate.staffPwd,
                        permission:JSON.stringify(this.per_val_arr),
                        status:this.formValidate.status,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('新增成功!');
                            this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:10, }).then((data) => {
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                            this.staffModal = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
            }else{
                
                let newArr = [];
                if(this.per_val_arr && this.per_val_arr.length === 0){
                    if(this.new_permission_arr && this.new_permission_arr.length !== 0){
                        for(let i=0; i<this.new_permission_arr.length; i++){
                            newArr.push(this.new_permission_arr[i])
                        }
                    }
                }else{
                    for(let i=0; i<this.per_val_arr.length; i++){
                        newArr.push(this.per_val_arr[i])
                    }
                }

                if(this.pwdDisabled && !this.per_show){
                    //超级管理员&&未修改密码
                    this.editAdminUserNoPwdSuper({ 
                        id:this.edit_id,
                        name:this.formValidate.staffName,
                        telephone:this.formValidate.staffTelephone,
                        role:this.formValidate.staffRole,
                        status:this.formValidate.status,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            if(this.pointPageCurrent > 1){
                                this.getAdminUserLists({ id:'',status:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize, }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent;
                                })
                            }else{
                                this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:this.pageSize, }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                })
                            }
                            this.staffModal = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else if(!this.pwdDisabled && !this.per_show){
                    //超级管理员&&修改了密码
                    this.editAdminUserSuper({ 
                        id:this.edit_id,
                        name:this.formValidate.staffName,
                        telephone:this.formValidate.staffTelephone,
                        role:this.formValidate.staffRole,
                        password:this.formValidate.staffPwd,
                        status:this.formValidate.status,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            if(this.pointPageCurrent > 1){
                                this.getAdminUserLists({ id:'',status:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize, }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent;
                                })
                            }else{
                                this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:this.pageSize, }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                })
                            }
                            this.staffModal = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else if(this.pwdDisabled && this.per_show){
                    //普通管理员&&未修改密码
                    this.editAdminUserNoPwd({ 
                        id:this.edit_id,
                        name:this.formValidate.staffName,
                        telephone:this.formValidate.staffTelephone,
                        role:this.formValidate.staffRole,
                        permission:JSON.stringify(newArr),
                        status:this.formValidate.status,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            if(this.pointPageCurrent > 1){
                                this.getAdminUserLists({ id:'',status:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize, }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent;
                                })
                            }else{
                                this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:this.pageSize, }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                })
                            }
                            this.staffModal = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else if(!this.pwdDisabled && this.per_show){
                    //普通管理员&&修改了密码
                    this.editAdminUser({ 
                        id:this.edit_id,
                        name:this.formValidate.staffName,
                        telephone:this.formValidate.staffTelephone,
                        role:this.formValidate.staffRole,
                        password:this.formValidate.staffPwd,
                        permission:JSON.stringify(newArr),
                        status:this.formValidate.status,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            if(this.pointPageCurrent > 1){
                                this.getAdminUserLists({ id:'',status:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize, }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent;
                                })
                            }else{
                                this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:this.pageSize, }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                })
                            }
                            this.staffModal = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }
            }
               
        })
    },
    changePage(page){
        this.pageCurrent = page;
        this.getAdminUserLists({ id:'',status:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:size }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
  },
  mounted () {

      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
      
    this.getAdminUserHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.CheckHostData,0,{ title:'在职员工',colSpan:4,value:data.data.data.work,em:true})
            this.$set(this.CheckHostData,1,{ title:'离职员工',colSpan:4,value:data.data.data.leave,em:false})
        }else{
            this.$set(this.CheckHostData,0,{ title:'在职员工',colSpan:4,value:0,em:true})
            this.$set(this.CheckHostData,1,{ title:'离职员工',colSpan:4,value:0,em:false})
        }
        
    })

    this.getPermissionLists().then((data) => {
        if(data.data.code === 1){
            for(let i=0; i<data.data.data.length; i++){
                data.data.data[i]['title'] = data.data.data[i]['name'];
                data.data.data[i]['expand'] = false;
                data.data.data[i]['children'] = data.data.data[i]['child'];
                for(let k=0; k<data.data.data[i]['children'].length; k++){
                    data.data.data[i]['children'][k]['title'] = data.data.data[i]['children'][k]['name']
                }
            }
            return data
        }else{
            return [];
        }
        
    }).then(data=>{
        if(data.data.data && data.data.data.length>0){
            this.permisssion_arr = []
            for(let i=0; i<data.data.data.length; i++){
                this.$set(this.permisssion_arr,i,data.data.data[i])
            }
        }else{
            this.permisssion_arr = []
        }
        
    })

    this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:10, }).then((data) => {
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

    this.getAdminUserHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.CheckHostData,0,{ title:'在职员工',colSpan:4,value:data.data.data.work,em:true})
            this.$set(this.CheckHostData,1,{ title:'离职员工',colSpan:4,value:data.data.data.leave,em:false})
        }else{
            this.$set(this.CheckHostData,0,{ title:'在职员工',colSpan:4,value:0,em:true})
            this.$set(this.CheckHostData,1,{ title:'离职员工',colSpan:4,value:0,em:false})
        }
        
    })

    this.getPermissionLists().then((data) => {
        if(data.data.code === 1){
            for(let i=0; i<data.data.data.length; i++){
                data.data.data[i]['title'] = data.data.data[i]['name'];
                data.data.data[i]['expand'] = false;
                data.data.data[i]['children'] = data.data.data[i]['child'];
                for(let k=0; k<data.data.data[i]['children'].length; k++){
                    data.data.data[i]['children'][k]['title'] = data.data.data[i]['children'][k]['name']
                }
            }
            return data
        }else{
            return [];
        }
        
    }).then(data=>{

        if(data.data.data && data.data.data.length>0){
            this.permisssion_arr = []
            for(let i=0; i<data.data.data.length; i++){
                this.$set(this.permisssion_arr,i,data.data.data[i])
            }
        }else{
            this.permisssion_arr = []
        }
        
    })

    this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:10, }).then((data) => {
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

  }
}
</script>

<style lang="less">
.checkboxGroup{
    margin-left:20px;
    label{
        display: block !important;
        margin:5px 0;
    }
}
</style>
