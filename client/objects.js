Wayfarer.world_object = function () {
	// position related infos
	this.x = 0;
	this.y = 0;
	this.heading=180;
	
	// drawing related infos
	this.width=20;
	this.height=20;
	
	// datastore related infos
	this.remote_id = null;
	this.last_updated_at = null;
	
	this.update = function(data) {
		if (data['x']) this.x = data['x'];
		if (data['y']) this.y = data['y'];
		if (data['heading']) this.heading = data['heading'];
	}
	
	// We're doing this ourselves because the toJSON needs to be *lightning* fast
	this.toJSON=function() {
		return '{"game_id":'+this.remote_id+',"x":'+this.x+', "y":'+this.y+',"heading":'+this.heading+'}';
	}
	
	this.draw=function(canvas) {
		// This is where we'll put our own drawing code.
		// This is some default drawing code
		canvas.save();
		canvas.translate(this.x,this.y);
		canvas.rotate((-this.heading+180) * Math.PI / 180);
		canvas.drawImage(Wayfarer.default_image,-(this.width/2),-(this.height/2),this.width,this.height);
		canvas.restore();
	}
	
	// User-specified stuff for your own game objects
	this.tick=function() {
		// This is where we put things that happen every 'tick'
		// Good examples are friction functions, position updates for player objects, etc. etc.
	}
	
	this.click = function() {};
	this.selected = function() {};
	this.deselected = function() {};
	this.collided = function(obj) {};
	this.keyDown = function(code) {};
	this.keyUp = function(code) {};
	
	this.initialized = function() {};
	this.destroyed = function() {};
};

Wayfarer.moveable_object = function() {
	this.inheritFrom = Wayfarer.world_object;
	this.inheritFrom();
	
	this.v = 0;
	
	this.tick=function() {
		this.x += Math.sin(this.heading * Math.PI / 180)*this.v;
		this.y += Math.cos(this.heading * Math.PI / 180)*this.v;
	};
};

Wayfarer.player_object = function () {
	this.inheritFrom=Wayfarer.moveable_object;
	this.inheritFrom();
	
	this.rotation_speed=0; // 1 = rotating CW, -1 = rotating CCW, 0 = not rotating
	this.acceleration=0;
	
	this.v_prime_speed = 0.1; // pixels per tick per tick
	this.max_v = 2;
	
	this.rotation_speed = 0; // degrees per tick per tick
	
	this.tick = function() {
		this.x += Math.sin(this.heading * Math.PI / 180)*this.v;
		this.y += Math.cos(this.heading * Math.PI / 180)*this.v;
		
		// Input related stuff
		
		if (1==1) { // TODO: packet dropping
			this.heading+=this.rotation_speed;
			this.v+=this.acceleration;
			if (this.v>this.max_v) this.v=this.max_v;
			if (this.v>0) this.v-=(this.v / 10); // friction IN SPAAAACCEEEEE
		}
		
	}
	
	this.toJSON=function() {
		return '{"game_id":'+this.remote_id+',"rotation_speed":'+this.rotation_speed+',"acceleration":'+this.acceleration+'}';
	}
	
	this.keyDown = function(code) {
		//Wayfarer.log(code);
		switch(code) {
			case 37: /* left-arrow */
				if (this.rotation_speed != 1) {
					this.rotation_speed = 1;
					Wayfarer.Network.request('input',{object:this.toJSON()});
				}
			break;
			case 38: /* up-arrow */
				if (this.acceleration < this.v_prime_speed) {
					this.acceleration=this.v_prime_speed;
					Wayfarer.Network.request('input',{object:this.toJSON()});
				}
			break;
			case 39: /* right-arrow */
				if (this.rotation_speed != -1) {
					this.rotation_speed = -1;
					Wayfarer.Network.request('input',{object:this.toJSON()});
				}
			break;
		};
	};
	
	this.keyUp = function(code) {
		switch(code) {
			case 37: /* left-arrow */
			case 39: /* right-arrow */
				if (this.rotation_speed != 0) {
					this.rotation_speed = 0;
					Wayfarer.Network.request('input',{object:this.toJSON()});
				}
			break;
			case 38: /* up-arrow */
				if (this.acceleration > 0) {
					this.acceleration = 0;
					Wayfarer.Network.request('input',{object:this.toJSON()});
				}
			break;
		};
	};
}