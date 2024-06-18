<template>
    <h1 class="title">{{ title }}</h1>
    <BarChart />
</template>

<script>
import BarChart from '../components/BarChart'
import { store } from '../components/store'


export default {
  name: 'HistoryPages',
  components: { BarChart },
  data: () => ({
    loaded: false,
    title: store.nameC,
  }),
  mounted() {
    switch (store.type) {
      case 'car':
        this.title = this.title + "-輕型車輛車位統計";
        break;
      case 'mb':
        this.title = this.title + "-電單車車位統計";
        break;
    }

  }



}


</script>
<style>
.title {
  text-align: center;
}
</style>