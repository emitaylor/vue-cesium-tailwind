<template>
  <div class="p-6">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Filtrer par site :</label>
      <select v-model="selectedSites" @change="filterDevices" multiple class="mt-1 block w-full">
        <option value="site1">Site 1</option>
        <option value="site2">Site 2</option>
        <!-- Ajouter d'autres options de sites ici -->
      </select>
    </div>
    <ul>
      <li v-for="device in filteredDevices" :key="device.id" class="bg-white p-4 mb-2 rounded shadow">
        {{ device.name }} - {{ device.siteName }}
      </li>
    </ul>
  </div>
</template>
  
  <script>
  import { Viewer, createWorldTerrain } from 'cesium';
  import 'cesium/Source/Widgets/widgets.css';
  import axios from 'axios';
  
  export default {
  data() {
    return {
      devices: [],
      selectedSites: [],
      filteredDevices: [],
    };
  },
  created() {
    this.fetchDevices();
  },
  methods: {
    async fetchDevices() {
      try {
        const response = await axios.get('https://hub.dev.flyingeye.fr/api/device?ConId=1', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZmVkb2NrX3VzZXIifQ.-fJpasraNiTSKlM9grE3eeGDGkeqnoNielFFL1wlwiQ',
          },
        });
        this.devices = response.data;
        this.filteredDevices = this.devices; // Initialisation du filtre
      } catch (error) {
        console.error('Erreur lors de la récupération des appareils:', error);
      }
    },
    filterDevices() {
      // Filtrer les appareils en fonction des sites sélectionnés
      if (this.selectedSites.length) {
        this.filteredDevices = this.devices.filter(device =>
          this.selectedSites.includes(device.siteId) // Remplacer `siteId` par la bonne clé si nécessaire
        );
      } else {
        this.filteredDevices = this.devices;
      }
    },
  },
};