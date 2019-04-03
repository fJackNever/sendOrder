<template>
  <div style="padding:0 24px 24px;">
    <topHost :itemCol="leagueDriverData" @transferdata="updateTable"></topHost>
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

        <Divider />

        <span style="font-size:14px;padding-right:10px;">是否绑车</span>
        <Select v-model="bindingSelected" style="width:100px;margin-right:10px;" transfer @on-change="changeBinding">
            <Option v-for="(item,index) in bindingOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">是否有营运证</span>
        <Select v-model="serviceSelected" style="width:100px;margin-right:10px;" transfer @on-change="changeService">
            <Option v-for="(item,index) in serviceOptions" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">车队</span>
        <Select v-model="carTeamSelected" style="width:150px;margin-right:10px;" transfer @on-change="changeTeam">
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in carTeamOptions" :value="item.id" :key="index">{{ item.fleet_name }}</Option>
        </Select>

        <DatePicker type="daterange" @on-change="changeDate" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择注册时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入司机姓名"
        style="width:200px" transfer>
            <Option v-for="(item,index) in driverGather" :value="item.id" :key="index" >{{ item.id_name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <Input v-model="driverPhone" placeholder="请输入司机手机号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" @click="findDriver">查询</Button>

        <Divider />
        
        <Button type="primary" style="margin-right:30px;" @click="new_driver('new')">新增加盟司机</Button>
        <!-- <Button type="primary" style="margin-right:30px;">导入加盟司机</Button> -->

      </Card>
      <Card shadow style="margin-top:30px;margin-bottom:130px;">
        <Table border :columns="order_columns" :data="order_data">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-right: 10px" @click="check_driver(row.id)" >查看</Button>
                <Button type="primary" style="margin-right: 10px" @click="new_edit_driver(2,row.id)">编辑</Button>
                <Button type="primary" style="margin-right: 10px" @click="un_bind_driver(1,row.id)" v-if="row.is_binding === 0">绑车</Button>
                <Button type="primary" style="margin-right: 10px" @click="un_bind_driver(2,row.id,row.binding_id)"  v-if="row.is_binding === 1" >解绑</Button>
                <Button type="success" style="margin-right: 10px" @click="stop_recover(1,row.id)" v-if="row.status === 0">恢复运营</Button>
                <Button type="success" style="margin-right: 10px" @click="stop_recover(0,row.id)" v-if="row.status === 1">停运</Button>
                <Button type="error" @click="remove(row.id)">删除</Button>
            </template>
        </Table>
        <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
      </Card>
      <Modal title="绑定车辆" v-model="bindVisible" :footer-hide="true">
            <div style="text-align: center;">
                <span style="font-size:14px;padding-right:10px;">绑定车辆</span>
                <AutoComplete
                    v-model="bindCar"
                    @on-search="searchBindCar"
                    @on-select="selectBindCar"
                    placeholder="请输入绑定车牌号"
                    style="width:200px" transfer>
                    <Option v-for="item in bindCarGather" :value="item.id" :key="item.id" >{{ item.car_no }}</Option>
                </AutoComplete>
            </div>
            <div style="text-align: center;margin:20px 0;">
                <Button type="error" @click="handleSure()">确认</Button>
            </div>
      </Modal>
      <Modal 
            title="是否改派"
            v-model="unBindVisible" 
            @on-ok="confirmUnBind"
            ok-text="是"
            cancel-text="否"
            class="reassignModal"
      >
      </Modal>
      <Modal 
            :title="operateTitle"
            v-model="operateVisible" 
            @on-ok="confirmOperate"
            ok-text="是"
            cancel-text="否"
            class="reassignModal"
      >
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
import { Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Page,Modal,Poptip } from 'iview'
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
    Modal,
    Poptip,
  },
  data () {
    return {
      leagueDriverData: [],
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
      carTeamSelected:-1,
      carTeamOptions:[],
      date_val:['',''],
      driverName:'',
      inputNameShake:'',
      driverGather:[],
      driverPhone:'',
      order_columns: [
            {
                title: '姓名',
                key: 'id_name',
                width:100,
            },
            {
                title: '注册城市',
                key: 'city',
            },
            {
                title: '手机号',
                key: 'telephone',
            },
            {
                title: '车牌号',
                key: 'binding_info',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.binding_info.car_no),
                    ]);
                }
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
                width: 400,
                align: 'center'
            }
        ],
        order_data: [],
        pageTotal:0,
        pageSize:10,
        pageCurrent:1,
        bindVisible:false,
        bindCar:'',
        bindCarGather:[],
        inputCarShake:'',
        carId:'',
        driverId:'',
        permission_arr:'',
        unBindVisible:false,
        carModalId:'',
        driverModalId:'',
        operateTitle:'',
        operateVisible:false,
        operateId:'',
        operateType:'',
        deleteVisible:false,
        deleteId:'',
    }
  },
  methods: {
    ...mapActions([
      'getCompanyCityLists',
      'getDriverLists',
      'bindingCar',
      'unbindingCar',
      'editDriverStatus',
      'delDriver',
      'getCarLists',
      'getFleetLists',
      'getDriverHost',
    ]),
    confirmUnBind(){

    },
    updateTable(index){
        if(index === 0){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
        }else if(index === 1){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:2,is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
        }else if(index === 2){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:1,is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
        }else if(index === 3){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:3,is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
        this.carTeamSelected = -1;
        this.order_data = [];
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === -1){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:val,start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    changeTeamStatus(val){
        this.carTeamSelected = -1;
        this.order_data = [];
        this.citySelected = -1;
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === 4){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:val,is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    changeOperateStatus(val){
        this.carTeamSelected = -1;
        this.order_data = [];
        this.citySelected = -1;
        this.teamStatusSelected = 4;
        this.bindingSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === 2){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.getDriverLists({ id:'',fleet_id:'',status:val,city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    changeBinding(val){
        this.carTeamSelected = -1;
        this.order_data = [];
        this.citySelected = -1;
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === 2){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:val,is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    changeService(val){
        
        this.carTeamSelected = -1;
        this.order_data = [];
        this.citySelected = -1;
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === 2){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:val,search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    changeTeam(val){
        this.serviceSelected = 2
        this.order_data = [];
        this.citySelected = -1;
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        if(val === -1){
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.getDriverLists({ id:'',fleet_id:val,status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    changeDate(date){
        this.carTeamSelected = -1;
        this.order_data = [];
        this.citySelected = -1;
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.serviceSelected = 2;
        this.driverName = '';
        this.driverPhone = '';
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:date[0],end_time:date[1],id_name:this.driverName,telephone:this.driverPhone,auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
    searchName(value){
      if(this.inputNameShake) clearTimeout(this.inputNameShake)
        this.inputNameShake = setTimeout(()=>{
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:value,telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                this.driverGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.driverGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectName(val){
        this.getDriverLists({ id:val,fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
            this.driverName = data.data.data.rows[0].id_name
            this.driverPhone = data.data.data.rows[0].telephone
        })
    },
    findDriver(){
        this.order_data = [];
        this.citySelected = -1;
        this.teamStatusSelected = 4;
        this.operationSelected = 2;
        this.bindingSelected = 2;
        this.serviceSelected = 2;
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:this.driverName,telephone:this.driverPhone,auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
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
    check_driver(index){
        
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2001'){
                    per_val = 2001
                }
            }
            if(per_val === 2001){
                this.$router.push({path:'checkDriver',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'checkDriver',query:{id:index}});
        }

    },
    new_driver(new_type){
        let per_val = ''
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2008'){
                    per_val = 2008
                }
            }
            if(per_val === 2008){
                this.$router.push({path:'newDriver',query:{type:new_type}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'newDriver',query:{type:new_type}});
        }
    },
    new_edit_driver(type,index){

      let per_val = '' 
    
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2002'){
                    per_val = 2002
                }
            }
            if(per_val === 2002){
                this.$router.push({path:'editDriver',query:{id:index}});
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.$router.push({path:'editDriver',query:{id:index}});
        }
    },
    searchBindCar(value){
        if(this.inputCarShake) clearTimeout(this.inputCarShake)
        this.inputCarShake = setTimeout(()=>{
            this.getCarLists({ id:'',status:'',car_template_id:'',start_time:'',end_time:'',car_no:value,search:'',offset:0,limit:10 }).then((data) => {
                this.bindCarGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.bindCarGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectBindCar(val){
        this.getCarLists({ id:val,status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10 }).then((data) => {
            this.bindCar = data.data.data.rows[0].car_no
            this.carId = val
        })
    },
    handleSure(){
        this.bindingCar({ 
            car_id:this.carId,
            driver_id:this.driverId,
        }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('绑定成功!');
                this.bindVisible = false;
                if(this.pageCurrent > 1){
                    this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                        this.order_data = []
                        for(let i=0; i<data.data.data.rows.length; i++){
                            this.$set(this.order_data,i,data.data.data.rows[i])
                        }
                        this.$refs.Pagination.currentPage = this.pageCurrent;
                        this.pageTotal = data.data.data.total
                    })
                }else{
                    this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                        this.order_data = []
                        for(let i=0; i<data.data.data.rows.length; i++){
                            this.$set(this.order_data,i,data.data.data.rows[i])
                        }
                        this.pageTotal = data.data.data.total
                    })
                }
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    un_bind_driver(type,id,bind_id){
        let per_val = '';
        if(type === 1){
            
            if(this.permission_arr[0] !== '9999'){

                for(let i=0; i<this.permission_arr[2000].length; i++){
                    if(this.permission_arr[2000][i] === '2004'){
                        per_val = 2004
                    }
                }

                if(per_val === 2004){
                    this.bindVisible = true;
                    this.driverId = id;
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '暂无权限访问！'
                    });
                }

            }else{
                this.bindVisible = true;
                this.driverId = id;
            }

        }else{

            this.carModalId = bind_id;
            this.driverModalId  = id;
            this.unBindVisible = true;
        }
    },
    confirmUnBind(){
        let per_val = '';
        if(this.permission_arr[0] !== '9999'){
                for(let i=0; i<this.permission_arr[2000].length; i++){
                    if(this.permission_arr[2000][i] === '2005'){
                        per_val = 2005
                    }
                }

                if(per_val === 2005){
                    this.unbindingCar({ 
                        car_id:this.carModalId,
                        driver_id:this.driverModalId,
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('解绑成功!');
                            if(this.pageCurrent > 1){
                                this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent;
                                    this.pageTotal = data.data.data.total
                                    this.unBindVisible = false;
                                })
                            }else{
                                this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.pageTotal = data.data.data.total
                                })
                            }
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '暂无权限访问！'
                    });
                }
            }else{
                this.unbindingCar({ 
                    car_id:this.carModalId,
                    driver_id:this.driverModalId,
                }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('解绑成功!');
                        if(this.pageCurrent > 1){
                            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent;
                                this.pageTotal = data.data.data.total
                                this.unBindVisible = false;
                            })
                        }else{
                            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                        }
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })
            } 

    },
    stop_recover(type,id){
        this.operateVisible = true;
        this.operateType = type
        this.operateId = id;
        if(type === 1){
            this.operateTitle = '是否恢复运营'
        }else{
            this.operateTitle = '是否停运'
        }  
    },
    confirmOperate(){
        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2006'){
                    per_val = 2006
                }
            }

            if(per_val === 2006){

                this.editDriverStatus({ 
                    id:this.operateId,
                    status:this.operateType,
                    server_comment:'',
                    }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('修改成功!');
                        if(this.pageCurrent > 1){
                            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent;
                                this.pageTotal = data.data.data.total
                                this.operateVisible = false;
                            })
                        }else{
                            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.pageTotal = data.data.data.total
                            })
                        }
                    }else{
                        this.$Notice.warning({
                            title: '嘀友提醒',
                            desc: data.data.msg
                        });
                    }
                })

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.editDriverStatus({ 
                id:this.operateId,
                status:this.operateType,
                server_comment:'',
                }).then((data) => {
                if(data.data.code === 1){
                    this.$Message.success('修改成功!');
                    if(this.pageCurrent > 1){
                        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(this.pageCurrent - 1)*this.pageSize,limit:this.pageSize }).then((data) => {
                            this.order_data = []
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.$refs.Pagination.currentPage = this.pageCurrent;
                            this.pageTotal = data.data.data.total
                            this.operateVisible = false;
                        })
                    }else{
                        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
                            this.order_data = []
                            for(let i=0; i<data.data.data.rows.length; i++){
                                this.$set(this.order_data,i,data.data.data.rows[i])
                            }
                            this.pageTotal = data.data.data.total
                        })
                    }
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }
    },
    remove(index){
        this.deleteVisible = true;
        this.deleteId = index;
    },
    confirmDelete(){

        let per_val = '' 
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[2000].length; i++){
                if(this.permission_arr[2000][i] === '2009'){
                    per_val = 2009
                }
            }

            if(per_val === 2009){

                this.delDriver({ id:this.deleteId }).then((data) => {
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
                                this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                    this.order_data = []
                                    for(let i=0; i<data.data.data.rows.length; i++){
                                        this.$set(this.order_data,i,data.data.data.rows[i])
                                    }
                                    this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                    this.pageTotal = data.data.data.total
                                })
                            }else{
                                this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
            this.delDriver({ id:this.deleteId }).then((data) => {
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
                            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(this.pageCurrent - 2)*this.pageSize,limit:this.pageSize }).then((data) => {
                                this.order_data = []
                                for(let i=0; i<data.data.data.rows.length; i++){
                                    this.$set(this.order_data,i,data.data.data.rows[i])
                                }
                                this.$refs.Pagination.currentPage = this.pageCurrent - 1;
                                this.pageTotal = data.data.data.total
                            })
                        }else{
                            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:this.date_val[0],end_time:this.date_val[1],id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:size }).then((data) => {
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
      
    this.getDriverHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.leagueDriverData,0,{ title:'加盟司机',colSpan:5,value:data.data.data.total,em:true})
            this.$set(this.leagueDriverData,1,{ title:'已审核司机',colSpan:5,value:data.data.data.auth,em:true})
            this.$set(this.leagueDriverData,2,{ title:'待审核司机',colSpan:5,value:data.data.data.wait_auth,em:true})
            this.$set(this.leagueDriverData,3,{ title:'停运司机',colSpan:5,value:data.data.data.stop_service,em:false})
        }else{
            this.$set(this.leagueDriverData,0,{ title:'加盟司机',colSpan:5,value:0,em:true})
            this.$set(this.leagueDriverData,1,{ title:'已审核司机',colSpan:5,value:0,em:true})
            this.$set(this.leagueDriverData,2,{ title:'待审核司机',colSpan:5,value:0,em:true})
            this.$set(this.leagueDriverData,3,{ title:'停运司机',colSpan:5,value:0,em:false})
        }
    })

    this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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

    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
        if(data.data.code === 1){
            this.city_arr = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.city_arr,i,data.data.data.rows[i])
            }
        }else{
            this.city_arr = [];
        }
    })

    this.getFleetLists({ id:'',status:1,fleet_no:'',fleet_name:'',search:'',offset:0,limit:10000 }).then((data) => {
        if(data.data.code === 1){
            this.carTeamOptions = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.carTeamOptions,i,data.data.data.rows[i])
            }
        }else{
            this.carTeamOptions = [];
        }
        
    })

  },
  activated () {

    this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))

    this.getDriverHost().then((data) => {
        if(data.data.code === 1){
            this.$set(this.leagueDriverData,0,{ title:'加盟司机',colSpan:5,value:data.data.data.total,em:true})
            this.$set(this.leagueDriverData,1,{ title:'已审核司机',colSpan:5,value:data.data.data.auth,em:true})
            this.$set(this.leagueDriverData,2,{ title:'待审核司机',colSpan:5,value:data.data.data.wait_auth,em:true})
            this.$set(this.leagueDriverData,3,{ title:'停运司机',colSpan:5,value:data.data.data.stop_service,em:false})
        }else{
            this.$set(this.leagueDriverData,0,{ title:'加盟司机',colSpan:5,value:0,em:true})
            this.$set(this.leagueDriverData,1,{ title:'已审核司机',colSpan:5,value:0,em:true})
            this.$set(this.leagueDriverData,2,{ title:'待审核司机',colSpan:5,value:0,em:true})
            this.$set(this.leagueDriverData,3,{ title:'停运司机',colSpan:5,value:0,em:false})
        }
    })

    this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
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

    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
        if(data.data.code === 1){
            this.city_arr = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.city_arr,i,data.data.data.rows[i])
            }
        }else{
            this.city_arr = [];
        }
    })

    this.getFleetLists({ id:'',status:1,fleet_no:'',fleet_name:'',search:'',offset:0,limit:10000 }).then((data) => {
        if(data.data.code === 1){
            this.carTeamOptions = [];
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.carTeamOptions,i,data.data.data.rows[i])
            }
        }else{
            this.carTeamOptions = [];
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
