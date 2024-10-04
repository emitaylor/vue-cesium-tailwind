<template>
  <div>
    <button @click="playFlight">Play</button>
    <button @click="pauseFlight">Pause</button>
    <button @click="prevStep">Étape Précédente</button>
    <button @click="nextStep">Étape Suivante</button>
    <div ref="viewerContainer" style="width: 100%; height: 100vh;"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { Viewer, Cartesian3, HeadingPitchRoll, Transforms, Color } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

export default {
  name: 'CesiumViewer',
  data() {
    return {
      viewer: null,
      droneEntity: null,
      dronePath: [],
      currentIndex: 0,
      timer: null,
    };
  },
  async created() {
    // Charger les données JSON au moment de la création du composant
    try {
      const response = await fetch('/datas.json'); // Assurez-vous que le fichier `datas.json` est dans `public`
      this.dronePath = await response.json();
    } catch (error) {
      console.error('Erreur lors du chargement du fichier JSON:', error);
    }
  },
  setup() {
    const viewerContainer = ref(null);

    onMounted(() => {
      // Initialiser le viewer Cesium
      const viewer = new Viewer(viewerContainer.value, {
        shouldAnimate: true,
        fullscreenButton: true,
        timeline: false,
        infoBox: false,
        selectionIndicator: false,
      });

      // Créer un drone avec une simple forme géométrique
      const droneEntity = viewer.entities.add({
        name: "Drone",
        position: Cartesian3.fromDegrees(-75.59777, 40.03883, 100),
        orientation: Transforms.headingPitchRollQuaternion(
          Cartesian3.fromDegrees(-75.59777, 40.03883, 100),
          new HeadingPitchRoll(0, 0, 0)
        ),
        cylinder: {
          length: 10.0,
          topRadius: 2.0,
          bottomRadius: 2.0,
          material: Color.RED.withAlpha(0.8),
        },
      });
      
      this.viewer = viewer;
      this.droneEntity = droneEntity;
    });

    return {
      viewerContainer,
    };
  },
  methods: {
    playFlight() {
      if (this.currentIndex >= this.dronePath.length - 1) {
        this.currentIndex = 0;
      }

      this.timer = setInterval(() => {
        if (this.currentIndex < this.dronePath.length) {
          const currentData = this.dronePath[this.currentIndex];
          const position = Cartesian3.fromDegrees(currentData.longitude, currentData.latitude, currentData.altitude);
          const orientation = Transforms.headingPitchRollQuaternion(
            position,
            new HeadingPitchRoll(
              Cesium.Math.toRadians(currentData.attitude_head),
              Cesium.Math.toRadians(currentData.attitude_pitch),
              Cesium.Math.toRadians(currentData.attitude_roll)
            )
          );

          this.droneEntity.position = position;
          this.droneEntity.orientation = orientation;

          this.currentIndex++;
        } else {
          clearInterval(this.timer);
        }
      }, 1000); // Intervalle de temps (1 seconde par étape)
    },
    pauseFlight() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    nextStep() {
      if (this.currentIndex < this.dronePath.length - 1) {
        this.currentIndex++;
        this.updateDronePosition();
      }
    },
    prevStep() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateDronePosition();
      }
    },
    updateDronePosition() {
      const currentData = this.dronePath[this.currentIndex];
      const position = Cartesian3.fromDegrees(currentData.longitude, currentData.latitude, currentData.altitude);
      const orientation = Transforms.headingPitchRollQuaternion(
        position,
        new HeadingPitchRoll(
          Cesium.Math.toRadians(currentData.attitude_head),
          Cesium.Math.toRadians(currentData.attitude_pitch),
          Cesium.Math.toRadians(currentData.attitude_roll)
        )
      );

      this.droneEntity.position = position;
      this.droneEntity.orientation = orientation;
    },
  },
};
</script>

<style scoped>
.cesium-viewer-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
