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

Heroic.RegionX = function(shape, size, origin, parent) {
	//this[action].apply(this);
	//this.init(shape, origin, size);

	if( typeof(origin) == 'undefined' ) {
		var origin = false;
	}
	if( typeof(parent) == 'undefined' ) {
		var parent = false;
	}

	this.origin		= origin;	// keep reference to one of parent's points
	this.parent		= parent;	// if no parent, run master()
	this.points		= [];		// array of arrays. value is set to true
	this.edge		= [];
	this.interior	= [];
	this.children	= [];		// child regions

	//this.setShape();

	if( this.parent == undefined ) {
		this.master();
	}
}

Heroic.RegionX.prototype.addPoints = function(pointOne, pointTwo) {
	return {x: pointOne.x + pointTwo.x, y: pointOne.y + pointTwo.y};
}

Heroic.RegionX.prototype.getOffset = function() {
	// recursive function that gets parents' offsets
	if( this.parent ) {
		return this.addPoints( this.origin, this.parent.getOffset() );
	}

	return this.origin;
}

Heroic.RegionX.prototype.each = function() {
	// enumerable?
	// this.last = 0;
}

Heroic.RegionX.prototype.getShape = function() {
	// line, rectangle, circle, grid/array
	// cross: tiles n,s,e,w of point
	// ring: tiles surrounding point

	// shapes are just collections of points. no references to tiles exist outside of the master region
}

Heroic.RegionX.prototype.overlaps = function() {
	// check sub regions or no?
}
Heroic.RegionX.prototype.merge = function(region) {
	// need to merge sub regions? maybe not
}

Heroic.RegionX.prototype.hasPoint = function(x, y) {
	if( this.points[y][x] ) {
		return true;
	} else {
		return false;
	}
}

Heroic.RegionX.prototype.getTile = function(x, y) {
	// figure out offset of parent based on this.origin (??)
	// how do we work our way back up the chain of regions in an efficient manner?
	// get Tile from master Region
}

Heroic.RegionX.prototype.addPoint = function(x, y) {
	// check if [y] array is set first
	//this.points[y][x] = true;
	// recalculate edge and interior?
}

Heroic.RegionX.prototype.removePoint = function(tile) {
	this.points[y][x] = false;
	// recalculate edge and interior?
}

Heroic.RegionX.prototype.addChild = function(shape, size, origin) {
	// new Region(shape, origin, size, this);
}

//Heroic.RegionX.prototype.findEdges = function() { // can look at [y] arrays for lowest/highest set index }
//Heroic.RegionX.prototype.findInteriors = function() {}

Heroic.RegionX.prototype.master = function() {
	// create tiles and store references to them
	// intended for use only once in the master Region
	this.key = []; // link between points and tiles

	// foreach this.points: set link between this.key and new Tile()
}

//Heroic.RegionX.prototype.init = function(shape, size, origin, parent) {}

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