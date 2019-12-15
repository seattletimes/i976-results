//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

//ICH code for popup template if needed----------
var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var mapElement = document.querySelector("leaflet-map");

var st = require("./sound-transit.geo.json");
// var rail = require("./rail.geo.json");

var dataKing = require("./king.geo.json");
var dataPierce = require("./pierce.geo.json");
var dataSnoho = require("./snoho.geo.json");

console.log(dataKing);
console.log(dataKing.features);
var data = { features: [...dataKing.features, ...dataPierce.features, ...dataSnoho.features] };

var color = "Pct_yes";

data.features.forEach(function(f) {
	["Pct_yes"].forEach(function(prop) {
		f.properties[prop] = (f.properties[prop] * 100).toFixed(1);
	});
});

if (mapElement) {
  var L = mapElement.leaflet;
  var map = mapElement.map;

  map.scrollWheelZoom.disable();

  var focused = false;

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
  layer.on({
  	     mouseover: function(e) {
        layer.setStyle({ weight: 2.5, fillOpacity: .7 });
      },
      mouseout: function(e) {
        if (focused && focused == layer) { return }
        layer.setStyle({ weight: 1.5, fillOpacity: 0.4
         });
      }
    });
};
var getColor = function(d) {
    var value = d[color];
    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    // console.log(value)
    if (typeof value != "undefined") {
      // condition ? if-true : if-false;
     return value >= 60 ? '#b35806' :
     		value >= 50 ? '#f1a340' :
     		value >= 40 ? '#998ec3' :
             '#542788' ;
    } else {
      return "gray"
    }
  };

  var style = function(feature) {
    var s = {
      fillColor: getColor(feature.properties),
      weight: 1.0,
      opacity: .1,
      color: "#000000",
      fillOpacity: 0.4
    };
    return s;
  }

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  // Set up style for ST polygon
function stStyle(feature) {
    return {
      fillColor: "#FF00FF",
      fillOpacity: 0,
      color: '#000000',
      weight: 3,
    };
  }
            
  // Create layer and add it to the map
  var stLayer = L.geoJSON(st, {
    style:stStyle
  });
            
  stLayer.addTo(map);
  stLayer.bringToBack();
}

 map.scrollWheelZoom.disable();