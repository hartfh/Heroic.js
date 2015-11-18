var Heroic = Heroic || {};

/*
1.) Action Queue

2.) Character movement

3.) SFX Layer


-Regions are similar to Inventory but have their own implementation of its behavior
-Initial setup involves creating all the tiles and adding them to the master region
-Methods
	toEach
	getEach
	subRegion
	createShape. parameters: shape, origin, size

*/

Heroic.RegionX = function() {}

Heroic.RegionX.prototype.each = function() {
	// enumerable
}

Heroic.RegionX.prototype.getShape = function() {
	// 
}

Heroic.RegionX.prototype.overlaps = function() {
	// check sub regions or no?
}
Heroic.RegionX.prototype.merge = function(region) {
	// need to merge sub regions? maybe not
}

Heroic.RegionX.prototype.hasTile = function(tile) {
	// return true/false
}

Heroic.RegionX.prototype.getTile = function(x, y) {
	// return this.tiles[y][x];

	return false;
}

Heroic.RegionX.prototype.addTile = function(tile) {

	// only accepts Tile objects
	// adds one tile
	// recalculate edge and interior?

	if( !this.hasOwnProperty(tile.y) ) {
		//set the sub array
	}
	this.tiles[tile.y][tile.x] = tile;
}

Heroic.RegionX.prototype.removeTile = function(tile) {

	// remove a tile from this.tiles
	// recalculate edge and interior?
	this.tiles[tile.y][tile.x] = undefined;
}

//Heroic.RegionX.prototype.findEdges = function() {}
//Heroic.RegionX.prototype.findInteriors = function() {}

Heroic.RegionX.prototype.init = function() {
	this.width; this.height; this.origin; // ????? should all tile references be relative or absolute?. if relative then do Tiles even need to contain X and Y coordinates? not really
	// virtual tiles for tiles that are not set (outside the master Region)
	this.tiles		= []; // need to somehow set the sub arrays
	// sub regions cannot exceed master region. Or can they? use virtual tiles outside parent region
	this.regions	= []; // sub-regions

	// sub regions
	/*
	this.subs; // array of sub regions?
	this.subs['edge'];
	this.subs['interior'];
	this.subs['quadrant-nw'];
	this.subs['quadrant-n'];
	this.subs['quadrant-ne'];
	*/
}

function initializeEngine() {
	Heroic.Entities	= {};
	Heroic.Layers	= {};

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