var GAME = GAME || {};


// Need some way to pass instructions through "each()" in order to keep behavior 
// within the Map classes and not in Terrain. Though not sure if this is really the way to go.

/*
 * An extension of the Map class for testing purposes.
 */
GAME.TestMap = function() {}

GAME.TestMap.extend(GAME.Map);

// randomly set wall tiles
GAME.TestMap.prototype.generateNoise = function() {
	var args = [GAME.Palette.wall];

	GAME.Entities.terrain.toSome('setProperty', args, 0.5);
}

// Need a collection of test functions that can be passed through checkEach(). This
// keeps the checking methods housed within this Map subclass and not polluting Terrain.
// Can possibly move this up to Map class and just keep application of tests in subclass.
GAME.TestMap.prototype.tests = {
	isEdge:			function(terrain) {
		return terrain.tile.isEdge();
	},
	fill:			function(terrain) {

	}
}

GAME.TestMap.prototype.fillGaps = function() {
	var args = [{
		
	}];

	//GAME.Entities.terrain.checkEach('setProperty', args, this.tests.fill);

	//each 'fromMirror'
}

// rename this
GAME.TestMap.prototype.wallEdges = function() {
	var args = [GAME.Palette.wall];

	GAME.Entities.terrain.checkEach('setProperty', args, this.tests.isEdge);
}

GAME.TestMap.prototype.init = function() {
	this.grid = new GAME.Grid();
	this.grid.init();

	this.generateNoise();
	this.wallEdges();
	this.fillGaps();
}