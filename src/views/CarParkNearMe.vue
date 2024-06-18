<template>

  <div class="switcher">
    <div class="switch">
      <input type="checkbox" id="user-type" v-model="userType" true-value="Mb" false-value="Car" />
      <label for="user-type" class="switch-toggle"></label>
    </div>
  </div>
  <div>
    <div class="input-container">
      <div class="input-box">
        <label for="latitude">Latitude:</label>
        <vue-number-input type="text" v-model="latitude.value" inline />
      </div>
      <div class="input-box">
        <label for="longitude">Longitude:</label>
        <vue-number-input type="text" v-model="longitude.value" inline />

      </div>
      <button class="latlng-btn" @click="changeClientLocation()">Refresh</button>
    </div>
  </div>
  <div class="near-container">
    <div class="map-container">

      <div style="height: 400px; width: 550px; padding: 10px;">
        <l-map ref="map" v-model:zoom="zoom" :center=focusPoint>
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
            name="OpenStreetMap"></l-tile-layer>

          <l-marker :lat-lng="[marker.lat, marker.lng]" v-for="(marker, index) in markers" :key="index">
            <LIcon
              :icon-url="`https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-${colors[index]}.png`"
              :icon-size="[25, 35]" />
          </l-marker>

          <l-marker :lat-lng="clientLocation" :static-anchor="true">
            <LIcon :icon-url="`https://cdn-icons-png.flaticon.com/512/3603/3603850.png`" :icon-size="[35, 35]" />
          </l-marker>


        </l-map>


      </div>
    </div>

    <div class="table-container">
      <table class="my-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Distance</th>
            <th>Avaiable slot</th>
            <th>Price</th>
            <th>Jump to</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="row.cp_ID">
            <td>{{ row.nameC }}</td>
            <td>{{ row.distance }}m</td>
            <td>{{ row.count }}</td>
            <td>{{ row.priceString }}</td>
            <td>
              <button class="marker-button" @click="jumpToMarker(row)">
                <img
                  :src="`https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-${colors[index]}.png`"
                  alt="Marker Icon" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LMarker, LIcon, LTileLayer } from "@vue-leaflet/vue-leaflet";
import axios from 'axios';
import { store } from '../components/store'

export default {
  components: {
    LMap,
    LMarker,
    LTileLayer,
    LIcon
  },
  data() {
    return {
      rows: [],
      zoom: 15,
      latitude: {
        value: 22.210928,
        error: ''
      },
      longitude: {
        value: 113.552971,
        error: ''
      },
      focusPoint: [22.210928, 113.552971],
      clientLocation: [],
      carParkmarkers: [], // Array to store dynamically added markers
      userType: "Car",
      colors: ["red", "green", "blue", "grey", "yellow"],
    };
  },
  created() {
    this.latitude.value = store.clientLocation[0];
    this.longitude.value = store.clientLocation[1];
    this.userType = store.userType;
    this.clientLocation = [this.latitude.value, this.longitude.value];
    this.fetchData();
  },
  watch: {
    userType(newValue) {
      this.userType = newValue;
      store.userType = newValue;

      this.fetchData();
    },
  },
  methods: {
    fetchData() {
      // Make an API call to fetch the data
      axios.get(`https://localhost:7155/Get${this.userType}NearestCarPark?lat=${this.latitude.value}&lng=${this.longitude.value}`)
        .then(response => {
          this.rows = response.data;
          this.markers = this.rows.map(row => ({
            lat: row.lat,
            lng: row.lng,
            // color: "blue"
          }));
          this.clientLocation = [this.latitude.value, this.longitude.value];
          this.focusPoint = this.clientLocation;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });


    },
    jumpToMarker(row) {
      this.focusPoint = [row.lat, row.lng];
    },

    changeClientLocation() {
      // Validate latitude input
      if (isNaN(parseFloat(this.latitude.value))) {
        this.latitude.error = 'Invalid latitude value';
        return;
      } else {
        this.latitude.error = '';
      }

      // Validate longitude input
      if (isNaN(parseFloat(this.longitude.value))) {
        this.longitude.error = 'Invalid longitude value';
        return;
      } else {
        this.longitude.error = '';
      }

      // Update client location and fetch data
      this.clientLocation = [this.latitude.value, this.longitude.value];
      this.focusPoint = this.clientLocation;
      this.carParkmarkers = [];
      this.fetchData();
    }
  }
};
</script>

<style scoped>
.near-container {
  display: flex;
  flex-wrap: wrap;
}



.map-container {
  flex: 1;
  padding: 10px;
}

.table-container {
  flex: 1;
  margin-left: 20px;
  padding-top: 20px;
  max-width: 600px;
}

.my-table {
  width: 100%;
  text-align: center;
  /* Align the table content to the center */
}

.my-table th,
.my-table td {
  padding: 8px;
}

.my-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.my-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}


.latlng-btn {
  margin-bottom: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;

}

.input-container {
  display: flex;
  align-items: center;
}

.input-box {
  margin-top: 10px;
  margin-right: 10px;
}

.input-box label {
  padding-left: 10px;
  padding-bottom: 25px;
  display: inline-block;
  width: 100px;
  font-weight: bold;
  text-align: left;
  vertical-align: middle;
}


.input-box input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.current-coordinates {
  margin-top: 20px;
  font-weight: bold;
}

.marker-button {
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.error-message {
  position: relative;
  display: inline-block;
}

.error-message span {
  position: absolute;
  top: -70px;
  left: 50%;
  transform: translateX(-100%);
  background-color: red;
  color: white;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
}

.switcher {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-toggle {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #007bff;
  border-radius: 34px;
  transition: 0.4s;
}

.switch-toggle:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}



.switch input:checked+.switch-toggle:before {
  transform: translateX(26px);
}

.switch-toggle:before {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}



.switch-toggle:after {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 4px;
  color: white;
}

.switch-toggle:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
  background-image: url('@/assets/car.png');
  /* Replace with your car icon image */
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60%;
  /* Adjust the size as needed */
}

.switch input:checked+.switch-toggle:before {
  transform: translateX(26px);
  background-image: url('@/assets/motorCycle.png');
  /* Replace with your motorbike icon image */
  background-position: center;
  background-size: 60%;
  /* Adjust the size as needed */
}

.slider-label {
  margin-left: 10px;
}
</style>