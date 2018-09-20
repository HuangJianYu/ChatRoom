<template>
  <div id="login">
    <div class="content1">
      <h2>Sign In</h2>
      <input type="text" class="username" value="USERNAME"/>
      <input type="password" class="password" value="12345678"/>
      <div class="button-row">
        <input type="submit" class="submit" value="SIGN IN"/>
        <input type="reset" class="reset" value="RESET"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data:function () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#login{
  background-image: url("../../static/img/banner.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
}
.content1{
    position: absolute;
    height: 50%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width:45%;
    background-color: rgba(0,0,0,0.21);
    float: left;
  }
  .content1 h2{
    font-size:2.5rem;
    width: 100%;
    height: 15%;
    /*padding:30px;*/
    color: #ffffff;
    font-weight: 2rem;
    text-align: center;
  }
  .username{
    color: white;
    font-size: 1.8rem;
    width: 74%;
    height: 12%;
    margin-bottom: 5%;
    margin-left: 10%;
    background: url("../../static/img/person.png") no-repeat 2%;
    padding-left: 6%;
    border: solid 1.3px white;
    border-radius: 0.5rem;
  }
  .password{
    color: white;
    font-size: 1.8rem;
    width: 74%;
    height: 12%;
    margin-bottom: 5%;
    margin-left: 10%;
    background: url("../../static/img/lock.png") no-repeat 3%;
    padding-left: 6%;
    border: solid 1.3px white;
    border-radius: 0.5rem;
  }
  .button-row{
    height: 15%;
    width: 100%;
  }
  .button-row input{
    width: 30%;
    height: 80%;
    font-size: 1.4rem;
    margin-left: 13%;
  }
  .submit{
    color: white;
    background: forestgreen;
    border: 0px;
    border-radius: 5px;
  }
  .reset{
    color: white;
    background: #c0392b;
    border: 0px;
    border-radius: 5px;
  }
</style>
