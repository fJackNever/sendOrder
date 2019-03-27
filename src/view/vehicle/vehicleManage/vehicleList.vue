<template>
  <div style="padding:0 24px 24px;">
      <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">品牌车型</span>
        <Select v-model="modelSelected" style="width:150px;margin-right:10px;" transfer @on-change="changeModel">
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in modelOptions" :value="item.id" :key="index">{{ item.brand + '-' + item.model }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">审核状态</span>
        <Select v-model="statusSelected" style="width:150px;margin-right:10px;" transfer @on-change="changeStatus">
            <Option v-for="(item,index) in statusOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">注册日期</span>
        <DatePicker type="daterange" @on-change="changeDate" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">车牌号</span>
        <AutoComplete
        v-model="licenseNum"
        @on-search="searchLicenseNum"
        @on-select="selectLicenseNum"
        placeholder="请输入车牌号"
        style="width:200px;" transfer>
            <Option v-for="item in licenseNumGather" :value="item.id" :key="item.id" >{{ item.car_no }}</Option>
        </AutoComplete>

        <Button type="success" style="margin-left:30px;" @click="findVehicle">查询</Button>
        <Button type="success" style="margin-left:30px;" @click="new_edit_vehicle(1)">添加车辆</Button>
        <!-- <Button type="success" style="margin-left:30px;">导入车辆</Button> -->
        <Button type="success" style="margin-left:30px;" @click="exportData">导出车辆</Button>

        <Divider />
        
      </Card>
      <Card shadow style="margin-top:30px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="checkVehicle(row.id,'check')">查看与审核</Button>
                <Button type="primary" style="margin-right: 5px" @click="new_edit_vehicle(2,row.id)">编辑</Button>
                <Button type="error" @click="deleteRecord(row.id)">删除</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
      </Card>
  </div>
</template>

