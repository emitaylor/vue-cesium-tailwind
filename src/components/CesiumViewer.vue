<template>
  <div id="cesiumContainer" style="width: 100%; height: 100vh;"></div>
</template>

<script>
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

export default {
  name: "CesiumViewer",
  mounted() {
    this.initializeCesium();
  },
  methods: {
    async initializeCesium() {
      try {
        await this.$nextTick(); // DOM ready
        const container = document.getElementById("cesiumContainer");

        if (!container) {
          throw new Error("Conteneur Cesium non trouvé");
        }

        var viewer = new Cesium.Viewer("cesiumContainer", {
          infoBox: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          homeButton: false,
          geocoder: false,
          navigationHelpButton: false,
          sceneModePicker: false,
        });

        console.log("Cesium initialisé", viewer);
      } catch (error) {
        console.error("Erreur lors de l'initialisation de Cesium:", error);
      }
    }
  }
};
</script>

<style>
#cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>
