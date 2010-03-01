Wayfarer.Display = {}

Wayfarer.Display.initialize = function(width,height) {
	Wayfarer.log('Initializing Display...');
	Wayfarer.Display.width = width;
	Wayfarer.Display.height = height;
	
	// Center point of the display
	Wayfarer.Display.x = width/2;
	Wayfarer.Display.y = height/2;
	
	jQuery( function() {
		$('body').append('<div style="width: 0; height: 0; overflow: hidden;"><canvas id="buffer" width="'+width+'" height="'+height+'" style="visibility:hidden"></canvas></div><canvas id="canvas" style="border:1px solid black" width="'+width+'" height="'+height+'"></canvas>');
	
		Wayfarer.buffer_object = $("#buffer")[0];
		Wayfarer.canvas = Wayfarer.buffer_object.getContext("2d");
		Wayfarer.visible_canvas = $("#canvas")[0].getContext("2d");
	});
};

Wayfarer.Display.tick = function() {
	Wayfarer.canvas.clearRect(0,0,Wayfarer.Display.width,Wayfarer.Display.height);
	for (var id in Wayfarer.World.visible_objects) {
		obj = Wayfarer.World.visible_objects[id];
		
		Wayfarer.canvas.save();
		Wayfarer.canvas.translate(Wayfarer.Display.x,Wayfarer.Display.y);
		obj.draw(Wayfarer.canvas);
		Wayfarer.canvas.restore();
	}
	
	Wayfarer.visible_canvas.clearRect(0,0,Wayfarer.Display.width,Wayfarer.Display.height);
	Wayfarer.visible_canvas.drawImage(Wayfarer.buffer_object, 0, 0);
};