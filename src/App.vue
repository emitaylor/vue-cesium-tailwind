<template>
  <div id="app">
    <CesiumViewer />
  </div>
</template>

<script>
import CesiumViewer from './components/CesiumViewer.vue';

export default {
  name: 'App',
  components: {
    CesiumViewer,
  },
};
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
