Wayfarer.Input = {};

Wayfarer.Input.bind_mouse = function() {
	$(window).bind("click",function(e) {
		var worldX = e.pageX*Wayfarer.displayWidthConversion;
		var worldY = e.pageY*Wayfarer.displayHeightConversion;
		Wayfarer.highlighted_object = Wayfarer.World.object_at(worldX-Wayfarer.Display.x,worldY-Wayfarer.Display.y);
	});
}

Wayfarer.Input.unbind_mouse = function() {
	$(window).unbind('click');
}

Wayfarer.Input.focus_keyboard = function(obj) {
	Wayfarer.Input.focused_object = obj;
};

Wayfarer.Input.bind_keyboard = function() {
	$(window).bind('keydown', function(e) {
		if (Wayfarer.Input.focused_object) {
			Wayfarer.Input.focused_object.keyDown(e.keyCode);
		}
	});
	$(window).bind('keyup', function(e) {
		if (Wayfarer.Input.focused_object) {
			Wayfarer.Input.focused_object.keyUp(e.keyCode);
		}
	});
};

Wayfarer.Input.unbind_keyboard = function() {
	$(window).unbind("keydown");
	$(window).unbind("keyup");
};

Wayfarer.Input.initialize = function() {
	Wayfarer.log('Initializing Input...');
};