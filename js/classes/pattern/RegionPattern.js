var Heroic = Heroic || {};

Heroic.RegionPattern = function(args) {
	this.initialize(args);
};

/*
 * 
 * 
 * 
 * @param	{Object}	args.parent		Region object
 */
Heroic.RegionPattern.prototype.initialize = function(args) {
	if( typeof(args.recursive) == 'undefined'  ) {
		args.recursive = false;
	}
	if( typeof(args.direction) == 'undefined' ) {
		args.direction = new Heroic.Direction();
	}
	if( typeof(args.depth) == 'undefined' ) {
		args.depth = 1;
	}

	this.parent		= args.parent;
	this.shape		= args.shape;
	this.direction	= args.direction;
	this.lastChild	= false;
	this.continue	= true;
	this.regions	= [];
	this.recursive	= args.recursive;

	//this.depth		= args.depth; // limit to max depth = 3?
	//this.branches	= 0; // limit to 2 or 3 branches?
	this.length		= 0;
	//this.maxLength	= 0;

	//this.setExtras(); ????

	// continue and recurse
	while( this.continue ) {
		var region = this.parent.addChild(this.shape);

		this.length++;
		this.lastChild = region;
		this.regions.push(region);
		this.realign();

		if( this.recursive ) {
			if( this.maybeRecurse() ) {
				this.recurse(args);
			}
		}
		if( this.maybeTerminate() ) {
			this.terminate();
		} else {
			this.reduce();
			this.turn();
		}
	}

	// merge all regions
	var length		= this.regions.length;
	var firstRegion	= this.regions[0];

	for(var i = length - 1; i > 0; i--) {
		var region = this.regions[i];

		firstRegion.mergeWith(region);
		this.regions.pop();
	}

	firstRegion.calcTerminus();
	firstRegion.patch();
	firstRegion.calcEdge();
}

Heroic.RegionPattern.prototype.terminate = function() {
	this.continue = false;
}

// Abstract methods
Heroic.RegionPattern.prototype.maybeRecurse		= function() {}
Heroic.RegionPattern.prototype.maybeTerminate	= function() {}
Heroic.RegionPattern.prototype.realign			= function() {}
Heroic.RegionPattern.prototype.recurse			= function(args) {}
Heroic.RegionPattern.prototype.reduce			= function() {}
Heroic.RegionPattern.prototype.turn				= function() {}
//Heroic.RegionPattern.prototype.setExtras	= function() {}