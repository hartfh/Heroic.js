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
	if( Math.random() > 0.65 ) {
		return true;
	}

	return false;
}

Heroic.RectangularPattern.prototype.realign = function() {
	var lastRegion = this.lastChild;

	//this.shape.origin = {x: this.shape.origin.x + this.width, y: this.shape.origin.y + this.height};
	//var lastPoint = lastRegion.randomPoint(2);



	//this.shape.origin = {x: this.shape.origin.x + this.width, y: this.shape.origin.y + this.height};
	//this.shape.terminus = {x: this.shape.origin.x + this.width, y: this.shape.origin.y + this.height};
	console.log(lastRegion.correction);
	this.shape.origin = {x: lastRegion.special['endpoint'].x + this.shape.origin.x, y: lastRegion.special['endpoint'].y + this.shape.origin.y};
	//console.log(this.shape.origin);
	this.shape.terminus = {x: this.shape.origin.x + this.width, y: this.shape.origin.y + this.height};
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
	recurseArgs.parent		= this;
	recurseArgs.region		= this.region;
	recurseArgs.recursive	= this.recursive;

	recurseArgs.direction.rotate( 90 * sign );

	var recurseRegion = new this.constructor(recurseArgs);
	this.regions = this.regions.concat(recurseRegion.regions);
}

Heroic.RectangularPattern.prototype.reduce = function() {
	// shorten or narrow?
}

Heroic.RectangularPattern.prototype.turn = function() {
	if( this.length > 0 ) {
		if( Math.random() > 0.00 ) {
			this.direction.rotate(45);
			this.lastChild.rotate(45 * this.direction.index);
		}
	}
}

Heroic.RectangularPattern.prototype.setExtras = function() {
	
	if( this.depth == 0 ) {
		this.height	= this.shape.terminus.y - this.shape.origin.y;
		this.width	= this.shape.terminus.x - this.shape.origin.x;
	} else {
		this.height	= this.parent.height;
		this.width	= this.parent.width;
	}
}