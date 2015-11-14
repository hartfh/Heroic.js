var Heroic = Heroic || {};

Heroic.TestStructures = function() {}

Heroic.TestStructures.extend(Heroic.Map);

Heroic.TestStructures.prototype.generateNoise = function() {
	//var args = [Heroic.Palette.wall];
	//Heroic.Entities.terrain.toSome('set', args, 0.013);
}

Heroic.TestStructures.prototype.testShapes = function() {
	
	var args1, args2, args3, region;

	/*
	args1 = [{x: 25, y: 15}, 6, false];
	args2 = [Heroic.Palette.wall];
	args3 = [Heroic.Palette.test1];
	region = this.createRegion('getBlob', args1);

	Heroic.Entities.map.regions.load(region);
	region.edge.toEach('set', args2, 'terrain');
	region.interior.toEach('set', args3, 'terrain');
	*/

	/*
	// Line Testing
	var tiles = this.grid.getLine({x: 7, y: 7}, {x: 40, y: 24});
	for(var index in tiles) {
		var tile = tiles[index];

		//args1 = [{x: tile.x, y: tile.y}, 7];
		//args2 = [Heroic.Palette.wall];
		//region = this.createRegion('getCircle', args1);

		args1 = [{x: tile.x, y: tile.y}, 6, 6];
		args2 = [Heroic.Palette.wall];
		region = this.createRegion('getRectangle', args1);

		Heroic.Entities.map.regions.load(region);
		region.edge.toEach('set', args2, 'terrain');
	}
	*/

	// Grid testing
	var tiles = this.grid.getGrid({x: 5, y: 5}, 45, 35, 7, 25);
	for(var index in tiles) {
		var tile = tiles[index];

		args1 = [{x: tile.x, y: tile.y}, 3];
		args2 = [Heroic.Palette.wall];
		args3 = [Heroic.Palette.test1];
		//region = this.createRegion('getBlob', args1);
		region = this.createRegion('getCircle', args1);

		Heroic.Entities.map.regions.load(region);
		region.edge.toEach('set', args2, 'terrain');
		region.interior.toEach('set', args3, 'terrain');
	}

	/*
	// Grid dots
	args1 = [{x: 13, y: 3}, 42, 30, 5, 15];
	args3 = [Heroic.Palette.test1];
	region = this.createRegion('getGrid', args1);
	region.edge.toEach('set', args3, 'terrain');
	*/

	/*
	// Blob testing
	var tiles = this.grid.getRandomTiles(0.004);
	for(var index in tiles) {
		var tile = tiles[index];

		args1 = [{x: tile.x, y: tile.y}, 6];
		args2 = [Heroic.Palette.wall];
		args3 = [Heroic.Palette.test1];
		region = this.createRegion('getBlob', args1);

		Heroic.Entities.map.regions.load(region);
		region.edge.toEach('set', args2, 'terrain');
		region.interior.toEach('set', args3, 'terrain');
	}
	*/
}

Heroic.TestStructures.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.regions = new Heroic.Inventory();
	this.regions.init();

	this.generateNoise();

	this.testShapes();
}