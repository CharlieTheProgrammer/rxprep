<template>
  <div id="app">
    <Home msg="Study Planner"/>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'app',
  components: {
    Home
  }
}
</script>

<style>
#app {
  margin-top: 40px;
}
</style>
