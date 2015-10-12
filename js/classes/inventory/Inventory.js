var GAME = GAME || {};

GAME.Inventory = function() {}

/*
 *  Add an object to this inventory
 */
GAME.Inventory.prototype.load = function(asset) {
	if( typeof(asset) == 'object' ) {
		if( asset instanceof GAME.Asset || asset instanceof GAME.Terrain ) {
			this.contents.push(asset);
		}
	}
}

/*
 *  Remove an object from this inventory
 */
GAME.Inventory.prototype.unload = function(ID) {
	// How do we reference the object?
}

/*
 *  Loop through this inventory and apply command to each object
 */
GAME.Inventory.prototype.each = function(command) {
	this.contents.forEach(function(object, index) {

	});
}

/*
 *  Returns an object from the inventory based on its ID
 */
GAME.Inventory.prototype.get = function(ID) {
	// Figure out how to reference the object in the array (assign them some ID?)
}

GAME.Inventory.prototype.init = function() {
	 this.contents = [];
}



// Have an inventory for each of Terrain, Characters, Items