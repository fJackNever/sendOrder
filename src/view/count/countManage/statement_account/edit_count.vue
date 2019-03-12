<template>
  <div style="padding:0 24px 24px;">
      <Card shadow :title="cardTitle" class="indentCard">
        <Row>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="客户名称" prop="cusName">
                        <Input v-model="formValidate.cusName" placeholder="请输入客户名称" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="客户邮箱" prop="mailbox">
                        <Input v-model="formValidate.mailbox" placeholder="请输入客户邮箱" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="对账时间" prop="accountDate" :label-width="120">
                        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择对账时间范围" v-model="formValidate.accountDate" style="width: 200px;margin-left:20px;"></DatePicker>
                    </FormItem>

                    <FormItem label="总计订单数" prop="indentNum">
                        <InputNumber :min="0" v-model="formValidate.indentNum"></InputNumber>
                    </FormItem>

                    <FormItem label="总计金额" prop="indentMoney">
                        <InputNumber :min="0" v-model="formValidate.indentMoney"></InputNumber>
                    </FormItem>

                    <FormItem label="支付状态" prop="payStatus">
                        <Input v-model="formValidate.payStatus" placeholder="请输入支付状态" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="确认状态" prop="confirmStatus">
                        <Input v-model="formValidate.confirmStatus" placeholder="请输入确认状态" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="凭证单号" prop="evidenceBill">
                        <Input v-model="formValidate.evidenceBill" placeholder="请输入凭证单号" style="width:200px"></Input>
                    </FormItem>

                </Form>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >
                    <FormItem label="办理人" prop="transactPer">
                        <Input v-model="formValidate.transactPer" placeholder="请输入办理人" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="客户电话" prop="cusPhone">
                        <Input v-model="formValidate.cusPhone" placeholder="请输入客户电话" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="客户地址" prop="cusAddress">
                        <Input v-model="formValidate.cusAddress" placeholder="请输入客户地址" style="width:200px"></Input>
                    </FormItem>

                    <FormItem label="交易凭证" prop="evidencePic" >
                        <div class="demo-upload-list" v-for="item in evidenceList">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                        <Upload
                            ref="evidenceUpload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :before-upload="handleEvidence"
                            type="drag"
                            action=""
                            :style="{display: evidenceList.length === 1 ? 'none' : 'inline-block' ,width:'58px'}">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                    <Modal title="图片预览" v-model="visible" :footer-hide="true">
                        <img :src="allPicModal" v-if="visible" style="width: 100%">
                    </Modal>

                    <FormItem label="摘要" prop="desc" style="width:400px;">
                        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入摘要"></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">确认收款</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
      </Card>
  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,InputNumber,Upload, } from 'iview'
import { mapActions } from 'vuex'
export default {
  name: 'edit_count',
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
  },
  data () {
    return {
      cardTitle:'客户对账单详情',
      formValidate: {},
      evidenceList:[],
      visible:false,
    }
  },
  methods: {

    handleView (url) {
        this.allPicModal = url;
        this.visible = true;
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '图片提醒',
            desc: '请选择.jpg，.jpeg 或 .png图片'
        });
    },
    handleEvidence (file) {
        // let check = this.idFrontList.length < 2;
        // if (!check) {
        //     this.$Notice.warning({
        //         title: '只能上传一张图片'
        //     });
        // }else{
        //     let reader = new FileReader();
        //     reader.readAsDataURL(file);
        //     reader.onloadend = () => {
        //         let base64Img = reader.result.split('base64,')[1];
        //         this.idFrontBase64 = base64Img;
        //         this.uploadPic({ base64Img }).then(res => {
        //             this.$set(this.idFrontList,0, {
        //                 url:res.data.data.path,
        //                 name:'idFrontPic' + res.data.data.ossId,
        //             })
        //         })
        //     };
        // }
        
        // return check;
    },

    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    },
  },
  mounted () {

  },
  activated () {

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
