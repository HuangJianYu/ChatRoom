<template>
  <div id="chatRoom">
    <div class="chatRoomBox">
      <div class="user_list">
        <li class="user_item" v-for="item in user">{{item}}</li>
      </div>
      <div id="scrolldIV" class="chat_record">
        <div class="chat_item" v-for="item in chatContent">
          <div class="chat_box">
            <div class="chat_info">{{item.info}}</div>
            <div class="content">{{item.message}}</div>
            <img :src="item.img" v-if="item.showImg" class="chat_img">
          </div>
        </div>
      </div>
      <div class="input_area">
        <div class="add_file">
          <img src="../../static/img/img.png" class="add_img_icon">
          <input type="file" class="add_img" accept="image/png,image/jpeg,image/gif">
        </div>
        <div contentEditable="true" id="inputarea">
          <!-- <img id="preview" v-show="hasImg" src=""> -->
        </div>
        <button class="send_btn">发送</button>
      </div>
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
      img_src:""
      // hasImg:false
    }
  },
  mounted: function () {
    let that = this
    let $sendbtn = $('.send_btn')
    let $inputarea = $('#inputarea')
    let $img = $('.add_img')
    let imgSrc = ""
    let message = {}
    let username = ""
    console.log('HJY TEST : enter chatRoom')
    var websocket = new WebSocket("ws://localhost:8888")

    eventBus.$on('ChatRoom',function(val){
      // console.log("HJY TEST : ChatRoom $on val = "+JSON.stringify(val))
      username = val.username
      setTimeout(()=>{
        init(val.username)
      },200)
    })

    $(".add_img_icon").click(function(){
      $(".add_img").click()
    })

    $(".add_img_icon").mouseover(function(){
      $(".add_img_icon").css('cursor','pointer')
    })

    $sendbtn.mouseover(function(){
      $sendbtn.css('cursor','pointer')
    })

    function showMessage (mes) {
      let date = new Date()
      console.log('HJY TEST : date = ' + JSON.stringify(date))
      if (mes.type === 'enter') {
        // that.user.push(mes.data)
        that.user = mes.data
      } else if (mes.type === 'leave') {
        console.log('HJY TEST : that.user.length = '+that.user.length)
        for(let i = 0;i<that.user.length;i++){
          console.log("HJY TEST : that.user[i] = "+that.user[i])
          if(mes.data === that.user[i]){
            console.log("HJY TEST : i = "+i)
            that.user.splice(i,1)
          }
        }
      } else if (mes.type === 'message') {
        let chat = {}
        let time = ''
        let hour = ''
        let minutes = ''
        let seconds = ''
        if(date.getHours()<10)
          hour = '0'+date.getHours()
        else
          hour = date.getHours()
        if(date.getMinutes()<10)
          minutes = '0' + date.getMinutes()
        else
          minutes = date.getMinutes()
        if(date.getSeconds()<10)
          seconds = '0' + date.getSeconds()
        else
          minutes = date.getSeconds()
        time = hour+':'+minutes+':'+seconds
        chat.info = mes.name+'  '+time
        chat.message = mes.message
        if(mes.img){
          chat.showImg = true
          chat.img = mes.img
        }
        that.chatContent.push(chat)
        that.$nextTick(()=>{
          if(mes.name === username){
            $('.chat_info').eq(that.chatContent.length-1).css('color','green')
            // $('.chat_info').eq(that.chatContent.length-1).css('text-align','right')
            // $('.content').eq(that.chatContent.length-1).css('text-align','right')
            $('.chat_box').eq(that.chatContent.length-1).css('float','right')
            $('.chat_box').eq(that.chatContent.length-1).children('img').css('float','right')
          }
          let div = document.getElementById('scrolldIV')
          div.scrollTop = div.scrollHeight
        })
      }
    }

    $img.change(selectFile)

    function selectFile () {
      console.log("HJY TEST : selectFile")
      if (this.files.length != 0) {
          var file = this.files[0]
          var reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function(e) {
            // that.hasImg = true;
            // $("#preview").attr("src",e.target.result)
            message.username = username
            message.type = 'chatContent'
            message.img = e.target.result
          }
          setTimeout(()=>{
            console.log("HJY TEST : send img")
            websocket.send(JSON.stringify(message))
            message = {}
          },200)
      }
    }

    function sendMessage () {
      if($inputarea.text() === ''){
        alert("输入内容不能为空");
        $inputarea.text('')
        return
      }
      message.type = 'chatContent'
      message.text = $inputarea.text() 
      message.username = username
      websocket.send(JSON.stringify(message))
      message = {}
      $inputarea.text('')
      // $inputarea.html(html)
    }

    function KeyUp (e) {
      console.log('HJY TEST : KeyUp = ' + e.which)
      if (e.keyCode == 13 && message != {}) {
        sendMessage()
      }
    }

    function init (name) {
      message.type = 'enterMessage'
      message.username = name
      websocket.send(JSON.stringify(message))
      message = {}
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
      console.log('HJY TEST : e.data = ' + JSON.stringify(mes))
      showMessage(mes)
    }
  }
}
</script>

<style>
#chatRoom{
  /*background-image: url("../../static/img/wallhaven.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;*/
}
.chatRoomBox {
  background-image: url("../../static/img/wallhaven.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 60%;
  height: 90%;
  margin-left: 20%;
  position: absolute;
  border-radius: 0.8rem;
  /*border: solid;*/
}
.user_list{
  position: relative;
  margin-top: 1%;
  margin-left: 1%;
  width: 22%;
  height: 98%;
  overflow: auto;
  float: left;
  text-align: center;
}
.user_item{
  background-color: white;
  list-style-type:none;
  line-height: 78px;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  color: black;
  width: 100%;
  height: 10%;
  margin-bottom: 1%;
}
.chat_record{
  position: relative;
  margin-top: 1%;
  margin-left: 1%;
  width: 75%;
  height: 65%;
  background-color: white;
  overflow: auto;
  float: left;
  border-radius: 0.5rem;
}
.chat_item{
  width: 100%;
  float: left;
}
.chat_box{
  float: left;
  height: auto;
  padding: 1%;
  max-width: 90%;
  margin-top: 1%;
  margin-bottom: 1%;
  margin-left: 2%;
  margin-right: 2%;
  background-color: #c3b9b9;
  border-radius: 0.6rem;
}
.chat_info{
  /*float: left;*/
  /*width: 90%;*/
  margin-left: 0.5vw;
  font-size: 1.2rem;
  margin-right: 0.5vw;
  text-align: left;
  color: blue;
}
.content{
  /*float: left;*/
  /*width: 85%;*/
  margin-left: 1vw;
  font-size: 1.2rem;
  word-wrap: break-word;
  text-align: left;
}
.chat_img{
  max-width: 192px;
  max-height: 108px;
  margin-left: 1vw;
}
.input_area{
  position: relative;
  float: left;
  margin-left: 10px;
  width: 75%;
  height: 30%;
}
.add_file {
    float: left;
    width: 100%;
    height: 20%;
    background-color: white;
    border-top: solid 2px;
}
.add_img_icon{
  max-height: 60%;
  margin-left: 2%;
  margin-top: 1%;
}
.add_img{
  display: none;
}
#inputarea{
  position: relative;
  float: left;
  text-align: left;
  width: 100%;
  height: 70%;
  font-size: 1.4rem;
  border: none;
  background-color: white;
  overflow: auto;
}
.send_btn{
  float: right;
  width: 12%;
  height: 12%;
  margin-top: 1.5%;
  margin-right: 2%;
  font-size: 1rem;
  background-color: white;
  border: none;
  border-radius: 0.4rem;
}
</style>
