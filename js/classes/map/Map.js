var GAME = GAME || {};

// Figure out what general functionality should go here. Then implement specific stuff in child classes.

/*
 * Acts as an algorithm for generating terrain on a Grid.
 * 
 * @class
 */
GAME.Map = function() {}

/*
 * Setup the Map by creating a new Grid and modifying it according to Map type.
 *
 * @param	{string}	type of map??
 * @return	void
 */
GAME.Map.prototype.init = function() {
	this.grid = new GAME.Grid();
	this.grid.init();
	// do stuff to this.grid
}