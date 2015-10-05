var GAME = GAME || {};

GAME.Colors = {
	black:		'rgba(0, 0, 0, 1)',
	clear:		'rgba(0, 0, 0, 0)',
	white:		'rgba(255, 255, 255, 1)'
}

function initializeEngine() {
	GAME.Entities	= {};
	GAME.Layers		= {};

	GAME.Entities.palette		= new GAME.Palette();
	GAME.Entities.map			= new GAME.Map();
	GAME.Entities.map.init();
	GAME.Entities.characters	= new GAME.Inventory();
	GAME.Entities.items			= new GAME.Inventory();

	GAME.Layers.terrain			= new GAME.Layer();
	GAME.Layers.terrain.init('canvas1');
	GAME.Layers.assets		= new GAME.Layer();
	GAME.Layers.assets.init('canvas2');

	// Cave/wall generation
	for(var i = 0; i < 5; i++) {
		GAME.Entities.map.grid.each('checkType', ['1', 40]);
		GAME.Entities.map.grid.each('checkType', ['0', 70]);
		GAME.Entities.map.grid.each('fromMirror');
	}

	GAME.Entities.map.grid.each('draw');

	var test = new GAME.Character();
	test.init();
	test.setLocation(4,4);
	test.move(20, 20);
	test.move(10, 10);
}

jQuery(window).load(function() {
	jQuery(window).on('keyup', function(e) {
		switch(e.keyCode) {
			case 37:
				Player.move('left');
				break;
			case 38:
				Player.move('up');
				break;
			case 39:
				Player.move('right');
				break;
			case 40:
				Player.move('down');
				break;
			default:
				break;
		}
	});
});