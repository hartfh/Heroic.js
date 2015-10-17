var Heroic = Heroic || {};


// Need some way to pass instructions through "each()" in order to keep behavior 
// within the Map classes and not in Terrain. Though not sure if this is really the way to go.

/*
 * An extension of the Map class for testing purposes.
 */
Heroic.TestMap = function() {}

Heroic.TestMap.extend(Heroic.Map);

// randomly set wall tiles
Heroic.TestMap.prototype.generateNoise = function() {
	var args = [Heroic.Palette.wall];

	Heroic.Entities.terrain.toSome('setProperty', args, 0.31);
}

// Need a collection of test functions that can be passed through checkEach(). This
// keeps the checking methods housed within this Map subclass and not polluting Terrain.
// Can possibly move this up to Map class and just keep application of tests in subclass.
Heroic.TestMap.prototype.tests = {
	isEdge:			function(terrain) {
		return terrain.tile.isEdge();
	},
	fill:			function(terrain) {
		var walls		= 0;
		var borderTiles	= terrain.tile.getBorder();
		var empty		= 8 - borderTiles.length;

		borderTiles.forEach(function(elem, index) {
			if( elem.terrain.type == 'wall' ) {
				walls++;
			}
		});

		walls += empty;

		if( (walls / 8) > 0.4 ) {
			return true;
		}

		return false;
	},
	smooth:			function(terrain) {
		var walls		= 0;
		var borderTiles	= terrain.tile.getBorder();
		var empty		= 8 - borderTiles.length;

		borderTiles.forEach(function(elem, index) {
			if( elem.terrain.type == 'open' ) {
				walls++;
			}
		});

		walls += empty;

		if( (walls / 8) > 0.7 ) {
			return true;
		}

		return false;
	}
}

Heroic.TestMap.prototype.fillGaps = function() {
	var args = [{
		mirror:		Heroic.Palette.wall
	}];

	Heroic.Entities.terrain.checkEach('setProperty', args, this.tests.fill);
	Heroic.Entities.terrain.toEach('fromMirror');

	var args = [{
		mirror:		Heroic.Palette.open
	}];

	Heroic.Entities.terrain.checkEach('setProperty', args, this.tests.smooth);
	Heroic.Entities.terrain.toEach('fromMirror');
}

// rename this
Heroic.TestMap.prototype.wallEdges = function() {
	var args = [Heroic.Palette.wall];

	Heroic.Entities.terrain.checkEach('setProperty', args, this.tests.isEdge);
}

Heroic.TestMap.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.generateNoise();
	this.wallEdges();
	this.fillGaps();
	this.fillGaps();
	this.fillGaps();
	this.fillGaps();
}