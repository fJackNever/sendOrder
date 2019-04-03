<template>
  <div style="padding:0 24px 24px;">
      <Card shadow style="margin-top:10px;;">
        <p slot="title">包车</p>
        <div slot="extra">
            <Button type="primary" @click="new_edit_use(1)">新增包车价格</Button>
        </div>
        <Table border :columns="use_order_columns" :data="use_order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="new_edit_use(2,row.id,row.order_type,row.use_car_type_id,row.amount/100,row.status)">编辑</Button>
            </template>
        </Table>
        <Page ref="usePagination" show-sizer @on-change="changeUsePage" @on-page-size-change="changeUsePageSize" style="margin-top:15px;"/>
      </Card>
      
      <Card shadow style="margin-top:10px;margin-bottom:130px;">
        <p slot="title">点对点</p>
        <div slot="extra">
            <Button type="primary" @click="new_edit_point(1)">新增点对点价格</Button>
        </div>
        <Table border :columns="point_order_columns" :data="point_order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="new_edit_point(2,row.id,row.use_car_type_id,row.amount/100,row.limit_km,row.addition_amount/100,row.status)">编辑</Button>
            </template>
        </Table>
        <Page ref="pointPagination" show-sizer @on-change="changePointPage" @on-page-size-change="changePointPageSize" style="margin-top:15px;"/>
      </Card>

      <Modal
        v-model="usePriceModal"
        title="包车价格配置"
        :footer-hide="true"
      >
            <Form ref="formUseValidate" :model="formUseValidate" :label-width="160" >
                
                <FormItem label="订单类型" prop="indentType">
                    <Select v-model="formUseValidate.indentType" placeholder="请选择类型" style="width:200px">
                        <Option :value="1">日租</Option>
                        <Option :value="2">半日租</Option>
                    </Select>
                </FormItem>

                <FormItem label="用车类型" prop="useCarType">
                    <Select v-model="formUseValidate.useCarType" placeholder="请选择类型" style="width:200px">
                        <Option v-for="(item, index) in useTypeArr" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="价格" prop="usePrice">
                    <InputNumber :min="0" v-model="formUseValidate.usePrice"></InputNumber>
                </FormItem>

                <FormItem label="状态" prop="status">
                    <Select v-model="formUseValidate.status" placeholder="请选择状态" style="width:200px">
                        <Option :value="0">停用</Option>
                        <Option :value="1">启用</Option>
                    </Select>
                </FormItem>

                <FormItem v-if="use_add_edit === 1">
                    <Button type="primary" @click="handleUseSubmit('formUseValidate')">添加</Button>
                </FormItem>
                <FormItem v-if="use_add_edit === 2">
                    <Button type="primary" @click="handleUseSubmit('formUseValidate')">修改</Button>
                </FormItem>

            </Form>
        </Modal>
        <Modal
        v-model="pointPriceModal"
        title="点对点价格配置"
        :footer-hide="true"
      >
            <Form ref="formPointValidate" :model="formPointValidate" :label-width="160" >
                
                <FormItem label="所属类型" prop="pointCarType">
                    <Select v-model="formPointValidate.pointCarType" placeholder="请选择类型" style="width:200px">
                        <Option v-for="(item, index) in useTypeArr" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="订单起步价" prop="startFare">
                    <InputNumber :min="0" v-model="formPointValidate.startFare"></InputNumber>
                </FormItem>

                <FormItem label="超过" prop="exceedMileage" style="float: left;">
                    <InputNumber :min="0" v-model="formPointValidate.exceedMileage"></InputNumber>
                    <span style="font-size:14px;padding-left:10px;padding-right:10px;">公里后</span>
                </FormItem>

                <FormItem prop="charge" class="charge">
                    <InputNumber :min="0" v-model="formPointValidate.charge"></InputNumber>
                    <span style="font-size:14px;padding-left:10px;">元/公里</span>
                </FormItem>

                <FormItem label="状态" prop="status" style="clear:both;">
                    <Select v-model="formUseValidate.status" placeholder="请选择状态" style="width:200px">
                        <Option :value="0">停用</Option>
                        <Option :value="1">启用</Option>
                    </Select>
                </FormItem>

                <div style="text-align:center;clear:both;">
                    <Button type="primary" @click="handlePointSubmit('formPointValidate')" v-if="point_add_edit === 1">添加</Button>
                    <Button type="primary" @click="handlePointSubmit('formPointValidate')" v-if="point_add_edit === 2">修改</Button>
                </div>
            </Form>
        </Modal>
  </div>
</template>

