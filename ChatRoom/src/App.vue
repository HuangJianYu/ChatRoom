<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <p>
      <router-link to="/ChatRoom">chatroom</router-link>
      <router-link to="/HelloWorld">helloworld</router-link>
    </p> -->
    <!-- <router-view/> -->
    <Login v-if="curView === 'Login'"></Login>
    <ChatRoom v-if="curView === 'ChatRoom'"></ChatRoom>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import ChatRoom from './components/ChatRoom.vue'
export default {
  name: 'App',
  data: function () {
    return {
      curView: 'Login'
    }
  },
  components: {
    Login,
    ChatRoom
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
