var Heroic = Heroic || {};

Heroic.RectangularPattern = function(args) {
	this.initialize(args);
}

Heroic.RectangularPattern.extend(Heroic.RegionPattern);

Heroic.RectangularPattern.prototype.maybeRecurse = function() {
	if( Math.random() > 0.72 ) {
		return true;
	}

	return false;
}

Heroic.RectangularPattern.prototype.maybeTerminate = function() {
	if( Math.random() > 0.70 ) {
		return true;
	}

	return false;
}

Heroic.RectangularPattern.prototype.realign = function() {
	var lastRegion = this.lastChild;

	this.shape.origin = {x: lastRegion.special['corner2'].x + this.shape.origin.x, y: lastRegion.special['corner2'].y + this.shape.origin.y};
	this.shape.terminus = {x: this.shape.origin.x + this.width, y: this.shape.origin.y + this.height};

	/*
	if( this.regions.length > 1 ) {
		var prevRegion = this.regions[this.regions.length - 2];
		var vertices = [];
		vertices.push(this.shape.origin);
		console.log(lastRegion.special);
		vertices.push({x: 20, y: 20});
		//vertices.push( prevRegion.sumPoints(this.shape.origin, lastRegion.special['corner2']) );
		var cornerRegion = this.region.addChild({shape: 'polygon', origin: {x: 0, y: 0}, vertices: vertices});
		//console.log(cornerRegion);

		// reconcile coordinates
		// create child region
		// merge prevRegion with new one?
	}
	*/
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

	recurseArgs.direction.rotate(sign * 45);

	var recurseRegion = new this.constructor(recurseArgs);
	this.regions = this.regions.concat(recurseRegion.regions);
}

Heroic.RectangularPattern.prototype.reduce = function() {
	// shorten or narrow?
}

Heroic.RectangularPattern.prototype.turn = function() {
	if( this.length > 0 ) {
		var sign = Math.round( Math.random() * 2 - 1 );
		this.direction.rotate(sign * 45);
	}

	this.lastChild.rotate(45 * this.direction.index);
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