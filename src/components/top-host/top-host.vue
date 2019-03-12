<template>
    <Row>
        <Col :span="item.colSpan" v-for="item in itemCol" class="colStyle" >
            <div class="headerInfo" @click="transfer(item.value)">
                <span v-html="item.title">{{item.title}}</span>
                <p v-html="item.value">{{item.value}}</p>
                <em v-if="item.em"/>
            </div>
        </Col>
    </Row>
</template>

<script>
import { Row,Col } from 'iview'
export default {
  name: 'topHost',
  components: {
      Row,
      Col
  },
  props: {
      itemCol:{
        type: Array,
      }
  },
  methods:{
      filterData(){

      },
      transfer(data){
          this.$emit('transferdata',data);
      }
  }
}
</script>

<style lang="less">

    .colStyle{
        background: #fff;
        padding: 20px 0;
        border-bottom: 1px solid #F0F0F0;
    }
    
    .headerInfo {
        position: relative;
        text-align: center;
        & > span {
            color:rgba(0, 0, 0, 0.45);
            display: inline-block;
            font-size: 14px;
            line-height: 22px;
            margin-bottom: 4px;
        }

        & > p {
            color: '#000';
            font-size: 24px;
            line-height: 32px;
            margin: 0;
            font-family: sans-serif;
        }

        & > em {
            background-color: #e8e8e8;
            position: absolute;
            height: 56px;
            width: 1px;
            top: 0;
            right: 0;
        }
    }
</style>
