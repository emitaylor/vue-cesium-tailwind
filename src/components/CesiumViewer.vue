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
          throw new Error("Cesium container not found");
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
        
        this.viewer = viewer;

        // Centre the camera on the Château of Murviel-lès-Béziers
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(3.14354, 43.43992, 300),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0.0
          }
        });

        // Load GeoJSON file
        const geojsonUrl = 'example.geojson'; 

        const dataSource = await Cesium.GeoJsonDataSource.load(geojsonUrl);
        viewer.dataSources.add(dataSource);

        // Browse entities and add labels as needed
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

        console.log('\x1b[32m%s\x1b[0m', '\x1b[1mGeoJSON loaded successfully!');
      } 
      catch (error) {
        console.error('\x1b[31m', 'Error during initialization of Cesium', error);
      }
      this.addDrones();
    },

    addDrones() {
      const dronePaths = [
        { longitude: 0, latitude: 0, height: 1000, color: Cesium.Color.BLUE },
        { longitude: 120, latitude: 30, height: 1000, color: Cesium.Color.GREEN },
        { longitude: -60, latitude: -30, height: 1000, color: Cesium.Color.ORANGE }
      ];

      dronePaths.forEach((path, index) => {
        const drone = this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(path.longitude, path.latitude, path.height),
          point: {
            pixelSize: 10,
            color: path.color,
          },
          label: {
            text: `Drone ${index + 1}`,
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
          }
        });

        let angle = 0; // Start angle for the drone's movement
        setInterval(() => {
          angle += 1; // Change this value to adjust the speed
          const newLongitude = (path.longitude + angle) % 360; // Make a complete turn around the globe
          drone.position = Cesium.Cartesian3.fromDegrees(newLongitude, path.latitude, path.height);
        }, 100); // Adjust this interval to change the update frequency
      });
    },
  }
}
</script>

<style>
#cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>
