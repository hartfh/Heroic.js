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
			prev = 'out';
		}
		if(!nextTile) {
			next = 'out';
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
			up = 'out';
		}
		if(!downTile) {
			down = 'out';
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

/*
 * Shifts this region by the specified amount.
 * 
 * @param	{integer}	x	Number of tiles to shift X-coordinates
 * @param	{integer}	y	Number of tiles to shift Y-coordinates
 */
Heroic.Region.prototype.translate = function(x, y) {
	var areas = ['edge', 'interior'];

	for(var index in areas) {
		var area, contents, tempInv;
		
		area		= areas[index];
		area		= this[area];
		contents	= area.contents;
		tempInv		= new Heroic.Inventory();

		tempInv.init();

		for(var index2 in contents) {
			var tile, newTile;

			tile = contents[index2];
			newTile = Heroic.Entities.map.grid.getTile(tile.x + x, tile.y + y);

			if(newTile) {
				tempInv.load(newTile);
			}
		}

		this[area] = tempInv;
	}
}

Heroic.Region.prototype.rotate = function(origin, degrees) {
	// remove rotation from getGrid but incorporate same approach of rotating about an origin
}

/*
 * Grow the region by one tile.
 * 
 */
Heroic.Region.prototype.grow = function() {
	var oldEdge = this.edge.contents;
	var newEdge = [];

	for(var index in oldEdge) {
		var tile = oldEdge[index];

		// look at bounding tiles

		var bounding = tile.getBounding();

		for(var index2 in bounding) {
			var boundTile = bounding[index2];

			if( this.edge.contents.indexOf(boundTile) != -1 ) {
				// is an edge tile. ignore
			} else if( this.interior.contents.indexOf(boundTile) != -1 ) {
				// is an interior tile. ignore
			} else {
				// is an outside tile
				var direction = parseInt(index2);
				var rotatedDir = rotateDirection(direction, 180);
				var oppositeTile = tile.getNeighbor(rotatedDir);

				if( oppositeTile ) {
					if( this.interior.contents.indexOf(oppositeTile) != -1 ) {
						newEdge.push(boundTile);
					}
				}
				// if exterior: look at opposite for interior? if not, check adjacent for multiple instances of edge tiles
			}
		}		
	}

	// if edge tile has inner tile down from it, tile up from it becomes new edge, etc.
	// empty tiles bounded by 2 or more edge tiles becomes new edge

	// expand edge
	this.edge.contents = newEdge;

	
	// add old edge tiles to interior
	//this.interior.contents.concat( oldEdge );
}

// accepts array of Regions to merge with?
Heroic.Region.prototype.merge = function(regions) {

}

Heroic.Region.prototype.init = function() {
	this.edge		= new Heroic.Inventory();
	this.interior	= new Heroic.Inventory();

	this.edge.init();
	this.interior.init();
}