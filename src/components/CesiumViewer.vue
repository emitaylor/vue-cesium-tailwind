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
          throw new Error("Conteneur Cesium not found");
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
        // console.log("Cesium initialised", viewer);
        this.viewer = viewer;

        this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883), // Coordonnées 
          point: {
            pixelSize: 10, // Size
            color: Cesium.Color.RED, // Color RED
          },
          description: "Point rouge à ces coordonnées." // Description qui s'affiche dans l'infoBox
        });
        console.log("Cesium initialisé", viewer);

        // Load GeoJSON file in Cesium
        const geojsonUrl = 'example.geojson'; 

        this.viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geojsonUrl)).then(() => {
          console.log("GeoJSON chargé avec succès !");
        }).catch(error => {
          console.error("Erreur lors du chargement du GeoJSON:", error);
        });
      } 
      catch (error) {
        console.error("Error during initialization of Cesium", error);
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
