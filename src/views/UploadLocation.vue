<template>
  <div>
    <div class="dropzone" v-bind="getRootProps()">
      <input class="dropzone-input" v-bind="getInputProps()" />
      <div class="dropzone-text">
        <p>{{ dropzoneText }}</p>
      </div>
    </div>
  </div>

  <div>
    <table>
      <thead>
        <tr>
          <th>Name (CN)</th>
          <th>Name (PT)</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in locations" :key="item.id">
          <td>{{ item.nameCN }}</td>
          <td>{{ item.namePT }}</td>
          <td>{{ item.lat }}</td>
          <td>{{ item.lng }}</td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button class="reset-button" @click="resetRow">Reset</button>
      <button class="upload-button" @click="uploadRow">Upload</button>
    </div>
  </div>

</template>

<script>
import { useDropzone } from "vue3-dropzone";
import Papa from 'papaparse';
import { store } from "@/components/store";
import { watch } from 'vue';
import axios from 'axios';

export default {



  data() {
    return {
      locations: [],
      editingPerson: null,
      dropzoneText: "Drop the files here ...",

    };
  },

  created() {
    watch(() => store.csvdata, (newCsvdata) => {
      if (newCsvdata.length <= 0) return;
      this.loadToTable();
    });
  },

  setup() {
    function onDrop(acceptedFiles, rejectedFiles) {
      console.log(rejectedFiles);
      const csvFiles = acceptedFiles.filter(file => file.type === 'text/csv');
      csvFiles.forEach(file => {
        store.filename = csvFiles.map(file => file.name)[0];
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            store.csvdata = results.data;
          }
        });
      });
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });

    return {
      getRootProps,
      getInputProps,
      ...rest,
    };
  },

  methods: {
    loadToTable() {

      this.dropzoneText = "Current File: " + store.filename;

      this.locations = store.csvdata.map(x => ({
        nameCN: x.name_cn,
        namePT: x.name_pt,
        lat: x.latitude,
        lng: x.longitude
      }));
    },
    resetRow() {
      this.locations = [];
      store.csvdata = [];
      store.filename = "";
      this.dropzoneText = "Drop the files here ...";
    },
    uploadRow() {

      if (this.locations.length > 0) {
        axios.post("https://localhost:7155/InsertLocation", this.locations)
          .then(res => {
            if (res.data == true) {
              alert("Successfully upload locations");
            }else{
              alert(res.data);
            }
          })
      } else {
        alert("Please upload files first");
      }

    }
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Table Styles */
table {
  table-layout: fixed;
  width: 100%;
}

th {
  width: 150px;
  /* Adjust the width as needed */
}

td {
  padding: 10px;
  border: 1px solid #ddd;
}

th {
  background-color: #f0f0f0;
}

.dropzone {
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  /* Add a dashed border */
  border-radius: 5px;
  padding: 30px;
  height: 100px;
  text-align: center;
}

.dropzone:hover {
  border: 1px solid #ccc;
  /* Add a solid border on hover */
}

.buttons {
  display: flex;
  margin-top: 50px;
  justify-content: flex-end;
}

.reset-button {
  width: 80px;
  height: 40px;
  margin-right: 5px;
  background-color: #007bff;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}

.upload-button {
  width: 80px;
  height: 40px;
  
  background-color: #4CAF50;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}
</style>