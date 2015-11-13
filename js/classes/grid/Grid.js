var Heroic = Heroic || {};

// NOTES: add option for circular pattern? Would probably need subclasses

// consider putting a check at the end of all the get region methods to see if should continue with another

/*
 * Acts as a collection of tiles with methods to access them.
 *
 * @class
 */
Heroic.Grid = function() {
	this.width	= 49;
	this.height	= 35;
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

// ******should randomize the tile order prior to returning
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

	return tiles;
}

Heroic.Grid.prototype.getPattern = function() {
	// grid
	// random grid
}

/*
 * Get all tiles that form a line between two end points.
 * 
 * @param	{Object}	start	Tile that represents the start point
 * @param	{Object}	end		Tile that represents the end point
 * @return	{array}
 */
Heroic.Grid.prototype.getLine = function(pointOne, pointTwo) {
	if(pointOne == pointTwo) {
		return [];
	}

	var tiles = [];
	var slope = (pointTwo.y - pointOne.y) / (pointTwo.x - pointOne.x);
	
	if( Math.abs(slope) > 1 ) {
		slope = (pointTwo.x - pointOne.x) / (pointTwo.y - pointOne.y);

		if( pointOne.y < pointTwo.y ) {
			var start	= pointOne;
			var end		= pointTwo;
		} else {
			var start	= pointTwo;
			var end		= pointOne;
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
		if( pointOne.x < pointTwo.x ) {
			var start	= pointOne;
			var end		= pointTwo;
		} else {
			var start	= pointTwo;
			var end		= pointOne;
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
 * Get an array of tiles in a rectangular area.
 * 
 * @param	{object}	origin		Object containing x and y coordinate values
 * @param	{integer}	origin.x	X-coordinate
 * @param	{integer}	origin.y	Y-coordinate
 * @param	{integer}	width		Width of area
 * @param	{integer}	height		Height of area
 * @param	{boolean}	fill		Whether or not to fill the area
 * @return	{array}
 */
Heroic.Grid.prototype.getRectangle = function(origin, width, height, fill) {
	var points	= [];
	var tiles	= [];

	if( typeof(fill) == 'undefined' ) {
		var fill = false;
	}

	for(var y = 0; y < height; y++) {
		for(var x = 0; x < width; x++) {
			var point	= {};
			var edge	= false;

			point.x = x;
			point.y = y;

			if( x == 0 || x == (width - 1) ) {
				edge = true;
			}
			if( y == 0 || y == (height - 1) ) {
				edge = true;
			}
			if( fill || ( edge && !fill ) ) {
				points.push(point);
			}
		}
	}

	// offset points based on origin
	for(var index in points) {
		var point = points[index];
		var offsetPoint = {};

		offsetPoint.x = point.x + origin.x;
		offsetPoint.y = point.y + origin.y;

		var tile = this.getTile(offsetPoint.x, offsetPoint.y);

		tiles.push(tile);
	}

	return tiles;
}

/*
 * Get an array of tiles in a circular area.
 * 
 * @param	{Object}	origin		Coordinates of point on grid
 * @param	{integer}	origin.x	X-coordinate
 * @param	{integer}	origin.y	Y-coordinate
 * @param	{integer}	radius		Radius of the circle (including origin point)
 * @param	{boolean}	fill		Whether or not to fill the circular area
 * @return	{array}
 */
Heroic.Grid.prototype.getCircle = function(origin, radius, fill) {
	var points	= [];
	var tiles	= [];

	if( isNaN(radius) ) {
		return points;
	}
	if( typeof(fill) == 'undefined' ) {
		var fill = false;
	}
	
	radius--;

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
	if( fill ) {
		for(var index in points) {
			var point = points[index];

			for(var insideY = point.y - 1; insideY > -1; insideY--) {
				var insidePoint = [];

				insidePoint.x = point.x;
				insidePoint.y = insideY;

				points.push(insidePoint);
			}
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

		offsetPoint.x = point.x + origin.x;
		offsetPoint.y = point.y + origin.y;

		var tile = this.getTile(offsetPoint.x, offsetPoint.y);

		if(tile) {
			tiles.push(tile);
		}
	}

	return tiles;
}

/*
 * Get an array of tiles in an irregular area.
 * 
 * @param	{Object}	origin		Coordinates of point on grid
 * @param	{integer}	origin.x	X-coordinate
 * @param	{integer}	origin.y	Y-coordinate
 * @param	{integer}	radius		Radius of the circle (including origin point)
 * @param	{boolean}	fill		Whether or not to fill the circular area
 * @return {array}
 */
Heroic.Grid.prototype.getBlob = function(origin, radius) {
	var tiles = this.getCircle(origin, radius, true);

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

		var randOrigin = {x: origin.x - xOffset, y: origin.y - yOffset};

		var moreTiles = this.getCircle(randOrigin, randRadius, true);

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

Heroic.Grid.prototype.growEdges = function(tiles) {
	var edgeTiles = [];



	return edgeTiles;
}

// find the tiles that make up an area's boundaries
Heroic.Grid.prototype.findEdges = function(tiles) {
	var edgeTiles = [];

	for(var index in tiles) {
		var tile = tiles[index];

		// check tiles left and right of this one
		var prevTile = this.getTile(tile.x - 1, tile.y);
		var nextTile = this.getTile(tile.x + 1, tile.y);

		var prev = tiles.indexOf(prevTile);
		var next = tiles.indexOf(nextTile);

		if(prev == -1 || next == -1) {
			edgeTiles.push(tile);
		}

		// check tiles up and down from this one
		var upTile		= this.getTile(tile.x, tile.y - 1);
		var downTile	= this.getTile(tile.x, tile.y + 1);

		var up			= tiles.indexOf(upTile);
		var down		= tiles.indexOf(downTile);

		if(up == -1 || down == -1) {
			if( edgeTiles.indexOf(tile) == -1 ) {
				edgeTiles.push(tile);
			}
		}
	}

	return edgeTiles;
}

Heroic.Grid.prototype.each = function(command, arg) {
	if( typeof(arg) == 'undefined' ) {
		var arg = [];
	}

	this.tiles.forEach(function(row, index1) {
		row.forEach(function(cell, index2) {
			cell[command].apply(cell, arg);
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