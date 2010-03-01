var Wayfarer = {};

Wayfarer.log = function(message) {
	if (window.console && window.console['log']) { window.console.log(message);	}
};


Wayfarer.initialize = function(config) {
	Wayfarer.log('Wayfarer initializing...');
	Wayfarer.config = config;
	Wayfarer.player = {};
		
	Wayfarer.World.initialize();
	Wayfarer.Input.initialize();
	Wayfarer.Network.initialize(config['host'],config['port']);
	
	Wayfarer.Display.initialize(config['width'],config['height']);
	
	Wayfarer.default_image = new Image();
	Wayfarer.default_image.src = 'shuttle.png'; // Set source path

	jQuery(function() {
		Wayfarer.displayWidthConversion=config['width']/$("#canvas")[0].offsetWidth;
		Wayfarer.displayHeightConversion=config['height']/$("#canvas")[0].offsetHeight;
	});
	
	Wayfarer.msecs_per_game_tick = 1000 / config['game_hz'];
	Wayfarer.msecs_per_frame = 1000 / config['target_fps'];
}

Wayfarer.start = function() {
	Wayfarer.log('Wayfarer starting...');
	
	Wayfarer.splash_screen(function() {
		Wayfarer.login(function() {
			Wayfarer.World.download(function() {
				Wayfarer.simulation_running = true;
			
				Wayfarer.Network.start_listening_stream(Wayfarer.client_updates,'updates',200,
					function(action) { eval(action); }
					);
				Wayfarer.Input.bind_mouse();
				Wayfarer.Input.bind_keyboard();
			
				Wayfarer.game_tick();
				Wayfarer.draw_tick();
			});
		});
	});
};

Wayfarer.splash_screen = function(callback) {
	$("body").append('<img src="wayfarer-small.png" id="splash" style="display:none;position:absolute;top:50px;left:50px;" />');
	$('#splash').fadeIn(500,function() {
		$('#splash').fadeOut(1000,function() {callback();});
	});
}

Wayfarer.login = function(callback) {
	if (Wayfarer.config['network_only']) {
		Wayfarer.Dialog.modal('Log in!',
			"<form action='#' id='login_form'>Name:<input type='text' name='name'><br />Password:<input type='text' name='password'></form>",
			function() {
				Wayfarer.player.name = $('#login_form').find('input[name=name]').val();
				Wayfarer.player.password = $('#login_form').find('input[name=password]').val();
			
				Wayfarer.Network.authenticate(Wayfarer.player.name,Wayfarer.player.password,
					function() { callback(); },
					function() { 
						Wayfarer.log('Failed login attempt.');
						Wayfarer.Dialog.alert('Invalid login or password.','',function() {Wayfarer.login(callback);}); }
				);
			}
		);
	} else { callback(); }
}

Wayfarer.resume_simulation = function() {
	Wayfarer.simulation_running = true;
	Wayfarer.game_tick();
}

Wayfarer.pause_simulation = function() {
	Wayfarer.simulation_running = false;
}

Wayfarer.game_tick = function() {
	var now = new Date();
	var t_start = now.getTime();

	Wayfarer.World.tick();

	var now = new Date();
	var t_stop = now.getTime();
	var msecs = t_stop-t_start;
	var time_to_next_frame = Wayfarer.msecs_per_game_tick-msecs;

	if (Wayfarer.simulation_running) setTimeout(Wayfarer.game_tick,time_to_next_frame);
};

Wayfarer.draw_tick = function() {
	var now = new Date();
	var t_start = now.getTime();

	Wayfarer.Display.tick();

	var now = new Date();
	var t_stop = now.getTime();
	var msecs = t_stop-t_start;
	var time_to_next_frame = Wayfarer.msecs_per_frame-msecs;

	setTimeout(Wayfarer.draw_tick,time_to_next_frame);	
}