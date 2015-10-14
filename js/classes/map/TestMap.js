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

	var args = [{
		ascii:			'X',
		background: 	'white',
		color:			'black'
	}];

	GAME.Entities.terrain.each('setProperty', args);
}

GAME.TestMap.prototype.init = function() {
	this.grid = new GAME.Grid();
	this.grid.init();
	//this.generateNoise();
}