<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip"></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { Card } from 'iview'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm,
    Card
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'handleLogOut'
    ]),
    handleSubmit ({ name, telephone ,password }) {
      this.handleLogin({ name, telephone ,password }).then(res => {
        if(res.data.code==1){
          this.$router.push({path:'/'});
        }else{
          this.$Notice.warning({
              title: '嘀友提醒',
              desc: res.data.msg
          });
        }
      })
    }
  }
}
</script>

<style>

</style>
