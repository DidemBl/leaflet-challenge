
// Create the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 4
  });

// Add the tile layer

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);





// Store the endpoint as Url
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"




// Get the GeoJSON data

d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    let features = data.features;
    
// Color function for the markers 
    function chooseColor(value) {

        if (value >= -10 && value < 10) {
            
            return 'lightgreen';
    
        }else if (value >= 10 && value < 30){
            
            return 'yellow';

        }else if (value >= 30 && value < 50){
        
            return 'green';

        }else if (value >= 50 && value < 70){
        
            return 'orange';

        }else if (value >= 70 && value < 90){
        
            return 'red';

        }else{
        
            return 'purple';
    }
}
    // Loop through the features array, and create one marker for each feature object.
    for (let i = 0; i < features.length; i++) {
        L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
        fillOpacity: 0.85,
        color: chooseColor(features[i].geometry.coordinates[2]),
        fillColor: chooseColor(features[i].geometry.coordinates[2]),
        // Make marker's size proportionate to the magnitude of the earthquake.
        radius: 800 * (10 * features[i].properties.mag)
        }).bindPopup(`<h1>${features[i].properties.title}</h1><hr> <h3>Depth (km): ${features[i].geometry.coordinates[2].toLocaleString()}</h3>`).addTo(myMap);
    }

    //Add the legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function(myMap){
        let div = L.DomUtil.create('div', 'legend');
        labels = [];
        let categories = ['-10-10','10-30','30-50','50-70','70-90','90+'];
        let colors = ['lightgreen','yellow','green', 'orange', 'red', 'purple']

    categories.forEach(function(category, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>" + category);
    });
    div.innerHTML = "<ul>" + labels.join("") + "</ul>";
    return div;
    };
    legend.addTo(myMap);
});   
 




    