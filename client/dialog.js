Wayfarer.Dialog = {}

// A modal pauses the game in the background, and steals any and all inputs to the game.
Wayfarer.Dialog.modal = function(title, content, callback) {
	Wayfarer.Input.unbind_mouse();
	Wayfarer.Input.unbind_keyboard();
	Wayfarer.pause_simulation();
	$('body').append('<div class="wayfarer_modal"><span>'+title+"</span>"+content+"<button id='modal_ok'>OK</button></div>");
	$('#modal_ok').click(function() {
		callback();
		$('.wayfarer_modal').remove();
		Wayfarer.Input.bind_mouse();
		Wayfarer.Input.bind_keyboard();
		Wayfarer.resume_simulation();
	});
}

// An alert keeps the game running in the background. It only grabs mouse input.
Wayfarer.Dialog.alert = function(title, content, callback) {
	Wayfarer.Input.unbind_mouse();
	$('body').append('<div class="wayfarer_modal"><span>'+title+"</span>"+content+"<button id='modal_ok'>OK</button></div>");
	$('#modal_ok').click(function() {
		callback();
		$('.wayfarer_modal').remove();
		Wayfarer.Input.bind_mouse();
	});	
}