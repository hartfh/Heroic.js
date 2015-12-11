var Heroic = Heroic || {};

Heroic.RectangularPattern = function(args) {
	this.initialize(args);
}

Heroic.RectangularPattern.extend(Heroic.RegionPattern);

Heroic.RectangularPattern.prototype.realign = function() {
	// move to terminus but adjust?
}

Heroic.RectangularPattern.prototype.reduce = function() {
	// shorten or narrow?
}

Heroic.RectangularPattern.prototype.turn = function() {
	var sign = Math.round( Math.random() * 2 - 1 );
	this.parent.direction.rotate( 90 * sign );
}

Heroic.RectangularPattern.prototype.maybeRecurse = function() {
	
}

Heroic.RectangularPattern.prototype.recurse = function() {
	var recurseArgs = {};
	var sign = Math.round( Math.random() * 2 - 1 );

	recurseArgs.direction = new Heroic.Direction( args.direction.index );
	recurseArgs.shape		= {
		shape:		this.shape.shape,
		origin:		{x: this.shape.origin.x,	y: this.shape.origin.y},
		terminus:	{x: this.shape.terminus.x,	y: this.shape.terminus.y},
	};
	recurseArgs.parent		= this.parent;
	recurseArgs.recursive	= this.recursive;

	recurseArgs.direction.rotate( 90 * sign );

	var recurseRegion = new this.constructor(recurseArgs);
	this.regions = this.regions.concat(recurseRegion.regions);
}

Heroic.RectangularPattern.prototype.maybeTerminate = function() {
	if( true ) {
		return true;
	}

	return false;
}