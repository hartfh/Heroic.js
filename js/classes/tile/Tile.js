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
 * @return	{Object[]}	array of tiles
 */
Heroic.Tile.prototype.getBorder = function() {
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
Heroic.Tile.prototype.checkType = function(type, percent) {
	var borders = this.getBorder();
	var walls = 0;
	var empty = 8 - borders.length;

	borders.forEach(function(elem, index) {
		if( elem.type == type ) {
			walls++;
		}
	});
	
	walls += empty;
	tilePercent = walls / 8;

	if( tilePercent > (percent / 100) ) {
		this.mirror = type;
		this.submirror = Heroic.Entities.palette.getRandSubtype(type);
	}
}
*/

/*
 * Check if this tile is on one of the edges of its grid.
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
Heroic.Tile.prototype.setProperty = function(property, value) {
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
	//this.type		= '';
	//this.subtype	= '';
	//this.mirror 	= '';
	//this.submirror	= '';
	this.grid		= parent;

	this.terrain	= new Heroic.Terrain();

	/*
	var rand = Math.random(); // remove

	// remove
	if( rand > 0.67 ) {
		this.type = '1';
		this.subtype = Heroic.Entities.palette.getRandSubtype('1');
	} else {
		this.type = '0';
		this.subtype = Heroic.Entities.palette.getRandSubtype('0');
	}
	if( this.x == 0 || this.y == 0 || (this.x == this.grid.width - 1) || (this.y == this.grid.height - 1) ) {
		this.type = '1';
	}
	this.toMirror();
	*/

	this.terrain.init(this);

	Heroic.Entities.terrain.load( this.terrain );
}