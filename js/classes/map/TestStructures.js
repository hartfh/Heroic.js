var Heroic = Heroic || {};

Heroic.TestStructures = function() {}

Heroic.TestStructures.extend(Heroic.Map);

Heroic.TestStructures.prototype.generateNoise = function() {
	//var args = [Heroic.Palette.wall];
	//Heroic.Entities.terrain.toSome('set', args, 0.013);
}

Heroic.TestStructures.prototype.testShapes = function() {
	
	var args1, args2, region;

	args1 = [{x: 20, y: 20}, 6, true];
	args2 = [Heroic.Palette.wall];
	region = this.createRegion('getBlob', args1);
	region.toEach('set', args2);
	/*

	args1 = [{x: 20, y: 20}, 10, 10];
	args2 = [Heroic.Palette.wall];
	region = this.createRegion('getRectangle', args1);
	region.toEach('set', args2);

	args1 = [{x: 34, y: 15}, 13];
	args2 = [Heroic.Palette.wall];
	region = this.createRegion('getCircle', args1);
	region.toEach('set', args2);

	args1 = [{x: 5, y: 5}, {x: 11, y: 30}];
	args2 = [Heroic.Palette.wall];
	region = this.createRegion('getLine', args1);
	region.toEach('set', args2);
	*/

	//args2 = [Heroic.Palette.wall];
	//region = this.createRegion('getRandomTiles', [0.01]);
	//region.toEach('set', args2);

	/*
	var tiles = this.grid.getRandomTiles(0.005);
	for(var index in tiles) {
		var tile = tiles[index];

		var args1 = [{x: tile.x, y: tile.y}, 4];
		var args2 = [Heroic.Palette.wall];
		var region = this.createRegion('getCircle', args1);
		region.toEach('set', args2);
	}
	*/
}

Heroic.TestStructures.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.generateNoise();

	this.testShapes();
}