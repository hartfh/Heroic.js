var GAME = GAME || {};

GAME.Terrain = function() {}

GAME.Terrain.extend(GAME.Asset);

/*
 * Sets up terrain properties.
 *
 * @return void
 */
GAME.Terrain.prototype.init = function(tile) {
	this.tile		= null;
	this.ascii		= '.';
	this.color		= 'white';
	this.background	= 'black';
	this.layer		= GAME.Layers.terrain;
	this.tile		= tile;
}