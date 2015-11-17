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

	/*
	// Grid testing
	var tiles = this.grid.getGrid({x: 5, y: 5}, 45, 35, 10, 25);
	for(var index in tiles) {
		var tile = tiles[index];

		args1 = [{x: tile.x, y: tile.y}, 5];
		args2 = [Heroic.Palette.wall];
		args3 = [Heroic.Palette.test1];
		//region = this.createRegion('getBlob', args1);
		region = this.createRegion('getCircle', args1);

		Heroic.Entities.map.regions.load(region);
		region.translate(-3, -3);
		region.edge.toEach('set', args2, 'terrain');
		region.interior.toEach('set', args3, 'terrain');
	}
	*/

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

	// Merge and Grow testing
	/*
	args1 = [{x: 5, y: 5}, 17, 7];
	args2 = [Heroic.Palette.wall];
	args3 = [Heroic.Palette.test1];

	region3 = this.createRegion('getRectangle', args1);
	Heroic.Entities.map.regions.load(region);
	region3.edge.toEach('set', args2, 'terrain');
	region3.interior.toEach('set', args3, 'terrain');

	args1 = [{x: 20, y: 15}, 8];

	region = this.createRegion('getBlob', args1);
	Heroic.Entities.map.regions.load(region);
	//region.grow();
	region.merge(region3);

	args1 = [{x: 30, y: 25}, 7];
	region2 = this.createRegion('getBlob', args1);
	Heroic.Entities.map.regions.load(region);

	region.merge(region2);
	region.edge.toEach('set', args2, 'terrain');
	region.interior.toEach('set', args3, 'terrain');
	*/

	// Grid of circles, merged
	/*
	args2 = [Heroic.Palette.wall];
	args3 = [Heroic.Palette.test1];

	//var tiles = this.grid.getGrid({x: 7, y: 5}, 30, 11, 10, 15);
	var tiles = this.grid.getRandomTiles(0.01);
	var circles = new Heroic.Region();
	circles.init();
	for(var index in tiles) {
		var tile = tiles[index];

		region = this.createRegion('getBlob', [{x: tile.x, y: tile.y}, 4]);

		if( circles.overlaps(region) || (index == 0) ) {
			circles.merge(region);
		}
	}
	circles.edge.toEach('set', args2, 'terrain');
	Heroic.Entities.map.regions.load(circles);
	circles.interior.toEach('set', args3, 'terrain');
	*/

	// Recursion
	/*
	args2 = [Heroic.Palette.wall];
	args3 = [Heroic.Palette.test1];

	var tile = this.grid.getRandomTile();
	var blobs = new Heroic.Region();
	blobs.init();

	// find a way to branch them a little better. also a way to give it directionality
	for(var i = 0; i < 15; i++) {
		blob = this.createRegion('getBlob', [{x: tile.x, y: tile.y}, 5]);
		blobs.merge(blob);
		tile = blobs.edge.getRandom();
	}

	blobs.edge.toEach('set', args2, 'terrain');
	Heroic.Entities.map.regions.load(blobs);
	blobs.interior.toEach('set', args3, 'terrain');
	*/

	// Recursion 2
	args2 = [Heroic.Palette.wall];
	args3 = [Heroic.Palette.test1];

	var tile = this.grid.getRandomTile();
	//var blobs = this.createRegion('getCircle', {origin: {x: 45, y: 45}, radius: 5}, {percent: 0.8, branches: 1, direction: 'n'});
	var blobs = this.createRegion('getRectangle', {origin: {x: 45, y: 45}, terminus: {x: 54, y: 49}}, {percent: 0.8, branches: 1, direction: 'e'});
	//var blobs = this.createRegion('getBlob', {origin: {x: 45, y: 45}, radius: 5}, {percent: 0.8, branches: 1, direction: 'ne'});
	//var blobs2 = this.createRegion('getBlob', [{x: 45, y: 45}, 5], {percent: 0.8, branches: 1, direction: 'w'});
	//var blobs3 = this.createRegion('getBlob', [{x: 45, y: 45}, 5], {percent: 0.8, branches: 1, direction: 's'});
	//blobs.merge(blobs2);
	//blobs.merge(blobs3);

	blobs.edge.toEach('set', args2, 'terrain');
	Heroic.Entities.map.regions.load(blobs);
	blobs.interior.toEach('set', args3, 'terrain');

}

Heroic.TestStructures.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.regions = new Heroic.Inventory();
	this.regions.init();

	this.generateNoise();

	this.testShapes();
}