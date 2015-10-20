var Heroic = Heroic || {};

/*
 * An extension of the Map class for testing/development purposes.
 */
Heroic.TestMap = function() {}

Heroic.TestMap.extend(Heroic.Map);

// randomly set wall tiles
Heroic.TestMap.prototype.generateNoise = function() {
	var args = [Heroic.Palette.wall];

	Heroic.Entities.terrain.toSome('set', args, 0.34);
}

Heroic.TestMap.prototype.fillGaps = function() {
	var args = [{
		mirror:		Heroic.Palette.wall
	}];
	var args2 = {
		percent:	0.5,
		type:		'wall'
	};

	Heroic.Entities.terrain.checkEach('set', args, this.tests.neighboredBy, args2);
	Heroic.Entities.terrain.toEach('fromMirror');
}

Heroic.TestMap.prototype.smoothEdges = function() {
	var args = [{
		mirror:		Heroic.Palette.open
	}];
	var args2 = {
		percent:	0.59,
		type:		'open'
	};

	Heroic.Entities.terrain.checkEach('set', args, this.tests.neighboredBy, args2);
	Heroic.Entities.terrain.toEach('fromMirror');
}

Heroic.TestMap.prototype.wallEdges = function() {
	var args = [Heroic.Palette.wall];

	Heroic.Entities.terrain.checkEach('set', args, this.tests.isEdge);
}

Heroic.TestMap.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.generateNoise();
	this.wallEdges();

	this.fillGaps();
	this.fillGaps();

	this.smoothEdges();
	this.smoothEdges();

	this.fillGaps();
	this.fillGaps();
	this.fillGaps();
	this.fillGaps();
}