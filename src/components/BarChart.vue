<template>
  <div class="container">
    <Bar v-if="loaded" :data="chartData" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { store } from './store'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
data: () => ({
  loaded: false,
  chartData: null,
  url:'',
  color : "rgba(153, 204, 153,0.5)",

}),
  async mounted() {
    this.loaded = false
    switch(store.type){
      case 'car':
        this.url = `https://localhost:7155/GetCarSlotAnalyst?date=${store.picked_date}&cpID=${store.cp_ID}`;
        break;
      case 'mb':
        this.url = `https://localhost:7155/GetMbSlotAnalyst?date=${store.picked_date}&cpID=${store.cp_ID}`;
        this.color = 'rgba(54, 162, 235, 0.5)';
        break;
    }
    fetch(this.url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response is not ok');
        }
        return response.json();
      })
      .then(data => {
        const timeIndex = data.map(item => item.timeIndex);
        const count = data.map(item => item.count);

        this.chartData = {
          labels: timeIndex,
          datasets: [
            { 
              label: '剩餘空位',
              data: count,  
              backgroundColor:this.color }
          ]
        };
      })
      .finally(() => {
        this.loaded = true;
      });
  }
}
</script>