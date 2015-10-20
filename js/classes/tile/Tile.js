var Heroic = Heroic || {};

/*
 * Represents a single square on the map grid.
 *
 * @class
 */
Heroic.Tile = function() {
	this.size		= 14;
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

/*
 * Get all tiles within a rectangular area relative to this one.
 *
 * @param	{intger}	width	Width of area
 * @param	{intger}	height	Height of area
 * @return	{array}				Array of tiles
 */
Heroic.Tile.prototype.getRectangle = function(width, height) {
	// this tile is top-left of rectangle?




	// return tiles;
}

/*
 * Get all tiles within a circular area centered on this one.
 * 
 * @param	{integer}	radius	Radius of the area
 * @return	{array}				Array of tiles
 */
Heroic.Tile.prototype.getCircle = function(radius) {
	// circle centered on this tile



	// return tiles;
}

/*
 * Get a neighboring tile based on one direction.
 * 
 * @param	{integer}	direction	Which direction to check
 * @return	{Object}
 */
// ****Should this be able to get tiles in diagonal directions??
Heroic.Tile.prototype.getNeighbor = function(direction) {
	var x = 0;
	var y = 0;

	switch(direction) {
		case 'left':
			x--;
			break;
		case 'up':
			y--;
			break;
		case 'right':
			x++;
			break;
		case 'down':
			y++;
			break;
		default:
			break;
	}

	// convert direction

	return this.grid.getTile(this.x + x, this.y + y);
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

// ***Remove functionality that will be covered by Terrain object
Heroic.Tile.prototype.init = function(x, y, parent) {
	this.x			= x;
	this.y			= y;
	this.grid		= parent;

	this.terrain	= new Heroic.Terrain();

	this.terrain.init(this);

	Heroic.Entities.terrain.load( this.terrain );
}