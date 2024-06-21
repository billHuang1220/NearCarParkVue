<template>
  <div class="autocomplete-container">

    <AutoComplete v-model="value" :suggestions="items" :optionLabel="getLabel" @complete="searchLocation" />

    <button class="insert-button" @click="insert">Insert</button>
  </div>
  <div class="routerList-container">

    <table class="my-table">
      <thead>
        <tr>
          <th>Name (CN)</th>
          <th>Name (EN)</th>
          <th class="column-width-20">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="waypoints.length === 0">
          <td colspan="3">No waypoint available</td>
        </tr>
        <tr v-for="(point, index) in waypoints" :key="point.name">
          <td>{{ point.nameCN }}</td>
          <td>{{ point.nameEN }}</td>

          <td>
            <div class="btn-row">
              <button @click="remove(index)" class="table-btn">
                <img src="../assets/trash.png" alt="Car" class="button-icon">
              </button>
              <button @click="moveUp(index)" :disabled="index === 0" class="table-btn">
                <img src="../assets/moveUp.png" alt="Car" class="button-icon">
              </button>
              <button @click="moveDown(index)" :disabled="index === waypoints.length - 1" class="table-btn">
                <img src="../assets/move.png" alt="Car" class="button-icon">
              </button>
              <button @click="checkNearCarPark(point)" class="table-btn">
                <img src="../assets/car-park.png" alt="Car" class="button-icon">
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div :id="mapId" class="map"></div>
  <LRoutingMachine :mapObject="mapObject" :waypoints="waypoints" :markerIcon="customIcon">

  </LRoutingMachine>
</template>

<script>
import LRoutingMachine from "../components/LRoutingMachine.vue";
import "leaflet/dist/leaflet.css";
import AutoComplete from "primevue/autocomplete";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import L from "leaflet";
import axios from "axios";
import { store } from "../components/store";

window.onbeforeunload = function () {
  store.waypoints = this.waypoints;
}

const customIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
  iconSize: [25, 25], // Adjust the size according to your marker image
});

export default {
  components: {
    LRoutingMachine,
    AutoComplete,
  },
  data() {
    return {
      mapId: "map",
      mapObject: null,
      zoom: 15,
      waypoints: store.waypoints,
      center: { lat: 22.210928, lng: 113.552971 },
      osmUrl: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      customIcon,
      value: "",
      items: [],
      debounceTimer: null,
      selectedItemIndex: -1,
    };
  },
  mounted() {
    this.mapObject = L.map(this.mapId, {
      zoom: this.zoom,
      center: this.center,
    });

    L.tileLayer(this.osmUrl, {
      attribution: this.attribution,
    }).addTo(this.mapObject);
  },

  methods: {
    async searchLocation() {
      try {
        const response = await axios.get(
          `https://localhost:7155/AutoComplete?prefix=${this.value}`
        );
        if (typeof (response.data) == "object") {
          this.items = response.data;

        } else {
          console.log(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    },

    checkNearCarPark(point) {
      store.clientLocation = [point.lat, point.lng];
      window.location.hash = '#/';

    },
    getLabel(item) {
      return (item.nameCN && item.nameEN) ? item.nameCN + " (" + item.nameEN + ")" : item;
    },


    insert() {

      if (this.value) {
        const isDuplicate = this.waypoints.some((point) => point.nameCN == this.value.nameCN);

        if (isDuplicate) {
          alert("Waypoint already exists!");
        } else {
          this.waypoints.push(this.value);
          this.value = "";
          store.routingLayer.setWaypoints(this.waypoints);
        }
      }
    },

    remove(index) {
      this.waypoints.splice(index, 1);
      store.routingLayer.setWaypoints(this.waypoints);
    },
    moveUp(index) {
      if (index > 0) {
        [this.waypoints[index - 1], this.waypoints[index]] = [this.waypoints[index], this.waypoints[index - 1]];
        store.routingLayer.setWaypoints(this.waypoints);
      }
    },
    moveDown(index) {
      if (index < this.waypoints.length - 1) {
        [this.waypoints[index], this.waypoints[index + 1]] = [this.waypoints[index + 1], this.waypoints[index]];
        store.routingLayer.setWaypoints(this.waypoints);
      }
    },
  },
  watch: {
    selectedItemIndex(newIndex) {
      const selectedItem = this.items[newIndex];
      if (selectedItem) {
        this.value = this.getLabel(selectedItem);
      }
    },
  },
};
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.my-table th.column-width-20 {
  width: 20%;
}

.button-icon {
  width: 25px;
  height: 25px;
}

.trash-button-icon {
  width: 25px;
  height: 25px;
}

.button-icon {
  width: 25px;
  height: 25px;
}

.btn-row {
  display: flex;
  justify-content: space-evenly;
}

.table-btn {
  width: 50px;
  height: auto;
  background-color: white;
  border-radius: 5px;
  border-width: 1.5px;
  margin-right: 10px;
}

.routerList-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.autocomplete-container {
  display: flex;
  align-items: center;
  width: 100%;

}

.custom-autocomplete {
  margin-right: 10px;

}

.insert-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.my-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}


.my-table th,
.my-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.map {
  padding: 10px;
  width: 1000px;
  height: 800px;
  margin: auto;

}
</style>