<template>
  <div style="padding:0 24px 24px;">
    <Row style="margin-top:10px;">
      <Card shadow>
        <topHost :itemCol="CheckHostData" :style="{ cursor:'pointer'}"></topHost>

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
                    <Button type="primary" style="margin-right: 5px" @click="new_edit_staff(2,row.id,row.name,row.telephone,row.role,row.password,row.permission,row.status)">编辑</Button>
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
                    <Input type="password" v-model="formValidate.staffPwd" placeholder="请输入员工密码" style="width:200px"></Input>
                </FormItem>

                <FormItem label="权限" prop="permission">
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
      CheckHostData: [
        { title:'在职员工',colSpan:4,value:60,em:true},
        { title:'离职员工',colSpan:4,value:8,em:false},
      ],

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
        ruleValidate: {},
        staffModal:false,
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
    }
  },
  methods: {
    ...mapActions([
      'getPermissionLists',
      'addAdminUser',
      'editAdminUser',
      'getAdminUserLists',
    ]),
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
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    new_edit_staff(type,index,name,telephone,role,password,permission,status){
        this.staffModal = true;
        if(index){
            this.add_edit = 2;
            this.edit_id = index;
            this.$set(this.formValidate,'staffName',name)
            this.$set(this.formValidate,'staffTelephone',telephone)
            this.$set(this.formValidate,'staffRole',role)
            this.$set(this.formValidate,'staffPwd',password)

            let new_arr = permission.split(",");

            
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
            this.add_edit = 1;
            this.$refs['formValidate'].resetFields();
            for(let j=0; j<this.permisssion_arr.length; j++){
                this.$set(this.permisssion_arr[j],'checked',false)

                for(let k=0; k<this.permisssion_arr[j]['children'].length; k++){
                    this.$set(this.permisssion_arr[j]['children'][k],'checked',false)
                }
            }
        }

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
                    this.editAdminUser({ 
                        id:this.edit_id,
                        name:this.formValidate.staffName,
                        telephone:this.formValidate.staffTelephone,
                        role:this.formValidate.staffRole,
                        password:this.formValidate.staffPwd,
                        permission:JSON.stringify(this.per_val_arr),
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
    this.getPermissionLists().then((data) => {
        for(let i=0; i<data.data.data.length; i++){
            data.data.data[i]['title'] = data.data.data[i]['name'];
            data.data.data[i]['expand'] = false;
            data.data.data[i]['children'] = data.data.data[i]['child'];
            for(let k=0; k<data.data.data[i]['children'].length; k++){
                data.data.data[i]['children'][k]['title'] = data.data.data[i]['children'][k]['name']
            }
        }
        return data
    }).then(data=>{
        for(let i=0; i<data.data.data.length; i++){
            this.$set(this.permisssion_arr,i,data.data.data[i])
        }
    })

    this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:10, }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })

  },
  activated () {
    this.getPermissionLists().then((data) => {
        for(let i=0; i<data.data.data.length; i++){
            data.data.data[i]['title'] = data.data.data[i]['name'];
            data.data.data[i]['expand'] = false;
            data.data.data[i]['children'] = data.data.data[i]['child'];
            for(let k=0; k<data.data.data[i]['children'].length; k++){
                data.data.data[i]['children'][k]['title'] = data.data.data[i]['children'][k]['name']
            }
        }
        return data
    }).then(data=>{
        for(let i=0; i<data.data.data.length; i++){
            this.$set(this.permisssion_arr,i,data.data.data[i])
        }
    })

    this.getAdminUserLists({ id:'',status:'',search:'',offset:0,limit:10, }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
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
