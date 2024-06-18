<script>
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import { IRouter, IGeocoder, LineOptions } from "leaflet-routing-machine";
import { store } from '../components/store'

const props = {
  markerIcon: {
      type: Object,
      required: true,
    },
  mapObject: {
    type: Object,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  waypoints: {
    type: Array,
    required: true,
  },
  router: {
    type: IRouter,
  },
  plan: {
    type: L.Routing.Plan,
  },
  geocoder: {
    type: IGeocoder,
  },
  fitSelectedRoutes: {
    type: [String, Boolean],
    default: "smart",
  },
  lineOptions: {
    type: LineOptions,
  },
  routeLine: {
    type: Function,
  },
  autoRoute: {
    type: Boolean,
    default: true,
  },
  routeWhileDragging: {
    type: Boolean,
    default: false,
  },
  routeDragInterval: {
    type: Number,
    default: 500,
  },
  waypointMode: {
    type: String,
    default: "connect",
  },
  useZoomParameter: {
    type: Boolean,
    default: false,
  },
  showAlternatives: {
    type: Boolean,
    default: false,
  },
  altLineOptions: {
    type: LineOptions,
  },
};

export default {
  props,
  name: "LRoutingMachine",
  data() {
    return {
      ready: false,
      map: null,
      layer: null,
    };
  },
  watch: {
    mapObject() {
      if (this.mapObject == null) {
        return;
      }
      this.add();
    },
  },
  mounted() {
    this.add();
  },
  beforeUnmount() {
    return this.layer ? this.layer.remove() : null;
  },
  methods: {
    add() {
      if (this.mapObject == null) {
        return;
      }

      const {
        waypoints,
        fitSelectedRoutes,
        autoRoute,
        routeWhileDragging,
        routeDragInterval,
        waypointMode,
        useZoomParameter,
        showAlternatives,
      } = this;

      const options = {
        waypoints,
        fitSelectedRoutes,
        autoRoute,
        routeWhileDragging,
        routeDragInterval,
        waypointMode,
        useZoomParameter,
        showAlternatives,
      };

      store.routingLayer = L.Routing.control(options);
      store.routingLayer.addTo(this.mapObject);
      this.layer = store.routingLayer;

      this.ready = true;
    },
  },
  
};
</script>
