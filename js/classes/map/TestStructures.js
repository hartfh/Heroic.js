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




	// perhaps modify Inventory.load to allow for array of objects
	var tempInventory = new Heroic.Inventory();
	tempInventory.init();

	var circlePoints = getCircularArea({x: 16, y: 12}, 10);
	
	for(var index in circlePoints) {
		var point = circlePoints[index];

		var tile = Heroic.Entities.map.grid.getTile(point['x'], point['y']);

		tempInventory.load( tile.terrain );
	}
	
	var args = [Heroic.Palette.wall];

	tempInventory.toEach('set', args);
}

Heroic.TestStructures.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.generateNoise();

	this.expandWalls();
}