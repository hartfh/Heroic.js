var GAME = GAME || {};


// Need some way to pass instructions through "each()" in order to keep behavior 
// within the Map classes and not in Terrain. Though not sure if this is really the way to go.

/*
 * An extension of the Map class for testing purposes.
 */
GAME.TestMap = function() {}

GAME.TestMap.extend(GAME.Map);

GAME.TestMap.prototype.generateNoise = function() {
	// randomly set wall tiles

	var args = [GAME.Palette.wall];

	GAME.Entities.terrain.toSome('setProperty', args, 0.5);
}

GAME.TestMap.prototype.wallEdges = function() {
	var args = [GAME.Palette.wall];

	GAME.Entities.terrain.checkEach('setProperty', args, 'isEdge');
}

GAME.TestMap.prototype.init = function() {
	this.grid = new GAME.Grid();
	this.grid.init();
	this.generateNoise();
	this.wallEdges();
}