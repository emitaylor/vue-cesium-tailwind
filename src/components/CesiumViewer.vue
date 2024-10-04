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
import { Viewer, Cartesian3, HeadingPitchRoll, Transforms, Color, Math as CesiumMath } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

export default {
  name: 'CesiumViewer',
  setup() {
    const viewerContainer = ref(null)
    const viewer = ref(null)
    const droneEntity = ref(null)
    const dronePath = ref([])
    const currentIndex = ref(0)
    const timer = ref(null)

    const fetchDronePath = async () => {
      try {
        const response = await fetch('/datas.json')
        const data = await response.json()
        console.log('Données JSON reçues:', data)
        const flightRecords = data.flight_records
        if (flightRecords) {
          console.log('%c flightRecords HERE!', 'background: #222; color: #bada55')
          console.log(flightRecords)
          console.log('%c END', 'background: #222; color: #bada55')

          Object.keys(flightRecords).forEach(recordKey => {
            const record = flightRecords[recordKey]
            console.log('Données de l\'enregistrement:', record)

            if (record.latitude != null && record.longitude != null) {
              dronePath.value.push({
                latitude: record.latitude,
                longitude: record.longitude,
                altitude: record.height || 0,
                attitude_head: record.attitude_head,
                attitude_pitch: record.attitude_pitch,
                attitude_roll: record.attitude_roll,
                timestamp: recordKey
              })
            } else {
              console.warn(`L'enregistrement pour l'horodatage ${recordKey} ne contient pas de latitude ou de longitude valides.`)
            }
          })
        } else {
          console.error('Aucun enregistrement de vol trouvé dans les données.')
        }
      } catch (error) {
        console.error('Erreur lors du chargement du fichier JSON', error)
      }
    }

    onMounted(async () => {
      viewer.value = new Viewer(viewerContainer.value, {
        shouldAnimate: true,
        fullscreenButton: true,
        timeline: false,
        infoBox: false,
        selectionIndicator: false
      })

      await fetchDronePath()

      if (viewer.value && dronePath.value.length > 0) {
        const initialData = dronePath.value[0]
        const initialPosition = Cartesian3.fromDegrees(initialData.longitude, initialData.latitude, initialData.altitude)

        droneEntity.value = viewer.value.entities.add({
          name: 'Drone',
          position: initialPosition,
          point: {
            pixelSize: 10,
            color: Color.RED
          }
        })

        viewer.value.zoomTo(droneEntity.value)
      } else {
        console.error("Les données JSON ne contiennent aucune position de drone valide.")
      }
    })

    const playFlight = () => {
      console.log('playFlight called')
      if (currentIndex.value >= dronePath.value.length - 1) {
        currentIndex.value = 0
      }

      timer.value = setInterval(() => {
        if (currentIndex.value < dronePath.value.length) {
          updateDronePosition(dronePath.value[currentIndex.value])
          currentIndex.value++
        } else {
          clearInterval(timer.value)
        }
      }, 1000)
    }

    const pauseFlight = () => {
      console.log('pauseFlight called')
      if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
      }
    }

    const nextStep = () => {
      console.log('nextStep called')
      if (currentIndex.value < dronePath.value.length - 1) {
        currentIndex.value++
        updateDronePosition(dronePath.value[currentIndex.value])
      }
    }

    const prevStep = () => {
      console.log('prevStep called')
      if (currentIndex.value > 0) {
        currentIndex.value--
        updateDronePosition(dronePath.value[currentIndex.value])
      }
    }

    const jumpToStep = (index) => {
      console.log('jumpToStep called with index:', index)
      currentIndex.value = index
      updateDronePosition(dronePath.value[currentIndex.value])
    }

    const updateDronePosition = (data) => {
      console.log('updateDronePosition called with data:', data)

      if (!droneEntity.value) {
        console.error("droneEntity is not défini.")
        return
      }

      const position = Cartesian3.fromDegrees(data.longitude, data.latitude, data.altitude)
      droneEntity.value.position = position

      const orientation = Transforms.headingPitchRollQuaternion(
        position,
        new HeadingPitchRoll(
          CesiumMath.toRadians(data.attitude_head),
          CesiumMath.toRadians(data.attitude_pitch),
          CesiumMath.toRadians(data.attitude_roll)
        )
      )

      droneEntity.value.orientation = orientation
    }

    return {
      viewerContainer,
      dronePath,
      playFlight,
      pauseFlight,
      nextStep,
      prevStep,
      jumpToStep
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px
}

.control-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px
}

.control-button:hover {
  background-color: #0056b3
}

.cesium-viewer-container {
  width: 100vw;
  height: 60vh
}

.event-list {
  margin-top: 20px
}
</style>