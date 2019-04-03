<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">

            <span style="font-size:14px;padding-right:10px;">车型状态</span>
            <Select v-model="status" placeholder="请选择车型状态" style="width:200px" @on-change="checkUseStatus">
                <Option :value="2">全部</Option>
                <Option :value="0">停用</Option>
                <Option :value="1">启用</Option>
            </Select>

            <span style="font-size:14px;padding-right:10px;padding-left:20px;">搜索关键字</span>
            <Input v-model="searchVal" placeholder="请输入用车关键字" style="width:200px"></Input>

            <Button type="primary" @click="find()" style="margin:0 40px;">查询</Button>

            <Button type="primary" @click="addUseType()">新增用车类型</Button>

      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="success" style="margin-right: 10px" @click="edit(row.id,row.name,row.status)">编辑</Button>
                <Button type="error" @click="remove(row.id)">删除</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
      </Card>
      
      <Modal title="添加用车类型" v-model="visible" :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="120" >
                <FormItem label="用车类型名称" prop="name" :label-width="120">
                    <Input v-model="formValidate.name" placeholder="请输入用车类型名称" style="width:200px"></Input>
                </FormItem>
                <FormItem label="状态" prop="status" :label-width="120">
                    <Select v-model="formValidate.status" placeholder="请选择状态" style="width:200px">
                        <Option :value="0">停用</Option>
                        <Option :value="1">启用</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">{{ add_edit === 1 ? '新增':'修改' }}</Button>
                </FormItem>
            </Form>
        </Modal>
        <Modal 
            title="是否删除"
            v-model="deleteVisible" 
            @on-ok="confirmDelete"
            ok-text="是"
            cancel-text="否"
            class="reassignModal"
      >
      </Modal>
  </div>
</template>

<script>
import { Row,Card,Button,Select,Option,Form,FormItem,Table,Input,Modal,Page, } from 'iview'
import { mapActions } from 'vuex' 
export default {
  name: 'useCarType',
  components: {
    Row,
    Card,
    Button,
    Select,
    Option,
    Form,
    FormItem,
    Table,
    Input,
    Modal,
    Page,
  },
  data () {
    return {
      cardTitle:'用车类型',
      searchVal:'',
      status:2,
      add_edit:1,
      edit_id:'',
      formValidate: {
          status:1,
      },
      ruleValidate: {},
      order_columns: [
            {
                title: '用车类型编号',
                key: 'id'
            },
            {
                title: '用车类型名称',
                key: 'name'
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.status === 0 ? '停用':'启用'),
                    ]);
                }
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
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        permission_arr:'',
        deleteVisible:false,
        deleteId:'',
    }
  },
  methods: {
    ...mapActions([
      'addUseCarType',
      'editUseCarType',
      'delUseCarType',
      'getUseCarTypeLists',
    ]),
    checkUseStatus(val){
        this.order_data = [];
        this.searchVal = ''
        if(val === 2){
            this.getUseCarTypeLists({ id:'',status:'',search:'',offset:0,limit:10 }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getUseCarTypeLists({ id:'',status:val,search:'',offset:0,limit:10 }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        } 
    },
    find(){
        this.order_data = []
        if(this.status === 2){
            this.getUseCarTypeLists({ id:'',status:'',search:this.searchVal,offset:0,limit:10 }).then((data) => {
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
        }else{
            this.getUseCarTypeLists({ id:'',status:this.status,search:this.searchVal,offset:0,limit:10 }).then((data) => {
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
    },
    addUseType(){
        
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[7000].length; i++){
                if(this.permission_arr[7000][i] === '7002'){
                    per_val = 7002
                }
            }
            if(per_val === 7002){
                this.visible = true; 
                this.$refs['formValidate'].resetFields();
                this.add_edit = 1;
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.visible = true; 
            this.$refs['formValidate'].resetFields();
            this.add_edit = 1;
        }
        
    },
    edit(index,name,status){
        this.visible = true;
        this.$set(this.formValidate,'name',name)
        this.$set(this.formValidate,'status',status)
        this.add_edit = 2;
        this.edit_id = index;
    },
    remove(index){
        this.deleteVisible = true;
        this.deleteId = index;
    },
    confirmDelete(){
        this.delUseCarType({ id:this.deleteId }).then((data) => {
            if(data.data.code === 1){
                for(let i=0; i<this.order_data.length;){
                    if(this.deleteId === this.order_data[i].id){
                        this.order_data.splice(i,1)
                    }else{
                        i++
                    }
                }
                this.$Message.success('删除成功!');
                this.deleteVisible = false;
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
                        this.getUseCarTypeLists({ id:'',status:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                            this.order_data = []
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                            this.pageTotal = data.data.data.total
                        })
                    }else{
                        this.getUseCarTypeLists({ id:'',status:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if(this.add_edit === 1){
                    this.addUseCarType({ 
                        name: this.formValidate.name,
                        status:this.formValidate.status,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('新增成功!');
                            this.getUseCarTypeLists({ id:'',status:'',search:'',offset:0,limit:10 }).then((data) => {
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                            this.visible = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
            }else{
                    this.editUseCarType({ 
                        id:this.edit_id,
                        name: this.formValidate.name,
                        status:this.formValidate.status,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            if(this.pageCurrent > 1){
                                this.getUseCarTypeLists({ id:'',status:'',search:this.searchVal,offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getUseCarTypeLists({ id:'',status:'',search:this.searchVal,offset:0,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.pageTotal = data.data.data.total
                                })
                            }
                            this.visible = false;
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
        this.getUseCarTypeLists({ id:'',status:'',search:this.searchVal,offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getUseCarTypeLists({ id:'',status:'',search:this.searchVal,offset:0,limit:size }).then((data) => {
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
    this.getUseCarTypeLists({ id:'',status:'',search:'',offset:0,limit:10 }).then((data) => {
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
    this.getUseCarTypeLists({ id:'',status:'',search:'',offset:0,limit:10 }).then((data) => {
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
