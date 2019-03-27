<template>
  <div style="padding:0 24px 24px;">
    <Card shadow :title="cardTitle" class="indentCard">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >
                    <FormItem label="审核状态" prop="status">
                        <Select v-model="formValidate.status" placeholder="请选择审核状态" style="width:200px">
                            <Option :value="0">待审核</Option>
                            <Option :value="1">审核通过</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="行驶证正面照" prop="drivePic" :label-width="100">
                        <div class="demo-upload-list" v-for="item in driveList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(1)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="driveUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleDrive"
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
                        <Input v-model="formValidate.licensePlateNum" placeholder="请输入车牌号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="所有人" prop="owner">
                        <Input v-model="formValidate.owner" placeholder="请输入所有人" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="车架号" prop="Vin" >
                        <Input v-model="formValidate.Vin" placeholder="请输入车架号" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="发动机号" prop="engineNum">
                        <Input v-model="formValidate.engineNum" placeholder="请输入发动机号" style="width:200px"></Input>
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
                                <Icon type="ios-trash-outline" @click.native="handleRemove(2)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="perCarUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handlePercar"
                            type="drag"
                            action=""
                            :style="{display: perCarList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>

                    <FormItem label="注册日期" prop="registerDate">
                        <DatePicker type="date" placeholder="注册日期" v-model="formValidate.registerDate" style="width:200px"></DatePicker>
                    </FormItem>

                    <FormItem label="品牌车型" prop="brandModel">
                        <Select v-model="formValidate.brandModel" placeholder="请选择品牌车型" style="width:200px">
                            <Option v-for="(item, index) in brandModelArr" :value="item.id" :key="index">{{ item.brand + '-' + item.model }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="车身颜色" prop="carColor">
                        <Input v-model="formValidate.carColor" placeholder="请输入车身颜色" style="width:200px"></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit()">添加</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
    </Card>

  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,Upload,Select,Option,RadioGroup,Radio, } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'new_vehicle',
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
    Upload,
    Select,
    Option,
    RadioGroup,
    Radio,
  },
  data () {
    return {
      cardTitle:'添加车辆',
      formValidate: {
          status:0,
      },
      visible:false,
      driveList:[],
      perCarList:[],
      brandModelArr:[],
      formDriverValidate:{},
      idFrontList:[],
      webPerList:[],
      idBackList:[],
      driveFrontList:[],
      driveBackList:[],
      webDriveList:[],
      driver_info_show:true,
    }
  },
  methods: {
    ...mapActions([
      'uploadPic',
      'getCarTemplateLists',
      'addCar',
      'editCar',
      'getCarLists',
    ]),
    handleView (url) {
        this.allPicModal = url;
        this.visible = true;
    },
    handleRemove (type) {
        if(type === 1){
            this.driveList.splice(0,1)
        }else if(type === 2){
            this.perCarList.splice(0,1)
        }
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleDrive (file) {
        let check = this.driveList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.driveList,0, {
                        url:res.data.data.path,
                        name:'drivePic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    handlePercar(file){
        let check = this.perCarList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.perCarList,0, {
                        url:res.data.data.path,
                        name:'perCarPic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    handleSubmit () {
                
        let momRgDate = '';
        if(this.formValidate.registerDate){
            momRgDate = moment(this.formValidate.registerDate).format('YYYY-MM-DD')
        }else{
            momRgDate = ''
        }

        let drive_pic,per_car_pic;
        if(this.driveList && this.driveList.length>0){
            drive_pic = this.driveList[0].url
        }else{
            drive_pic = ''
        }

        if(this.perCarList && this.perCarList.length>0){
            per_car_pic = this.perCarList[0].url
        }else{
            per_car_pic = ''
        }

        this.addCar({ 
            status:this.formValidate.status,
            travel_img_path:drive_pic,
            car_no:this.formValidate.licensePlateNum || '',
            owner:this.formValidate.owner || '',
            frame_no:this.formValidate.Vin || '',
            engine_no:this.formValidate.engineNum || '',
            car_person_img_path:per_car_pic,
            register_date:momRgDate,
            car_template_id:this.formValidate.brandModel || '',
            car_color:this.formValidate.carColor || ''
        }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('新增成功!');
                this.$refs['formValidate'].resetFields();
                this.$router.push({ path:'vehicleList' });
            }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: data.data.msg
                });
            }
        })
    },
  },
  mounted () {
        this.getCarTemplateLists({ id:'',status:1,use_car_type_id:'',search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.brandModelArr,i,data.data.data.rows[i])
            }
        })
  },
  activated () {
        this.getCarTemplateLists({ id:'',status:1,use_car_type_id:'',search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.brandModelArr,i,data.data.data.rows[i])
            }
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
