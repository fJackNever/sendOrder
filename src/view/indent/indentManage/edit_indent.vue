<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" class="indentCard">
        <div slot="title" class="cardSlot">
            <div style="width:200px;margin-top:6px;">{{cardTitle}}</div>
            <Steps :current="current">
                <Step title="待处理"></Step>
                <Step title="待抢单"></Step>
                <Step title="已接单"></Step>
                <Step title="出发接乘客"></Step>
                <Step title="已接到乘客"></Step>
                <Step title="已完成"></Step>
                <Step title="已取消"></Step>
            </Steps>
        </div>
        <Row>
            <Col span="8">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                    <div style="margin:10px 0;">订单信息</div>
                    <FormItem label="订单类型" prop="indentType">
                        <Select v-model="formValidate.indentType" placeholder="请选择订单类型" style="width:200px" @on-change="changePrice('indentType',$event)">
                            <Option :value="1">日租包车</Option>
                            <Option :value="2">半日租包车</Option>
                            <Option :value="3">点对点用车</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="车型要求" prop="modelRequire">
                        <Select v-model="formValidate.modelRequire" placeholder="请选择车型要求" style="width:200px" @on-change="changePrice('modelRequire',$event)">
                            <Option v-for="(item,index) in useCarArr" :value="item.id" :key="index">{{ item.name }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="订单开始时间" prop="indentStartDate" :label-width="100">
                        <DatePicker type="date" placeholder="请选择日期" v-model="formValidate.indentStartDate" style="width:200px" @on-change="changePrice('indentStartDate',$event)"></DatePicker>
                    </FormItem>
                    <FormItem prop="indentStartTime" :label-width="100">
                        <TimePicker type="time" v-model="formValidate.indentStartTime" placeholder="请选择时间" style="width: 168px" @on-change="changePrice('indentStartTime',$event)"></TimePicker>
                    </FormItem>
                    
                    <FormItem label="订单城市" prop="indentCity">
                        <Select v-model="formValidate.indentCity" placeholder="请选择订单城市" style="width:200px" @on-change="changePrice('indentCity',$event)">
                            <Option v-for="item in cityArr" :value="item.id + ',' + item.city" >{{ item.city }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="客户名称" prop="cusName">
                        <AutoComplete
                        v-model="formValidate.cusName"
                        @on-search="searchName"
                        @on-select="changePrice('cusName',$event)"
                        placeholder="请输入客户名称"
                        style="width:200px" transfer>
                            <Option v-for="(item,index) in cusGather" :value="item.id" :key="index" >{{ item.name }}</Option>
                        </AutoComplete>
                    </FormItem>

                    <FormItem label="订单起点" prop="startAddress">
                        <AutoComplete
                        v-model="formValidate.startAddress"
                        @on-search="searchStartAddress"
                        @on-select="selectStartAddress"
                        placeholder="请输入订单起点"
                        style="width:200px" transfer>
                            <Option v-for="(item,index) in startAddressGather" :value="item.name" :key="index" >{{ item.name }}</Option>
                        </AutoComplete>
                        <!-- <Icon type="ios-pin" :size="25" style="margin-left:10px;cursor:pointer;" @click="locate(1)" v-if="start_icon_show"/> -->
                    </FormItem>

                    <FormItem label="订单终点" prop="endAddress" v-if="end_address_show">
                        <AutoComplete
                        v-model="formValidate.endAddress"
                        @on-search="searchEndAddress"
                        @on-select="selectEndAddress"
                        placeholder="请输入订单终点"
                        style="width:200px" transfer>
                            <Option v-for="(item,index) in endAddressGather" :value="item.name" :key="index" >{{ item.name }}</Option>
                        </AutoComplete>
                        <!-- <Icon type="ios-pin" :size="25" style="margin-left:10px;cursor:pointer;" @click="locate(2)"/> -->
                    </FormItem>

                    <FormItem label="平台价格" prop="platformPrice">
                        <InputNumber :min="0" v-model="formValidate.platformPrice" disabled></InputNumber>
                    </FormItem>

                    <FormItem label="订单价格" prop="indentPrice">
                        <InputNumber :min="0" v-model="formValidate.indentPrice" @on-change="changeIp"></InputNumber>
                    </FormItem>

                    <FormItem label="司机价格" prop="deiverPrice">
                        <InputNumber :min="0" v-model="formValidate.deiverPrice" @on-change="changeDp"></InputNumber>
                    </FormItem>

                    <div style="margin:10px 0;">乘客信息</div>
                    <FormItem label="乘客称呼" prop="passengerName">
                        <Input v-model="formValidate.passengerName" placeholder="请输入乘客称呼" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="乘客电话" prop="passengerPhone">
                        <Input v-model="formValidate.passengerPhone" placeholder="请输入乘客电话" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="注意事项" prop="desc" style="width:400px;">
                        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入注意事项"></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">修改</Button>
                    </FormItem>

                </Form>
            </Col>
            <Col span="16">
                <baidu-map class="bm-view" center="上海" ak="A1KbCD1wUrTDiAxu46BtmVhI">
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    <bm-driving
                        :start="indentStartAddress"
                        :end="indentEndAddress"
                        :auto-viewport="true"
                        policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
                        :panel="false"
                        :location="addressCity"
                        v-if="path_show">
                    </bm-driving>
                    <bm-marker :position="{lng: this.markerLng, lat: this.markerLat}" :dragging="true" v-if="point_show"></bm-marker>
                </baidu-map>
            </Col>
        </Row>
      </Card>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation,BmDriving,BmMarker } from 'vue-baidu-map'
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Form,FormItem,RadioGroup,Radio,Modal,Icon,Steps,Step,InputNumber,TimePicker, } from 'iview'
import { mapActions } from 'vuex'
import driverLogo from '@/assets/images/driver.png'
import fetchJsonp from 'fetch-jsonp'
import moment from 'moment' 
export default {
  name: 'edit_indent',
  components: {
    Row,
    Col,
    Card,
    Input,
    Button,
    Divider,
    DatePicker,
    Select,
    Option,
    Table,
    AutoComplete,
    Form,
    FormItem,
    RadioGroup,
    Radio,
    Modal,
    Icon,
    BaiduMap,
    BmNavigation,
    BmDriving,
    BmMarker,
    Steps,
    Step,
    InputNumber,
    TimePicker,
  },
  data () {
    return {
      driverLogo,
      cardTitle:'修改订单',
      current: 0,
      formValidate: {
          indentType:1,
          modelRequire:'',
          indentCity:'',
          startAddress: '',
          endAddress: '',
          platformPrice:0,
          indentPrice: 0,
          deiverPrice:0,
          cusName:'',
          passengerName: '',
          passengerPhone: '',
          desc: '',
      },
      cityArr:[],
      ruleValidate: {

      },
      useCarArr:[],
      start_location:'',
      end_location:'',
      cusId:'',
      cusGather:[],
      inputNameShake:'',
      addressCity:'',
      indentStartAddress:'',
      indentEndAddress:'',
      start_location:'',
      end_location:'',
      order_distance:'',
      auto_num:0,
      start_icon_show:true,
      end_address_show:false,
      markerLng:'',
      markerLat:'',
      startAddressGather:[],
      inputStartAddressShake:'',
      endAddressGather:[],
      inputEndAddressShake:'',
      path_show:true,
      point_show:true,
    }
  },
  methods: {
    ...mapActions([
      'checkOrderGetAmount',
      'getCustomerLists',
      'getUseCarTypeLists',
      'getCompanyCityLists',
      'editOrder',
      'getOrderLists'
    ]),
    searchStartAddress(value){
      if(this.inputStartAddressShake) clearTimeout(this.inputStartAddressShake)
        this.inputStartAddressShake = setTimeout(()=>{
            fetchJsonp('https://api.map.baidu.com/place/v2/suggestion?query='+value+'&region='+this.addressCity+'&city_limit=true&output=json&ak=A1KbCD1wUrTDiAxu46BtmVhI',{
                headers:{ Accept: 'application/json',},
                jsonCallbackFunction:'renderReverse'
            }).then( response => response.json() )
            .then(data => {
                this.startAddressGather = []
                for(let i=0; i<data.result.length; i++){
                    this.$set(this.startAddressGather,i,data.result[i])
                }
            })
        },600)
    },
    selectStartAddress(){
        if(this.start_icon_show){
            this.path_show = false;
            this.point_show = true;
            this.locate(1)
        }else{
            this.path_show = true;
            this.point_show = false;
            this.locate(2)
        }
    },
    searchEndAddress(value){
      if(this.inputEndAddressShake) clearTimeout(this.inputEndAddressShake)
        this.inputEndAddressShake = setTimeout(()=>{
            fetchJsonp('https://api.map.baidu.com/place/v2/suggestion?query='+value+'&region='+this.addressCity+'&city_limit=true&output=json&ak=A1KbCD1wUrTDiAxu46BtmVhI',{
                headers:{ Accept: 'application/json',},
                jsonCallbackFunction:'renderReverse'
            }).then( response => response.json() )
            .then(data => {
                this.endAddressGather = []
                for(let i=0; i<data.result.length; i++){
                    this.$set(this.endAddressGather,i,data.result[i])
                }
            })
        },600)
    },
    selectEndAddress(){
        this.path_show = true;
        this.point_show = false;
        this.locate(2)
    },
    changeIp(val){
        this.$set(this.formValidate,'platformPrice',val - this.formValidate.deiverPrice)
    },
    changeDp(val){
        this.$set(this.formValidate,'platformPrice',this.formValidate.indentPrice - val)
    },
    get_address(val){

        if(this.addressCity !== ''){
            this.markerLng = val.point.lng
            this.markerLat = val.point.lat
            
            this.auto_num++;
            if( this.auto_num%2 === 0){
                fetchJsonp('https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location='+val.point.lat+','+val.point.lng+'&output=json&pois=1&latest_admin=1&ak=A1KbCD1wUrTDiAxu46BtmVhI',{
                    headers:{ Accept: 'application/json',},
                    jsonCallbackFunction:'renderReverse'
                }).then( response => response.json() )
                .then(data => {
                    this.$set(this.formValidate,'endAddress',data.result.formatted_address)
                })
            }else{
                fetchJsonp('https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location='+val.point.lat+','+val.point.lng+'&output=json&pois=1&latest_admin=1&ak=A1KbCD1wUrTDiAxu46BtmVhI',{
                    headers:{ Accept: 'application/json',},
                    jsonCallbackFunction:'renderReverse'
                }).then( response => response.json() )
                .then(data => {
                    this.$set(this.formValidate,'startAddress',data.result.formatted_address)
                })
            }
        }else{
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: '请先选择订单城市'
            });
        }
    },
    changePrice(type,val){

        let momStDate;
        if(this.formValidate.indentStartDate){
            momStDate = moment(this.formValidate.indentStartDate).format('YYYY-MM-DD')
        }else{
            momStDate = ''
        }

        let cityId;
        if(this.formValidate.indentCity){
            cityId = this.formValidate.indentCity.split(',')[0]
        }else{
            cityId = '';
        }

        if(type === 'indentType'){

            if(val === 3){
                this.start_icon_show = false;
                this.end_address_show = true;
            }else{
                this.start_icon_show = true;
                this.end_address_show = false;
            }
            
            this.checkOrderGetAmount({ 
                    order_type:val,
                    use_car_type_id:this.formValidate.modelRequire,
                    city_id:cityId,
                    customer_id:this.cusId,
                    start_date:momStDate,
                    start_time:this.formValidate.indentStartTime,
                    start_location:this.start_location,
                    end_location:this.end_location,
                }).then((data) => {
                if(data.data.code === 1){
                    this.$set(this.formValidate,'platformPrice',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'indentPrice',data.data.data.amount/100)
                    this.$set(this.formValidate,'deiverPrice',data.data.data.driver_amount/100)
                }
            })
        }else if(type === 'modelRequire'){
            this.checkOrderGetAmount({ 
                    order_type:this.formValidate.indentType,
                    use_car_type_id:val,
                    city_id:cityId,
                    customer_id:this.cusId,
                    start_date:momStDate,
                    start_time:this.formValidate.indentStartTime,
                    start_location:this.start_location,
                    end_location:this.end_location,
                }).then((data) => {
                if(data.data.code === 1){
                    this.$set(this.formValidate,'platformPrice',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'indentPrice',data.data.data.amount/100)
                    this.$set(this.formValidate,'deiverPrice',data.data.data.driver_amount/100)
                }
            })
        }else if(type === 'indentStartDate'){
            this.checkOrderGetAmount({ 
                    order_type:this.formValidate.indentType,
                    use_car_type_id:this.formValidate.modelRequire,
                    city_id:cityId,
                    customer_id:this.cusId,
                    start_date:val,
                    start_time:this.formValidate.indentStartTime,
                    start_location:this.start_location,
                    end_location:this.end_location,
                }).then((data) => {
                if(data.data.code === 1){
                    this.$set(this.formValidate,'platformPrice',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'indentPrice',data.data.data.amount/100)
                    this.$set(this.formValidate,'deiverPrice',data.data.data.driver_amount/100)
                }
            })
        }else if(type === 'indentStartTime'){
            this.checkOrderGetAmount({ 
                    order_type:this.formValidate.indentType,
                    use_car_type_id:this.formValidate.modelRequire,
                    city_id:cityId,
                    customer_id:this.cusId,
                    start_date:momStDate,
                    start_time:val,
                    start_location:this.start_location,
                    end_location:this.end_location,
                }).then((data) => {
                if(data.data.code === 1){
                    this.$set(this.formValidate,'platformPrice',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'indentPrice',data.data.data.amount/100)
                    this.$set(this.formValidate,'deiverPrice',data.data.data.driver_amount/100)
                }
            })
        }else if(type === 'indentCity'){
            this.addressCity = val.split(',')[1];
            this.checkOrderGetAmount({ 
                    order_type:this.formValidate.indentType,
                    use_car_type_id:this.formValidate.modelRequire,
                    city_id:val.split(',')[1],
                    customer_id:this.cusId,
                    start_date:momStDate,
                    start_time:this.formValidate.indentStartTime,
                    start_location:this.start_location,
                    end_location:this.end_location,
                }).then((data) => {
                if(data.data.code === 1){
                    this.$set(this.formValidate,'platformPrice',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'indentPrice',data.data.data.amount/100)
                    this.$set(this.formValidate,'deiverPrice',data.data.data.driver_amount/100)
                }
            })
        }else if(type === 'cusName'){
            this.checkOrderGetAmount({ 
                    order_type:this.formValidate.indentType,
                    use_car_type_id:this.formValidate.modelRequire,
                    city_id:cityId,
                    customer_id:val,
                    start_date:momStDate,
                    start_time:this.formValidate.indentStartTime,
                    start_location:this.start_location,
                    end_location:this.end_location,
                }).then((data) => {
                if(data.data.code === 1){
                    this.$set(this.formValidate,'platformPrice',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'indentPrice',data.data.data.amount/100)
                    this.$set(this.formValidate,'deiverPrice',data.data.data.driver_amount/100)
                }
            })

            this.getCustomerLists({ id:val,status:'',type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
                this.$set(this.formValidate,'cusName',data.data.data.rows[0].name);
                this.cusId = val;
            })
        }else if(type === 'startAddress'){
            this.checkOrderGetAmount({ 
                    order_type:this.formValidate.indentType,
                    use_car_type_id:this.formValidate.modelRequire,
                    city_id:cityId,
                    customer_id:this.cusId,
                    start_date:momStDate,
                    start_time:this.formValidate.indentStartTime,
                    start_location:this.start_location,
                    end_location:'',
                }).then((data) => {
                if(data.data.code === 1){
                    this.$set(this.formValidate,'platformPrice',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'indentPrice',data.data.data.amount/100)
                    this.$set(this.formValidate,'deiverPrice',data.data.data.driver_amount/100)
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }else if(type === 'endAddress'){
            this.checkOrderGetAmount({ 
                    order_type:this.formValidate.indentType,
                    use_car_type_id:this.formValidate.modelRequire,
                    city_id:cityId,
                    customer_id:this.cusId,
                    start_date:momStDate,
                    start_time:this.formValidate.indentStartTime,
                    start_location:this.start_location,
                    end_location:this.end_location,
                }).then((data) => {
                if(data.data.code === 1){
                    this.$set(this.formValidate,'platformPrice',data.data.data.plat_amount/100)
                    this.$set(this.formValidate,'indentPrice',data.data.data.amount/100)
                    this.$set(this.formValidate,'deiverPrice',data.data.data.driver_amount/100)
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }
        
        
    },
    locate(type){

        if(type === 1){
            this.order_distance = '';
            if(this.addressCity !== ''){
                if( this.formValidate.startAddress === ''){
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '请先填写起点地址'
                    });
                }else{
                    
                    fetchJsonp('https://api.map.baidu.com/geocoder/v2/?address='+this.addressCity+this.formValidate.startAddress+'&output=json&ak=A1KbCD1wUrTDiAxu46BtmVhI&callback=showLocation',{
                        headers:{ Accept: 'application/json',},
                        jsonCallbackFunction:'showLocation'
                    }).then( response => response.json() )
                    .then(data => {
                        let lngInteger = data.result.location.lng.toString().split('.')[0];
                        let lngDecimals = data.result.location.lng.toString().split('.')[1].substring(0,6);
                        let latInteger = data.result.location.lat.toString().split('.')[0];
                        let latDecimals = data.result.location.lat.toString().split('.')[1].substring(0,6);
                        this.start_location = JSON.stringify({longitude:lngInteger+'.'+lngDecimals,latitude:latInteger+'.'+latDecimals})
                        this.end_location = ''

                        this.markerLng = data.result.location.lng
                        this.markerLat = data.result.location.lat
                    }).then(()=>{
                        this.changePrice('startAddress')
                    })
                }
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '请先选择订单城市'
                });
            }
        }else{
            if(this.addressCity !== ''){
                if( this.formValidate.startAddress === ''){
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '请先填写起点地址'
                    });
                }else if(this.formValidate.endAddress === ''){
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: '请先填写终点地址'
                    });
                }else{
                    fetchJsonp('https://api.map.baidu.com/geocoder/v2/?address='+this.addressCity+this.formValidate.startAddress+'&output=json&ak=A1KbCD1wUrTDiAxu46BtmVhI&callback=showLocation',{
                        headers:{ Accept: 'application/json',},
                        jsonCallbackFunction:'showLocation'
                    }).then( response => response.json() )
                    .then(data => {
                        let lngInteger = data.result.location.lng.toString().split('.')[0];
                        let lngDecimals = data.result.location.lng.toString().split('.')[1].substring(0,6);
                        let latInteger = data.result.location.lat.toString().split('.')[0];
                        let latDecimals = data.result.location.lat.toString().split('.')[1].substring(0,6);
                        this.start_location = JSON.stringify({longitude:lngInteger+'.'+lngDecimals,latitude:latInteger+'.'+latDecimals})
                        return {longitude:lngInteger+'.'+lngDecimals,latitude:latInteger+'.'+latDecimals}
                    }).then((data)=>{
                        let start_coordinate = data;
                        fetchJsonp('https://api.map.baidu.com/geocoder/v2/?address='+this.addressCity+this.formValidate.endAddress+'&output=json&ak=A1KbCD1wUrTDiAxu46BtmVhI&callback=showLocation',{
                            headers:{ Accept: 'application/json',},
                            jsonCallbackFunction:'showLocation'
                        }).then( response => response.json() )
                        .then(data => {
                            let lngInteger = data.result.location.lng.toString().split('.')[0];
                            let lngDecimals = data.result.location.lng.toString().split('.')[1].substring(0,6);
                            let latInteger = data.result.location.lat.toString().split('.')[0];
                            let latDecimals = data.result.location.lat.toString().split('.')[1].substring(0,6);
                            this.end_location = JSON.stringify({longitude:lngInteger+'.'+lngDecimals,latitude:latInteger+'.'+latDecimals})
                            return {
                                s_coordinate:start_coordinate,
                                e_coordinate:{longitude:lngInteger+'.'+lngDecimals,latitude:latInteger+'.'+latDecimals}
                            }
                        }).then(data=>{
                            fetchJsonp('https://api.map.baidu.com/direction/v2/driving?origin='+data.s_coordinate.latitude+','+data.s_coordinate.longitude+'&destination='+data.e_coordinate.latitude+','+data.e_coordinate.longitude+'&ak=A1KbCD1wUrTDiAxu46BtmVhI',{
                                headers:{ Accept: 'application/json',},
                                jsonCallbackFunction:'showLocation'
                            }).then( response => response.json() )
                            .then(data => {
                                this.order_distance = data.result.routes[0].distance
                            })
                        }).then(()=>{
                            this.changePrice('endAddress')
                        })
                    })

                    this.indentStartAddress = this.formValidate.startAddress;
                    this.indentEndAddress = this.formValidate.endAddress;

                }
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '请先选择订单城市'
                });
            }
        }
    },
    searchName(value){
      if(this.inputNameShake) clearTimeout(this.inputNameShake)
        this.inputNameShake = setTimeout(()=>{
            this.getCustomerLists({ id:'',status:'',type:'',start_time:'',end_time:'',name:value,telephone:'',contact:'',search:'',offset:0,limit:10 }).then((data) => {
                this.cusGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.cusGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {

                    let momStDate;
                    if(this.formValidate.indentStartDate){
                        momStDate = moment(this.formValidate.indentStartDate).format('YYYY-MM-DD')
                    }else{
                        momStDate = ''
                    }

                    let cityId;
                    if(this.formValidate.indentCity){
                        cityId = this.formValidate.indentCity.split(',')[0]
                    }else{
                        cityId = '';
                    }

                    this.editOrder({ 
                        id:this.$route.query.id,
                        order_type: this.formValidate.indentType,
                        use_car_type_id:this.formValidate.modelRequire,
                        start_date:momStDate,
                        start_time:this.formValidate.indentStartTime || '',
                        city_id:cityId,
                        customer_id:this.cusId,
                        start_address:this.formValidate.startAddress || '',
                        start_location:this.start_location || '',
                        end_address:this.formValidate.endAddress || '',
                        end_location:this.end_location || '',
                        plat_amount:this.formValidate.platformPrice * 100,
                        amount:this.formValidate.indentPrice * 100,
                        driver_amount:this.formValidate.deiverPrice * 100,
                        passenger_name:this.formValidate.passengerName || '',
                        passenger_tel:this.formValidate.passengerPhone || '',
                        comment:this.formValidate.desc || '',
                        distance:this.order_distance || '',
                     }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
                            this.$router.push({path:'indentManage'});
                        }else{
                            this.$Notice.warning({
                                title: '嘀友提醒',
                                desc: data.data.msg
                            });
                        }
                    })
            } else {
                this.$Message.error('提交失败!');
            }
        })
    },
  },
  mounted () {
          this.auto_num = 0;
          this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.useCarArr,i,data.data.data.rows[i])
            }
          }).then(()=>{

            this.getCompanyCityLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.cityArr,i,data.data.data.rows[i])
                }
            }).then(()=>{

                 this.getOrderLists({ id:this.$route.query.id,entity_id:'',customer_id:'',city_id:'',use_car_type_id:'',status:'',other_status:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                    this.$set(this.formValidate,'indentType',data.data.data.rows[0].order_type);
                    if(data.data.data.rows[0].order_type <= 2){
                        this.path_show = false;
                        this.point_show = true;
                        this.end_address_show = false;
                        this.start_icon_show = true;
                        this.markerLng = JSON.parse(data.data.data.rows[0].start_location).longitude
                        this.markerLat = JSON.parse(data.data.data.rows[0].start_location).latitude
                    }else{
                        this.indentStartAddress = data.data.data.rows[0].start_address;
                        this.indentEndAddress = data.data.data.rows[0].end_address;
                        this.path_show = true;
                        this.point_show = false;
                        this.end_address_show = true;
                        this.start_icon_show = false;
                    }
                    this.$set(this.formValidate,'modelRequire',data.data.data.rows[0].use_car_type_id);
                    this.$set(this.formValidate,'indentStartDate',data.data.data.rows[0].start_date);
                    this.$set(this.formValidate,'indentStartTime',data.data.data.rows[0].start_time);
                    this.$set(this.formValidate,'indentCity',data.data.data.rows[0].city_id+','+data.data.data.rows[0].city);
                    this.addressCity = data.data.data.rows[0].city
                    this.$set(this.formValidate,'cusName',data.data.data.rows[0].customer_name);
                    this.cusId = data.data.data.rows[0].customer_id;
                    this.$set(this.formValidate,'startAddress',data.data.data.rows[0].start_address);
                    this.start_location = data.data.data.rows[0].start_location
                    this.$set(this.formValidate,'endAddress',data.data.data.rows[0].end_address);
                    this.end_location = data.data.data.rows[0].end_location
                    this.$set(this.formValidate,'platformPrice',data.data.data.rows[0].plat_amount/100);
                    this.$set(this.formValidate,'indentPrice',data.data.data.rows[0].amount/100);
                    this.$set(this.formValidate,'deiverPrice',data.data.data.rows[0].driver_amount/100);
                    this.$set(this.formValidate,'passengerName',data.data.data.rows[0].passenger_name);
                    this.$set(this.formValidate,'passengerPhone',data.data.data.rows[0].passenger_tel);
                    this.$set(this.formValidate,'desc',data.data.data.rows[0].comment);
                    this.order_distance = data.data.data.rows[0].distance || '';
                    
                    
                    this.current = data.data.data.rows[0].status - 1;

                })

            })

          })
  },
  activated () {
            this.auto_num = 0;
          this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.useCarArr,i,data.data.data.rows[i])
            }
          }).then(()=>{

            this.getCompanyCityLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.cityArr,i,data.data.data.rows[i])
                }
            }).then(()=>{

                 this.getOrderLists({ id:this.$route.query.id,entity_id:'',customer_id:'',city_id:'',use_car_type_id:'',status:'',other_status:'',start_start_time:'',start_end_time:'',create_start_time:'',create_end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                    this.$set(this.formValidate,'indentType',data.data.data.rows[0].order_type);

                    if(data.data.data.rows[0].order_type <= 2){
                        this.path_show = false;
                        this.point_show = true;
                        this.end_address_show = false;
                        this.start_icon_show = true;
                        this.markerLng = JSON.parse(data.data.data.rows[0].start_location).longitude
                        this.markerLat = JSON.parse(data.data.data.rows[0].start_location).latitude
                    }else{
                        this.indentStartAddress = data.data.data.rows[0].start_address;
                        this.indentEndAddress = data.data.data.rows[0].end_address;
                         this.path_show = true;
                        this.point_show = false;
                        this.end_address_show = true;
                        this.start_icon_show = false;
                    }

                    this.$set(this.formValidate,'modelRequire',data.data.data.rows[0].use_car_type_id);
                    this.$set(this.formValidate,'indentStartDate',data.data.data.rows[0].start_date);
                    this.$set(this.formValidate,'indentStartTime',data.data.data.rows[0].start_time);
                    this.$set(this.formValidate,'indentCity',data.data.data.rows[0].city_id+','+data.data.data.rows[0].city);
                    this.addressCity = data.data.data.rows[0].city
                    this.$set(this.formValidate,'cusName',data.data.data.rows[0].customer_name);
                    this.cusId = data.data.data.rows[0].customer_id;
                    this.$set(this.formValidate,'startAddress',data.data.data.rows[0].start_address);
                    this.start_location = data.data.data.rows[0].start_location
                    this.$set(this.formValidate,'endAddress',data.data.data.rows[0].end_address);
                    this.end_location = data.data.data.rows[0].end_location
                    this.$set(this.formValidate,'platformPrice',data.data.data.rows[0].plat_amount/100);
                    this.$set(this.formValidate,'indentPrice',data.data.data.rows[0].amount/100);
                    this.$set(this.formValidate,'deiverPrice',data.data.data.rows[0].driver_amount/100);
                    this.$set(this.formValidate,'passengerName',data.data.data.rows[0].passenger_name);
                    this.$set(this.formValidate,'passengerPhone',data.data.data.rows[0].passenger_tel);
                    this.$set(this.formValidate,'desc',data.data.data.rows[0].comment);
                    this.order_distance = data.data.data.rows[0].distance || '';
                    
                    
                    this.current = data.data.data.rows[0].status - 1;

                })

            })

          })
  }
}
</script>

<style lang="less">
.bm-view {
  width: 100%;
  height: 700px;
}
.indentCard{
    margin-top:10px;
    .cardSlot{
        display: flex;
        .ivu-steps{
            .ivu-steps-main{
                display: block;
                margin-top: 25px;
            }
        }
    }
}
</style>
