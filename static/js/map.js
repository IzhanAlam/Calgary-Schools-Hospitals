
//get geojson data from link
function get_data_from_url(url){
    var http_req = new XMLHttpRequest();
    http_req.open("GET",url,false);
    http_req.send(null);
    return http_req.responseText;          
}

mapboxgl.accessToken = 'pk.eyJ1IjoiaXpoYW5hbGFtIiwiYSI6ImNrN2s2ZDFiaTAzbzgzZG11MG1xMHdlZzEifQ.uBG-TBw1B2h81lSwJcLPvg';
var map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/izhanalam/ck846sjfv199t1io8gd7v2h9u', 
  center: [-114.0719,51.0447],
  zoom: 10
});

var school_json = 'https://data.calgary.ca/resource/fd9t-tdn2.geojson'
var school_obj = JSON.parse(get_data_from_url(school_json));

var hospital_json = 'https://data.calgary.ca/resource/x34e-bcjz.geojson?type=Hospital';
var hospital_obj = JSON.parse(get_data_from_url(hospital_json));

var clinic_json = 'https://data.calgary.ca/resource/x34e-bcjz.geojson?type=PHS%20Clinic';
var clinic_obj = JSON.parse(get_data_from_url(clinic_json));

var hospital_clinic_obj = { 
  "type" : "FeatureCollection",
  "features": [... hospital_obj.features, ... clinic_obj.features]
};



var hospitals = hospital_clinic_obj;


var school = school_obj;

map.on('load', function() {
  map.addLayer({
    id: 'hospitals',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: hospitals
    },
    layout: {
      'icon-image': 'hospital-15',
      'icon-allow-overlap': true
    },
    paint: { }
  });

  map.addLayer({
    id: 'school',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: school
    },
    layout: {
      'icon-image': 'school-11'
    },
    paint: { }
  });

  map.addSource('nearest-hospital', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });
});

var popup = new mapboxgl.Popup();

map.on('mousemove', function(e) {

  var features = map.queryRenderedFeatures(e.point, { layers: ['hospitals', 'school'] });
  if (!features.length) {
    popup.remove();
    return;
  }

  var feature = features[0];

  popup.setLngLat(feature.geometry.coordinates)
  .setHTML(feature.properties.name)
  .addTo(map);

  map.getCanvas().style.cursor = features.length ? 'pointer' : '';

});




map.on('click', function(e) {

  var schoolFeatures = map.queryRenderedFeatures(e.point, { layers: ['school'] });
  if (!schoolFeatures.length) {
    return;
  }

  var schoolFeature = schoolFeatures[0];

  var nearestHospital = turf.nearest(schoolFeature, hospitals);
  
  if (nearestHospital !== null) {

    map.getSource('nearest-hospital').setData({
      type: 'FeatureCollection',
      features: [nearestHospital]
    });

    map.addLayer({
      id: 'nearest-hospital',
      type: 'circle',
      source: 'nearest-hospital',
      paint: {
        'circle-radius': 12,
        'circle-color': 'black'
      }
    }, 'hospitals');
  }

  var school_name = schoolFeature.properties.name;
  var hospital_name = nearestHospital.properties.name;
  document.getElementById("schoolname").innerHTML = school_name;
  document.getElementById("hospitalname").innerHTML = hospital_name;

});

