var Heroic = Heroic || {};

/*
 * An extension of the Map class for testing/development purposes.
 */
Heroic.TestMap = function() {}

Heroic.TestMap.extend(Heroic.Map);

// randomly set wall tiles
Heroic.TestMap.prototype.generateNoise = function() {
	var args = [Heroic.Palette.wall];

	Heroic.Entities.terrain.toSome('setProperty', args, 0.31);
}

Heroic.TestMap.prototype.fillGaps = function() {
	var args = [{
		mirror:		Heroic.Palette.wall
	}];
	var args2 = {
		percent:	0.4,
		type:		'wall'
	};

	Heroic.Entities.terrain.checkEach('setProperty', args, this.tests.neighboredBy, args2);
	Heroic.Entities.terrain.toEach('fromMirror');

	args = [{
		mirror:		Heroic.Palette.open
	}];
	args2 = {
		percent:	0.7,
		type:		'open'
	};

	Heroic.Entities.terrain.checkEach('setProperty', args, this.tests.neighboredBy, args2);
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