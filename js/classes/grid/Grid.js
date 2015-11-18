var Heroic = Heroic || {};

/*
 * Acts as a collection of tiles with methods to access them.
 *
 * @class
 */
Heroic.Grid = function() {
	//this.width	= 49;
	//this.height	= 35;
	this.width	= 90;
	this.height	= 90;
}

/*
 * Gets a tile at the provided coordinates. Returns false if tile is invalid.
 * 
 * @param	{integer}	x		X-coordinate of tile
 * @param	{integer}	y		Y-coordinate of tile
 * @return	{Object}	tile
 */
Heroic.Grid.prototype.getTile	= function(x, y) {
	if( typeof(x) != 'number' || typeof(y) != 'number' ) {
		return false;
	}
	if( x < 0 || x > this.width - 1 ) {
		return false;
	}
	if( y < 0 || y > this.height - 1 ) {
		return false;
	}

	return this.tiles[y][x];
}

/*
 * Gets a tile at random.
 *
 * @return	{Object}	tile
 */
Heroic.Grid.prototype.getRandomTile = function() {
	var randX = Math.floor( Math.random() * this.width );
	var randY = Math.floor( Math.random() * this.height );

	return this.getTile(randX, randY);
}

/*
 * Get tiles based on whether RNG exceeds threshold.
 * 
 * @param	{float}		percent		Threshold to test against (ranges from 0 - 1)
 * @return	{array}
 */
Heroic.Grid.prototype.getRandomTiles = function(percent) {
	var rand;
	var tiles = [];

	this.tiles.forEach(function(row, index1) {
		row.forEach(function(tile, index2) {
			rand = Math.random();

			if( percent > rand ) {
				tiles.push(tile);
			}
		});
	});

	tiles.shuffle();

	return tiles;
}

/*
 * Get tiles that make up points on a grid.
 * 
 * @param	{Object}	origin		Starting point of the grid
 * @param	{integer}	origin.x	X-coordinate
 * @param	{integer}	origin.y	Y-coordinate
 * @param	{integer}	width		Width of the grid
 * @param	{integer}	height		Height of the grid
 * @param	{integer}	spacing		Distance between tiles within the grid
 * @param	{integer}	degrees		Rotate the grid by this many degrees
 * @return	{array}
 */
Heroic.Grid.prototype.getGrid = function(origin, width, height, spacing, degrees) {
	if( typeof(degrees) != 'number' ) {
		degrees = 0;
	}

	var tiles	= [];
	var radians	= degrees * Math.PI / 180;

	for(var y = 0; y <= height; y = y + spacing) {
		for(var x = 0; x <= width; x = x + spacing) {
			var rotatedX = Math.cos(radians) * x - ( y * Math.sin(radians) );
			var rotatedY = y + Math.sin(radians) * x;

			var offsetX = Math.round(rotatedX) + origin.x;
			var offsetY = Math.round(rotatedY) + origin.y;

			var tile = this.getTile(offsetX, offsetY);

			if(tile) {
				tiles.push(tile);
			}
		}
	}

	return tiles;
}

/*
 * Get all tiles that form a line between two points.
 * 
 * @param	{Object}	args.origin		Tile object, line's start point
 * @param	{Object}	args.terminus	Tile object, line's finish point
 * @return	{array}
 */
Heroic.Grid.prototype.getLine = function(args) {
	if(args.origin == args.terminus) {
		return [];
	}

	var tiles = [];
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

			var tile = this.getTile(x, y);

			if(tile) {
				tiles.push(tile);
			}
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

			var tile = this.getTile(x, y);

			if(tile) {
				tiles.push(tile);
			}
		}
	}

	return tiles;
}

/*
 * Get all tiles in a rectangular area.
 * 
 * @param	{Object}	args.origin		Tile object and the rectangle's start point
 * @param	{Object}	args.terminus	Tile object and the rectangle's end point
 * @return	{array}
 */
Heroic.Grid.prototype.getRectangle = function(args) {
	var tiles		= [];
	var width		= args.terminus.x - args.origin.x;
	var height		= args.terminus.y - args.origin.y;

	var start	= {x: false, y: false};
	var end	= {x: false, y: false};

	if( height < 0 ) {
		start.y		= args.terminus.y;
		end.y	= args.origin.y;
		height		= Math.abs(height);
	} else {
		start.y		= args.origin.y;
		end.y	= args.terminus.y;
	}


	if( width < 0 ) {
		start.x		= args.terminus.x;
		end.x	= args.origin.x;
		width		= Math.abs(width);
	} else {
		start.x		= args.origin.x;
		end.x	= args.terminus.x;
	}

	for(var y = 0; y < height; y++) {
		for(var x = 0; x < width; x++) {
			var offsetPoint = {};

			offsetPoint.x = x + start.x;
			offsetPoint.y = y + start.y;

			var tile = this.getTile(offsetPoint.x, offsetPoint.y);

			if(tile) {
				tiles.push(tile);
			}
		}
	}

	return tiles;
}

