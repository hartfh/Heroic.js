var Heroic = Heroic || {};

Heroic.OrganicPattern = function(args) {
	this.initialize(args);
}

Heroic.OrganicPattern.extend(Heroic.RegionPattern);

Heroic.OrganicPattern = function(args) {
	this.initialize(args);
}

Heroic.OrganicPattern.extend(Heroic.RegionPattern);

Heroic.OrganicPattern.prototype.realign = function() {
	var last = this.lastChild;
	var newPoint = last.edge[this.direction.index][0];
	this.shape.origin = last.sumPoints(newPoint, last.offset);
}

Heroic.OrganicPattern.prototype.reduce = function() {
	if( this.shape.radius > 2 ) {
		if( Math.random() > 0.5 ) {
			this.shape.radius--;
		}
	}
}

Heroic.OrganicPattern.prototype.turn = function() {
	var sign = Math.round( Math.random() * 2 - 1 );
	this.direction.rotate( 45 * sign );
}

Heroic.OrganicPattern.prototype.maybeRecurse = function() {
	if( Math.random() > 0.83 ) {
		return true;
	}

	return false;
}

Heroic.OrganicPattern.prototype.recurse = function(args) {
	// copy args by value
	var recurseArgs = {};
	var sign = Math.round( Math.random() * 2 - 1 );

	recurseArgs.direction	= new Heroic.Direction( this.direction.index );
	recurseArgs.depth		= args.depth++;
	recurseArgs.shape		= {
		shape:		this.shape.shape,
		origin:		{x: this.shape.origin.x, y: this.shape.origin.y},
		radius:		this.shape.radius
	};
	recurseArgs.parent		= this.parent;
	recurseArgs.recursive	= this.recursive;

	recurseArgs.direction.rotate(45 * sign);

	var recurseRegion = new this.constructor(recurseArgs);
	this.regions = this.regions.concat(recurseRegion.regions);
}

Heroic.OrganicPattern.prototype.maybeTerminate = function() {
	if( this.shape.radius == 2 ) {
		if( Math.random() > 0.2 ) {
			return true;
		}
	}

	return false;
}