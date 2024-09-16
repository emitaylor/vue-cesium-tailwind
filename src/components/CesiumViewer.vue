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

        const viewer = new Cesium.Viewer("cesiumContainer", {
          infoBox: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          homeButton: false,
          geocoder: false,
          navigationHelpButton: false,
          sceneModePicker: false,
        });

        // Centre la caméra sur le château de Murviel-lès-Béziers
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(3.14354, 43.43992, 300),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0), // Vue directement vers le bas
            roll: 0.0
          }
        });

        // Charger le fichier GeoJSON et afficher les entités
        const geojsonUrl = 'example.geojson'; 

        const dataSource = await Cesium.GeoJsonDataSource.load(geojsonUrl);
        viewer.dataSources.add(dataSource);

        // Parcourir les entités et ajouter des labels si nécessaire
        dataSource.entities.values.forEach(entity => {
          entity.label = {
            text: entity.properties.name,
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
          };
          entity.point = {
            pixelSize: 10,
            color: Cesium.Color.RED,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          };
        });

        console.log("GeoJSON chargé avec succès !");
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