/*
 * Get all tiles in a circular area.
 * 
 * @param	{Object}	args.origin		Tile object, circle's center point
 * @param	{integer}	args.radius		Radius of the circle (including origin point)
 * @return	{array}
 */
Heroic.Grid.prototype.getCircle = function(args) {
	var points	= [];
	var tiles	= [];

	if( isNaN(args.radius) ) {
		return points;
	}
	if( typeof(fill) == 'undefined' ) {
		var fill = false;
	}
	
	var radius = args.radius - 1;

	// get edge points on one 45 deg arc
	for(var x = 0; x < radius; x++) {
		var edgePoint = {};
		var y = Math.sqrt( (radius * radius) - (x * x) );
		y = Math.round(y);

		if( !isNaN(y) ) {
			edgePoint.x = x;
			edgePoint.y = y;

			points.push(edgePoint);
		}
	}

	// mirror the points into a 90 degree arc
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = {};

		mirrorPoint.x = point.y;
		mirrorPoint.y = point.x;

		points.push(mirrorPoint);
	}

	// add all points inside the arc
	for(var index in points) {
		var point = points[index];

		for(var insideY = point.y - 1; insideY > -1; insideY--) {
			var insidePoint = [];

			insidePoint.x = point.x;
			insidePoint.y = insideY;

			points.push(insidePoint);
		}
	}

	// mirror points about Y-axis
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = {};

		if( point.x != 0 ) {
			mirrorPoint.x = -1 * point.x;
			mirrorPoint.y = point.y;
			
			points.push(mirrorPoint);
		}
	}

	// mirror points about X-axis
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = {};

		if( point.y != 0 ) {
			mirrorPoint.x = point.x;
			mirrorPoint.y = -1 * point.y;
			
			points.push(mirrorPoint);
		}
	}

	// apply offset to points based on origin
	for(var index in points) {
		var point = points[index];

		var offsetPoint = {};

		offsetPoint.x = point.x + args.origin.x;
		offsetPoint.y = point.y + args.origin.y;

		var tile = this.getTile(offsetPoint.x, offsetPoint.y);

		if(tile) {
			tiles.push(tile);
		}
	}

	return tiles;
}

/*
 * Get all tiles in an irregularly shaped area.
 * 
 * @param	{Object}	args.origin		Tile object, circle's center point
 * @param	{integer}	args.radius		Radius of the primary circle (including origin point)
 * @return {array}
 */
Heroic.Grid.prototype.getBlob = function(args) {
	var tiles	= this.getCircle(args);
	var radius	= args.radius;
	var origin	= args.origin;

	// Between 3 and 6 extra circles
	var addons = Math.random() * (6 - 3) + 3;
	addons = Math.round(addons);

	// Do getCircle a random number of times, with a random origin offset and radius for each
	for(var i = 0; i < addons; i++) {
		var randRadius = Math.random() * (radius - 3) + 3;

		var xOffset = Math.random() * (radius + radius) - radius;
		var yOffset = Math.random() * (radius + radius) - radius;

		xOffset = Math.round(xOffset);
		yOffset = Math.round(yOffset);

		var randOrigin	= {x: origin.x - xOffset, y: origin.y - yOffset};
		var randArgs	= {origin: randOrigin, radius: randRadius};

		var moreTiles = this.getCircle(randArgs);

		// Add non-duplicate tiles to area
		for(var index in moreTiles) {
			var tile = moreTiles[index];

			if( tiles.indexOf(tile) == -1 ) {
				tiles.push(tile);
			}
		}
	}

	return tiles;
}

/*
Heroic.Grid.prototype.growEdges = function(tiles) {
	var edgeTiles = [];

	return edgeTiles;
}
*/

Heroic.Grid.prototype.each = function(command, args) {
	if( typeof(args) == 'undefined' ) {
		var args = [];
	}

	this.tiles.forEach(function(row, index1) {
		row.forEach(function(cell, index2) {
			cell[command].apply(cell, args);
		});
	});
}

Heroic.Grid.prototype.init = function() {
	this.tiles	= [];

	for(var y = 0; y < this.height; y++) {
		var row = [];

		for(var x = 0; x < this.width; x++) {
			var tile = new Heroic.Tile();
			tile.init(x, y, this);
			row.push(tile);
		}

		this.tiles.push(row);
	}
}