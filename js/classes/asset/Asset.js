var GAME = GAME || {};

/*
 * 
 *
 * @class
 */
GAME.Asset = function() {}

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

	GAME.Layers.assets.draw(args);
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
GAME.Asset.prototype.init = function() {
	this.tile = null;
	this.name = '';
	this.ascii = 'P';
	this.color = 'white';
	this.background = 'clear';
	// set graphical character
}