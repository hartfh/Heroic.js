var Heroic = Heroic || {};

// NOTES: add option for circular pattern? Would probably need subclasses

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
 * Chooses a tile at random.
 *
 * @return	{Object}	tile
 */
Heroic.Grid.prototype.getRandomTile = function() {
	var randX = Math.floor( Math.random() * this.width );
	var randY = Math.floor( Math.random() * this.height );

	return this.getTile(randX, randY);
}

Heroic.Grid.prototype.getRandomTiles = function() {

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

		tiles.push(tile);
	}

	return tiles;
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