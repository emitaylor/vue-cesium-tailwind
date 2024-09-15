<template>
    <div ref="cesiumContainer" class="cesium-container" sandbox="allow-scripts"></div>
  </template>
  
  <script>
    import * as Cesium from 'cesium';
    import 'cesium/Build/Cesium/Widgets/widgets.css';
    import axios from 'axios';
  
  export default {
    name: 'CesiumViewer',
    data() {
      return {
        viewer: null,
        drones: [],
      };
    },
    mounted() {
      this.initCesiumViewer();
      this.fetchDroneData();
      setInterval(this.fetchDroneData, 5000); // maj every 5s
    },
    methods: {
      initCesiumViewer() {
        this.viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
        //   terrainProvider: Cesium.createWorldTerrain(),
        });
      },
      async fetchDroneData() {
        // API positions de drones
        fetch('/api/drones')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            this.drones = data; // Met à jour les drones
            this.updateDronesOnMap();
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
      },
      updateDronesOnMap() {
        const dronesArray = Array.isArray(this.drones) ? this.drones : [this.drones];

        //clear entities
        this.viewer.entities.removeAll();
  
        //add drones
        dronesArray.forEach(drone => {
          this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(drone.longitude, drone.latitude, drone.altitude),
            point: {
              pixelSize: 10,
              color: Cesium.Color.BLUE,
            },
            label: {
              text: `Drone ${drone.id}`,
              font: '14pt sans-serif',
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
          });
        });
  
        this.viewer.zoomTo(this.viewer.entities);
      },
    },
    beforeDestroy() {
      if (this.viewer) {
        this.viewer.destroy();
      }
    },
  };
  </script>
  
  <style>
  .cesium-container {
    width: 100%;
    height: 100vh;
  }
  </style>
  