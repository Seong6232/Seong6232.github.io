$(document).ready(function(){

	var source   = $("#bus-template").html();
	var template = Handlebars.compile(source);

	$(".submit").click(function(){

		var currentBus = $(".bus-id").val();

		$.ajax({
			url: "https://arrivelah.herokuapp.com/?id=" + currentBus
		}).done(function(data){
			console.log(data);
			for(var i=0; i< data.services.length;i++){
				data.services[i].next.duration_min = Math.floor(data.services[i].next.duration_ms/1000/60)
			}
			$(".result").html(template(data));
			for(var i=0; i< data.services.length;i++){
				showMap(data.services[i].next.lat,data.services[i].next.lng, data.services[i].no);
			}

		})
	});

	function showMap(lat,lng, bus){
		console.log("into");

		initialize();
	  // In this example, we center the map, and add a marker, using a LatLng object
      // literal instead of a google.maps.LatLng object. LatLng object literals are
      // a convenient way to add a LatLng coordinate and, in most cases, can be used
      // in place of a google.maps.LatLng object.

      var map;
      function initialize() {
        var mapOptions = {
          zoom: 18,
          center: {lat: lat, lng: lng}
        };
        map = new google.maps.Map(document.getElementById('bus-' + bus),
            mapOptions);

        var marker = new google.maps.Marker({
          // The below line is equivalent to writing:
          // position: new google.maps.LatLng(-34.397, 150.644)
          position: {lat: lat, lng: lng},
          map: map
        });

        // You can use a LatLng literal in place of a google.maps.LatLng object when
        // creating the Marker object. Once the Marker object is instantiated, its
        // position will be available as a google.maps.LatLng object. In this case,
        // we retrieve the marker's position using the
        // google.maps.LatLng.getPosition() method.
        var infowindow = new google.maps.InfoWindow({
          content: '<p>Marker Location:' + marker.getPosition() + '</p>'
        });

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });
      }

      google.maps.event.addDomListener(window, 'load', initialize);
	}
});