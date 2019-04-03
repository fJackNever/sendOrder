<template>
  <div style="padding:0 24px 24px;">
    <Card shadow :title="cardTitle" class="indentCard">
                <Form ref="formValidate" :model="formValidate" :label-width="80" >

                    <FormItem label="密码" prop="cusPwd">
                        <Input type="password" v-model="formValidate.cusPwd" placeholder="请输入密码" style="width:200px" ></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">确认修改</Button>
                    </FormItem>
                </Form>
    </Card>

  </div>
</template>

<script>
import { Row,Col,Card,Input,Button,DatePicker,Table,AutoComplete,Form,FormItem,Modal,Icon,Upload,Select,Option,RadioGroup,Radio, } from 'iview'
import { mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'merchantInfo',
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
      cardTitle:'修改密码',
      formValidate: {
          status:0,
      },
      visible:false,
      operationList:[],
      otherList:[],
      brandModelArr:[],
      formDriverValidate:{},
    }
  },
  methods: {
    ...mapActions([
      'getChangeCustomerPassword',
    ]),

    handleSubmit (name) {
        
        this.$refs[name].validate((valid) => {
            if (valid) {

                    this.getChangeCustomerPassword({ 
                        password:this.formValidate.cusPwd,
                    }).then((data) => {
                        if(data.data.code === 1){
                            this.$Message.success('修改成功!');
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
