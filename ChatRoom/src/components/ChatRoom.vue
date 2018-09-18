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

    function showMessage (mes) {
      let date = new Date()
      console.log('HJY TEST : date = ' + JSON.stringify(date))
      if (mes.type === 'enter') {
        // console.log("HJY TEST : str = "+str)
        that.user.push(mes.data)
        // console.log("HJY TEST : that.user = "+that.user)
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
      console.log("HJY TEST : $img.change")
      that.hasImg = true
      that.$nextTick(()=>{
        imgSrc = window.URL.createObjectURL($(this)[0].files[0])
        $("#preview").attr("src",imgSrc)
        console.log('HJY TEST : src = ' + imgSrc)
      })
    }

    function getBase64Img () {
      var img = imgSrc //imgurl 就是你的图片路径  

      function getBase64Image(img) {  
           var canvas = document.createElement("canvas")
           canvas.width = img.width 
           canvas.height = img.height
           var ctx = canvas.getContext("2d")
           ctx.drawImage(img, 0, 0, img.width, img.height)
           var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase()
           var dataURL = canvas.toDataURL("image/"+ext) 
           return dataURL
      }  

      var image = new Image()
      image.src = img
      image.onload = function () {
        var base64 = getBase64Image(image)
        // console.log("HJY TEST : base64 = " + base64)
        message.img = base64
      }
      window.URL.revokeObjectURL(imgSrc)
      $("#preview").attr("src","")
      that.hasImg = false
    }

    function sendMessage () {
      if(imgSrc != ""){
        getBase64Img()
      }
      setTimeout(()=>{
        let html = $inputarea.children('img');
        // console.log('HJY TEST : $inputarea.text() = ' + $inputarea.text())
        message.text = $inputarea.text() 
        websocket.send(JSON.stringify(message))
        message = {}
        $inputarea.html('')
        $inputarea.html(html)
      },200)
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
