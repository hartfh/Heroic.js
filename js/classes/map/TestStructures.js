var Heroic = Heroic || {};

Heroic.TestStructures = function() {}

Heroic.TestStructures.extend(Heroic.Map);

Heroic.TestStructures.prototype.generateNoise = function() {
	var args = [Heroic.Palette.wall];
	Heroic.Entities.terrain.toSome('set', args, 0.013);
}

Heroic.TestStructures.prototype.expandWalls = function() {
	var region = this.createRegion('getRectangularArea', [{x: 5, y: 5}, 10, 10]);
	var args = [Heroic.Palette.wall];
	region.toEach('set', args);

	var region = this.createRegion('getCircularArea', [{x: 20, y: 15}, 10]);
	var args = [Heroic.Palette.wall];
	region.toEach('set', args);
}

Heroic.TestStructures.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.generateNoise();

	this.expandWalls();
}