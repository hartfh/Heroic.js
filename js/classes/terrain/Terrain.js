var Heroic = Heroic || {};

// ***Obsolete. Eventually remove.

/*
 * Represents terrain data within a tile.
 *
 * @class
 */
Heroic.Terrain = function() {}

/*
 * Sets a property for this terrain. If JSON is provided will set each property to those defined
 * in the object. Otherwise will set a single property to the provided value.
 * 
 * @param	{Object}	property	JSON object
 * @param	{string}	property	Property name
 * @param	{mixed}		value		Any value to set the property to
 * 
 */
Heroic.Terrain.prototype.setProperty = function(property, value) {
	if( typeof(property) == 'object' ) {
		for(var prop in property) {
			this[prop] = property[prop];
		}
	} else {
		this[property] = value;
	}
}

/*
 * Copies type property value to mirror.
 *
 * @return void
 */
Heroic.Terrain.prototype.toMirror = function() {
	this.mirror = this.type;
}

/*
 * Copies mirror property value to type.
 *
 * @return void
 */
Heroic.Terrain.prototype.fromMirror = function() {
	this.type = this.mirror;
}

/*
 * Draws this object to the terrain layer.
 */
Heroic.Terrain.prototype.draw = function() {
	var args = {
		tile:			this.tile,
		color:			this.color,
		background:		this.background,
		character:		this.ascii
	};

	Heroic.Layers.terrain.draw(args);
}

Heroic.Terrain.prototype.init = function(tile) {
	this.type		= '';
	this.mirror		= '';
	this.ascii		= '.';
	this.background	= 'black';
	this.color		= 'white';
	//this.status
	this.tile		= tile;
}