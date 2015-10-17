var Heroic = Heroic || {};

/*
 * 
 * @class
 */
Heroic.Asset = function() {}

/*
 * Sets a property for this asset. If JSON is provided will set each property to those defined
 * in the object. Otherwise will set a single property to the provided value.
 * 
 * @param	{Object}	property	JSON object
 * @param	{string}	property	Property name
 * @param	{mixed}		value		Any value to set the property to
 * 
 */
Heroic.Asset.prototype.setProperty = function(property, value) {
	if( typeof(property) == 'object' ) {
		for(var prop in property) {
			this[prop] = property[prop];
		}
	} else {
		this[property] = value;
	}
}

/*
 * Sets a new grid location for the asset.
 *
 * @return void
 */
Heroic.Asset.prototype.setLocation = function(x, y) {
	this.tile = Heroic.Entities.map.grid.getTile(x, y);
}

/*
 * Saves all of an assets property values into the "mirror" property.
 */
Heroic.Asset.prototype.toMirror = function() {
	var properties	= Object.getOwnPropertyNames(this);
	var mirror		= {};

	for(var index in properties) {
		var prop = properties[index];

		if( prop != 'mirror' ) {
			mirror[prop] = this[prop];
		}
	}

	this.mirror = mirror;
}

/*
 * Copies all values stored in "mirror" property back to the asset.
 */
Heroic.Asset.prototype.fromMirror = function() {
	for(var index in this.mirror) {
		this[index] = this.mirror[index];
	}

	this.mirror = null;
}

/*
 * Erases the asset from the asset layer.
 *
 * @return void
 */
Heroic.Asset.prototype.clear = function() {
	Heroic.Layers.assets.clear(this.tile)
}

/* 
 * Draws the asset to the asset layer.
 * 
 * @return void
 */
Heroic.Asset.prototype.draw = function() {
	var args = {
		tile:			this.tile,
		color:			this.color,
		background:		this.background,
		character:		this.ascii
	};

	this.layer.draw(args);
}

/*
 * Moves asset to a specified grid location and redraws layer.
 *
 * @return void
 */
Heroic.Asset.prototype.move = function(x, y) {
	this.clear();
	this.setLocation(x, y);
	this.draw();
}

/*
 * Sets up asset properties.
 *
 * @return void
 */
Heroic.Asset.prototype.init = function(tile) {
	this.tile = null;
	this.name = '';
	this.ascii = '';
	this.color = 'white';
	this.background = 'clear';
	this.layer	= '';
	this.mirror = null;
	//this.tile = tile;
	// set graphical character
}