<script>
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page } from 'iview'
import { mapActions } from 'vuex'
import FileSaver from 'file-saver';
export default {
  name: 'vehicleList',
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
  },
  data () {
    return {
      modelSelected:'',
      modelOptions:[],
      statusSelected:3,
      statusOptions:[
        {label:'全部',value:3},
        {label:'待审核',value:0},
        {label:'审核通过',value:1},
        {label:'审核拒绝',value:2},
      ],
      date_val:['',''],
      licenseNum:'',
      licenseNumGather:[],
      inputCarShake:'',
      order_columns: [
            {
                title: '车牌号',
                key: 'car_no'
            },
            {
                title: '所有人',
                key: 'owner'
            },
            {
                title: '品牌车型',
                key: 'brand_model'
            },
            {
                title: '车身颜色',
                key: 'car_color'
            },
            {
                title: '车辆注册日期',
                key: 'register_date'
            },
            {
                title: '绑定司机',
                key: 'binding_info',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.binding_info.id_name),
                    ]);
                }
            },
            {
                title: '司机手机号',
                key: 'binding_info',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.binding_info.telephone),
                    ]);
                }
            },
            {
                title: '审核状态',
                key: 'type',
                render: (h, params) => {
                    return h('div', [
                        h('div',this.getAuthCarStatus(params.row.status)),
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
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        permission_arr:''
    }
  },
  methods: {
    ...mapActions([
      'getCarTemplateLists',
      'getCarLists',
      'delCar',
    ]),

    exportData(){

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[3000].length; i++){
                if(this.permission_arr[3000][i] === '3007'){
                    per_val = 3007
                }
            }
            if(per_val === 3007){
                
                this.getCarLists({ id:'',status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:100000 }).then((data) => {
                    let result = data.data.data.rows[0];
                    let str = '车牌号,所有人,品牌车型,车身颜色,车辆注册日期,绑定司机,司机手机号,审核状态';
                    let check_status;
                    for (let i=0; i<result.length; i++) {

                        if(result[i].status === 0){
                            check_status = '待审核'
                        }else if(status === 1){
                            check_status = '审核通过'
                        }else if(status === 2){
                            check_status = '审核拒绝'
                        }

                            str += '\n' +
                            result[i].car_no + ',' +
                            result[i].owner + ',' +
                            result[i].brand_model + ',' +
                            result[i].car_color+ ',' +
                            result[i].register_date + ',' +
                            result[i].binding_info.id_name + ',' +
                            result[i].binding_info.telephone + ',' +
                            check_status
                    }
                    let exportContent = "\uFEFF";
                    let blob = new Blob([exportContent + str], {
                        type: "text/plain;charset=utf-8"
                    });
                    FileSaver.saveAs(blob, "车辆记录列表.xls");

                })

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            
            this.getCarLists({ id:'',status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:100000 }).then((data) => {
                let result = data.data.data.rows[0];
                let str = '车牌号,所有人,品牌车型,车身颜色,车辆注册日期,绑定司机,司机手机号,审核状态';
                let check_status;
                for (let i=0; i<result.length; i++) {

                    if(result[i].status === 0){
                        check_status = '待审核'
                    }else if(status === 1){
                        check_status = '审核通过'
                    }else if(status === 2){
                        check_status = '审核拒绝'
                    }

                        str += '\n' +
                        result[i].car_no + ',' +
                        result[i].owner + ',' +
                        result[i].brand_model + ',' +
                        result[i].car_color+ ',' +
                        result[i].register_date + ',' +
                        result[i].binding_info.id_name + ',' +
                        result[i].binding_info.telephone + ',' +
                        check_status
                }
                let exportContent = "\uFEFF";
                let blob = new Blob([exportContent + str], {
                    type: "text/plain;charset=utf-8"
                });
                FileSaver.saveAs(blob, "车辆记录列表.xls");

            })

        }
        
        
        
    },

    getAuthCarStatus(status){
        if(status === 0){
            return '待审核'
        }else if(status === 1){
            return '审核通过'
        }else if(status === 2){
            return '审核拒绝'
        }
    },
    changeModel(val){
        this.statusSelected = 3;
        this.licenseNum = '';
        if(val === -1){
            this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getCarLists({ id:'',status:'',car_template_id:val,start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeStatus(val){
        this.modelSelected = -1;
        this.licenseNum = '';
        if(val === 3){
            this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getCarLists({ id:'',status:val,car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeDate(date){
        this.statusSelected = 3;
        this.modelSelected = -1;
        this.licenseNum = '';
        this.$set(this.date_val,0,date[0])
        this.$set(this.date_val,1,date[1])
        this.getCarLists({ id:'',status:'',car_template_id:'',start_time:date[0],end_time:date[1],car_no:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    searchLicenseNum(value){
        if(this.inputCarShake) clearTimeout(this.inputCarShake)
        this.inputCarShake = setTimeout(()=>{
            this.getCarLists({ id:'',status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10 }).then((data) => {
                this.licenseNumGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.licenseNumGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectLicenseNum(val){
        this.getCarLists({ id:val,status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10 }).then((data) => {
            this.licenseNum = data.data.data.rows[0].car_no
        })
    },
    findVehicle(){
        this.order_data = [];
        this.statusSelected = 3;
        this.modelSelected = -1;
        this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:this.licenseNum,search:'',offset:0,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    checkVehicle(index,type){

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[3000].length; i++){
                if(this.permission_arr[3000][i] === '3004'){
                    per_val = 3004
                }
            }
            if(per_val === 3004){
                this.$router.push({path:'check_vehicle',query:{id:index,type}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'check_vehicle',query:{id:index,type}});
        }

      
    },
    new_edit_vehicle(type,index){
      if(index){
        
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[3000].length; i++){
                if(this.permission_arr[3000][i] === '3002'){
                    per_val = 3002
                }
            }
            if(per_val === 3002){
                this.$router.push({path:'edit_vehicle',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'edit_vehicle',query:{id:index}});
        }

        
      }else{

          if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[3000].length; i++){
                if(this.permission_arr[3000][i] === '3001'){
                    per_val = 3001
                }
            }
            if(per_val === 3001){
                this.$router.push({path:'new_vehicle'});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'new_vehicle'});
        }

        
      }
    },
    deleteRecord(index){

        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[3000].length; i++){
                if(this.permission_arr[3000][i] === '3005'){
                    per_val = 3005
                }
            }
            if(per_val === 3005){
                
                this.delCar({ id:index }).then((data) => {
                    if(data.data.code === 1){
                        for(let i=0; i<this.order_data.length;){
                            if(index === this.order_data[i].id){
                                this.order_data.splice(i,1)
                            }else{
                                i++
                            }
                        }
                        this.$Message.success('删除成功!');
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
                                this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.delCar({ id:index }).then((data) => {
                if(data.data.code === 1){
                    for(let i=0; i<this.order_data.length;){
                        if(index === this.order_data[i].id){
                            this.order_data.splice(i,1)
                        }else{
                            i++
                        }
                    }
                    this.$Message.success('删除成功!');
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
                            this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                this.pageTotal = data.data.data.total
                            })
                        }else{
                            this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
        this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getCarLists({ id:'',status:'',car_template_id:'',start_time:this.date_val[0],end_time:this.date_val[1],car_no:'',search:'',offset:0,limit:size }).then((data) => {
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
    this.getCarTemplateLists({ id:'',status:1,use_car_type_id:'',search:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.modelOptions,i,data.data.data.rows[i])
        }
    })

    this.getCarLists({ id:'',status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })

  },
  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getCarTemplateLists({ id:'',status:1,use_car_type_id:'',search:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.modelOptions,i,data.data.data.rows[i])
        }
    })

    this.getCarLists({ id:'',status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.order_data,i,data.data.data.rows[i])
        }
        this.pageTotal = data.data.data.total
    })

  }
}
</script>

<style lang="less">

</style>
