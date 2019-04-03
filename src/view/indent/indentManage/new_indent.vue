<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" class="indentCard">
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
                        <DatePicker type="date" placeholder="请选择日期" :options="optionsDis" v-model="formValidate.indentStartDate" style="width:200px" @on-change="changePrice('indentStartDate',$event)"></DatePicker>
                    </FormItem>
                    <FormItem prop="indentStartTime" :label-width="100">
                        <TimePicker type="time" v-model="formValidate.indentStartTime" placeholder="请选择时间" style="width: 168px" @on-change="changePrice('indentStartTime',$event)"></TimePicker>
                    </FormItem>
                    
                    <FormItem label="订单城市" prop="indentCity">
                        <Select v-model="formValidate.indentCity" placeholder="请选择订单城市" style="width:200px" @on-change="changePrice('indentCity',$event)">
                            <Option v-for="(item,index) in cityArr" :value="item.id + ',' + item.city" :key="index">{{ item.city }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="客户名称" prop="cusName">
                        <Select v-model="formValidate.cusName" placeholder="请选择客户名称" style="width:200px" @on-change="changePrice('cusName',$event)">
                            <Option v-for="(item,index) in cusArr" :value="item.id" :key="index" >{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    
                    <FormItem label="订单起点" prop="startAddress">
                        <AutoComplete
                        v-model="formValidate.startAddress"
                        @on-search="searchStartAddress"
                        placeholder="请输入订单起点"
                        style="width:200px" transfer>
                            <Option v-for="(item,index) in startAddressGather" :value="item.name" :key="index" >{{ item.name }}</Option>
                        </AutoComplete>

                    </FormItem>

                    <FormItem label="订单终点" prop="endAddress" v-if="end_address_show">
                        <AutoComplete
                        v-model="formValidate.endAddress"
                        @on-search="searchEndAddress"
                        placeholder="请输入订单终点"
                        style="width:200px" transfer>
                            <Option v-for="(item,index) in endAddressGather" :value="item.name" :key="index" >{{ item.name }}</Option>
                        </AutoComplete>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleAddress">确认选择地址</Button>
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
                        <Button type="primary" @click="handleSubmit('formValidate')">新增</Button>
                    </FormItem>

                </Form>
            </Col>
            <Col span="16">
                <baidu-map class="bm-view" :center="center_city" ak="A1KbCD1wUrTDiAxu46BtmVhI" :zoom="10" >
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
  name: 'new_indent',
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
      cardTitle:'新增订单',
      current: 0,
      formValidate: {
          indentType:3,
          platformPrice:0,
          indentPrice: 0,
          deiverPrice:0,
          passengerName: '',
          passengerPhone: '',
          desc: '',
          indentStartDate:moment().format('YYYY-MM-DD'),
          indentStartTime:moment().add(1, 'hours').format('hh:mm:ss'),
      },
      optionsDis:{
        disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      cityArr:[],
      ruleValidate: {
        passengerPhone:[
            { required: true, message: '乘客电话必须填写', trigger: 'blur' }
        ],
      },
      useCarArr:[],
      start_location:'',
      end_location:'',
      cusId:'',
      cusArr:[],
      inputNameShake:'',
      addressCity:'',
      indentStartAddress:'',
      indentEndAddress:'',
      start_location:'',
      end_location:'',
      markerLng:'',
      markerLat:'',
      auto_num:0,
      end_address_show:true,
      order_distance:'',
      startAddressGather:[],
      inputStartAddressShake:'',
      endAddressGather:[],
      inputEndAddressShake:'',
      path_show:true,
      point_show:true,
      center_city:'上海',
    }
  },
  methods: {
    ...mapActions([
      'checkOrderGetAmount',
      'getCustomerLists',
      'getUseCarTypeLists',
      'getCompanyCityLists',
      'addOrder',
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
                
                var new_arr = [];
                var obj = {};
                new_arr = data.result.reduce(function(item, next) {
                    obj[next.name] ? '' : obj[next.name] = true && item.push(next);
                    return item;
                }, []);

                for(let i=0; i<new_arr.length; i++){
                    this.$set(this.startAddressGather,i,new_arr[i])
                }
            })
        },600)
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
                var new_arr = [];
                var obj = {};
                new_arr = data.result.reduce(function(item, next) {
                    obj[next.name] ? '' : obj[next.name] = true && item.push(next);
                    return item;
                }, []);

                for(let i=0; i<new_arr.length; i++){
                    this.$set(this.endAddressGather,i,new_arr[i])
                }

            })
        },600)
    },
    handleAddress(){
        if(!this.end_address_show){
            this.path_show = false;
            this.point_show = true;
            this.locate(1)
        }else if(this.end_address_show){
            this.path_show = true;
            this.point_show = false;
            this.locate(2)
        }
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
                this.end_address_show = true;
            }else{
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
            this.center_city = val.split(',')[1];
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
            this.cusId = val;
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
                        }).then(()=>{
                            this.indentStartAddress = this.formValidate.startAddress;
                            this.indentEndAddress = this.formValidate.endAddress;
                        })
                    })

                    
                    

                }
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '请先选择订单城市'
                });
            }
        }
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
                    
                    this.addOrder({ 
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
                            this.$Message.success('新增成功!');
                            this.$refs['formValidate'].resetFields();
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
      this.path_show = true;
      this.point_show = true;
      this.end_address_show = true;
          this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.useCarArr,i,data.data.data.rows[i])
            }
            return data;
          }).then(data=>{
              this.$set(this.formValidate,'modelRequire',data.data.data.rows[0].id)
          })

          this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10000,status:1 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.cityArr,i,data.data.data.rows[i])
            }
            return data;
          }).then(data=>{
              this.$set(this.formValidate,'indentCity',data.data.data.rows[0].id + ',' + data.data.data.rows[0].city)
              this.addressCity = data.data.data.rows[0].city
              this.center_city = data.data.data.rows[0].city
          })

          this.getCustomerLists({ id:'',status:1,type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:1000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.cusArr,i,data.data.data.rows[i])
            }
            this.cusId = data.data.data.rows[0].id
            return data;
          }).then(data=>{
              this.$set(this.formValidate,'cusName',data.data.data.rows[0].id)
          })
  },
