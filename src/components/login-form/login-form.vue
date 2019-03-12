<template>
  <Form ref="loginForm" :model="form" @keydown.enter.native="handleSubmit">
    <FormItem prop="name">
      <Input v-model="form.name" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>

    <FormItem prop="telephone">
      <Input v-model="form.telephone" placeholder="请输入手机号">
        <span slot="prepend">
          <Icon :size="16" type="ios-call" />
        </span>
      </Input>
    </FormItem>

    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { Form,FormItem,Input,Icon,Button } from 'iview'
export default {
  name: 'LoginForm',
  data () {
    return {
      form: {
        name: '',
        telephone: '',
        password: ''
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            name: this.form.name,
            telephone: this.form.telephone,
            password: this.form.password
          })
        }
      })
    }
  },
  components: {
    Form,
    FormItem,
    Input,
    Icon,
    Button
  },
}
</script>
