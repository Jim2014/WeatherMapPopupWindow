/*
helper function
*/
function displayWeatherMapByElementName(cityElementName,stateElementName){		  
		  displayWeatherMap($("[name='"+cityElementName+"']").val()
				  +','+$("[name='"+stateElementName+"']").val()
				  );
	  }
/*
main function

Function:
1.diaply a popup map window on your html page
2.user can input address and search weacher on the popup window
3.user can click a position on the popupwindow and display a weather info at the click point
4.you can pass a address and it will display the address's weather info on the map
5.the weather info is 5 days/3 hour forecast, provided by http://api.openweathermap.org

Usage:
1.you should replace the openWeatherMapKey with yours. rigester your key on the http://api.openweathermap.org
2.JQuery required, add JQury to your html
3.Include <script src="https://maps.googleapis.com/maps/api/js?key=[YourGoogleApiKey]"></script>
  apply your google api key replace the [YourGoogleApiKey]
4.include WeatherMapPopupWindow.css to your html
5.include this js file and call this function
6.any issues or suggestion, please submit to https://github.com/Jim2014/WeatherMapPopupWindow, thank you

*/
function displayWeatherMap(address){
	var map;
	var openWeatherMapKey = "1d76ad8dbd7721d3ef6fdd670d748b91";	//<-replace it with your key

	///1.create popupwindow in body element
	 $('#weatherMapPopupWindow').remove();
     $('body').append(
        $('<div id="weatherMapPopupWindow"/>')
      );

	///2.add search box
	var mapElement=document.getElementById('weatherMapPopupWindow');
	mapElement.innerHTML='<div id="mapSearchPanel">\
      <input id="mapAddress" type="textbox" value="'+address+'">\
      <input id="mapSubmit" type="button" value="Search">\
      <input type="button" id="mapCloseBtn" value="Close"/>\
    </div><div id="mapContainer"></div>';
    //search submit button click event
    document.getElementById('mapSubmit').addEventListener('click', function() {
    	var address = document.getElementById('mapAddress').value;
        getWeatherByAddress(map,address);
 	});
 	//close button click event
 	$("#mapCloseBtn").click(function(){
  		$('#weatherMapPopupWindow').remove();
		});
 	//end add search box
    
    
	///3.create the map object
	var lat= 41.8781;
	var lng= 87.6298;
	var mapOptions = {zoom: 8,center: {lat:lat,lng:lng}};
	var mapContainer=document.getElementById("mapContainer");
	map = new google.maps.Map(mapContainer,mapOptions);
	//map click event,get weather when user click the map
    google.maps.event.addListener(map, 'click', mapOnClick);
    function mapOnClick(event){
    	var lat=event.latLng.lat();
    	var lng= event.latLng.lng(); 
    	weatherRequest(lat,lng);
    }

    ///4.dear with input parameter address
	//if address is not empty, get weather by address
	//else get current geolocation and get weather by position
	if(address!=''){
		getWeatherByAddress(map,address);
	}
	else if(navigator.geolocation){
		    navigator.geolocation.getCurrentPosition(function(position) {
		      weatherRequest(position.coords.latitude,position.coords.longitude);
		  });
	}
    
	///5.function define
    function getWeatherByAddress(resultsMap,address) {
    	//create geocoder object and get location(latitude and longitude)
	  	var geocoder = new google.maps.Geocoder();
	  	geocoder.geocode({'address': address}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	    	var loc=results[0].geometry.location;
	      resultsMap.setCenter(loc);
	      weatherRequest(loc.lat(),loc.lng());
	    } else {
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
	}
	
	//get weather by position (latitude and longitude)
    function weatherRequest(lat,lng){   	
    	var labelIndex=0;	 
    	var lat=lat;
    	var lng= lng; 

    	addMarker();
    	getWeather();
    	// Add the marker at the clicked location
    	function addMarker() {		  
		  var marker = new google.maps.Marker({
		  	position: {lat: lat,lng: lng},
		  	map: map
		  });
		  return marker;
	  	};
		// add a InfoWindow at current position
	  	function addInfoWindow(info){
	  		var infowindow = new google.maps.InfoWindow();
	  		infowindow.setContent(info);
	  		infowindow.setOptions({
			position:{
			lat: lat,
			lng: lng
			},
	    	pixelOffset: {
	    			width: 0,
	    			height: -15
	    		}
	    	}
	    	);
	    	infowindow.open(map);
	  	};
	  	//get weather info for 5days by every 3 hours
	  	function getWeather(){
	  		var requestString = "http://api.openweathermap.org/data/2.5/forecast?lat="
                    + lat + "&lon=" + lng 
                    + "&cluster=yes&format=json&&units=Imperial"
                    + "&APPID=" + openWeatherMapKey;
            request = new XMLHttpRequest();
            request.onload = proccessWeatherResults;
            request.open("get", requestString, true);
            request.send();
        };
        //dis weather info to infowindow at current position
        function proccessWeatherResults() {
		  	var results = JSON.parse(this.responseText);
		  	var markup ="<div class='WeatherInfoWindow'>";
		  	markup+='<h4>'+results.city.name+','+results.city.country+'</h4>';
		  	markup+='<hr/>'
		  	for (let i = 0; i < results.list.length; i++) {
	  			let item=results.list[i];
	  			markup+='<div>';
	  			markup+=item.dt_txt+' ';
	  			markup+='<img src="http://openweathermap.org/img/w/'+ item.weather[0].icon+'.png">';
	  			markup+=item.main.temp+'&#8457;';
	  			markup+='</div>';
	  			markup+='<hr/>'
	  		}
		  	markup+='</div>';
		  	addInfoWindow(markup);
		}
    }
}

 
    
    
  
  

