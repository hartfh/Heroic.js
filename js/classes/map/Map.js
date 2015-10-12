var GAME = GAME || {};

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
GAME.Map = function() {}


// This can actually be removed. Functionality already exists in Terrain.
/*
 * Define and set the initial visual properties for tiles.
 */
GAME.Map.prototype.setBase = function(args) {
	var args = [{
		ascii:			'.',
		color:			'white',
		background:		'black'
	}];

	this.grid.each('setProperty', args);
}

/*
 * Setup the Map by creating a new Grid and modifying it according to Map type.
 *
 * @return	void
 */
GAME.Map.prototype.init = function() {
	this.grid = new GAME.Grid();
	this.grid.init();
	// do stuff to this.grid
}