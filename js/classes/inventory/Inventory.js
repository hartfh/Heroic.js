var Heroic = Heroic || {};

// Note: Is there a way to create multiple other inventories (sub-inventories) that have assets added
// and removed from them often in order to facilitate accessing certain subsets of assets (rather than
// having to loop through and test them).

/*
 * Serves as a collection of assets and provides means for accessing them.
 * 
 * @class
 */
Heroic.Inventory = function() {}

/*
 * Add an object to this inventory.
 */
Heroic.Inventory.prototype.load = function(asset) {
	if( typeof(asset) == 'object' ) {
		if( this.contents.indexOf(asset) == -1 ) {
			this.contents.push(asset);
		}
	}
}

/*
 * Remove an object from this inventory.
 */
Heroic.Inventory.prototype.unload = function(ID) {
	// How do we reference each object?
}

/*
 * Loop through this inventory and apply command to each asset.
 * 
 * @param	{string}	command		Method to invoke
 * @param	{array}		args		Array of arguments
 */
Heroic.Inventory.prototype.toEach = function(command, args) {
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
 * @param	{array}		args		Array of arguments for "command" parameter
 * @param	{string}	condition	Method to test condition
 * @param	{mixed}		args2		Optional arguments for "condition" parameter
 */
Heroic.Inventory.prototype.checkEach = function(command, args, condition, args2) {
	if( typeof(args2) == 'undefined' ) {
		var args2 = null;
	}

	this.contents.forEach(function(object, index) {
		if( condition(object, args2) ) {
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
Heroic.Inventory.prototype.toSome = function(command, args, percent) {
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
Heroic.Inventory.prototype.get = function(ID) {
	// Figure out how to reference the object in the array (assign them some ID?)
}

Heroic.Inventory.prototype.init = function() {
	 this.contents = [];
}