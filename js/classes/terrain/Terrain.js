var GAME = GAME || {};

/*
 * Represents terrain within a tile.
 *
 * @class
 */
GAME.Terrain = function() {}

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

GAME.Terrain.prototype.init = function(x, y) {
	this.type		= '';
	this.mirror		= '';
	this.ascii		= '.';
	this.background	= 'black';
	this.color		= 'white';
	//this.status
	this.tile		= GAME.Grid.getTile(x, y);
}