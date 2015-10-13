var GAME = GAME || {};

/*
 * An extension of the Map class for testing purposes.
 */
GAME.TestMap = function() {}

GAME.TestMap.extend(GAME.Map);

GAME.TestMap.prototype.generateNoise = function() {
	// randomly set wall tiles

	// get tile and modify the terrain. This is new functionality I think

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