//   activated () {

//       this.auto_num = 0;
//       this.path_show = true;
//       this.point_show = true;
//       this.end_address_show = true;
//           this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
//             for(let i=0; i<data.data.data.rows.length; i++){
//                 this.$set(this.useCarArr,i,data.data.data.rows[i])
//             }
//             return data;
//           }).then(data=>{
//               this.$set(this.formValidate,'modelRequire',data.data.data.rows[0].id)
//           })

//           this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10000,status:1 }).then((data) => {
//             for(let i=0; i<data.data.data.rows.length; i++){
//                 this.$set(this.cityArr,i,data.data.data.rows[i])
//             }
//             return data;
//           }).then(data=>{
//               this.$set(this.formValidate,'indentCity',data.data.data.rows[0].id + ',' + data.data.data.rows[0].city)
//               this.addressCity = data.data.data.rows[0].city
//               this.center_city = data.data.data.rows[0].city
//           })

//           this.getCustomerLists({ id:'',status:1,type:'',start_time:'',end_time:'',name:'',telephone:'',contact:'',search:'',offset:0,limit:1000 }).then((data) => {
//             for(let i=0; i<data.data.data.rows.length; i++){
//                 this.$set(this.cusArr,i,data.data.data.rows[i])
//             }
//             this.cusId = data.data.data.rows[0].id
//             return data;
//           }).then(data=>{
//               this.$set(this.formValidate,'cusName',data.data.data.rows[0].id)
//           })
//   }
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
