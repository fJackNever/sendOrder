<template>
  <div style="padding:0 24px 24px;">
      <topHost :itemCol="carTypeData"></topHost>
      <Card shadow :title="cardTitle" style="margin-top:10px;">

            <span style="font-size:14px;padding-right:10px;">所属类型</span>
            <Select v-model="useType" placeholder="请选择所属类型" style="width:200px" @on-change="checkUseType">
                <Option :value="0">全部</Option>
                <Option v-for="(item, index) in useTypeArr" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>

            <span style="font-size:14px;padding-right:10px;padding-left:20px;">状态</span>
            <Select v-model="status" placeholder="请选择状态" style="width:200px" @on-change="checkUseStatus">
                <Option :value="2">全部</Option>
                <Option :value="0">停用</Option>
                <Option :value="1">启用</Option>
            </Select>

            <span style="font-size:14px;padding-right:10px;padding-left:20px;">搜索关键字</span>
            <Input v-model="searchVal" placeholder="请输入用车类型关键字" style="width:200px"></Input>

            <Button type="primary" @click="find()" style="margin:0 30px;">查询</Button>

            <Divider />

            <Button type="primary" @click="addUseType()" style="margin-right:30px;">新增车型</Button>
            
            <!-- <Button type="primary" @click="leadType()" style="margin-right:30px;">导入车型</Button> -->

            <Button type="primary" @click="exportCarType()" style="margin-right:30px;">导出车型</Button>

      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="success" style="margin-right: 10px" @click="edit(row.id,row.use_car_type_id,row.brand,row.model,row.status)">编辑</Button>
                <Button type="error" @click="remove(row.id)">删除</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
      </Card>
      <Modal title="添加车型" v-model="visible" :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="120" >
                <FormItem label="所属类型" prop="use_car_type_id" :label-width="120">
                    <Select v-model="formValidate.use_car_type_id" placeholder="请选择所属类型" style="width:200px">
                        <Option v-for="(item, index) in useTypeArr" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="品牌" prop="brand" :label-width="120">
                    <Input v-model="formValidate.brand" placeholder="请输入品牌" style="width:200px"></Input>
                </FormItem>
                <FormItem label="型号" prop="model" :label-width="120">
                    <Input v-model="formValidate.model" placeholder="请输入型号" style="width:200px"></Input>
                </FormItem>
                <FormItem label="状态" prop="status" :label-width="120">
                    <Select v-model="formValidate.status" placeholder="请选择状态" style="width:200px">
                        <Option :value="0">停用</Option>
                        <Option :value="1">启用</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">{{ add_edit === 1 ? '新增':'修改'}}</Button>
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
import topHost from '_c/top-host'
import { Row,Card,Button,Select,Option,Form,FormItem,Table,Input,Modal,Page,Divider } from 'iview'
import { mapActions } from 'vuex' 
import FileSaver from 'file-saver';
export default {
  name: 'brandType',
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
    topHost,
    Page,
    Divider
  },
  data () {
    return {
      cardTitle:'品牌车型',
      carTypeData: [],
      useTypeArr:[],
      add_edit:1,
      useType:0,
      status:2,
      searchVal:'',
      formValidate: {
          status:1,
      },
      ruleValidate: {},
      order_columns: [
            {
                title: '品牌',
                key: 'brand'
            },
            {
                title: '型号',
                key: 'model'
            },
            {
                title: '所属类型',
                key: 'user_car_type_name'
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
        edit_id:'',
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        use_id:'',
        status_val:'',
        top_data_num:'',
        permission_arr:'',
        deleteVisible:false,
        deleteId:'',
    }
  },
  methods: {
    ...mapActions([
      'addCarTemplate',
      'editCarTemplate',
      'delCarTemplate',
      'getCarTemplateLists',
      'getUseCarTypeLists',
      'getTemplateHost',
    ]),

    checkUseType(val){
        this.order_data = [];
        this.searchVal = '';
        this.use_id = val;
        if(val === 2){
            this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:'',search:'',offset:0,limit:10 }).then((data) => {
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
            this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:val,search:'',offset:0,limit:10 }).then((data) => {
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
    checkUseStatus(val){
        this.order_data = [];
        this.searchVal = '';
        this.status_val = val;
        if(val === 2){
            this.getCarTemplateLists({ id:'',status:'',use_car_type_id:this.use_id,search:'',offset:0,limit:10 }).then((data) => {
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
            this.getCarTemplateLists({ id:'',status:val,use_car_type_id:this.use_id,search:'',offset:0,limit:10 }).then((data) => {
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
    find(){
        this.order_data = [];
        if(this.use_id === 0 && this.status_val === 2){
            this.getCarTemplateLists({ id:'',status:'',use_car_type_id:'',search:this.searchVal,offset:0,limit:10 }).then((data) => {
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
        }else if(this.use_id === 0){
            this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:'',search:this.searchVal,offset:0,limit:10 }).then((data) => {
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
        }else if(this.status_val === 2){
            this.getCarTemplateLists({ id:'',status:'',use_car_type_id:this.use_id,search:this.searchVal,offset:0,limit:10 }).then((data) => {
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
            this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:this.use_id,search:this.searchVal,offset:0,limit:10 }).then((data) => {
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
    exportCarType(){

        this.getCarTemplateLists({ id:'',status:'',use_car_type_id:'',search:'',offset:0,limit:10000 }).then((data) => {
            if(data.data.code === 1){
                let result = data.data.data.rows;
                let str = '品牌,型号,所属类型,状态';
                
                for (let i=0; i<result.length; i++) {
                    let car_status = ''
                    if(result[i].status === 0){
                        car_status = '停用'
                    }else{
                        car_status = '启用'
                    }
                    
                        str += '\n' +
                        result[i].brand + ',' +
                        result[i].model + ',' +
                        result[i].user_car_type_name + ',' +
                        car_status
                }
                let exportContent = "\uFEFF";
                let blob = new Blob([exportContent + str], {
                    type: "text/plain;charset=utf-8"
                });
                FileSaver.saveAs(blob, "车型列表.xls");
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }

        })
        
    },
    edit(index,use_car_type_id,brand,model,status){
        this.visible = true; 
        this.edit_id = index;
        this.add_edit = 2;

        this.$set(this.formValidate,'use_car_type_id',use_car_type_id)
        this.$set(this.formValidate,'brand',brand)
        this.$set(this.formValidate,'model',model)
        this.$set(this.formValidate,'status',status)
        
    },
    remove(index){
        this.deleteVisible = true;
        this.deleteId = index;
    },
    confirmDelete(){
        this.delCarTemplate({ id:this.deleteId }).then((data) => {
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
                        this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:this.use_id,search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                            this.order_data = []
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                            this.pageTotal = data.data.data.total
                        })
                    }else{
                        this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:this.use_id,search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            if( this.add_edit === 1 ){
                this.addCarTemplate({ 
                    use_car_type_id: this.formValidate.use_car_type_id,
                    brand:this.formValidate.brand,
                    model:this.formValidate.model,
                    status:this.formValidate.status,
                    }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('新增成功!');
                        this.getCarTemplateLists({ id:'',status:'',use_car_type_id:'',search:'',offset:0,limit:10 }).then((data) => {
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
                this.editCarTemplate({ 
                    id:this.edit_id,
                    use_car_type_id:this.formValidate.use_car_type_id,
                    brand: this.formValidate.brand,
                    model:this.formValidate.model,
                    status:this.formValidate.status,
                    }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('修改成功!');
                        if(this.pageCurrent > 1){
                            this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:this.use_id,search:this.searchVal,offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent;
                                this.pageTotal = data.data.data.total
                            })
                        }else{
                            this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:this.use_id,search:this.searchVal,offset:0,limit:this.pageSize }).then((data) => {
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
        this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:this.use_id,search:this.searchVal,offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getCarTemplateLists({ id:'',status:this.status_val,use_car_type_id:this.use_id,search:this.searchVal,offset:0,limit:size }).then((data) => {
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
    this.getTemplateHost().then((data) => {
        if(data.data.code === 1){
            this.carTypeData = []
            this.top_data_num = data.data.data.length
            for(let i=0; i<data.data.data.length; i++){
                if(i === data.data.data.length-1){
                    this.$set(this.carTypeData,i,{ title:data.data.data[i].name,colSpan:3,value:data.data.data[i].count,em:false})
                }else{
                    this.$set(this.carTypeData,i,{ title:data.data.data[i].name,colSpan:3,value:data.data.data[i].count,em:true})
                }
                
            }
        }else{
            this.carTypeData = []
        }
        
    }) 

    this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10 }).then((data) => {
        if(data.data.code === 1){
            this.useTypeArr = []
            data.data.data.rows.map((item,index)=>{
                this.$set(this.useTypeArr,index,item);
            })
        }else{
            this.useTypeArr = []
        }
        
    })

    this.getCarTemplateLists({ id:'',status:'',use_car_type_id:'',search:'',offset:0,limit:10 }).then((data) => {
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
    this.getTemplateHost().then((data) => {
        if(data.data.code === 1){
            this.carTypeData = []
            this.top_data_num = data.data.data.length
            for(let i=0; i<data.data.data.length; i++){
                if(i === data.data.data.length-1){
                    this.$set(this.carTypeData,i,{ title:data.data.data[i].name,colSpan:3,value:data.data.data[i].count,em:false})
                }else{
                    this.$set(this.carTypeData,i,{ title:data.data.data[i].name,colSpan:3,value:data.data.data[i].count,em:true})
                }
                
            }
        }else{
            this.carTypeData = []
        }
        
    }) 

    this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10 }).then((data) => {
        if(data.data.code === 1){
            this.useTypeArr = []
            data.data.data.rows.map((item,index)=>{
                this.$set(this.useTypeArr,index,item);
            })
        }else{
            this.useTypeArr = []
        }
        
    })

    this.getCarTemplateLists({ id:'',status:'',use_car_type_id:'',search:'',offset:0,limit:10 }).then((data) => {
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
