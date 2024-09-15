import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

createApp(App).mount('#app')
