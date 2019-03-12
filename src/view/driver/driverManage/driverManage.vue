<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="leagueDriverData" :style="{}"></topHost>
      <Card shadow style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">城市</span>
        <Select v-model="citySelected" style="width:80px;margin-right:10px;" transfer @on-change="changeCity">
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in city_arr" :value="item.id" :key="index">{{ item.city }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">加盟状态</span>
        <Select v-model="teamStatusSelected" style="width:120px;margin-right:10px;" transfer @on-change="changeTeamStatus">
            <Option v-for="(item,index) in teamStatusOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">运营状态</span>
        <Select v-model="operationSelected" style="width:100px;margin-right:10px;" transfer @on-change="changeOperateStatus">
            <Option v-for="(item,index) in operationOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">是否绑车</span>
        <Select v-model="bindingSelected" style="width:100px;margin-right:10px;" transfer @on-change="changeBinding">
            <Option v-for="(item,index) in bindingOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">是否有营运证</span>
        <Select v-model="serviceSelected" style="width:100px;margin-right:10px;" transfer @on-change="changeService">
            <Option v-for="(item,index) in serviceOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">车队</span>
        <Select v-model="carTeamSelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,index) in carTeamOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <DatePicker type="daterange" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择注册时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入司机姓名"
        style="width:200px" transfer>
            <Option v-for="item in driverGather" :value="item.id" :key="item.id" >{{ item.id_name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <Input v-model="driverPhone" placeholder="请输入司机手机号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="findDriver">查询</Button>

        <Divider />
        
        <Button type="primary" style="margin-right:30px;" @click="new_edit_driver(1)">新增加盟司机</Button>
        <Button type="primary" style="margin-right:30px;">导入加盟司机</Button>

      </Card>
      <Card shadow style="margin-top:30px;margin-bottom:130px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 5px" @click="check_driver(row.id,row.binding_id)">查看</Button>
                <Button type="primary" style="margin-right: 5px" @click="new_edit_driver(2,row.id)">编辑</Button>
                <Button type="error" @click="remove(row.id)">删除</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
      </Card>
  </div>
</template>

<script>
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page } from 'iview'
import { mapActions } from 'vuex'
import topHost from '_c/top-host'
import moment from 'moment' 
export default {
  name: 'driverManage',
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
    topHost,
  },
  data () {
    return {
      leagueDriverData: [
        { title:'加盟司机',colSpan:4,value:60,em:true},
        { title:'已审核司机',colSpan:4,value:8,em:true},
        { title:'待审核司机',colSpan:4,value:8,em:true},
        { title:'停运司机',colSpan:4,value:8,em:false},
      ],
      citySelected:-1,
      city_arr:[],
      teamStatusSelected:4,
      teamStatusOptions:[
        {label:'全部',value:4},
        {label:'未审核',value:0},
        {label:'待审核',value:1},
        {label:'审核通过',value:2},
        {label:'审核拒绝',value:3},
      ],
      operationSelected:2,
      operationOptions:[
        {label:'全部',value:2},
        {label:'停运',value:0},
        {label:'正常',value:1},
      ],
      bindingSelected:2,
      bindingOptions:[
        {label:'全部',value:2},
        {label:'未绑车',value:0},
        {label:'已绑车',value:1},
      ],
      serviceSelected:2,
      serviceOptions:[
        {label:'全部',value:2},
        {label:'否',value:0},
        {label:'是',value:1},
      ],
      carTeamSelected:1,
      carTeamOptions:[
        {label:'x车队',value:1},
        {label:'滴滴车队',value:2},
      ],
      date_val:['',''],
      driverName:'',
      inputNameShake:'',
      driverGather:[],
      driverPhone:'',
      order_columns: [
            {
                title: '姓名',
                key: 'id_name'
            },
            {
                title: '注册城市',
                key: 'city'
            },
            {
                title: '手机号',
                key: 'telephone'
            },
            {
                title: '车牌号',
                key: 'binding_info.car_no'
            },
            {
                title: '审核状态',
                key: 'type',
                render: (h, params) => {
                    return h('div', [
                        h('div',this.getAuthCarStatus(params.row.auth_status)),
                    ]);
                }
            },
            {
                title: '运营状态',
                key: 'type',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.status === 0 ? '停运':'正常'),
                    ]);
                }
            },
            {
                title: '是否绑车',
                key: 'type',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.is_binding === 0 ? '否':'是'),
                    ]);
                }
            },
            {
                title: '是否有营运证',
                key: 'type',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.is_server === 0 ? '否':'是'),
                    ]);
                }
            },
            {
                title: '操作',
                slot: 'action',
                width: 220,
                align: 'center'
            }
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
    }
  },
  methods: {
    ...mapActions([
      'getCompanyCityLists',
      'getDriverLists',
      'bindingCar',
      'delDriver',
    ]),
    getAuthCarStatus(status){
        if(status === 0){
            return '未审核'
        }else if(status === 1){
            return '待审核'
        }else if(status === 2){
            return '审核通过'
        }else if(status === 3){
            return '审核拒绝'
        }
    },
    changeCity(val){
        this.order_data = [];
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === -1){
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getDriverLists({ id:'',status:'',city_id:val,start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeTeamStatus(val){
        this.order_data = [];
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === 4){
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:val,is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeOperateStatus(val){
        this.order_data = [];
        this.teamStatusSelected = 4;
        this.bindingSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === 2){
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getDriverLists({ id:'',status:val,city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeBinding(val){
        this.order_data = [];
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === 2){
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:val,is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    changeService(val){
        this.order_data = [];
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === 2){
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }else{
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:val,search:'',offset:0,limit:this.pageSize }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
        }
    },
    searchName(value){
      if(this.inputNameShake) clearTimeout(this.inputNameShake)
        this.inputNameShake = setTimeout(()=>{
            this.getDriverLists({ id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                this.driverGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.driverGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectName(val){
        this.getDriverLists({ id:val,status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
            this.driverName = data.data.data.rows[0].id_name
            this.driverPhone = data.data.data.rows[0].telephone
        })
    },
    findDriver(){
        this.getDriverLists({ id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:this.driverName,telephone:this.driverPhone,auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    check_driver(index,binding_id){
        this.bindingCar({ driver_id:index,car_id:binding_id }).then((data) => {
            if(data.data.data.car === 1){
                this.$router.push({path:'checkDriver',query:{id:index,binding_id:binding_id}});
            }else{
                this.$router.push({path:'checkDriver',query:{id:index}});
            }
        })
    },
    new_edit_driver(type,index){
      if(index){
        this.$router.push({path:'newEditDriver',query:{id:index}});
      }else{
        this.$router.push({path:'newEditDriver'});
      }
    },
    remove(index){
        this.delDriver({ id:index }).then((data) => {
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
                        this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                            this.order_data = []
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                            this.pageTotal = data.data.data.total
                        })
                    }else{
                        this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
        this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getDriverLists({ id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:size }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
  },
  mounted () {
    this.getDriverLists({ id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
      for(let i=0; i<data.data.data.rows.length; i++){
        this.$set(this.order_data,i,data.data.data.rows[i])
      }
      this.pageTotal = data.data.data.total
    })

    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.city_arr,i,data.data.data.rows[i])
        }
    })

  },
  activated () {
    this.getDriverLists({ id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
      for(let i=0; i<data.data.data.rows.length; i++){
        this.$set(this.order_data,i,data.data.data.rows[i])
      }
      this.pageTotal = data.data.data.total
    })

    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.city_arr,i,data.data.data.rows[i])
        }
    })

  }
}
</script>

<style lang="less">

</style>
