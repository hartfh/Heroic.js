var GAME = GAME || {};

// NOTES: add option for circular pattern? Would probably need subclasses

/*
 * Acts as a collection of tiles with methods to access them.
 *
 * @class
 */
GAME.Grid = function() {
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
GAME.Grid.prototype.getTile	= function(x, y) {
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
 * Chooses a random tile.
 *
 * @return	{Object}	tile
 */
GAME.Grid.prototype.getRandomTile = function() {
	var randX = Math.floor( Math.random() * this.width );
	var randY = Math.floor( Math.random() * this.height );

	return this.getTile(randX, randY);
}

GAME.Grid.prototype.each = function(command, arg) {
	if( typeof(arg) == 'undefined' ) {
		arg = [];
	}

	this.tiles.forEach(function(row, index1) {
		row.forEach(function(cell, index2) {
			cell[command].apply(cell, arg);
		});
	});
}

GAME.Grid.prototype.init = function() {
	this.tiles	= [];

	for(var y = 0; y < this.height; y++) {
		var row = [];

		for(var x = 0; x < this.width; x++) {
			var tile = new GAME.Tile();
			tile.init(x, y, this);
			row.push(tile);
		}

		this.tiles.push(row);
	}
}