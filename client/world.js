Wayfarer.World = {};

Wayfarer.World.initialize = function() {
	Wayfarer.log("Initializing World...");
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
};

Wayfarer.World.update_object = function(object_id, data) {
if (Wayfarer.World.objects[object_id]) {
	Wayfarer.World.objects[object_id].update(data);
} else {
	// TODO: type of object fixinate
	obj = new Wayfarer.player_object();
	obj.remote_id = data['game_id'];
	obj.update(data);
	
	Wayfarer.World.objects[object_id] = obj;
	Wayfarer.World.visible_objects[object_id] = obj;
}
};

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