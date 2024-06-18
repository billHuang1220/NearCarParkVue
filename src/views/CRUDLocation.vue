<template>



    <div class="location-page">
        <h1>Search Location</h1>
        <div class="autocomplete-container">
            <AutoComplete v-model="value" :suggestions="items" :optionLabel="getLabel" @complete="searchLocation"
                @keydown.down="selectNextItem" @keydown.up="selectPreviousItem" class="custom-autocomplete" placeholder="Search by Name"/>
            <button class="select-button" @click="select">Select</button>

        </div>
        <div v-if="location">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Name (CN)</td>
                        <td>
                            <input type="text" v-model="location.nameCN" class="input-field" />
                        </td>
                    </tr>
                    <tr>
                        <td>Name (EN)</td>
                        <td>
                            <input type="text" v-model="location.namePT" class="input-field" />
                        </td>
                    </tr>
                    <tr>
                        <td>Latitude</td>
                        <td>
                            <vue-number-input type="text" v-model="location.lat" inline/>
                        </td>
                    </tr>
                    <tr>
                        <td>Longitude</td>
                        <td>
                            <vue-number-input type="text" v-model="location.lng" inline/>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="btn-row1">
                <button class="select-button" @click="reset">Reset</button>
                <div class="btn-row">

                    <div v-if="location.id">
                        <button class="insert-button" @click="update">Update</button>
                    </div>
                    <div v-else>
                        <button class="insert-button" @click="insert">Insert</button>
                    </div>
                    <button class="delete-button" @click="softDelete">Delete</button>
                </div>
            </div>

        </div>


    </div>


</template>

<script>

import AutoComplete from "primevue/autocomplete";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import axios from "axios";

const tempLocation = {
    nameCN: '',
    namePT: '',
    lat: '',
    lng: '',
    id: null

};
export default {

    components: {
        AutoComplete,
    },

    data() {
        return {
            value: '',
            items: [],
            location: tempLocation,
            selectedItemIndex: -1,
        };
    },
    methods: {

        async searchLocation() {
            try {
                const response = await axios.get(
                    `https://localhost:7155/AutoComplete?prefix=${this.value}`
                );
                this.items = response.data;
            } catch (error) {
                console.error(error);
            }
        },


        reset() {
            this.value = '',
            this.location.nameCN = '';
            this.location.namePT = '';
            this.location.lat = '';
            this.location.lng = '';
            this.location.id = '';
        },


        insert() {
            var properties = Object.keys(this.location);
            properties = properties.filter(x=>x!= "id");
            console.log(properties);
            const nullProperties = properties.filter(
                (property) => this.location[property] === ''
            );

            if (nullProperties.length > 0) {
                alert("One or more properties are null!");
            } else {
                var loc = [{
                    nameCN: this.location.nameCN,
                    nameEN: this.location.namePT,
                    lat: this.location.lat,
                    lng: this.location.lng
                }];

                axios.post("https://localhost:7155/InsertLocation", loc)
                    .then(res => {
                        if(res.data == true){
                            alert("Successfully insert location!");
                            this.location = tempLocation;
                        }else{
                            alert(res.data);
                        }
                    });
            }
        },
        select() {
            if (this.value) {
                this.location = this.value;
                console.log(this.location);
                this.value = '';
            }
        },

        update() {
            if (this.location) {
                try {
                    axios.put(`https://localhost:7155/UpdateLocation?nameCN=${this.location.nameCN}&nameEN=${this.location.namePT}&lat=${this.location.lat}&lng=${this.location.lng}&id=${this.location.id}`)
                        .then(res => {

                            if (res.data) {
                                alert("Successfully update the location!");
                            } else {
                                alert("Fail to update the location!");
                            }
                            this.location = tempLocation;
                        });

                } catch (error) {
                    console.error(error);
                }

            }
        },
        softDelete() {
            if (this.location) {
                try {
                    axios.put(`https://localhost:7155/DeleteLocation?id=${this.location.id}`)
                        .then(res => {

                            if (res.data) {
                                alert("Successfully deleted the location!");
                            } else {
                                alert("Fail to delete the location!");
                            }
                        });
                    this.location = tempLocation;

                } catch (error) {
                    console.error(error);
                }
            }
        },

        getLabel(item) {
            return item.nameCN + " (" + item.namePT + ")";
        },

        selectNextItem() {
            if (this.selectedItemIndex < this.items.length - 1) {
                this.selectedItemIndex++;
            }
        },

        selectPreviousItem() {
            if (this.selectedItemIndex > 0) {
                this.selectedItemIndex--;
            }
        },

        debouncedSearchLocation() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(this.searchLocation, 500); // 0.5 second delay
        },
    },
    mounted() {
        // Fetch the location details from an API or other data source
        // and populate the location object
    },
};
</script>

<style scoped>
.location-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

.form-group {
    margin-top: 20px;
    margin-bottom: 20px;
}

.btn {
    margin-right: 10px;
}


.insert-button {
    margin-left: 5px;
    padding: 8px 16px;
    background-color: #4CAF50;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}

.select-button  {
    margin-left: 5px;
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}


.delete-button {
    margin-left: 5px;

    padding: 8px 16px;
    background-color: rgba(252, 44, 44, 0.932);
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}

.custom-table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.custom-table th,
.custom-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.custom-table th {
    background-color: #f2f2f2;
}

.input-field {
  -moz-appearance: textfield;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: .25rem;
  display: block;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 100%;
  min-height: 1.5rem;
  min-width: 3rem;
  padding: .4375rem .875rem;
  transition: border-color .15s;
  width: 100%;
}


.autocomplete-container {
    display: flex;
    align-items: center;
    width: auto;
}

.btn {
    margin-top: 10px;
}

.btn-row {
    display: flex;
    justify-content: flex-end;
}

.btn-row1 {
    display: flex;
    justify-content: space-between;

}
</style>