var GAME = GAME || {};

// Note: Is there a way to create multiple other inventories (sub-inventories) that have assets added
// and removed from them often in order to facilitate accessing certain subsets of assets (rather than
// having to loop through and test them).

/*
 * Serves as a collection of assets and provides means for accessing them.
 * 
 * @class
 */
GAME.Inventory = function() {}

/*
 * Add an object to this inventory.
 */
GAME.Inventory.prototype.load = function(asset) {
	if( typeof(asset) == 'object' ) {
		if( asset instanceof GAME.Asset ) {
			this.contents.push(asset);
		}
	}
}

/*
 * Remove an object from this inventory.
 */
GAME.Inventory.prototype.unload = function(ID) {
	// How do we reference the object?
}

/*
 * Loop through this inventory and apply command to each asset.
 * 
 * @param	{string}	command		Method to invoke
 * @param	{array}		args		Array of arguments
 */
GAME.Inventory.prototype.toEach = function(command, args) {
	if( typeof(args) == 'undefined' ) {
		var args = [];
	}

	this.contents.forEach(function(object, index) {
		object[command].apply(object, args);
	});
}

/*
 * Loop through this inventory and apply command to each asset if it meets a condition.
 *
 * @param	{string}	command		Method to invoke
 * @param	{array}		args		Array of arguments
 * @param	{string}	condition	Method to test condition
 */
GAME.Inventory.prototype.checkEach = function(command, args, condition) {
	this.contents.forEach(function(object, index) {
		if( condition(object) ) {
			object[command].apply(object, args);
		}
	});
}

/*
 * Loop through this inventory and apply command to random assets.
 * 
 * @param	{string}	command		Method to invoke
 * @param	{array}		args		Array of arguments
 * @param	{float}		percent		Chance to have each tile be affected
 */
GAME.Inventory.prototype.toSome = function(command, args, percent) {
	var rand;

	if( typeof(args) == 'undefined' ) {
		var args = [];
	}

	this.contents.forEach(function(object, index) {
		rand = Math.random();

		if( rand < percent ) {
			object[command].apply(object, args);
		}
	});
}

/*
 * Returns an object from the inventory based on its ID
 */
GAME.Inventory.prototype.get = function(ID) {
	// Figure out how to reference the object in the array (assign them some ID?)
}

GAME.Inventory.prototype.init = function() {
	 this.contents = [];
}