<script>
import { Card,Button,Select,Option,Table,AutoComplete,Page,Modal,Form,FormItem,Input,InputNumber, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'indentPriceConfigure',
  components: {
    Card,
    Button,
    Select,
    Option,
    Table,
    AutoComplete,
    Page,
    Modal,
    Form,
    FormItem,
    Input,
    InputNumber,
  },
  data () {
    return {
        use_order_columns: [
            {
                title: '用车价格编号',
                key: 'id'
            },
            {
                title: '订单类型',
                key: 'order_type',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.order_type === 1 ? '日租':'半日租'),
                    ]);
                }
            },
            {
                title: '用车类型',
                key: 'user_car_type_name',
            },
            {
                title: '价格',
                key: 'amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.amount/100),
                    ]);
                }
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
                width: 200,
                align: 'center'
            }
        ],
        use_order_data: [],
        usePageSize:10,
        usePageCurrent:1,
        usePriceModal:false,
        formUseValidate: {
          indentType:1,
          usePrice:0,
          status:1,
        },
        useTypeArr:[],
        use_add_edit:1,
        use_edit_id:'',
        point_order_columns:[
            {
                title: '所属类型',
                key: 'user_car_type_name',
            },
            {
                title: '起步价',
                key: 'amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.amount/100),
                    ]);
                }
            },
            {
                title: '基础公里数',
                key: 'limit_km'
            },
            {
                title: '超出价格（元/公里）',
                key: 'addition_amount',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.addition_amount/100),
                    ]);
                }
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
                width: 200,
                align: 'center'
            }
        ],
        point_order_data:[],
        pointPageSize:10,
        pointPageCurrent:1,
        pointPriceModal:false,
        formPointValidate:{
            startFare:0,
            exceedMileage:0,
            charge:0,
        },
        point_add_edit:1,
        permission_arr:'',
    }
  },
  methods: {
    ...mapActions([
      'addOrderType',
      'editOrderType',
      'getOrderTypeLists',
      'getUseCarTypeLists',
    ]),
    new_edit_use(type,index,order_type,use_car_type_id,amount,status){
      this.usePriceModal = true;
      if(index){
        this.use_add_edit = 2
        this.use_edit_id = index;
        this.$set(this.formUseValidate,'indentType',order_type)
        this.$set(this.formUseValidate,'useCarType',use_car_type_id)
        this.$set(this.formUseValidate,'usePrice',amount)
        this.$set(this.formUseValidate,'status',status)
      }else{
          let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[7000].length; i++){
                if(this.permission_arr[7000][i] === '7003'){
                    per_val = 7003
                }
            }
            if(per_val === 7003){
                this.use_add_edit = 1;
                this.$refs['formUseValidate'].resetFields();
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.use_add_edit = 1;
            this.$refs['formUseValidate'].resetFields();
        }
        
      }
    },
    changeUsePage(page){
        this.usePageCurrent = page;
        this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:(page-1)*this.usePageSize,limit:this.usePageSize,type:1, }).then((data) => {
            this.use_order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.use_order_data,i,data.data.data.rows[i])
            }
        })
    },
    changeUsePageSize(size){
        this.usePageSize = size;
        this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:0,limit:size,type:1, }).then((data) => {
            
            if(data.data.code === 1){
                this.use_order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.use_order_data,i,data.data.data.rows[i])
                }
            }else{
                this.use_order_data = [];
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }

        })
    },
    handleUseSubmit (name) {
        this.$refs[name].validate((valid) => {
            if(this.use_add_edit === 1){
                    this.addOrderType({ 
                        order_type: this.formUseValidate.indentType,
                        use_car_type_id: this.formUseValidate.useCarType,
                        amount: this.formUseValidate.usePrice * 100,
                        status: this.formUseValidate.status,
                        limit_km: '',
                        addition_amount: '',
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('新增成功!');
                            this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:0,limit:10,type:1, }).then((data) => {
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.use_order_data,i,data.data.data.rows[i])
                                }
                            })
                            this.usePriceModal = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
            }else{
                    this.editOrderType({ 
                        id:this.use_edit_id,
                        order_type: this.formUseValidate.indentType,
                        use_car_type_id: this.formUseValidate.useCarType,
                        amount: this.formUseValidate.usePrice * 100,
                        status: this.formUseValidate.status,
                        limit_km: '',
                        addition_amount: '',
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            if(this.usePageCurrent > 1){
                                this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:(this.usePageCurrent - 1)*this.usePageSize,limit:this.usePageSize,type:1, }).then((data) => {
                                    this.use_order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.use_order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.usePagination.currentPage = this.usePageCurrent;
                                })
                            }else{
                                this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:0,limit:this.usePageSize,type:1, }).then((data) => {
                                    this.use_order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.use_order_data,i,data.data.data.rows[i])
                                    }
                                })
                            }
                            this.usePriceModal = false;
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
    new_edit_point(type,index,use_car_type_id,amount,limit_km,addition_amount,status){
      this.pointPriceModal = true
      this.point_edit_id = index;
      if(index){
        this.point_add_edit = 2;
        this.$set(this.formPointValidate,'pointCarType',use_car_type_id)
        this.$set(this.formPointValidate,'startFare',amount)
        this.$set(this.formPointValidate,'exceedMileage',limit_km)
        this.$set(this.formPointValidate,'charge',addition_amount)
        this.$set(this.formPointValidate,'status',status)
      }else{

          let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2001'){
                    per_val = 2001
                }
            }
            if(per_val === 2001){
                this.point_add_edit = 1;
                this.$refs['formPointValidate'].resetFields();
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.point_add_edit = 1;
            this.$refs['formPointValidate'].resetFields();
        }

        
      }
    },
    changePointPage(page){
        this.pointPageCurrent = page;
        this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:(page-1)*this.pointPageSize,limit:this.pointPageSize,type:2, }).then((data) => {
            this.point_order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.point_order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePointPageSize(size){
        this.pointPageSize = size;
        this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:0,limit:size,type:2, }).then((data) => {
            
            if(data.data.code === 1){
                this.point_order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.point_order_data,i,data.data.data.rows[i])
                }
            }else{
                this.point_order_data = [];
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }

        })
    },
    handlePointSubmit(name){
         this.$refs[name].validate((valid) => {
            if(this.point_add_edit === 1){
                    this.addOrderType({ 
                        order_type: 3,
                        use_car_type_id: this.formPointValidate.pointCarType,
                        amount: this.formPointValidate.startFare * 100,
                        status: this.formUseValidate.status,
                        limit_km: this.formPointValidate.exceedMileage,
                        addition_amount: this.formPointValidate.charge * 100,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('新增成功!');
                            this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:0,limit:10,type:2, }).then((data) => {
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.point_order_data,i,data.data.data.rows[i])
                                }
                            })
                            this.pointPriceModal = false;
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
            }else{
                    this.editOrderType({ 
                        id:this.point_edit_id,
                        order_type: 3,
                        use_car_type_id: this.formPointValidate.pointCarType,
                        amount: this.formPointValidate.startFare * 100,
                        status: this.formPointValidate.status,
                        limit_km: this.formPointValidate.exceedMileage,
                        addition_amount: this.formPointValidate.charge * 100,
                        }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            if(this.pointPageCurrent > 1){
                                this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:(this.pointPageCurrent - 1)*this.pointPageSize,limit:this.pointPageSize,type:2, }).then((data) => {
                                    this.point_order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.point_order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.usePagination.currentPage = this.pointPageCurrent;
                                })
                            }else{
                                this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:0,limit:this.pointPageSize,type:2, }).then((data) => {
                                    this.point_order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.point_order_data,i,data.data.data.rows[i])
                                    }
                                })
                            }
                            this.pointPriceModal = false;
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
  },
  mounted () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
        data.data.data.rows.map((item,index)=>{
            this.$set(this.useTypeArr,index,item);
        })
    })

    this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:0,limit:10,type:'' }).then((data) => {
      let fir_sec_arr = [] ,third_arr = [];
      for(let i=0; i<data.data.data.rows.length; i++){
          if( data.data.data.rows[i].order_type === 1 || data.data.data.rows[i].order_type === 2){
              fir_sec_arr.push(data.data.data.rows[i])
          }else{
              third_arr.push(data.data.data.rows[i])
          }
      }

      for(let i=0; i<fir_sec_arr.length; i++){
        this.$set(this.use_order_data,i,fir_sec_arr[i])
      }

      for(let i=0; i<third_arr.length; i++){
        this.$set(this.point_order_data,i,third_arr[i])
      }

    })

  },

  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
        
        if(data.data.code === 1){
            this.useTypeArr = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.useTypeArr,i,data.data.data.rows[i])
            }
        }else{
            this.useTypeArr = [];
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: data.data.msg
            });
        }

    })

    this.getOrderTypeLists({ id:'',status:'',use_car_type_id:'',order_type:'',offset:0,limit:10,type:'' }).then((data) => {
        if(data.data.code === 1){
            let fir_sec_arr = [] ,third_arr = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                if( data.data.data.rows[i].order_type === 1 || data.data.data.rows[i].order_type === 2){
                    fir_sec_arr.push(data.data.data.rows[i])
                }else{
                    third_arr.push(data.data.data.rows[i])
                }
            }

            for(let i=0; i<fir_sec_arr.length; i++){
                this.$set(this.use_order_data,i,fir_sec_arr[i])
            }

            for(let i=0; i<third_arr.length; i++){
                this.$set(this.point_order_data,i,third_arr[i])
            }
        }else{
            this.use_order_data = [];
            this.point_order_data = []
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
.ivu-card-extra{
    top:10px !important;
}
.charge{
    float: left;
    .ivu-form-item-content{
        margin-left:0 !important;
    }
}
</style>
