<template>
  <div style="padding:0 24px 24px;">
      <Card shadow style="margin-top:10px;">

        <span style="font-size:14px;padding-right:10px;">时间</span>
        <DatePicker type="daterange" @on-change="changeDate" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;" transfer></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">客户名称</span>
        <AutoComplete
        v-model="cusName"
        @on-search="searchCusName"
        @on-select="selectCusName"
        placeholder="请输入客户名称"
        style="width:200px;" transfer>
          <Option v-for="(item,index) in cusNameGather" :value="item.id" :key="index" >{{ item.name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">客户手机号</span>
        <Input v-model="phone" placeholder="请输入联系人手机号" style="width:200px;"></Input>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">联系人</span>
        <AutoComplete
        v-model="contactPer"
        @on-search="searchContactPer"
        @on-select="selectContactPer"
        placeholder="请输入联系人"
        style="width:200px;" transfer>
          <Option v-for="(item,index) in contactPerGather" :value="item.id" :key="index" >{{ item.contact }}</Option>
        </AutoComplete>

        <Button type="success" style="margin-left:30px;" @click="checkCus">查询</Button>

        <Divider />

        <Button type="success" @click="new_cus('new')">添加客户</Button>
        <!-- <Button type="success" style="margin-left:30px;">推广二维码</Button> -->

        <Divider />
        
      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 10px" @click="checkVehicle(row.id,'check')">查看与审核</Button>
                <Button type="primary" style="margin-right: 10px" @click="new_edit_cus(2,row.id)">编辑</Button>
                <Button type="error" @click="deleteRecord(row.id)">删除</Button>
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
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page,Modal } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'customerList',
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
    Modal
  },
  data () {
    return {
      date_val:['',''],
      cusName:'',
      cusNameGather:[],
      contactPer:'',
      contactPerGather:[],
      phone:'',
      order_columns: [
            {
                title: '客户名称',
                key: 'name',
                width:100,
            },
            {
                title: '客户手机号',
                key: 'telephone'
            },
            {
                title: '联系人',
                key: 'contact'
            },
            {
                title: '邮箱',
                key: 'email'
            },
            {
                title: '注册时间',
                key: 'create_time'
            },
            {
                title: '审核状态',
                key: 'status',
                render: (h, params) => {
                    return h('div', [
                        h('div',this.getAuthCarStatus(params.row.status)),
                    ]);
                }
            },
            {
                title: '操作',
                slot: 'action',
                width: 290,
                align: 'center'
            }
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        inpuCusShake:'',
        inpuConShake:'',
        permission_arr:'',
        deleteVisible:false,
        deleteId:'',
    }
  },
  methods: {
    ...mapActions([
      'getCustomerLists',
      'delCustomer',
    ]),
    getAuthCarStatus(status){
        if(status === 0){
            return '待审核'
        }else if(status === 1){
            return '审核通过'
        }else if(status === 2){
            return '审核拒绝'
        }
    },
    changeDate(date){
      this.cusName = '';
      this.contactPer = '';
      this.phone = '';
      this.$set(this.date_val,0,date[0])
      this.$set(this.date_val,1,date[1])
      this.getCustomerLists({ id:'',status:'',type:'',start_time:date[0],end_time:date[1],name:'',telephone:'',contact:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    searchCusName(value){
      if(this.inpuCusShake) clearTimeout(this.inputCusShake)
        this.inpuCusShake = setTimeout(()=>{
            this.getCustomerLists({ id:'',status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
                this.cusNameGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.cusNameGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectCusName(val){
        this.getCustomerLists({ id:val,status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
            this.cusName = data.data.data.rows[0].name
        })
    },
    searchContactPer(value){
      if(this.inpuConShake) clearTimeout(this.inputConShake)
        this.inpuConShake = setTimeout(()=>{
            this.getCustomerLists({ id:'',status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
                this.contactPerGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.contactPerGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectContactPer(val){
        this.getCustomerLists({ id:val,status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
            this.contactPer = data.data.data.rows[0].contact
            this.phone = data.data.data.rows[0].telephone
        })
    },
    checkCus(){
      this.getCustomerLists({ id:'',status:'',type:'',start_time:'',end_time:'',name:this.cusName,telephone:this.phone,contact:this.contactPer,search:'',offset:0,limit:10 }).then((data) => {
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
    checkVehicle(index,type){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[1000].length; i++){
                if(this.permission_arr[1000][i] === '1004'){
                    per_val = 1004
                }
            }
            if(per_val === 1004){
                this.$router.push({path:'edit_customer',query:{id:index,type}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'edit_customer',query:{id:index,type}});
        }

      
    },
    new_cus(new_type){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[1000].length; i++){
                if(this.permission_arr[1000][i] === '1001'){
                    per_val = 1001
                }
            }
            if(per_val === 1001){
                this.$router.push({path:'new_customer',query:{type:new_type}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'new_customer',query:{type:new_type}});
        }
    },
    new_edit_cus(type,index){
            let per_val = ''
          if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[1000].length; i++){
                if(this.permission_arr[1000][i] === '1003'){
                    per_val = 1003
                }
            }
            if(per_val === 1003){
                this.$router.push({path:'edit_customer',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'edit_customer',query:{id:index}});
        }

    },
    deleteRecord(index){
        this.deleteVisible = true;
        this.deleteId = index

    },
    confirmDelete(){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[1000].length; i++){
                if(this.permission_arr[1000][i] === '1005'){
                    per_val = 1005
                }
            }
            if(per_val === 1005){
                
                this.delCustomer({ id:this.deleteId }).then((data) => {
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
                                this.getCustomerLists({ id:'',status:'',type:'',start_time:this.date_val[0],end_time:this.date_val[1],name:'',telephone:'',contact:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getCustomerLists({ id:'',status:'',type:'',start_time:this.date_val[0],end_time:this.date_val[1],name:'',telephone:'',contact:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            
            this.delCustomer({ id:this.deleteId }).then((data) => {
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
                            this.getCustomerLists({ id:'',status:'',type:'',start_time:this.date_val[0],end_time:this.date_val[1],name:'',telephone:'',contact:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                this.pageTotal = data.data.data.total
                            })
                        }else{
                            this.getCustomerLists({ id:'',status:'',type:'',start_time:this.date_val[0],end_time:this.date_val[1],name:'',telephone:'',contact:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
        this.getCustomerLists({ id:'',status:'',type:'',start_time:this.date_val[0],end_time:this.date_val[1],name:'',telephone:'',contact:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getCustomerLists({ id:'',status:'',type:'',start_time:this.date_val[0],end_time:this.date_val[1],name:'',telephone:'',contact:'',search:'',offset:0,limit:size }).then((data) => {
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
    this.getCustomerLists({ id:'',status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
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
    this.getCustomerLists({ id:'',status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
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

</style>
