<template>
      <input type="text" v-model="searchQuery" placeholder="Search by ID or Name" class="search-bar" />
  <table class="my-table">
    <thead>
      <tr>
        <th>CP_ID</th>
        <th>Name</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in filteredRows" :key="row.cp_ID">
        <td>{{ row.cp_ID }}</td>
        <td>{{ row.nameC }}</td>
        <td>
          <button :class="{ active: row.hasCarSlot }" class="car-button" @click="openDatepicker(row,'car')">
            <img src="../assets/car.png" alt="Car" class="button-icon">
          </button>
      
          <button :class="{ active: row.hasMBSlot }" class="mb-button"  @click="openDatepicker(row,'mb')">
            <img src="../assets/motorCycle.png" alt="Motor Bike" class="button-icon">
          </button>

          <VueDatePicker v-model="selectedDate" 
            :enable-time-picker="false"
       
            :disabled-dates="disableDates"
            inline 
            auto-apply
            v-if="selectedCpID === row.cp_ID" 
            @closed="closeDatepicker">
          </VueDatePicker>
          <button v-if="selectedCpID === row.cp_ID" @click="sumbitDate()" class="submit-button">Submit</button>
          <button v-if="selectedCpID === row.cp_ID" @click="closeDatepicker()" class="cancel-button">Cancel</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios';
import { store } from '../components/store'

export default {
  name: 'CarParkList',

  data() {
    return {
      rows: [],
      selectedCpID: '',
      selectedDate: '',
      availableDate:[],
      searchQuery: '',
    };
  },

  created() {
    this.fetchCarParkList();
    this.fetchDate();
  },

  computed: {
    filteredRows() {
      return this.rows.filter(row => {
        const query = this.searchQuery.toLowerCase();
        return row.cp_ID.toLowerCase().includes(query) || row.nameC.toLowerCase().includes(query);
      });
    },
  },
  methods: {
    fetchCarParkList() {
      // Make an API call to fetch the data
      axios.get('https://localhost:7155/GetCarParkList')
        .then(response => {
          this.rows = response.data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchDate(){
      axios.get('https://localhost:7155/GetAvailableDate')
        .then(response => {
          this.availableDate = response.data;
        })
        .catch(error => {
          console.error('Error fetching available date:', error);
        });

    },
    openDatepicker(row, type) {
      this.selectedDate = new Date();
      this.selectedCpID = row.cp_ID;
      store.nameC = row.nameC;
      store.type = type;
    },
    closeDatepicker() {
      this.selectedCpID = '';
      this.selectedDate = '';
      store.type = '';
      store.cp_ID='';
      store.picked_date='';
    },
    sumbitDate() {
      store.cp_ID = this.selectedCpID;
      store.picked_date = `${String(this.selectedDate.getMonth() + 1).padStart(2, '0')}${String(this.selectedDate.getDate()).padStart(2, '0')}`;
      window.location.hash = '#/history';
    },
  
    disableDates(date) {    
      const options = { month: "2-digit", day: "2-digit", timeZone: "Asia/Shanghai" };
      const formattedDate = date.toLocaleDateString("en-US", options);
      const result = formattedDate.replace(/\//g, '');
      return !this.availableDate.includes(result);
    },
  },
};
</script>

<style scoped>
.my-table {
  border-collapse: collapse;
  width: 100%;
}

.my-table th,
.my-table td {
  border: 1px solid black;
  padding: 8px;
}

.my-table th {
  background-color: #f2f2f2;
}

.car-button,
.mb-button {
  background-color: #e6e6e6;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.car-button.active {
  background-color: #99cc99;
}

.mb-button.active {
  background-color: #36A2EB;
}

.button-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 5px;
}

.submit-button,
.cancel-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 5px;
}

.cancel-button {
  background-color: #f44336;
}

.submit-button:hover,
.cancel-button:hover {
  opacity: 0.8;
}


.search-bar {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
}
</style>     
