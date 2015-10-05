var GAME = GAME || {};

// NOTES: add option for circular pattern? Would probably need subclasses


GAME.Grid = function() {
	this.width	= 49;
	this.height	= 35;
}

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