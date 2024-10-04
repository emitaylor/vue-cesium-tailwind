<template>
  <div>
    <CesiumViewer />
  </div>
</template>

<script>
import CesiumViewer from './components/CesiumViewer.vue'

export default {
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
