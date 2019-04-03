<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <a href="javascript:void(0)">
            {{userName}}
          <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions,mapMutations } from 'vuex'
import { Dropdown,Icon,DropdownMenu,DropdownItem } from 'iview'
export default {
  name: 'User',
  components: {
    Dropdown,
    Icon,
    DropdownMenu,
    DropdownItem
  },
  data () {
    return {
      userName:'',
    }
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    },
  },
  mounted (){
    this.userName = window.localStorage.getItem("izuxbcniushdfdebfud_userName");
  }
}
</script>
