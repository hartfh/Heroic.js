var Heroic = Heroic || {};

Heroic.Colors = {
	black:		'rgba(0, 0, 0, 1)',
	clear:		'rgba(0, 0, 0, 0)',
	white:		'rgba(255, 255, 255, 1)'
}

Heroic.Palette = {
	open:		{
			ascii:			'.',
			background:		'black',
			color:			'white',
			type:			'open'
	},
	wall:		{
			ascii:			'X',
			background:		'white',
			color:			'black',
			type:			'wall'
	}
}

function initializeEngine() {
	Heroic.Entities	= {};
	Heroic.Layers		= {};

	Heroic.Layers.terrain			= new Heroic.Layer();
	Heroic.Layers.terrain.init('canvas1');
	Heroic.Layers.characters		= new Heroic.Layer();
	Heroic.Layers.characters.init('canvas2');

	Heroic.Entities.characters	= new Heroic.Inventory();
	Heroic.Entities.items		= new Heroic.Inventory();
	Heroic.Entities.terrain		= new Heroic.Inventory();
	Heroic.Entities.terrain.init();

	//Heroic.Entities.map			= new Heroic.TestMap();
	Heroic.Entities.map			= new Heroic.TestStructures();
	Heroic.Entities.map.init();

	Heroic.Entities.terrain.toEach('draw');

	/*
	var test = new Heroic.Character();
	test.init();
	test.setLocation(4,4);
	test.move(20, 20);
	test.move(10, 10);
	*/
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