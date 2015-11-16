var Heroic = Heroic || {};

/*
 * Represents a single square on the map grid.
 *
 * @class
 */
Heroic.Tile = function() {
	//this.size		= 14;
	this.size		= 5;
}

/*
 * Get all tiles bounding this one.
 *
 * @return	{array}		Array of tiles
 */
Heroic.Tile.prototype.getBorders = function() {
	var borders = [];

	for(var y = -1; y < 2; y++) {
		for(var x = -1; x < 2; x++) {
			var tile = this.grid.getTile(this.x + x, this.y + y);

			if( tile ) {
				borders.push(tile);
			}
		}
	}

	return borders;
}


Heroic.Tile.prototype.getBounding = function() {
	var bounding	= [];
	var directions	= getDirections();

	for(var index in directions) {
		var coords	= directions[index].coordinates;
		var tile	= this.grid.getTile(this.x + coords.x, this.y + coords.y);

		bounding[index] = tile;
	}

	return bounding;
}

Heroic.Tile.prototype.getNeighbor = function(direction) {
	if( typeof(direction) == 'string' ) {
		// convert string to integer direction
	}

	var directions = getDirections();
	var coordinates = directions[direction].coordinates;
	var tile = this.grid.getTile(this.x + coordinates.x, this.y + coordinates.y);

	return tile;
}

/*
 * Check if this tile is on one of the edges of the grid.
 *
 * @return	{boolean}
 */
Heroic.Tile.prototype.isEdge = function() {
	if( this.x == 0 || this.y == 0 ) {
		return true;
	}
	if( this.x == (this.grid.width - 1) || this.y == (this.grid.height - 1) ) {
		return true;
	}

	return false;
}

//Note: can this also be removed?????
/*
 * Sets a property for this tile. If JSON is provided will set each property to those defined
 * in the object. Otherwise will set a single property to the provided value.
 * 
 * @param	{Object}	property	JSON object
 * @param	{string}	property	Property name
 * @param	{mixed}		value		Any value to set the property to
 * 
 */
Heroic.Tile.prototype.set = function(property, value) {
	if( typeof(property) == 'object' ) {
		for(var prop in property) {
			this[prop] = property[prop];
		}
	} else {
		this[property] = value;
	}
}

Heroic.Tile.prototype.init = function(x, y, parent) {
	this.x			= x;
	this.y			= y;
	this.grid		= parent;

	this.terrain	= new Heroic.Terrain();

	this.terrain.init(this);

	Heroic.Entities.terrain.load( this.terrain );
}