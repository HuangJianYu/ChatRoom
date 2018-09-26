<template>
  <div id="signUp">
    <div class="content2">
      <h2>Sign Up Form</h2>
      <input type="text" class="content2_username"/>
      <div>（请输入用户名）</div>
      <input type="text" class="phone"/>
      <div>（请输入联系方式）</div>
      <input type="text" class="mail"/>
      <div>（请输入邮箱）</div>
      <input type="password" class="password"/>
      <div>（请输入密码）</div>
      <button class="register">REGISTER</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {eventBus} from '../eventBus.js'

export default {
  name: 'SignUp',
  mounted:function () {
    let $register = $('.register')

    $register.click(function () {
      if($(".content2_username").val() == ""){
        alert("用户名不能为空！")
        return
      }
      if($(".password").val() == ""){
        alert("密码不能为空！")
        return
      }
      $.ajax({
        url:"http://localhost/register",
        type:"POST",
        data:{
          username:$(".content2_username").val(),
          phone:$('.phone').val(),
          mail:$(".mail").val(),
          password:$(".password").val()
        },
        success:function (res) {
          alert(res);
        },
        error:function (err) {
          console.log(err);
        }
      })
      eventBus.$emit('App',{
        cmd:'openLogin'
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#signUp{
  background-image: url("../../static/img/banner.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
}
.content2{
  position: relative;
  height: 75%;
  width:40%;
  background-color: rgba(0,0,0,0.21);
  float: left;
  margin-left: 30%;
  margin-top: 7%;
}
.content2 h2{
  font-size:3rem;
  color: #ffffff;
  text-align: center;
}
.content2 input{
  color: white;
  padding-left: 7%;
  font-size: 1.8rem;
  width: 70%;
  height: 8%;
  /*margin-bottom: 8%;*/
  margin-left: 10%;
  border: solid 1.3px white;
  border-radius: 3px;
}
.content2 div{
  height: 8%;
  margin-left: 10%;
  font-size: 1.6rem;
  color: white;
  padding-top: 1%;
}
.content2_username{
  background: url("../../static/img/person.png") no-repeat 2%
}
.phone{
  background: url("../../static/img/phone.png") no-repeat 2%
}
.mail{
  background: url("../../static/img/mail.png") no-repeat 2%
}
.password{
  background: url("../../static/img/lock.png") no-repeat 2%
}
.register{
  color: white;
  background: forestgreen;
  border: 0px;
  border-radius: 5px;
  width: 80%;
  height: 8%;
  margin-left: 10%;
  font-size: 1.4rem;
}
</style>
