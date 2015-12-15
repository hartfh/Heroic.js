var Heroic = Heroic || {};

Heroic.RectangularPattern = function(args) {
	this.initialize(args);
}

Heroic.RectangularPattern.extend(Heroic.RegionPattern);

Heroic.RectangularPattern.prototype.maybeRecurse = function() {
	if( Math.random() > 1.8 ) {
		return true;
	}

	return false;
}

Heroic.RectangularPattern.prototype.maybeTerminate = function() {
	if( Math.random() > 0.4 ) {
		return true;
	}

	return false;
}

Heroic.RectangularPattern.prototype.realign = function() {
	this.shape.origin = {x: this.shape.terminus.x, y: this.shape.terminus.y};
	this.shape.terminus = {x: this.shape.origin.x + this.lastChild.terminus.x, y: this.shape.origin.y + this.lastChild.terminus.y};
}

Heroic.RectangularPattern.prototype.recurse = function(args) {
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

Heroic.RectangularPattern.prototype.reduce = function() {
	// shorten or narrow?
}

Heroic.RectangularPattern.prototype.turn = function() {
	//var sign = Math.round( Math.random() * 2 - 1 );
	//this.parent.direction.rotate( 90 * sign );

	if( this.length > 0 ) {
		this.lastChild.rotate(45);
	}

	//var lastOrigin = this.shape.origin;
	//var lastTerminus = this.shape.terminus;
	//this.shape.terminus = {x: lastTerminus.y, y: lastTerminus.x};
}