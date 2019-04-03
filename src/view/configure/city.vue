<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" inline>

                <FormItem label="城市" prop="city" :label-width="120">
                    <Input v-model="formValidate.city" placeholder="请输入城市" style="width:200px"></Input>
                </FormItem>

                <FormItem label="状态" prop="status" :label-width="120">
                    <Select v-model="formValidate.status" placeholder="请选择状态" style="width:200px">
                        <Option value="0">停用</Option>
                        <Option value="1">启用</Option>
                    </Select>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
                </FormItem>

            </Form>
      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 10px" @click="stop_recover(row.id,0)" v-if="row.status === 1">停用</Button>
                <Button type="success" style="margin-right: 10px" @click="stop_recover(row.id,1)" v-if="row.status === 0">恢复</Button>
                <Button type="error" @click="remove(row.id)">删除</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
    </Card>
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
import { Row,Card,Button,Select,Option,Form,FormItem,Table,Input,Page,Modal } from 'iview'
import { mapActions } from 'vuex' 
export default {
  name: 'city',
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
    Page,
    Modal
  },
  data () {
    return {
      formValidate: {
          status:'1'
      },
      cardTitle:'订单城市配置',
      ruleValidate: {},
      order_columns: [
            {
                title: '城市编号',
                key: 'id'
            },
            {
                title: '城市名称',
                key: 'city'
            },
            {
                title: '使用状态',
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
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        permission_arr:'',
        deleteVisible:false,
        deleteId:''
    }
  },
  methods: {
    ...mapActions([
      'addCompanyCity',
      'editCompanyCity',
      'delCompanyCity',
      'getCompanyCityLists',
    ]),

    handleSubmit (name) {

        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[7000].length; i++){
                if(this.permission_arr[7000][i] === '7006'){
                    per_val = 7006
                }
            }
            if(per_val === 7006){
                
                this.$refs[name].validate((valid) => {
                    this.addCompanyCity({ 
                        city: this.formValidate.city,
                        status:this.formValidate.status,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('添加成功!');
                            this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:'' }).then((data) => {
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                        }else if(data.data.code === 0){
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })   
                })

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            
            this.$refs[name].validate((valid) => {
                this.addCompanyCity({ 
                    city: this.formValidate.city,
                    status:this.formValidate.status,
                    }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('添加成功!');
                        this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:'' }).then((data) => {
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.pageTotal = data.data.data.total
                        })
                    }else if(data.data.code === 0){
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })   
            })

        }

        
    },
    stop_recover(index,type){
        this.editCompanyCity({ id:index,status:type }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('修改成功!');
                if(this.pageCurrent > 1){
                    this.getCompanyCityLists({ id:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize,status:'' }).then((data) => {
                        this.order_data = []
                        for(let i=0; i<data.data.data.rows.length; i++){
                            this.$set(this.order_data,i,data.data.data.rows[i])
                        }
                        this.$refs.Pagination.currentPage = this.pageCurrent;
                        this.pageTotal = data.data.data.total
                    })
                }else{
                    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:this.pageSize,status:'' }).then((data) => {
                        this.order_data = []
                        for(let i=0; i<data.data.data.rows.length; i++){
                            this.$set(this.order_data,i,data.data.data.rows[i])
                        }
                        this.pageTotal = data.data.data.total
                    })
                }
            }else if(data.data.code === 0){
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    remove(index){
        this.deleteVisible = true;
        this.deleteId = index;
    },
    confirmDelete(){
        this.delCompanyCity({ id:this.deleteId }).then((data) => {
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
                        this.getCompanyCityLists({ id:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize,status:'' }).then((data) => {
                            this.order_data = []
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                            this.pageTotal = data.data.data.total
                        })
                    }else{
                        this.getCompanyCityLists({ id:'',search:'',offset:0,limit:this.pageSize,status:'' }).then((data) => {
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
        this.getCompanyCityLists({ id:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize,status:'' }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getCompanyCityLists({ id:'',search:'',offset:0,limit:size,status:'' }).then((data) => {
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
    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:'' }).then((data) => {
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
    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:'' }).then((data) => {
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
