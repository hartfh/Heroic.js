var Heroic = Heroic || {};

Heroic.TestStructures = function() {}

Heroic.TestStructures.extend(Heroic.Map);

Heroic.TestStructures.prototype.generateNoise = function() {
	var args = [Heroic.Palette.wall];

	Heroic.Entities.terrain.toSome('set', args, 0.013);
}

Heroic.TestStructures.prototype.expandWalls = function() {
	// determine structure size and position relative to center point
	// set tiles around the center point
}

Heroic.TestStructures.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.generateNoise();

	this.expandWalls();
}