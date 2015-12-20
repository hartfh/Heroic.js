var Heroic = Heroic || {};

Heroic.Constants = {
	tileSize:		5
}

function initializeEngine() {
	Heroic.Entities	= {};
	Heroic.Layers	= {};

	Heroic.Layers.terrain		= new Heroic.Layer();
	Heroic.Layers.terrain.init('canvas1');
	Heroic.Layers.characters	= new Heroic.Layer();
	Heroic.Layers.characters.init('canvas2');

	Heroic.Entities.characters	= new Heroic.Inventory();
	Heroic.Entities.items		= new Heroic.Inventory();
	Heroic.Entities.terrain		= new Heroic.Inventory();
	Heroic.Entities.terrain.init();

	Heroic.Entities.regions		= new Heroic.Inventory();
	Heroic.Entities.regions.init();

	var test = new Heroic.Region({shape: 'circle', origin: {x: 0, y: 0}, radius: 65});
	Heroic.Entities.regions.load(test);



	

	// ------------------TESTING------------------ //

	var layer = Heroic.Layers.terrain;
	var styles = {color: 'black', background: 'green', character: ''};
	var drawArgs = {styles: styles, layer: layer};
	test.eachInterior(function(x, y, args) {
		//test.drawPoint(x, y, args);
	}, drawArgs);
	styles.background = 'white';
	test.eachEdge(function(x, y, args) {
		//test.drawPoint(x, y, args);
	}, drawArgs);

	var polygon = test.addChild({shape: 'polygon', origin: {x: 44, y: 44}, vertices: [{x: 50, y: 50}, {x: 55, y: 65}, {x: 60, y: 45}]});
	polygon.each(function(x, y, args) {
		polygon.drawPoint(x, y, args);
	}, drawArgs);


	//var recurArgs = {parent: test, recursive: true, shape: {shape: 'circle', origin: {x: 115, y: 90}, radius: 8}};
	//var recur = new Heroic.OrganicPattern(recurArgs);

	var recurArgs = {region: test, direction: new Heroic.Direction(0), recursive: true, shape: {shape: 'rectangle', origin: {x: 85, y: 85}, terminus: {x: 98, y: 89}}};
	var recur = new Heroic.RectangularPattern(recurArgs);

	var drawArgs = {};
	drawArgs.layer = layer;

	test.eachChild(function(child) {
		drawArgs.styles = {background: 'white', color: 'darkblue', character: ''};
		child.eachEdge(function(x, y, args) {
			child.drawPoint(x, y, args);
		}, drawArgs);

		drawArgs.styles = {background: 'darkblue', color: 'darkblue', character: ''};
		child.eachInterior(function(x, y, args) {
			child.drawPoint(x, y, args);
		}, drawArgs);
	});

	var args = {shape: 'circle', origin: {x: 77, y: 77}, radius: 1}
	var center = test.addChild(args);
	drawArgs.styles = {background: 'green', color: 'darkblue', character: ''};
	center.eachEdge(function(x, y, args) {
		center.drawPoint(x, y, args);
	}, drawArgs);

}

/*
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
*/