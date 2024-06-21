<script setup>
import { ref, computed } from 'vue'
import CarParkNearMe from './views/CarParkNearMe.vue'
import CarParkList from './views/CarParkList.vue'
import HistoryPage from './views/HistoryPage.vue';
import RoutingMap from './views/RoutingMap.vue';
import LocationPage from './views/UploadLocation.vue';
import CRUDPage from './views/CRUDLocation.vue';

const routes = {
  '/': CarParkNearMe,
  '/cpList': CarParkList,
  '/history':HistoryPage,
  '/routeMap':RoutingMap,
  '/location':LocationPage,
  '/crud':CRUDPage,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})
</script>

<template>
  <div class="container">
    <nav class="navbar">
      <ul class="navbar-nav">
        <!-- <li class="nav-item"><a class="nav-link" href="#/">Home</a></li> -->
        <li class="nav-item"><a class="nav-link" href="#/">CarParkNearMe</a></li>
        <li class="nav-item"><a class="nav-link" href="#/cpList">CarPark List</a></li>
        <li class="nav-item"><a class="nav-link" href="#/routeMap">RoutingMap</a></li>
        <li class="nav-item"><a class="nav-link" href="#/crud">UpdateLocation</a></li>
        <li class="nav-item"><a class="nav-link" href="#/location">Upload</a></li>

      </ul>
    </nav>

    <div class="content">
      <component :is="currentView" />
    </div>
  </div>
</template>

<style>
.container {
  max-width: 1100px;
  margin: 0 auto;
}

.navbar {
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.navbar-nav {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-right: 10px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #ddd;
}

.content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>