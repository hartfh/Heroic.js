var Heroic = Heroic || {};

Heroic.Region = function() {}

Heroic.Region.prototype.load = function(tiles) {
	for(var index in tiles) {
		var tile = tiles[index];
		var grid = tile.grid;
		var edge = false;

		// check tiles left and right of this one
		var prevTile = grid.getTile(tile.x - 1, tile.y);
		var nextTile = grid.getTile(tile.x + 1, tile.y);

		var prev = tiles.indexOf(prevTile);
		var next = tiles.indexOf(nextTile);

		// Grid edge tiles should not count as Region edge tiles
		if(!prevTile) {
			prev = 0;
		}
		if(!nextTile) {
			next = 0;
		}

		if(prev == -1 || next == -1) {
			this.edge.load(tile);
			edge = true;
		}

		// check tiles up and down from this one
		var upTile		= grid.getTile(tile.x, tile.y - 1);
		var downTile	= grid.getTile(tile.x, tile.y + 1);

		var up			= tiles.indexOf(upTile);
		var down		= tiles.indexOf(downTile);

		// Grid edge tiles should not count as Region edge tiles
		if(!upTile) {
			up = 0;
		}
		if(!downTile) {
			down = 0;
		}

		if(up == -1 || down == -1) {
			this.edge.load(tile);
			edge = true;
		}
		if( !edge ) {
			this.interior.load(tile);
		}
	}
}

Heroic.Region.prototype.init = function() {
	this.edge		= new Heroic.Inventory();
	this.edge.init();
	this.interior	= new Heroic.Inventory();
	this.interior.init();
}