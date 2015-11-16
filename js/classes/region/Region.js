var Heroic = Heroic || {};

Heroic.Region = function() {}

/*
 * Adds tiles to the region, then determines which are edge and interior tiles.
 * 
 * @param	{array}		tiles	Tile objects to add to the region.
 */
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
 */
Heroic.Region.prototype.grow = function() {
	var oldEdge = this.edge.contents;
	var newEdge = [];

	for(var index in oldEdge) {
		var tile		= oldEdge[index];
		var bounding	= tile.getBounding();

		for(var index2 in bounding) {
			var boundTile = bounding[index2];

			if(boundTile) {
				if( this.edge.contents.indexOf(boundTile) != -1 ) {
					// is an edge tile. ignore
				} else if( this.interior.contents.indexOf(boundTile) != -1 ) {
					// is an interior tile. ignore
				} else {
					// is an outside tile
					var direction		= parseInt(index2);
					var rotatedDir		= rotateDirection(direction, 180);
					var oppositeTile	= tile.getNeighbor(rotatedDir);

					if( oppositeTile ) {
						if( this.interior.contents.indexOf(oppositeTile) != -1 ) {
							newEdge.push(boundTile);
						} else if( this.edge.contents.indexOf(oppositeTile) != -1 ) {
							newEdge.push(boundTile);
						}
					}
				}
			}
		}		
	}

	this.edge.contents		= newEdge;
	this.interior.contents	= this.interior.contents.concat( oldEdge );
}

Heroic.Region.prototype.shrink = function() {

}

/*
 * Determine if this region shares any overlap with another.
 * 
 * @param	{Object}	region		Another region to test against.
 * @return	{boolean}
 */
Heroic.Region.prototype.overlaps = function(region) {
	var testEdges = region.edge.contents

	for(var index in testEdges) {
		var testTile = testEdges[index];

		if( this.edge.contents.indexOf(testTile) != -1 ) {
			return true;
		}
	}

	return false;
}

/*
 * Merge this region with another one.
 * 
 * @param	{Object}	region		Region to merge with.
 */
Heroic.Region.prototype.merge = function(region) {
	var tiles = [];

	tiles = tiles.concat( this.edge.contents );
	tiles = tiles.concat( this.interior.contents );
	tiles = tiles.concat( region.edge.contents );
	tiles = tiles.concat( region.interior.contents );

	this.edge.contents		= [];
	this.interior.contents	= [];

	this.load(tiles);
}

// chance to repeat
Heroic.Region.prototype.recurse = function() {
	
}

Heroic.Region.prototype.init = function() {
	this.edge		= new Heroic.Inventory();
	this.interior	= new Heroic.Inventory();

	this.edge.init();
	this.interior.init();
}