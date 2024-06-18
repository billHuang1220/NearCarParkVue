// store.js
import { reactive } from 'vue'

export const store = reactive({
  cp_ID: '',
  picked_date:'',
  type: '',
  nameC:'',
  routingLayer:null,
  waypoints: [],
  clientLocation: [22.210928, 113.552971],
  userType : "car",
  csvdata:[],
  filename:"",
})