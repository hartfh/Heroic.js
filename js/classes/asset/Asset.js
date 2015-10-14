var GAME = GAME || {};

/*
 * 
 *
 * @class
 */
GAME.Asset = function() {}

/*
 * Sets a property for this asset. If JSON is provided will set each property to those defined
 * in the object. Otherwise will set a single property to the provided value.
 * 
 * @param	{Object}	property	JSON object
 * @param	{string}	property	Property name
 * @param	{mixed}		value		Any value to set the property to
 * 
 */
GAME.Asset.prototype.setProperty = function(property, value) {
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
GAME.Asset.prototype.setLocation = function(x, y) {
	this.tile = GAME.Entities.map.grid.getTile(x, y);
}

/*
 * Erases the asset from the asset layer.
 *
 * @return void
 */
GAME.Asset.prototype.clear = function() {
	GAME.Layers.assets.clear(this.tile)
}

/* 
 * Draws the asset to the asset layer.
 * 
 * @returns void
 */
GAME.Asset.prototype.draw = function() {
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
GAME.Asset.prototype.move = function(x, y) {
	this.clear();
	this.setLocation(x, y);
	this.draw();
}

/*
 * Sets up asset properties.
 *
 * @return void
 */
GAME.Asset.prototype.init = function(tile) {
	this.tile = null;
	this.name = '';
	this.ascii = 'P';
	this.color = 'white';
	this.background = 'clear';
	this.layer	= '';
	//this.tile = tile;
	// set graphical character
}