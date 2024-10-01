# Vue Cesium Drone Project

This project is a web application that utilizes [CesiumJS](https://cesium.com/platform/cesiumjs/) for visualizing geospatial data. It simulates drones flying around the globe, showcasing real-time movement and geospatial visualization capabilities.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features
- **3D Visualization**: View the Château de Murviel-lès-Béziers in 3D with accurate geospatial coordinates.
- **GeoJSON Integration**: Load and visualize data from a GeoJSON file.
- **Dynamic Drone Simulation**: Observe drones flying around the globe in real-time.
- **Custom Labels**: Each entity (e.g., Château and Drones) has a label for better identification.
- **Interactive Map**: Rotate, zoom, and pan around the 3D globe to explore the simulation.

## Getting Started
To get a local copy of this project up and running, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/cesium-drone-simulation.git
   ```

2. **Navigate to the project directory:**:
   ```bash
   cd vue-cesium-drone
   ```

3. **Install the dependencies: Make sure you have Node.js installed. Then run:**:
   ```bash
   npm install
   ```

4. **Run the application: You can start the application by running:**:
   ```bash
   npm run dev
   ```

5. **Open your browser: Visit http://localhost:5173 to view the application.**



## Usage
- Navigate the Map: Use your mouse or trackpad to rotate, zoom, and pan around the 3D map.
- Drones: Observe three drones represented by colored points, moving around the globe simultaneously.
- Castel Visualization: The Castel of Murviel-lès-Béziers is marked on the map, with a label providing additional context.
- Model Interaction: The drones are visualized using custom 3D models (GLTF format), allowing for more realistic simulations.


## Technologies Used
- **CesiumJS** For 3D geospatial rendering and real-time simulation.
- **Vue.js**   For building the user interface and components.
- **Node.js**  For backend services and project dependencies.
- **GeoJSON**  For geospatial data integration and visualization.