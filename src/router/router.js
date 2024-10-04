// Exemple d'un fichier router.js
import Vue from 'vue';
import Router from 'vue-router';
import CesiumViewer from '../components/CesiumViewer.vue';
import DroneViewer from '../components/DroneViewer.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'CesiumViewer',
      component: CesiumViewer,
    },
    {
      path: '/drone-viewer', // Chemin pour accéder à la vue DroneViewer
      name: 'DroneViewer',
      component: DroneViewer,
    },
  ],
});
