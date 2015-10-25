var Heroic = Heroic || {};

Heroic.TestStructures = function() {}

Heroic.TestStructures.extend(Heroic.Map);

Heroic.TestStructures.prototype.generateNoise = function() {
	//var args = [Heroic.Palette.wall];
	//Heroic.Entities.terrain.toSome('set', args, 0.013);
}

Heroic.TestStructures.prototype.expandWalls = function() {
	var args1 = [{x: 15, y: 15}, 10, 10];
	var args2 = [Heroic.Palette.wall];
	var region = this.createRegion('getRectangle', args1);
	region.toEach('set', args2);


	var args1 = [{x: 30, y: 15}, 10];
	var args2 = [Heroic.Palette.wall];
	var region = this.createRegion('getCircle', args1);
	region.toEach('set', args2);
}

Heroic.TestStructures.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.generateNoise();

	this.expandWalls();
}