Wayfarer.World = {};

Wayfarer.World.initialize = function() {
	Wayfarer.log("Initializing World...");
	
	// just for debugging
	/*
	Wayfarer.player.object = new Wayfarer.player_object();
	Wayfarer.World.objects = { 1 : Wayfarer.player.object };
	Wayfarer.World.visible_objects = { 1 : Wayfarer.player.object };
	Wayfarer.Input.focus_keyboard(Wayfarer.player.object);
	*/
};

Wayfarer.World.visible_objects = [];
Wayfarer.World.objects = {};

Wayfarer.World.tick = function() {
	for (var id in Wayfarer.World.objects) {
		obj = Wayfarer.World.objects[id];
		obj.tick();
	}
}

Wayfarer.World.object_at = function(x,y) {
	Wayfarer.log('Searching for object at '+x+','+y);
}

Wayfarer.World.download = function(callback) {
	Wayfarer.log('Downloading world...');
	Wayfarer.Network.request('world',{'foo':'bar'}, function(data) {
		decoded = JSON.parse(data);
		
		$.each(decoded,function(key,val) {
			Wayfarer.log('Loaded object #' + key);
	
			// TODO: get type of object
			obj = new Wayfarer.player_object();
			obj.remote_id = val['game_id'];
			obj.update(val);
			
			Wayfarer.World.objects[key] = obj;
			Wayfarer.World.visible_objects[key] = obj; // TODO object.make_visible & inverse
			
			if (val['player_name'] == Wayfarer.player.name) {
				Wayfarer.log('Object #' + key + ' is our player object.');
				Wayfarer.player.object = obj;
				Wayfarer.Input.focus_keyboard(Wayfarer.player.object);
			}
			
		});
		
		callback();
	});
};