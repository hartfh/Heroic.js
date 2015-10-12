var GAME = GAME || {};

/*
 * Represents terrain data within a tile.
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

// Unfinished, obviously
/*
 * Draws the terrain to the appropriate layer.
 */
GAME.Terrain.prototype.draw = function() {
	/*
	var args = {
		tile:			this.tile,
		color:			this.color,
		background:		this.background,
		character:		this.ascii
	};

	GAME.Layers.terrain.draw(args);
	*/
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