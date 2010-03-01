Wayfarer.Network = {}

Wayfarer.Network.initialize = function(host,port) {
	Wayfarer.log('Initializing Network...');
	Wayfarer.Network.host = host;
	Wayfarer.Network.port = port;
};

Wayfarer.Network.request = function(method,data,callback,failure_callback) {
	jsonp = '?jsoncallback=?';
	url = 'http://'+Wayfarer.Network.host+':'+Wayfarer.Network.port+'/'+method+jsonp;
	
	$.ajax({
	  url: url,
	  dataType: 'json',
	  data: data,
	  success: function(data) { callback(data) },
	  error: function(xhr, data, errorthrown) { failure_callback(data) }
	});
};

Wayfarer.Network.start_listening_stream = function(streamer_object,method,periodicity,callback) {
	Wayfarer.log('Starting up a listening stream...');

	url = 'http://'+Wayfarer.Network.host+':'+Wayfarer.Network.port+'/'+method;
	streamer_object = {};
	streamer_object.xhr = $.ajax({ type: "GET", url: url });
	streamer_object.readPosition = 0;
	streamer_object.poller = function() {
	    var allMessages = streamer_object.xhr.responseText;
	    do {
	      var unprocessed = allMessages.substring(streamer_object.readPosition);
	      var lastLine = unprocessed.indexOf("\n");
	      if (lastLine!=-1) {
	        var anUpdate = unprocessed.substring(0, lastLine);
	        callback(anUpdate);
	        streamer_object.readPosition += lastLine+1;
	      }
	    } while (lastLine != -1);
	};
	
	streamer_object.pollTimer = setInterval(streamer_object.poller, periodicity);
};

Wayfarer.Network.authenticate = function(login,password,success,failure) {
	Wayfarer.Network.request('authenticate', {'login':login, 'password':password},
		function(data) { success(); },
		function(data) { failure(); });
}

// first of all we need to authenticate to the server
// then we need to pull down an initial world for us to start simulating
// now we need to start up our server keepalive listening heartbeat, as well as our outgoing heartbeat