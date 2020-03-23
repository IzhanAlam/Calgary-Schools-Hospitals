
//get geojson data from link
function get_data_from_url(url){
    var http_req = new XMLHttpRequest();
    http_req.open("GET",url,false);
    http_req.send(null);
    return http_req.responseText;          
}

mapboxgl.accessToken = 'pk.eyJ1IjoiaXpoYW5hbGFtIiwiYSI6ImNrN2s2ZDFiaTAzbzgzZG11MG1xMHdlZzEifQ.uBG-TBw1B2h81lSwJcLPvg';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
  center: [-114.0719,51.0447], // starting position
  zoom: 12 // starting zoom
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
      'icon-image': 'library-15'
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
  var libraryFeatures = map.queryRenderedFeatures(e.point, { layers: ['school'] });
  if (!libraryFeatures.length) {
    return;
  }

  var libraryFeature = libraryFeatures[0];

  var nearestHospital = turf.nearest(libraryFeature, hospitals);

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
        'circle-color': '#486DE0'
      }
    }, 'hospitals');
  }
});


/*
var map = L.map('mapid').setView([51.0447, -114.0719], 11);



var blackIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


//Schools
var featureGroup = L.featureGroup();
var geojsonLayer = L.geoJSON().addTo(map);
var markers = L.markerClusterGroup();
//Hospitals
var featureGroup2 = L.featureGroup();
var geojsonLayer2 = L.geoJSON().addTo(map);
var markers2 = L.markerClusterGroup();
//Clinics
var featureGroup3 = L.featureGroup();
var geojsonLayer3 = L.geoJSON().addTo(map);
var markers3 = L.markerClusterGroup();


var layers = document.getElementById('menu-ui');








var layer1 = L.tileLayer(
  'https://api.mapbox.com/styles/v1/izhanalam/ck7ty90g50vzr1is1dmhhug57/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXpoYW5hbGFtIiwiYSI6ImNrN2s2ZDFiaTAzbzgzZG11MG1xMHdlZzEifQ.uBG-TBw1B2h81lSwJcLPvg',  {
      tileSize: 512,
      zoomOffset: -1,
      attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });



var layer2 = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaXpoYW5hbGFtIiwiYSI6ImNrN2s2ZDFiaTAzbzgzZG11MG1xMHdlZzEifQ.uBG-TBw1B2h81lSwJcLPvg'
}).addTo(map);


//https://api.mapbox.com/styles/v1/izhanalam/ck7u70ax90z021ipamn7ndflk.html?fresh=true&title=view&access_token=pk.eyJ1IjoiaXpoYW5hbGFtIiwiYSI6ImNrN2s2ZDFiaTAzbzgzZG11MG1xMHdlZzEifQ.uBG-TBw1B2h81lSwJcLPvg
var layer3 = L.tileLayer(
  'https://api.mapbox.com/styles/v1/izhanalam/ck7u70ax90z021ipamn7ndflk/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXpoYW5hbGFtIiwiYSI6ImNrN2s2ZDFiaTAzbzgzZG11MG1xMHdlZzEifQ.uBG-TBw1B2h81lSwJcLPvg',  {
      tileSize: 512,
      zoomOffset: -1,
      attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
//https://api.mapbox.com/styles/v1/izhanalam/ck7uaqhpi0tva1is5xucpnar3.html?fresh=true&title=view&access_token=pk.eyJ1IjoiaXpoYW5hbGFtIiwiYSI6ImNrN2s2ZDFiaTAzbzgzZG11MG1xMHdlZzEifQ.uBG-TBw1B2h81lSwJcLPvg
var layer4 = L.tileLayer(
    'https://api.mapbox.com/styles/v1/izhanalam/ck7uaqhpi0tva1is5xucpnar3/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXpoYW5hbGFtIiwiYSI6ImNrN2s2ZDFiaTAzbzgzZG11MG1xMHdlZzEifQ.uBG-TBw1B2h81lSwJcLPvg',  {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});



//Schools

//Create the dropdown menu
$(function(){
  
  

  var school_json = 'https://data.calgary.ca/resource/fd9t-tdn2.json'
  var school_obj = JSON.parse(get_data_from_url(school_json));

  $.each(school_obj, function(i, option) {
    $('#School_name').append($('<option/>').attr("value", option.name).text(option.name));
    
  });
 

  

});

//Get the selection
$('#School_name').click(function(){ 
  var school_name = $(this).val();
  var nparams = "?name=" + school_name;


  var school_json = 'https://data.calgary.ca/resource/fd9t-tdn2.geojson' + nparams;
  var school_obj = JSON.parse(get_data_from_url(school_json));


  markers.clearLayers();

  geojsonLayer = L.geoJson(school_obj, {
    
    onEachFeature: function(feature,layer){
      layer.bindPopup("<p>Issued Date: <p>" + feature.properties.issueddate + "<br>" + "<p>Community Name: <p>" + feature.properties.communityname + "<br>" + "<p>Work Class Group: <p>" + feature.properties.workclassgroup + "<br>" + "<p>Contractor Name: <p>" + feature.properties.contractorname + "<br>" + "<p>Original Address: <p>" + feature.properties.originaladdress).openPopup;
    }
    });
  markers.addLayer(geojsonLayer);
  featureGroup.addLayer(markers);
  featureGroup.addTo(map);

});

// Hospitals

$(function(){
  

  var hospital_json = 'https://data.calgary.ca/resource/x34e-bcjz.json?type=Hospital';
  var hospital_obj = JSON.parse(get_data_from_url(hospital_json));

  $.each(hospital_obj, function(i, option) {
    $('#hosp_name').append($('<option/>').attr("value", option.name).text(option.name));
    
  });
 

  

});

//Get the selection
$('#hosp_name').click(function(){ 
  var hospital_name = $(this).val();
  


  var hospital_json = 'https://data.calgary.ca/resource/x34e-bcjz.geojson?type=Hospital&name=' + hospital_name;
  var hospital_obj = JSON.parse(get_data_from_url(hospital_json));

  geojsonLayer2 = L.geoJson(hospital_obj, {
    pointToLayer: function (feature, latlng){
      return L.marker(latlng, {icon: blackIcon});
    },
    onEachFeature: function(feature,layer){
      layer.bindPopup("<p>Issued Date: <p>" + feature.properties.issueddate + "<br>" + "<p>Community Name: <p>" + feature.properties.communityname + "<br>" + "<p>Work Class Group: <p>" + feature.properties.workclassgroup + "<br>" + "<p>Contractor Name: <p>" + feature.properties.contractorname + "<br>" + "<p>Original Address: <p>" + feature.properties.originaladdress).openPopup;
    }
    });


  clear_markers2();  
  markers2.addLayer(geojsonLayer2);
  featureGroup2.addLayer(markers2);
  featureGroup2.addTo(map);

});


//Clinic

$(function(){
  
  

  var clinic_json = 'https://data.calgary.ca/resource/x34e-bcjz.json?type=PHS%20Clinic';
  var clinic_obj = JSON.parse(get_data_from_url(clinic_json));

  $.each(clinic_obj, function(i, option) {
    $('#clinic_name').append($('<option/>').attr("value", option.name).text(option.name));
    
  });
 

  

});

//Get the selection
$('#clinic_name').click(function(){ 
  var clinic_name = $(this).val();

  var clinic_json = 'https://data.calgary.ca/resource/x34e-bcjz.geojson?type=PHS%20Clinic&name=' + clinic_name;
  var clinic_obj = JSON.parse(get_data_from_url(clinic_json));

  geojsonLayer3 = L.geoJson(clinic_obj, {
    pointToLayer: function (feature, latlng){
      return L.marker(latlng, {icon: blackIcon});
    },
    onEachFeature: function(feature,layer){
      layer.bindPopup("<p>Issued Date: <p>" + feature.properties.issueddate + "<br>" + "<p>Community Name: <p>" + feature.properties.communityname + "<br>" + "<p>Work Class Group: <p>" + feature.properties.workclassgroup + "<br>" + "<p>Contractor Name: <p>" + feature.properties.contractorname + "<br>" + "<p>Original Address: <p>" + feature.properties.originaladdress).openPopup;
    }
    });


  clear_markers3();  
  markers3.addLayer(geojsonLayer3);
  featureGroup3.addLayer(markers3);
  featureGroup3.addTo(map);

});












//--------------------------------------------------
function add_layer(layer){

  map.removeLayer(layer1);
  map.removeLayer(layer2);
  map.removeLayer(layer3);
  map.removeLayer(layer4);


  if (map.hasLayer(layer)){
    map.removeLayer(layer);
  }
  else {
    map.addLayer(layer);
  }
};


function clear_layers(){
map.clearLayers();
};


function clear_markers(){
markers.clearLayers();
markers2.clearLayers();
markers3.clearLayers();
};


function clear_marker1(){
  markers.clearLayers();
};
function clear_markers2(){

  markers2.clearLayers();
};
function clear_markers3(){

  markers3.clearLayers();
};



//----------------------------------------------


*/

