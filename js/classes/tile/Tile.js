var GAME = GAME || {};

GAME.Tile = function() {
	this.size		= 14;
}

/*
 * Get all bounding tiles of this tile.
 *
 * @return	{Object[]}
 */
GAME.Tile.prototype.getBorder = function() {
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
 * Get a neighboring tile based on one direction.
 * 
 * @param	{integer}	direction	Which direction to check
 * @return	{Object}
 */


 // ****Should this be able to get tiles in diagonal directions??
GAME.Tile.prototype.getNeighbor = function(direction) {
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
 * Sets a property for this tile. If JSON is provided will set each property to those defined
 * in the object. Otherwise will set a single property to the provided value.
 * 
 * @param	{Object}	property	JSON object
 * @param	{string}	property	Property name
 * @param	{mixed}		value		Any value to set the property to
 * 
 */
GAME.Tile.prototype.setProperty = function(property, value) {
	if( typeof(property) == 'object' ) {
		for(var prop in property) {
			this[prop] = property[prop];
		}
	} else {
		this[property] = value;
	}
}

// To be removed
GAME.Tile.prototype.checkType = function(type, percent) {
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
		this.submirror = GAME.Entities.palette.getRandSubtype(type);
	}
}

// To be removed
GAME.Tile.prototype.toMirror = function() {
	this.mirror = this.type;
	this.submirror = this.subtype;
}

// To be removed
GAME.Tile.prototype.fromMirror = function() {
	this.type = this.mirror;
	this.subtype = this.submirror;
}

// To be removed
// Will be covered by Terrain.draw(), Asset.draw(), etc.
/*
GAME.Tile.prototype.draw = function() {
	var ctx = GAME.Layers.terrain.context;

	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.fillStyle = 'rgba(28, 14, 9, 1)';

	if( this.type == '2' ) {
		ctx.fillStyle = 'rgba(56, 16, 16, 1)';
	}
	if( this.type == '1' ) {
		ctx.fillStyle = 'rgba(102, 37, 37, 1)';
	}

	ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);

	if( this.type == '0' ) {
		ctx.fillStyle = "rgba(180, 90, 90, 1)";
	} else {
		ctx.fillStyle = "rgba(255, 150, 150, 1)";
	}
	
	var char = GAME.Entities.palette.getChar(this.type, this.subtype);
	ctx.fillText(char, this.x * this.size + 4, this.y * this.size + this.size - 4);
}
*/

// ***Remove functionality that will be covered by Terrain object
GAME.Tile.prototype.init = function(x, y, parent) {
	this.x			= x;
	this.y			= y;
	this.type		= ''; // remove
	this.subtype	= ''; // remove
	this.mirror 	= ''; // remove
	this.submirror	= ''; // remove
	this.grid		= parent;

	this.terrain	= new GAME.Terrain();

	var rand = Math.random(); // remove

	// remove
	if( rand > 0.67 ) {
		this.type = '1';
		this.subtype = GAME.Entities.palette.getRandSubtype('1');
	} else {
		this.type = '0';
		this.subtype = GAME.Entities.palette.getRandSubtype('0');
	}
	if( this.x == 0 || this.y == 0 || (this.x == this.grid.width - 1) || (this.y == this.grid.height - 1) ) {
		this.type = '1';
	}
	this.toMirror(); // remove

	this.terrain.init(this);

	GAME.Entities.terrain.load( this.terrain );
}