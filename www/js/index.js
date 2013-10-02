/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Number.prototype.toRad = function() { return this * (Math.PI / 180); };

var app = {
    // Application Constructor
    initialize: function() {
        app.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'app' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
	alert('ready!');
	app.updateGPSLocation();
    },

    totalDistance: 0,
    lastPosition: null,
    
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    onSuccess: function(position) {
	var distance = 0;

	if (app.lastPosition != null) {
	  var lat1 = app.lastPosition.coords.latitude;
	  var lon1 = app.lastPosition.coords.longitude;
	  var lat2 = position.coords.latitude;
	  var lon2 = position.coords.longitude;

	  distance = app.calcDistance(lat1, lon1, lat2, lon2);
	}

	app.totalDistance += distance;

	$('#distance').html(app.totalDistance);
// 		$('#footer').html(position.coords.longitude + ' ' + position.coords.latitude + '<br/>' + distance);
	
	app.lastPosition = position;
	/*alert('Latitude: '          + position.coords.latitude          + '\n' +
	      'Longitude: '         + position.coords.longitude         + '\n' +
	      'Altitude: '          + position.coords.altitude          + '\n' +
	      'Accuracy: '          + position.coords.accuracy          + '\n' +
	      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	      'Heading: '           + position.coords.heading           + '\n' +
	      'Speed: '             + position.coords.speed             + '\n' +
	      'Timestamp: '         + position.timestamp                + '\n');*/
	
	window.setTimeout(app.updateGPSLocation, 1000);
    },

    // onError Callback receives a PositionError object
    //
    onError: function(error) {
	alert('code: '    + error.code    + '\n' +
	      'message: ' + error.message + '\n');
    },

    updateGPSLocation: function() {
	console.log('requesting GPS position');
	navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
    },
    
    calcDistance: function (lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	var dLat = (lat2-lat1).toRad();
	var dLon = (lon2-lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d;
    },
};
