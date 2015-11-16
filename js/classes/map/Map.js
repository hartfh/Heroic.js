var Heroic = Heroic || {};

// Figure out what general functionality should go here. Then implement specific stuff in child classes.

/*
Notes:
0.) Set tiles to base ASCII, colors
1.) Seed map tiles with walls/solid tiles
2.) Run filtering process to create caves
X.) Create room locations (determine size)?
Y.) Join rooms

Parent Class Methods:
setBase()
createRoom()

*/


/*
 * Acts as an algorithm for generating terrain on a Grid.
 * 
 * @class
 */
Heroic.Map = function() {}

/*
 * 
 */
Heroic.Map.prototype.createRegion = function(pattern, args, recursive) {
	if( typeof(recursive) == 'undefined' ) {
		var recursive = false;
	}

	var region, tiles;

	region = new Heroic.Region();
	region.init();

	tiles = Heroic.Entities.map.grid[pattern].apply(Heroic.Entities.map.grid, args);
	region.load(tiles);

	if( recursive ) {
		if( Math.random() < recursive.percent ) {
			console.log('recursed');
			var subTile, subRegion, subRecursive

			subRecursive = recursive;

			/*
			// some way to increase the number of branches each time
			if( Math.random() < ( 0.1 / subRecursive.branches ) ) {
				console.log('incrementing branches');
				if( subRecursive.branches < 5 ) {
					//subRecursive.branches++;
				}
			}
			*/

			for(var i = 0; i < recursive.branches; i++) {
				// -need to modify Tile in args. Args needs to be changed to be a JSON object
				subTile = region.edge.getRandom();
				args[0] = subTile;

				// -need to add directionality to "recursive" parameter

				subRegion = this.createRegion(pattern, args, subRecursive);
				region.merge(subRegion);
			}
		}
	}

	return region;
}

/*
 * Holds a collection of methods used to evaluate the characteristics of a terrain's tile. Each
 * methods returns true or false and is used in conjunction with the Inventory method checkEach()
 * to conditionally modify the map. Actual application of the "test" methods occurs in child
 * classes of this one.
 */
Heroic.Map.prototype.tests = {
	/*
	 * Determine if a terrain's tile is on the edge of the map.
	 *
	 * @param	{Object}	terrain		Terrain object to test
	 */
	isEdge:			function(terrain) {
		return terrain.tile.isEdge();
	},
	/*
	 * Determine if the number of neighboring tiles exceed a percentage of a certain type.
	 * 
	 * @param	{Object}	terrain			Terrain object to test
	 * @param	{Object}	args			Objects of arguments
	 * @param	{string}	args.type		Pallete type
	 * @param	{float}		args.percent	Percent threshold to exceed to return true
	 */
	neighboredBy:			function(terrain, args) {
		if( typeof(args) != 'object' ) {
			var args = {
				percent:		1,
				type:			'unknown'
			}
		}

		var	neighbors	= 0;
		var borderTiles	= terrain.tile.getBorders();
		//var emptyTiles	= 8 - borderTiles.length;

		borderTiles.forEach(function(tile, index) {
			if( tile.terrain.type == args.type ) {
				neighbors++;
			}
		});

		//neighbors += emptyTiles;

		if( (neighbors / borderTiles.length) >= args.percent ) {
			return true;
		}

		return false;
	}
}

/*
 * Setup the Map by creating a new Grid and modifying it according to Map type.
 *
 * @return	void
 */
Heroic.Map.prototype.init = function() {
	this.grid = new Heroic.Grid();
	this.grid.init();

	this.regions = new Heroic.Inventory();
	this.regions.init();
}