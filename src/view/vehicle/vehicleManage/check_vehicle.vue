<template>
  <div style="padding:0 24px 24px;">
    <Card shadow :title="cardTitle" class="indentCard">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >
                    <FormItem label="审核状态" prop="status" >
                        <Select v-model="formValidate.status" placeholder="请选择审核状态" style="width:200px">
                            <Option :value="0">待审核</Option>
                            <Option :value="1">审核通过</Option>
                            <Option :value="2">审核拒绝</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="行驶证正面照" prop="drivePic" :label-width="100">
                        <div class="demo-upload-list" v-for="item in driveList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: driveList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    <Modal title="图片预览" v-model="visible" :footer-hide="true">
                        <img :src="allPicModal" v-if="visible" style="width: 100%">
                    </Modal>

                    <FormItem label="车牌号" prop="licensePlateNum">
                        <Input v-model="formValidate.licensePlateNum" placeholder="请输入车牌号" style="width:200px" disabled></Input>
                    </FormItem>

                    <FormItem label="所有人" prop="owner">
                        <Input v-model="formValidate.owner" placeholder="请输入所有人" style="width:200px" disabled></Input>
                    </FormItem>

                    <FormItem label="车架号" prop="Vin" >
                        <Input v-model="formValidate.Vin" placeholder="请输入车架号" style="width:200px" disabled></Input>
                    </FormItem>

                    <FormItem label="发动机号" prop="engineNum">
                        <Input v-model="formValidate.engineNum" placeholder="请输入发动机号" style="width:200px" disabled></Input>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="人车合照" prop="perCarPic" >
                        <div class="demo-upload-list" v-for="item in perCarList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="perCarUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: perCarList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <FormItem label="注册日期" prop="registerDate">
                        <DatePicker type="date" placeholder="注册日期" v-model="formValidate.registerDate" style="width:200px" disabled></DatePicker>
                    </FormItem>

                    <FormItem label="品牌车型" prop="brandModel">
                        <Select v-model="formValidate.brandModel" placeholder="请选择品牌车型" style="width:200px" disabled>
                            <Option v-for="(item, index) in brandModelArr" :value="item.id" :key="index">{{ item.brand + '-' + item.model }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="车身颜色" prop="carColor">
                        <Input v-model="formValidate.carColor" placeholder="请输入车身颜色" style="width:200px" disabled></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
    </Card>

    <Card shadow title="绑定司机信息" class="indentCard" >
        <Button type="error" @click="handleUnbind()" v-if="driver_info_show" style="margin-right:10px;">解绑</Button>
        <Button type="primary" @click="handleBind()">绑定</Button>
        <Row v-if="driver_info_show">
            <Col span="12"> 
                <Form ref="formDriverValidate" :model="formDriverValidate" :label-width="80" >

                    <div style="margin:10px 0;">司机信息</div>
                    <FormItem label="司机姓名" prop="id_name">
                        <Input v-model="formDriverValidate.id_name" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="司机电话" prop="phone">
                        <Input v-model="formDriverValidate.phone" placeholder="请输入司机电话" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="是否通过审核" prop="driverCheck" :label-width="100">
                        <RadioGroup v-model="formDriverValidate.driverCheck">
                            <Radio :label="0">未审核</Radio>
                            <Radio :label="1">待审核</Radio>
                            <Radio :label="2">通过审核</Radio>
                            <Radio :label="3">审核拒绝</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="身份证正面" prop="idFrontPic" >
                        <div class="demo-upload-list" v-for="item in idFrontList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="idFrontUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: idFrontList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    
                    <div style="margin:10px 0;">驾驶证信息</div>
                    <FormItem label="司机姓名" prop="driveName">
                        <Input v-model="formDriverValidate.driveName" placeholder="请输入司机姓名" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="领证日期" prop="getPaperData">
                        <DatePicker type="date" placeholder="领证日期" v-model="formDriverValidate.getPaperData" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="准驾车型" prop="carModel">
                        <Input v-model="formDriverValidate.carModel" placeholder="请输入准驾车型" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="驾驶证正面" prop="driveFrontPic" >
                        <div class="demo-upload-list" v-for="item in driveFrontList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveFrontUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: driveFrontList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <div style="margin:10px 0;">其他信息</div>
                    <FormItem label="网约车驾驶证(人证)" prop="webPerPic" :label-width="120">
                        <div class="demo-upload-list" v-for="item in webPerList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="webPerUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: webPerList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formDriverValidate" :model="formDriverValidate" :label-width="80">
                    
                    <div style="margin:10px 0;">&nbsp;</div>
                    <FormItem label="司机性别" prop="sex" >
                        <RadioGroup v-model="formDriverValidate.sex">
                            <Radio :label="0">女</Radio>
                            <Radio :label="1">男</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="司机身份证号" prop="idNum" :label-width="100">
                        <Input v-model="formDriverValidate.idNum" placeholder="请输入司机身份证号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="司机住址" prop="address">
                        <Input v-model="formDriverValidate.address" placeholder="请输入司机住址" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="身份证反面" prop="idBackPic" >
                        <div class="demo-upload-list" v-for="item in idBackList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="idBackUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: idBackList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <div style="margin:10px 0;">&nbsp;</div>
                    <FormItem label="驾驶证号" prop="driveNum">
                        <Input v-model="formDriverValidate.driveNum" placeholder="请输入驾驶证号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="有效日期" prop="endDate">
                        <DatePicker type="date" placeholder="注册日期" v-model="formDriverValidate.endDate" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem style="visibility:hidden;">
                        <Input style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="驾驶证反面" prop="driveBackPic" >
                        <div class="demo-upload-list" v-for="item in driveBackList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveBackUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: driveBackList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <div style="margin:10px 0;">&nbsp;</div>
                    <FormItem label="网约车驾驶证(车证)" prop="webDrivePic" :label-width="120">
                        <div class="demo-upload-list" v-for="item in webDriveList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="webDriveUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            type="drag"
                            action=""
                            :style="{display: webDriveList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                </Form>
            </Col>
        </Row>
    </Card>

    <Modal title="绑定司机" v-model="bindVisible" :footer-hide="true">
        <div style="text-align: center;">
            <span style="font-size:14px;padding-right:10px;">绑定的司机</span>
            <AutoComplete
                v-model="bindDriver"
                @on-search="searchBindDriver"
                @on-select="selectBindDriver"
                placeholder="请输入绑定的司机"
                style="width:200px" transfer>
                    <Option v-for="item in bindDriverGather" :value="item.id" :key="item.id" >{{ item.id_name }}</Option>
            </AutoComplete>
        </div>
        <div style="text-align: center;margin:20px 0;">
            <Button type="error" @click="handleSure()">确认</Button>
        </div>          
    </Modal>

  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,InputNumber,Upload,Select,Option,RadioGroup,Radio, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'check_vehicle',
  components: {
    Row,
    Col,
    Card,
    Input,
    Button,
    DatePicker,
    Table,
    AutoComplete,
    Form,
    FormItem,
    Modal,
    Icon,
    InputNumber,
    Upload,
    Select,
    Option,
    RadioGroup,
    Radio,
  },
  data () {
    return {
      cardTitle:'查看与审核车辆',
      formValidate: {},
      ruleValidate: {
          brandModel:[
              { required: true, message: '请填写司品牌车型', trigger: 'blur' }
          ]
      },
      visible:false,
      driveList:[],
      perCarList:[],
      formDriverValidate:{},
      idFrontList:[],
      driveFrontList:[],
      webPerList:[],
      idBackList:[],
      driveBackList:[],
      webDriveList:[],
      bindVisible:false,
      bindDriver:'',
      bindDriverGather:[],
      driver_info_show:true,
      brandModelArr:[],
      inputDriverShake:'',
      driverId:'',
      permission_arr:'',
    }
  },
  methods: {
    ...mapActions([
      'getCarTemplateLists',
      'getCarLists',
      'authCarStatus',
      'getDriverLists',
      'bindingDriver',
      'unbindingDriver',
    ]),
    handleView (url) {
        this.allPicModal = url;
        this.visible = true;
    },
    handleUnbind(){
        let per_val = '';
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[3000].length; i++){
                if(this.permission_arr[3000][i] === '3009'){
                    per_val = 3009
                }
            }
            if(per_val === 3009){
                this.unbindingDriver({ 
                    car_id:this.$route.query.id,
                    driver_id:this.driverId,
                }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('解绑成功!');
                        this.bindVisible = false;
                        this.driver_info_show = false;
                        this.$refs['formDriverValidate'].resetFields();
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
            this.unbindingDriver({ 
                car_id:this.$route.query.id,
                driver_id:this.driverId,
            }).then((data) => {
                if(data.data.code === 1){
                    this.$Message.success('解绑成功!');
                    this.bindVisible = false;
                    this.driver_info_show = false;
                    this.$refs['formDriverValidate'].resetFields();
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })
        }

        
    },
    handleBind(){
        let per_val = '';
        if(this.permission_arr[0] !== '9999'){
            for(let i=0; i<this.permission_arr[3000].length; i++){
                if(this.permission_arr[3000][i] === '3008'){
                    per_val = 3008
                }
            }
            if(per_val === 3008){
                this.bindVisible = true;
                this.bindDriver = '';
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
            }
        }else{
            this.bindVisible = true;
            this.bindDriver = '';
        }

    },
    searchBindDriver(value){
        if(this.inputDriverShake) clearTimeout(this.inputDriverShake)
        this.inputDriverShake = setTimeout(()=>{
            this.getDriverLists({ id:'',fleet_id:'',status:1,city_id:'',start_time:'',end_time:'',id_name:value,telephone:'',auth_status:'',is_binding:0,is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                this.bindDriverGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.bindDriverGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectBindDriver(val){
        this.getDriverLists({ id:val,fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
            this.bindDriver = data.data.data.rows[0].id_name
            this.driverId = val
        })
    },
    handleSure(){
        this.bindingDriver({ 
            car_id:this.$route.query.id,
            driver_id:this.driverId,
        }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('绑定成功!');
                this.bindVisible = false;
                this.getCarLists({ id:this.$route.query.id,status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10000 }).then((data) => {

                    this.driver_info_show = true
                    this.$set(this.formDriverValidate,'id_name',data.data.data.rows[0].binding_info.id_name);
                    this.$set(this.formDriverValidate,'phone',data.data.data.rows[0].binding_info.telephone);
                    this.$set(this.formDriverValidate,'driverCheck',data.data.data.rows[0].binding_info.auth_status);
                    if(data.data.data.rows[0].binding_info.id_img_path){
                        this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].binding_info.id_img_path, name:'idFrontPic1' });
                    }
                    this.$set(this.formDriverValidate,'driveName',data.data.data.rows[0].binding_info.id_name);
                    this.$set(this.formDriverValidate,'getPaperData',data.data.data.rows[0].binding_info.driver_get_date);
                    this.$set(this.formDriverValidate,'carModel',data.data.data.rows[0].binding_info.driver_type);
                    if(data.data.data.rows[0].binding_info.driver_img_path){
                        this.$set(this.driveFrontList,0,{ url:data.data.data.rows[0].binding_info.driver_img_path, name:'driveFrontPic1' });
                    }
                    if(data.data.data.rows[0].binding_info.net_driver_img_path){
                        this.$set(this.webPerList,0,{ url:data.data.data.rows[0].binding_info.net_driver_img_path, name:'webPerPic1' });
                    }
                    this.$set(this.formDriverValidate,'sex',data.data.data.rows[0].binding_info.id_sex);
                    this.$set(this.formDriverValidate,'idNum',data.data.data.rows[0].binding_info.id_no);
                    this.$set(this.formDriverValidate,'address',data.data.data.rows[0].binding_info.id_address);
                    if(data.data.data.rows[0].binding_info.id_back_img_path){
                        this.$set(this.idBackList,0,{ url:data.data.data.rows[0].binding_info.id_back_img_path, name:'idBackPic1' });
                    }
                    this.$set(this.formDriverValidate,'driveNum',data.data.data.rows[0].binding_info.driver_no);
                    this.$set(this.formDriverValidate,'endDate',data.data.data.rows[0].binding_info.driver_valid_date);
                    if(data.data.data.rows[0].binding_info.driver_copy_img_path){
                        this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].binding_info.driver_copy_img_path, name:'driveBackPic1' });
                    }
                    if(data.data.data.rows[0].binding_info.net_car_img_path){
                        this.$set(this.webDriveList,0,{ url:data.data.data.rows[0].binding_info.net_car_img_path, name:'webDrivePic1' });
                    }
                    
                })

            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.authCarStatus({ 
                    id:this.$route.query.id,
                    status:this.formValidate.status,
                }).then((data) => {
                    if(data.data.code === 1){
                        this.$Message.success('审核成功!');
                        this.$router.push({ path:'vehicleList' });
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
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getCarTemplateLists({ id:'',status:1,use_car_type_id:'',search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.brandModelArr,i,data.data.data.rows[i])
            }
        }).then(()=>{
                
            this.getCarLists({ id:this.$route.query.id,status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10000 }).then((data) => {
                if(data.data.data.rows[0].binding_info.id_name === ''){
                    this.driver_info_show = false
                }else{
                    this.driver_info_show = true;
                    this.driverId = data.data.data.rows[0].binding_id;
                    this.$set(this.formDriverValidate,'id_name',data.data.data.rows[0].binding_info.id_name);
                    this.$set(this.formDriverValidate,'phone',data.data.data.rows[0].binding_info.telephone);
                    this.$set(this.formDriverValidate,'driverCheck',data.data.data.rows[0].binding_info.auth_status);
                    if(data.data.data.rows[0].binding_info.id_img_path){
                        this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].binding_info.id_img_path, name:'idFrontPic1' });
                    }
                    this.$set(this.formDriverValidate,'driveName',data.data.data.rows[0].binding_info.id_name);
                    this.$set(this.formDriverValidate,'getPaperData',data.data.data.rows[0].binding_info.driver_get_date);
                    this.$set(this.formDriverValidate,'carModel',data.data.data.rows[0].binding_info.driver_type);
                    if(data.data.data.rows[0].binding_info.driver_img_path){
                        this.$set(this.driveFrontList,0,{ url:data.data.data.rows[0].binding_info.driver_img_path, name:'driveFrontPic1' });
                    }
                    if(data.data.data.rows[0].binding_info.net_driver_img_path){
                        this.$set(this.webPerList,0,{ url:data.data.data.rows[0].binding_info.net_driver_img_path, name:'webPerPic1' });
                    }
                    this.$set(this.formDriverValidate,'sex',data.data.data.rows[0].binding_info.id_sex);
                    this.$set(this.formDriverValidate,'idNum',data.data.data.rows[0].binding_info.id_no);
                    this.$set(this.formDriverValidate,'address',data.data.data.rows[0].binding_info.id_address);
                    if(data.data.data.rows[0].binding_info.id_back_img_path){
                        this.$set(this.idBackList,0,{ url:data.data.data.rows[0].binding_info.id_back_img_path, name:'idBackPic1' });
                    }
                    this.$set(this.formDriverValidate,'driveNum',data.data.data.rows[0].binding_info.driver_no);
                    this.$set(this.formDriverValidate,'endDate',data.data.data.rows[0].binding_info.driver_valid_date);
                    if(data.data.data.rows[0].binding_info.driver_copy_img_path){
                        this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].binding_info.driver_copy_img_path, name:'driveBackPic1' });
                    }
                    if(data.data.data.rows[0].binding_info.net_car_img_path){
                        this.$set(this.webDriveList,0,{ url:data.data.data.rows[0].binding_info.net_car_img_path, name:'webDrivePic1' });
                    }
                }
                
                this.$set(this.formValidate,'status',data.data.data.rows[0].status);
                if(data.data.data.rows[0].travel_img_path){
                    this.$set(this.driveList,0,{ url:data.data.data.rows[0].travel_img_path, name:'drivePic1' });
                }
                this.$set(this.formValidate,'licensePlateNum',data.data.data.rows[0].car_no);
                this.$set(this.formValidate,'owner',data.data.data.rows[0].owner);
                this.$set(this.formValidate,'Vin',data.data.data.rows[0].frame_no);
                this.$set(this.formValidate,'engineNum',data.data.data.rows[0].engine_no);
                if(data.data.data.rows[0].car_person_img_path){
                    this.$set(this.perCarList,0,{ url:data.data.data.rows[0].car_person_img_path, name:'perCarPic1' });
                }
                this.$set(this.formValidate,'registerDate',data.data.data.rows[0].register_date);
                this.$set(this.formValidate,'brandModel',data.data.data.rows[0].car_template_id);
                this.$set(this.formValidate,'carColor',data.data.data.rows[0].car_color);
            })

        })
  },
  activated () {
      this.permission_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
    this.getCarTemplateLists({ id:'',status:1,use_car_type_id:'',search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.brandModelArr,i,data.data.data.rows[i])
            }
        }).then(()=>{

            this.getCarLists({ id:this.$route.query.id,status:'',car_template_id:'',start_time:'',end_time:'',car_no:'',search:'',offset:0,limit:10000 }).then((data) => {
                if(data.data.data.rows[0].binding_info.id_name === ''){
                    this.driver_info_show = false
                }else{
                    this.driver_info_show = true;
                    this.driverId = data.data.data.rows[0].binding_id;
                    this.$set(this.formDriverValidate,'id_name',data.data.data.rows[0].binding_info.id_name);
                    this.$set(this.formDriverValidate,'phone',data.data.data.rows[0].binding_info.telephone);
                    this.$set(this.formDriverValidate,'driverCheck',data.data.data.rows[0].binding_info.auth_status);
                    if(data.data.data.rows[0].binding_info.id_img_path){
                        this.$set(this.idFrontList,0,{ url:data.data.data.rows[0].binding_info.id_img_path, name:'idFrontPic1' });
                    }
                    this.$set(this.formDriverValidate,'driveName',data.data.data.rows[0].binding_info.id_name);
                    this.$set(this.formDriverValidate,'getPaperData',data.data.data.rows[0].binding_info.driver_get_date);
                    this.$set(this.formDriverValidate,'carModel',data.data.data.rows[0].binding_info.driver_type);
                    if(data.data.data.rows[0].binding_info.driver_img_path){
                        this.$set(this.driveFrontList,0,{ url:data.data.data.rows[0].binding_info.driver_img_path, name:'driveFrontPic1' });
                    }
                    if(data.data.data.rows[0].binding_info.net_driver_img_path){
                        this.$set(this.webPerList,0,{ url:data.data.data.rows[0].binding_info.net_driver_img_path, name:'webPerPic1' });
                    }
                    this.$set(this.formDriverValidate,'sex',data.data.data.rows[0].binding_info.id_sex);
                    this.$set(this.formDriverValidate,'idNum',data.data.data.rows[0].binding_info.id_no);
                    this.$set(this.formDriverValidate,'address',data.data.data.rows[0].binding_info.id_address);
                    if(data.data.data.rows[0].binding_info.id_back_img_path){
                        this.$set(this.idBackList,0,{ url:data.data.data.rows[0].binding_info.id_back_img_path, name:'idBackPic1' });
                    }
                    this.$set(this.formDriverValidate,'driveNum',data.data.data.rows[0].binding_info.driver_no);
                    this.$set(this.formDriverValidate,'endDate',data.data.data.rows[0].binding_info.driver_valid_date);
                    if(data.data.data.rows[0].binding_info.driver_copy_img_path){
                        this.$set(this.driveBackList,0,{ url:data.data.data.rows[0].binding_info.driver_copy_img_path, name:'driveBackPic1' });
                    }
                    if(data.data.data.rows[0].binding_info.net_car_img_path){
                        this.$set(this.webDriveList,0,{ url:data.data.data.rows[0].binding_info.net_car_img_path, name:'webDrivePic1' });
                    }
                }
                this.$set(this.formValidate,'status',data.data.data.rows[0].status);
                if(data.data.data.rows[0].travel_img_path){
                    this.$set(this.driveList,0,{ url:data.data.data.rows[0].travel_img_path, name:'drivePic1' });
                }
                this.$set(this.formValidate,'licensePlateNum',data.data.data.rows[0].car_no);
                this.$set(this.formValidate,'owner',data.data.data.rows[0].owner);
                this.$set(this.formValidate,'Vin',data.data.data.rows[0].frame_no);
                this.$set(this.formValidate,'engineNum',data.data.data.rows[0].engine_no);
                if(data.data.data.rows[0].car_person_img_path){
                    this.$set(this.perCarList,0,{ url:data.data.data.rows[0].car_person_img_path, name:'perCarPic1' });
                }
                this.$set(this.formValidate,'registerDate',data.data.data.rows[0].register_date);
                this.$set(this.formValidate,'brandModel',data.data.data.rows[0].car_template_id);
                this.$set(this.formValidate,'carColor',data.data.data.rows[0].car_color);
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

.demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
