var GAME = GAME || {};

GAME.Terrain = function() {}

GAME.Terrain.extend(GAME.Asset);

/*
 * Copies type property value to mirror.
 *
 * @return void
 */
GAME.Terrain.prototype.toMirror = function() {
	this.mirror = this.type;
}

/*
 * Copies mirror property value to type.
 *
 * @return void
 */
GAME.Terrain.prototype.fromMirror = function() {
	this.type = this.mirror;
}

/*
 * Sets up terrain properties.
 *
 * @return void
 */
GAME.Asset.prototype.init = function(tile) {
	this.tile		= null;
	this.ascii		= '.';
	this.color		= 'white';
	this.background	= 'black';
	this.layer		= GAME.Layers.terrain;
	this.tile		= tile;
}