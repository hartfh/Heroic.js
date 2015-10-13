var GAME = GAME || {};

/*
 * Serves as a collection of assets and provides means for accessing them.
 * 
 * @class
 */
GAME.Inventory = function() {}

/*
 *  Add an object to this inventory.
 */
GAME.Inventory.prototype.load = function(asset) {
	if( typeof(asset) == 'object' ) {
		if( asset instanceof GAME.Asset ) {
			this.contents.push(asset);
		}
	}
}

/*
 *  Remove an object from this inventory.
 */
GAME.Inventory.prototype.unload = function(ID) {
	// How do we reference the object?
}

/*
 *  Loop through this inventory and apply command to each object
 */
GAME.Inventory.prototype.each = function(command, args) {
	if( typeof(args) == 'undefined' ) {
		var args = [];
	}

	this.contents.forEach(function(object, index) {
		object[command].apply(object, args);
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