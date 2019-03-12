<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" style="margin-top:10px;">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" >

                <FormItem label="公司名称" prop="company_name" :label-width="120">
                    <Input v-model="formValidate.company_name" placeholder="请输入公司名称" style="width:200px"></Input>
                </FormItem>

                <FormItem label="公司电话" prop="telephone" :label-width="120">
                    <Input v-model="formValidate.telephone" placeholder="请输入公司电话" style="width:200px"></Input>
                </FormItem>

                <FormItem label="公司地址" prop="address" :label-width="120">
                    <Input v-model="formValidate.address" placeholder="请输入公司地址" style="width:200px"></Input>
                    <Icon type="ios-pin" :size="25" style="margin-left:10px;cursor:pointer;" @click="showAddress()"/>
                </FormItem>

                <FormItem label="公司营业执照" prop="operatePic" :label-width="120">
                    <div class="demo-upload-list" v-for="item in operateList">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="operateUpload"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png']"
                        :on-format-error="handleFormatError"
                        :before-upload="handleOperate"
                        type="drag"
                        action=""
                        :style="{display: operateList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                </FormItem>

                <FormItem label="公司介绍" prop="introduction" :label-width="120">
                    <Input v-model="formValidate.introduction" type="textarea" :rows="8" :autosize="{minRows: 5,maxRows: 8}" placeholder="请输入公司介绍..." style="width:400px"></Input>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                </FormItem>

            </Form>
      </Card>
      <Modal title="图片预览" v-model="pic_visible" :footer-hide="true">
        <img :src="allPicModal" v-if="pic_visible" style="width: 100%">
      </Modal>
      <Modal title="公司地址" v-model="address_visible" @on-ok="comfirm_address" ok-text="确认" cancel-text="取消">
        <div class="amap-wrapper">
            <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="conpany_address" :zoom="16" :events="events" class="amap-demo">
                <el-amap-marker vid="component-marker" :position="conpany_address" ></el-amap-marker>
            </el-amap>
        </div>
      </Modal>
  </div>
</template>

<script>
import { Row,Card,Input,Button,Form,FormItem,Icon,Upload,Modal, } from 'iview'
import { mapActions } from 'vuex' 
import { AMapManager } from 'vue-amap';
let amapManager=new AMapManager();
export default {
  name: 'companyInfo',
  components: {
    Row,
    Card,
    Input,
    Button,
    Form,
    FormItem,
    Icon,
    Upload,
    Modal,
  },
  data () {
    return {
      amapManager,
      formValidate: {},
      add_edit:1,
      cardTitle:'公司信息',
      ruleValidate: {},
      pic_visible:false,
      operateList:[],
      address_visible:false,
      conpany_address:[121.487439,31.235682],
      events: {
        init: (o) => {
            
        },
        'click': (e) => {
            // console.log(e)
            this.$set(this.conpany_address,0,e.lnglat.lng)
            this.$set(this.conpany_address,1,e.lnglat.lat)
        }
      },
    }
  },
  methods: {
    ...mapActions([
      'setCompanyBaseConfig',
      'getCompanyBaseConfig',
      'uploadPic',
      'getLngLat',
      'changeLngLat',
    ]),

    handleView (url) {
        this.allPicModal = url;
        this.pic_visible = true;
    },
    handleRemove (type) {
        this.operateList.splice(0,1)
        this.operateBase64 = ''
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleOperate (file) {
        let check = this.operateList.length < 2;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一张图片'
            });
        }else{
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                let base64Img = reader.result.split('base64,')[1];
                this.operateBase64 = base64Img;
                this.uploadPic({ base64Img }).then(res => {
                    this.$set(this.operateList,0, {
                        url:res.data.data.path,
                        name:'operatePic' + res.data.data.ossId,
                    })
                })
            };
        }
        
        return check;
    },
    showAddress(){
        if(this.formValidate.address === ''){
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: '请先填写公司地址'
            });
        }else{
            this.getLngLat({address:this.formValidate.address}).then((data) => {
                this.address_visible = true;
                this.$set(this.conpany_address,0,data.data.geocodes[0].location.split(',')[0])
                this.$set(this.conpany_address,1,data.data.geocodes[0].location.split(',')[1])
            })
        }
        
    },
    comfirm_address(){
        this.address_visible = false;
        this.changeLngLat({lng:this.conpany_address[0],lat:this.conpany_address[1]}).then((data) => {
            this.address_visible = false;
            this.$set(this.formValidate,'address',data.data.regeocode.formatted_address)
        })
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            let address_lng_lat = {};
            if(this.conpany_address){
                address_lng_lat.longitude = this.conpany_address[0]
                address_lng_lat.latitude = this.conpany_address[1]
            }
            this.setCompanyBaseConfig({ 
                company_name:this.formValidate.company_name || '',
                telephone: this.formValidate.telephone || '',
                address:this.formValidate.address || '',
                address_location:JSON.stringify(address_lng_lat),
                bussiness_path:this.operateList[0].url || '',
                introduction:this.formValidate.introduction || '',
                }).then((data) => {
                if(data.data.code === 1){
                    this.$Message.success('保存成功!');
                }else{
                    this.$Notice.warning({
                        title: '嘀友提醒',
                        desc: data.data.msg
                    });
                }
            })   
        })
    },
  },
  mounted () {
    this.getCompanyBaseConfig().then((data) => {
        if(data.data.code === 1){
            this.$set(this.formValidate,'company_name',data.data.data.company_name || '')
            this.$set(this.formValidate,'telephone',data.data.data.telephone || '')
            this.$set(this.formValidate,'address',data.data.data.address || '')
            if(data.data.data.bussiness_path){
                this.$set(this.operateList,0,{url:data.data.data.bussiness_path,name:'operatePic1',})
            }
            
            if(data.data.data.address_location){
                let obj = data.data.data.address_location.parseJSON()
                this.$set(this.conpany_address,0,obj.longitude)
                this.$set(this.conpany_address,1,obj.latitude)
            }

            this.$set(this.formValidate,'introduction',data.data.data.introduction || '')
        }else if(data.data.code === 0){
            this.$Notice.warning({
                title: '嘀友提醒',
                desc: data.data.msg
            });
        }
    })
  },
  activated () {
    this.getCompanyBaseConfig().then((data) => {
        if(data.data.code === 1){
            this.$set(this.formValidate,'company_name',data.data.data.company_name || '')
            this.$set(this.formValidate,'telephone',data.data.data.telephone || '')
            this.$set(this.formValidate,'address',data.data.data.address || '')
            if(data.data.data.bussiness_path){
                this.$set(this.operateList,0,{url:data.data.data.bussiness_path,name:'operatePic1',})
            }

            if(data.data.data.address_location){
                let obj = data.data.data.address_location.parseJSON()
                this.$set(this.conpany_address,0,obj.longitude)
                this.$set(this.conpany_address,1,obj.latitude)
            }

            this.$set(this.formValidate,'introduction',data.data.data.introduction || '')
        }else if(data.data.code === 0){
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
.amap-wrapper {
  width: 100%;
  height: 500px;
}
.amap-logo{
    display: none !important;
}
.amap-copyright{
    display: none !important;
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
