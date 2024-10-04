<template>
  <div class="app-container">
    <div class="controls">
      <button @click="playFlight" class="control-button">Play</button>
      <button @click="pauseFlight" class="control-button">Pause</button>
      <button @click="prevStep" class="control-button">Étape Précédente</button>
      <button @click="nextStep" class="control-button">Étape Suivante</button>
    </div>
    <div ref="viewerContainer" class="cesium-viewer-container"></div>

    <div class="event-list mt-4">
      <h2 class="text-lg font-bold mb-2">Liste des Événements</h2>
      <ul v-if="dronePath && dronePath.length">
        <li v-for="(data, index) in dronePath" :key="index">
          <button @click="jumpToStep(index)">
            {{ data.timestamp }}
          </button>
        </li>
      </ul>
      <p v-else>Aucune action disponible.</p>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { Viewer, Cartesian3, HeadingPitchRoll, Transforms, Color, Math as CesiumMath, SampledPositionProperty, JulianDate  } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

export default {
  name: 'CesiumViewer',
  setup() {
    const viewerContainer = ref(null);
    const viewer = ref(null);
    const droneEntity = ref(null);
    const visionConeEntity = ref(null);
    const dronePath = ref([]);
    const currentIndex = ref(0);
    const timer = ref(null);

    // drone position
    let currentPosition = Cartesian3.fromDegrees(2.3522, 48.8566, 100);
    let currentOrientation = Transforms.headingPitchRollQuaternion(
      currentPosition,
      new HeadingPitchRoll(
        CesiumMath.toRadians(0),
        CesiumMath.toRadians(0),
        CesiumMath.toRadians(0)
      )
    );

    const fetchDronePath = async () => {
      try {
        const response = await fetch('/datas.json');
        dronePath.value = await response.json();
        console.log('dronePath loaded:', dronePath.value);
      } catch (error) {
        console.error('Erreur lors du chargement du fichier JSON:', error);
      }
    };

    onMounted(async () => {
  await fetchDronePath();

  viewer.value = new Viewer(viewerContainer.value, {
    shouldAnimate: true,
    fullscreenButton: true,
    timeline: false,
    infoBox: false,
    selectionIndicator: false,
  });

  // Initialiser le drone si les données JSON ont été chargées
  if (dronePath.value.length > 0) {
    const initialData = dronePath.value[0];
    const initialPosition = Cartesian3.fromDegrees(initialData.longitude, initialData.latitude, initialData.altitude);

    droneEntity.value = viewer.value.entities.add({
      name: 'Drone',
      position: initialPosition,
      point: {
        pixelSize: 10,
        color: Color.RED,
      },
    });

    viewer.value.zoomTo(droneEntity.value);
  } else {
    console.error("Les données JSON ne contiennent aucune position de drone valide.");
  }
});

const playFlight = () => {
  console.log('playFlight called');
  if (currentIndex.value >= dronePath.value.length - 1) {
    currentIndex.value = 0;
  }

  timer.value = setInterval(() => {
    if (currentIndex.value < dronePath.value.length) {
      updateDronePosition(dronePath.value[currentIndex.value]);
      currentIndex.value++;
    } else {
      clearInterval(timer.value);
    }
  }, 1000);
};

    const pauseFlight = () => {
      console.log('pauseFlight called');
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    };

    const nextStep = () => {
      console.log('nextStep called');
      if (currentIndex.value < dronePath.value.length - 1) {
        currentIndex.value++;
        updateDronePosition(dronePath.value[currentIndex.value]);
      }
    };

    const prevStep = () => {
      console.log('prevStep called');
      if (currentIndex.value > 0) {
        currentIndex.value--;
        updateDronePosition(dronePath.value[currentIndex.value]);
      }
    };

    const jumpToStep = (index) => {
      console.log('jumpToStep called with index:', index);
      currentIndex.value = index;
      updateDronePosition(dronePath.value[currentIndex.value]);
    };

    const updateDronePosition = (data) => {
  console.log('updateDronePosition called with data:', data);

  if (!droneEntity.value) {
    console.error("droneEntity is not défini.");
    return;
  }

  const position = Cartesian3.fromDegrees(data.longitude, data.latitude, data.altitude);
  droneEntity.value.position = position;

  // Mettre à jour l'orientation du drone
  const orientation = Transforms.headingPitchRollQuaternion(
    position,
    new HeadingPitchRoll(
      CesiumMath.toRadians(data.attitude_head),
      CesiumMath.toRadians(data.attitude_pitch),
      CesiumMath.toRadians(data.attitude_roll)
    )
  );

  droneEntity.value.orientation = orientation;
};


    return {
      viewerContainer,
      dronePath,
      playFlight,
      pauseFlight,
      nextStep,
      prevStep,
      jumpToStep,
    };
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.control-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.control-button:hover {
  background-color: #0056b3;
}

.cesium-viewer-container {
  width: 100vw;
  height: 60vh;
}

.event-list {
  margin-top: 20px;
}
</style>
