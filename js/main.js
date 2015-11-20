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

/*
 * 
 * @param	{Object}	args	Can contain origin, terminus, radius, et. al.
 * 
 */
Heroic.RegionX = function(args, parent) {
	if( typeof(args) != 'object' ) {
		return false;
	}
	if( typeof(parent) == 'undefined' ) {
		var parent = false;
	}

	this.origin		= args.origin;	// keep reference to one of parent's points
	this.terminus	= {};
	this.parent		= parent;
	this.points		= [];		// array of arrays. used values are set to True
	this.edge		= [];
	this.interior	= [];
	this.children	= [];		// child regions
	this.offset		= {x: 0, y: 0};	// keeps track of offset from parent. gets updated whenever region moves or changes size

	this.calcShape(args);
}

Heroic.RegionX.prototype.master = function() {
	// create tiles and store references to them
	// intended for use only once in the master Region
	this.key = []; // link between points and tiles

	// foreach this.points: set link between this.key and new Tile()
}

Heroic.RegionX.prototype.calcShape = function(args) {
	var shapes = ['circle', 'rectangle', 'grid', 'line', 'blob'];
	// cross: tiles n,s,e,w of point
	// ring: tiles surrounding point

	if( shapes.indexOf(args.shape) != -1 ) {
		this[args.shape].apply(this, [args]);
		this.calcTerminus();
		this.calcInterior();
		this.calcEdge();

		if( !this.parent ) {
			this.master(); // create/store tiles
		}
	}
}

Heroic.RegionX.prototype.rectangle = function(args) {
	var width	= args.terminus.x - args.origin.x;
	var height	= args.terminus.y - args.origin.y;

	var start	= {x: false, y: false};
	var end		= {x: false, y: false};

	if( height < 0 ) {
		start.y	= args.terminus.y;
		end.y	= args.origin.y;
		height	= Math.abs(height);
	} else {
		start.y	= args.origin.y;
		end.y	= args.terminus.y;
	}

	if( width < 0 ) {
		start.x	= args.terminus.x;
		end.x	= args.origin.x;
		width	= Math.abs(width);
	} else {
		start.x	= args.origin.x;
		end.x	= args.terminus.x;
	}

	width++;
	height++;

	for(var y = 0; y < height; y++) {
		for(var x = 0; x < width; x++) {
			this.addPoint(x, y);
		}
	}
}
Heroic.RegionX.prototype.line = function(args) {
	console.log('making line');

	var slope = (args.terminus.y - args.origin.y) / (args.terminus.x - args.origin.x);
	
	if( Math.abs(slope) > 1 ) {
		slope = (args.terminus.x - args.origin.x) / (args.terminus.y - args.origin.y);

		if( args.origin.y < args.terminus.y ) {
			var start	= args.origin;
			var end		= args.terminus;
		} else {
			var start	= args.terminus;
			var end		= args.origin;
		}

		var offset = start.x - slope * start.y;

		for(var y = start.y; y <= end.y; y++) {
			var x = slope * y + offset;
			x = Math.round(x);

			this.addPoint(x, y);
		}
	} else {
		if( args.origin.x < args.terminus.x ) {
			var start	= args.origin;
			var end		= args.terminus;
		} else {
			var start	= args.terminus;
			var end		= args.origin;
		}

		var offset = start.y - slope * start.x;

		for(var x = start.x; x <= end.x; x++) {
			var y = slope * x + offset;
			y = Math.round(y);

			this.addPoint(x, y);
		}
	}
}
Heroic.RegionX.prototype.circle = function(args) {}
Heroic.RegionX.prototype.blob = function(args) { /* might need to expand region somehow since it will exceed its initial size */ }
Heroic.RegionX.prototype.grid = function(args) {}

Heroic.RegionX.prototype.calcTerminus = function() {
	// find highest Y and X values and terminus becomes {x: X, y: Y};
}

Heroic.RegionX.prototype.calcOffset = function() {
	// sum all offsets up through to master region
}

Heroic.RegionX.prototype.calcEdge = function() {}
Heroic.RegionX.prototype.calcInterior = function() {}

Heroic.RegionX.prototype.hasPoint = function(x, y) {
	if( this.points[y] ) {
		if( this.points[y][x] ) {
			return true;
		}
	}

	return false;
}

Heroic.RegionX.prototype.addPoint = function(x, y) {
	if( !this.hasPoint(x, y) ) {
		if( !this.points[y] ) {
			this.points[y] = [];
		}
		this.points[y][x] = {x: x, y: y};
	}
}

Heroic.RegionX.prototype.sumPoints = function(pointOne, pointTwo) {
	return {x: pointOne.x + pointTwo.x, y: pointOne.y + pointTwo.y};
}

Heroic.RegionX.prototype.each = function() {
	// enumerable?
	// this.last = 0;
}

Heroic.RegionX.prototype.overlaps = function() {
	// check sub regions or no?
}

Heroic.RegionX.prototype.merge = function(region) {
	// need to merge sub regions? maybe not
}

Heroic.RegionX.prototype.getTile = function(x, y) {
	// first check if hasPoint?
	// apply offset when getting tile
	// get Tile from master Region (how is this referenced? recursively up through parents?)
}

Heroic.RegionX.prototype.removePoint = function(tile) {
	// check if [y] exists
	this.points[y][x] = false;
	// recalculate edge and interior?
}

Heroic.RegionX.prototype.addChild = function(args) {
	// new Region(args, this);
}

//Heroic.RegionX.prototype.findEdges = function() { // can look at [y] arrays for lowest/highest set index }
//Heroic.RegionX.prototype.findInteriors = function() {}

/*
Heroic.RegionX.prototype.getOffset = function() {
	// recursive function that gets parents' offsets
	if( this.parent ) {
		return this.addPoints( this.origin, this.parent.getOffset() );
	}

	return this.origin;
}
*/
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