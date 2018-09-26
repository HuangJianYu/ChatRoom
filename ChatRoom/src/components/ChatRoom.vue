<template>
  <div id="chatRoom">
    <div class="user_list">
      <li class="user_item" v-for="item in user">{{item}}</li>
    </div>
    <div class="chat_record">
      <li class="chat_item" v-for="item in chatContent">
        <div class="chat_info">{{item.info}}</div>
        <div class="content">{{item.message}}</div>
        <img :src="item.img" v-if="item.showImg" class="chat_img">
      </li>
    </div>
    <div class="input_area">
      <div class="add_file">
        <input type="file" name="图片" class="add_img">
      </div>
      <div contentEditable="true" id="inputarea">
        <img id="preview" v-show="hasImg">
      </div>
      <button class="send_btn">发送</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {eventBus} from '../eventBus.js'

export default {
  name: 'App',
  data: function () {
    return {
      chatContent: [],
      user: [],
      img_src:"",
      hasImg:false
    }
  },
  mounted: function () {
    let that = this
    let $sendbtn = $('button')
    let $inputarea = $('#inputarea')
    let $img = $('.add_img')
    let imgSrc = ""
    let message = {}
    console.log('HJY TEST : enter chatRoom')
    var websocket = new WebSocket("ws://localhost:8888")

    eventBus.$on('ChatRoom',function(val){
      console.log("HJY TEST : ChatRoom $on val = "+JSON.stringify(val))
    })

    function showMessage (mes) {
      let date = new Date()
      console.log('HJY TEST : date = ' + JSON.stringify(date))
      if (mes.type === 'enter') {
        that.user.push(mes.data)
      } else if (mes.type === 'leave') {
      } else if (mes.type === 'message') {
        let chat = {}
        chat.info = mes.name + ' ' + date
        chat.message = mes.message
        if(mes.img){
          chat.showImg = true
          chat.img = mes.img
        }
        
        that.chatContent.push(chat)
      }
    }

    $img.change(selectFile)

    function selectFile () {
      if (this.files.length != 0) {
          var file = this.files[0]
          var reader = new FileReader()
          reader.onload = function(e) {
            that.hasImg = true;
            $("#preview").attr("src",e.target.result)
            message.img = e.target.result
          }
          reader.readAsDataURL(file)
      }
    }

    function sendMessage () {
      $("#preview").attr("src","")
      that.hasImg = false
      let html = $inputarea.children('img')
      message.text = $inputarea.text() 
      websocket.send(JSON.stringify(message))
      message = {}
      $inputarea.html('')
      $inputarea.html(html)
    }

    function KeyUp (e) {
      console.log('HJY TEST : KeyUp = ' + e.which)
      if (e.keyCode == 13 && message != {}) {
          sendMessage()
      }
    }

    websocket.onopen = function () {
      console.log('websocket open')
      $sendbtn.click(sendMessage)
      $inputarea.keyup(KeyUp)
    }

    websocket.onclose = function () {
      console.log('websocket close')
    }

    websocket.onmessage = function (e) {
      // console.log('HJY TEST : e.data = ' + e.data)
      var mes = JSON.parse(e.data)
      // console.log('HJY TEST : e.data = ' + JSON.stringify(mes))
      showMessage(mes)
    }
  }
}
</script>

<style>
#chatRoom {
  position: absolute;
  width: 1200px;
  height: 800px;
  background-color: gray;
}
.user_list{
  position: relative;
  margin-top: 10px;
  margin-left: 10px;
  width: 300px;
  height: 780px;
  overflow: auto;
  float: left;
}
.user_item{
  background-color: white;
  list-style-type:none;
  line-height: 78px;
  font-size: 20px;
  margin-left: 0;
  color: black;
  width: 300px;
  height: 78px;
}
.chat_record{
  position: relative;
  margin-top: 10px;
  margin-left: 10px;
  width: 870px;
  height: 520px;
  background-color: white;
  overflow: auto;
  float: left;
}
.chat_item{
  list-style-type:none;
}
.chat_info{
  float: left;
  width: 95%;
  margin-left: 5%;
  text-align: left;
}
.content{
  float: left;
  width: 80%;
  margin-left: 10%;
  word-wrap: break-word;
  text-align: left;
}
.chat_img{
  max-width: 192px;
  max-height: 108px;
  margin-left: 10%;
  float: left;
}
.input_area{
  position: relative;
  float: left;
  margin-left: 10px;
  width: 870px;
  height: 260px;
  /*background-color: green;*/
}
.add_file {
    /* position: relative; */
    float: left;
    /* margin-left: 5px; */
    width: 100%;
    height: 60px;
    background-color: white;
    border-top: solid 2px;
}
#inputarea{
  position: relative;
  float: left;
  text-align: left;
  width: 100%;
  height: 150px;
  font-size: 20px;
  border: none;
  background-color: white;
  overflow: auto;
}
#preview{
  width: 30%;
  height: 80%;
}
.send_btn{
  float: right;
  width: 100px;
  height: 30px;
  margin-top: 10px;
  margin-right: 10px;
}
</style>
