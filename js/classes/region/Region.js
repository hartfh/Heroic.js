var Heroic = Heroic || {};

/*
 * 
 * 
 * @param	{Object}	args	Contains parameters for defining a shape (shape, origin, terminus, radius, direction)
 */
Heroic.Region = function(args, parent) {
	if( typeof(args) != 'object' ) {
		return false;
	}
	if( typeof(parent) == 'undefined' ) {
		var parent = false;
	}

	this.origin		= args.origin;	// keep reference to one of parent's points
	this.terminus	= {};
	this.points		= [];
	this.edge		= [];
	this.interior	= [];
	this.quadrants	= [];
	this.children	= [];
	this.offset		= {x: 0, y: 0};	// keeps track of offset from parent. gets updated whenever region moves or changes size
	this.correction	= {x: 0, y: 0};
	this.parent		= parent;

	this.calcShape(args);
}

/*
 * 
 */
Heroic.Region.prototype.master = function() {
	// ?????
}

Heroic.Region.prototype.calcShape = function(args) {
	var shapes = ['circle', 'rectangle', 'grid', 'line', 'blob'];
	var self = this;

	if( shapes.indexOf(args.shape) != -1 ) {
		this[args.shape].apply(this, [args]);

		this.calcTerminus();
		this.calcEdge();

		if( !this.parent ) {
			this.master();
		} else {
			this.calcOffset();
		}

		for(var index in Heroic.Direction.key) {
			this.quadrants.push([]);
		}

		// determine which quadrant each point is part of
		this.each(function(x, y) {
			var quadrant = self.calcQuadrant(x, y);
			self.quadrants[quadrant].push({x: x, y: y});
		});
	}
}

Heroic.Region.prototype.calcQuadrant = function(x, y) {
	var slope, horz, vert;

	// find approximate center
	var width	= this.terminus.x;
	var height	= this.terminus.y;

	var centerX = width * 0.5;
	var centerY = height * 0.5;

	var rise	= y - centerY;
	var run		= x - centerX;

	// avoid Divide by Zero error
	if( run != 0) {
		slope = rise / run;
		slope = Math.abs(slope);
	} else {
		slope = 999;
	}

	// cases where tile is aligned with center point
	if( x == centerX ) {
		if( y < centerY ) {
			return 0;
		} else {
			return 4;
		}
	}
	if( y == centerY ) {
		if( x < centerX ) {
			return 6;
		} else {
			return 2;
		}
	}

	if( y < centerY ) {
		// North
		vert = 0;
	}
	if( y > centerY ) {
		// South
		vert = 4;
	}
	if( x < centerX ) {
		// West
		horz = 6;
	}
	if( x > centerX ) {
		// East
		horz = 2;
	}

	if( slope > 2.41 ) {
		return vert;
	} else if( slope < 0.41 ) {
		return horz;
	} else {
		if( vert === 0 ) {
			if( horz == 6 ) {
				// North-West
				return 7;
			} else {
				// North-East
				return 1;
			}
		} else {
			if( horz == 6 ) {
				// South-West
				return 5;
			} else {
				// South-East
				return 3;
			}
		}
	}
}

Heroic.Region.prototype.rectangle = function(args) {
	var width	= args.terminus.x - args.origin.x;
	var height	= args.terminus.y - args.origin.y;

	var start	= {x: false, y: false};
	var end		= {x: false, y: false};

	if( height < 0 ) {
		start.y	= args.terminus.y;
		end.y	= args.origin.y;
		height	= Math.abs(height);
	} else {
		start.y	= args.origin.y;
		end.y	= args.terminus.y;
	}

	if( width < 0 ) {
		start.x	= args.terminus.x;
		end.x	= args.origin.x;
		width	= Math.abs(width);
	} else {
		start.x	= args.origin.x;
		end.x	= args.terminus.x;
	}

	width++;
	height++;

	for(var y = 0; y < height; y++) {
		for(var x = 0; x < width; x++) {
			this.addPoint(x, y);
		}
	}
}

Heroic.Region.prototype.line = function(args) {
	var slope = (args.terminus.y - args.origin.y) / (args.terminus.x - args.origin.x);
	
	if( Math.abs(slope) > 1 ) {
		slope = (args.terminus.x - args.origin.x) / (args.terminus.y - args.origin.y);

		if( args.origin.y < args.terminus.y ) {
			var start	= args.origin;
			var end		= args.terminus;
		} else {
			var start	= args.terminus;
			var end		= args.origin;
		}

		var offset = start.x - slope * start.y;

		for(var y = start.y; y <= end.y; y++) {
			var x = slope * y + offset;
			x = Math.round(x);

			this.addPoint(x, y);
		}
	} else {
		if( args.origin.x < args.terminus.x ) {
			var start	= args.origin;
			var end		= args.terminus;
		} else {
			var start	= args.terminus;
			var end		= args.origin;
		}

		var offset = start.y - slope * start.x;

		for(var x = start.x; x <= end.x; x++) {
			var y = slope * x + offset;
			y = Math.round(y);

			this.addPoint(x, y);
		}
	}
}

// any cleanup needed?
Heroic.Region.prototype.circle = function(args) {
	if( isNaN(args.radius) ) {
		return;
	}
	
	var radius = args.radius;
	var origin = {x: radius, y: radius};
	var points = [];

	// get edge points on one 45 deg arc
	for(var x = 0; x < radius; x++) {
		var y = Math.sqrt( (radius * radius) - (x * x) );
		y = Math.round(y);

		var offsetPoint = {};
		offsetPoint.x = x + origin.x;
		offsetPoint.y = y + origin.y;

		this.addPoint(offsetPoint.x, offsetPoint.y);
		points.push(offsetPoint);
	}
	
	// mirror the points into a 90 degree arc
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = {};

		mirrorPoint.x = point.y;
		mirrorPoint.y = point.x;

		this.addPoint(mirrorPoint.x, mirrorPoint.y);
		points.push(mirrorPoint);
	}

	// add all points inside the arc
	for(var index in points) {
		var point = points[index];

		for(var insideY = point.y - 1; insideY > radius - 1; insideY--) {
			var insidePoint = {};

			insidePoint.x = point.x;
			insidePoint.y = insideY;

			this.addPoint(insidePoint.x, insidePoint.y);
			points.push(insidePoint);
		}
	}
	
	// mirror points about Y-axis
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = {};

		mirrorPoint.x = point.x;
		mirrorPoint.y = (-1 * (point.y - radius) ) + radius;
		
		this.addPoint(mirrorPoint.x, mirrorPoint.y);
		points.push(mirrorPoint);
	}

	// mirror points about X-axis
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = {};

		
		mirrorPoint.x = (-1 * (point.x - radius) ) + radius;
		mirrorPoint.y = point.y;
		
		this.addPoint(mirrorPoint.x, mirrorPoint.y);
	}

	if( this.parent ) {
		this.origin.x += radius * -1;
		this.origin.y += radius * -1;
	}
}

Heroic.Region.prototype.blank = function(args) {
	return;
}

Heroic.Region.prototype.blob = function(args) {
	var x = args.origin.x;
	var y = args.origin.x;
	var args = {shape: 'circle', origin: args.origin, radius: args.radius};
	var primaryRegion = new this.constructor(args, this);

	this.mergeWith(primaryRegion);

	// Between 6 and 10 extra circles
	var addons = Math.random() * (10 - 6) + 6;
	addons = Math.round(addons);

	// assemble random edge points for the addon regions
	var randPoints = [];
	for(var i = 0; i < addons; i++) {
		var randEdgeIndex = Math.round( Math.random() * (primaryRegion.edge.length - 1) );
		var randEdge = primaryRegion.edge[randEdgeIndex];
		var randPoint = {x: primaryRegion.origin.x + randEdge.x, y: primaryRegion.origin.y + randEdge.y};
		randPoints.push(randPoint);
	}

	for(var i = 0; i < addons; i++) {
		/*
		var xOffset = Math.random() * (args.radius + args.radius + 2) - args.radius;
		var yOffset = Math.random() * (args.radius + args.radius + 2) - args.radius;
		xOffset = Math.round(xOffset);
		yOffset = Math.round(yOffset);
		*/

		var min = Math.round(args.radius * 0.35);
		var max = args.radius - 1;
		var randRadius	= Math.round( Math.random() * (max - min) + min );
		//var addonArgs	= {shape: 'circle', origin: {x: x + xOffset, y: y + yOffset}, radius: randRadius};
		var addonArgs	= {shape: 'circle', origin: randPoints[i], radius: randRadius};
		var addonRegion	= new this.constructor(addonArgs, this);

		this.mergeWith(addonRegion);
	}

	this.calcTerminus();
}
Heroic.Region.prototype.grid = function(args) {}

// Heroic.Region.prototype.calcOrigin = function() {}

Heroic.Region.prototype.calcTerminus = function() {
	// PROBLEM: needs to take into account child regions (??)
	var height = this.points.length;
	var maxWidth = 0;

	for(var index in this.points) {
		var row = this.points[index];
		
		if( row.length > maxWidth ) {
			maxWidth = row.length
		}
	}

	this.terminus = {x: maxWidth - 1, y: height - 1};

	for(var index in this.children) {
		var child = this.children[index];

		var testTerminus = this.sumPoints(child.origin, child.terminus);

		if( testTerminus.x > this.terminus.x ) {
			this.terminus.x = testTerminus.x;
		}
		if( testTerminus.y > this.terminus.y ) {
			this.terminus.y = testTerminus.y;
		}
	}
}

Heroic.Region.prototype.calcOffset = function() {
	this.offset = this.sumPoints(this.origin, this.parent.offset);
	//this.offset = this.sumPoints( this.origin, this.getCompositeOffset() );
}

/*
 * Determine which tiles lie on the edge of the region's shape and which lie on its interior.
 */
Heroic.Region.prototype.calcEdge = function() {
	var self = this;

	this.edge		= [];
	this.interior	= [];

	for(var index in Heroic.Direction.key) {
		this.edge.push([]);
		this.interior.push([]);
	}

	this.each(function(x, y) {
		var quadrant = self.calcQuadrant(x, y);

		if(x == 0 || y == 0 || x == self.terminus.x || y == self.terminus.y) {
			self.edge[quadrant].push({x: x, y: y});
			return;
		} else {
			// check the eight surrounding points for empties
			var edges = 0;
			for(var j = -1; j < 2; j++) {
				for(var i = -1; i < 2; i++) {
					if( j != 0 || i != 0 ) {
						var testX = x + j;
						var testY = y + i;

						if( !self.hasPoint(testX, testY) ) {
							self.edge[quadrant].push({x: x, y: y});
							//self.edge.push({x: x, y: y});
							return;
						}
					}
				}
			}
		}
		// everything which is not an edge point makes up the interior
		self.interior[quadrant].push({x: x, y: y});
		//self.interior.push({x: x, y: y});
	});
}

Heroic.Region.prototype.hasPoint = function(x, y) {
	if( this.points[y] ) {
		if( this.points[y][x] ) {
			return true;
		}
	}

	return false;
}

Heroic.Region.prototype.addPoint = function(x, y) {
	if( !this.hasPoint(x, y) ) {
		if( !this.points[y] ) {
			this.points[y] = [];
		}
		this.points[y][x] = true;
	}
}

Heroic.Region.prototype.sumPoints = function(pointOne, pointTwo) {
	return {x: pointOne.x + pointTwo.x, y: pointOne.y + pointTwo.y};
}

Heroic.Region.prototype.getTile = function(x, y) {
	// first check if hasPoint?
	// apply offset when getting tile (first calculate combined offset)
	// get Tile from master Region (how is this referenced? recursively up through parents?)
}

Heroic.Region.prototype.removePoint = function(tile) {
	// check if [y] exists
	this.points[y][x] = false;
	// recalculate edge and interior?
}

// check if this region exceeds the boundaries of its direct parent
Heroic.Region.prototype.isOutOfBounds = function() {
	var out		= {n: 0, e: 0, s: 0, w: 0};
	var parent	= this.parent;

	if( this.offset.x < parent.offset.x ) {
		out.w = this.offset.x - parent.offset.x;
	}
	if( this.offset.y < parent.offset.y ) {
		out.n = this.offset.y - parent.offset.y;
	}
	if( (this.terminus.x + this.origin.x) > parent.terminus.x ) {	
		//out.e = this.terminus.x - parent.terminus.x;
		out.e = (this.terminus.x + this.origin.x) - parent.terminus.x;
	}
	if( (this.terminus.y + this.origin.y) > parent.terminus.y ) {
		//out.s = this.terminus.y - parent.terminus.y;
		out.s = (this.terminus.y + this.origin.y) - parent.terminus.y;
	}

	if( out.n || out.e || out.s || out.w ) {
		return out;
	}

	return false;
}

// fixes this region's boundaries and all ancestors
Heroic.Region.prototype.fixBoundaries = function() {
	var current = this;
	
	while( current.isOutOfBounds() ) {
		var out = current.isOutOfBounds();

		current = current.parent;

		if( !current.parent ) {
			break;
		}

		current.expand(out.w, out.e, out.n, out.s);
	}
}

// winnow out empty rows and columns
//Heroic.Region.prototype.minimize = function() {}

/*
 * Shift the region by a given amount
 * 
 * @param	{integer}	x	Amount to shift on the X-axis
 * @param	{integer}	y	Amount to shift on the Y-axis
 */
Heroic.Region.prototype.translate = function(x, y) {
	if( this.parent ) {
		this.origin.x += x;
		this.origin.y += y;
		this.offset.x += x;
		this.offset.y += y;

		if( this.origin.x < 0 ) {
			this.origin.x = 0;
		}
		if( this.origin.y < 0 ) {
			this.origin.y = 0;
		}
		if( this.isOutOfBounds() ) {
			var out = this.isOutOfBounds();

			this.fixBoundaries();

			// have to adjust origins of siblings in the event that parent region has been expanded in -x or -y directions
			this.eachSibling(function(child) {
				if( out.w ) {
					child.origin.x -= out.w;
				}
				if( out.n ) {
					child.origin.y -= out.n;
				}
			});
		}
	}
}

// expand a region's boundaries by X and Y amounts (can be negative to go backwards and up)
Heroic.Region.prototype.expand = function(xNeg, xPos, yNeg, yPos) {
	this.origin.x += xNeg;
	this.origin.y += yNeg;

	if( this.origin.x < 0 ) {
		this.origin.x = 0;
	}
	if( this.origin.y < 0 ) {
		this.origin.y = 0;
	}

	this.terminus.x += xPos;
	this.terminus.y += yPos;

	this.offset.x += xNeg;
	this.offset.y += yNeg;

	this.translatePoints( Math.abs(xNeg), Math.abs(yNeg) );
}

Heroic.Region.prototype.translatePoints = function(xShift, yShift) {
	var newPoints = [];

	this.each(function(x, y) {
		var yNew = y + yShift;
		var xNew = x + xShift;

		if( !newPoints[yNew] ) {
			newPoints[yNew] = [];
		}
		newPoints[yNew][xNew] = true;
	});

	this.points = newPoints;
	
	this.correction.x += xShift;
	this.correction.y += yShift;
}

Heroic.Region.prototype.rotate = function(degrees) {
	console.log('rotating...');

	if( typeof(degrees) != 'number' ) {
		degrees = 0;
	}

	var newPoints	= [];
	var radians		= degrees * Math.PI / 180;
	var minX = 0;
	var minY = 0;

	this.each(function(x, y) {
		var rotatedX = Math.cos(radians) * x - ( y * Math.sin(radians) );
		var rotatedY = y * Math.cos(radians) + Math.sin(radians) * x;
		var newPoint = {x: Math.round(rotatedX), y: Math.round(rotatedY)};

		if( newPoint.x < minX ) {
			minX = newPoint.x;
		}
		if( newPoint.y < minY ) {
			minY = newPoint.y;
		}

		newPoints.push(newPoint);
	}, degrees);

	if( minX < 0 || minY < 0 ) {
		this.expand(minX, 0, minY, 0);
	}

	// clear old points
	this.points = [];

	// add new points
	for(var index in newPoints) {
		newPoint = newPoints[index];
		this.addPoint(newPoint.x, newPoint.y);
	}
}

/*
 * Create a new child Region.
 * 
 * @param	{Object}	args	Construction arguments for new Region.
 */
Heroic.Region.prototype.addChild = function(args) {
	var child = new this.constructor(args, this);
	this.children.push(child);

	if( child.isOutOfBounds() ) {
		child.fixBoundaries();
	}

	return child;
}

/*
 * Remove the reference to this region from its parent's list of children.
 */
Heroic.Region.prototype.destroy = function() {
	var children	= this.parent.children;
	var index		= children.indexOf(this);

	if( index != -1 ) {
		children.splice(index, 1);
	}
}

// merge this region with all children, sub-children, etc.
Heroic.Region.prototype.flatten = function() {
	// what sub-routines do we need
	// mergeWith()
	// merge all siblings
	// recursively merge through children
}

Heroic.Region.prototype.mergeWith = function(region) {
	var self = this;
	var newOrigin = {x: 0, y: 0};

	if( this.origin.x > region.origin.x ) {
		newOrigin.x = region.origin.x;
	} else {
		newOrigin.x = this.origin.x;
	}

	if( this.origin.y > region.origin.y ) {
		newOrigin.y = region.origin.y;
	} else {
		newOrigin.y = this.origin.y;
	}

	var regions = [this, region];

	for(var index in regions) {
		var testRegion = regions[index];
		var diff = {x: 0, y: 0};

		diff.x = testRegion.origin.x - newOrigin.x;
		diff.y = testRegion.origin.y - newOrigin.y;

		if( diff.x || diff.y ) {
			testRegion.expand(-1 * diff.x, 0, -1 * diff.y, 0);
		}
	}

	this.correction		= {x: 0, y: 0};
	region.correction	= {x: 0, y: 0};
	
	region.each(function(x, y) {
		self.addPoint(x, y);
	});

	this.children = this.children.concat(region.children);

	this.calcTerminus();
	this.calcEdge();

	region.destroy();
}

/*
 * Applies a callback function to each point in the region.
 * 
 * @param	{Object}	callback
 */
Heroic.Region.prototype.each = function(callback, args) {
	var points = this.points;

	for(var y in points) {
		var row = points[y];

		for(var x in row) {
			callback(parseInt(x) + this.correction.x, parseInt(y) + this.correction.y, args);
		}
	}
}

/*
 * Applies a callback function to each child Region of this Region.
 * 
 * @param	{Object}	callback	Callback function
 * @param	{Object}	args		Arguments to make available to the callback function.
 */
Heroic.Region.prototype.eachChild = function(callback, args) {
	var children	= this.children;
	var length		= children.length;

	for(var i = length - 1; i > -1; i--) {
		var child = children[i];

		callback(child);
	}
}

// WIP
Heroic.Region.prototype.eachSibling = function(callback, args) {
	var children = this.parent.children;

	for( var index in children) {
		var child = children[index];

		if( this != child ) {
			callback(child);
		}
	}
}

/*
 * Applies a callback function to each edge point of this Region.
 * 
 * @param	{Object}	callback	Callback function
 * @param	{Object}	args		Arguments to make available to the callback function.
 */
Heroic.Region.prototype.eachEdge = function(callback, args) {
	var edgeQuadrants = this.edge;

	for(var index1 in edgeQuadrants) {
		var quadrant = edgeQuadrants[index1];

		for(var index2 in quadrant) {
			var point = quadrant[index2];
			var x = parseInt(point.x) + this.correction.x;
			var y = parseInt(point.y) + this.correction.y;

			callback(x, y, args);
		}
	}

	this.correction = {x: 0, y: 0};
}

/*
 * Applies a callback function to each interior point of this Region.
 * 
 * @param	{Object}	callback	Callback function
 * @param	{Object}	args		Arguments to make available to the callback function.
 */
Heroic.Region.prototype.eachInterior = function(callback, args) {
	var interiorQuadrants = this.interior;

	for(var index1 in interiorQuadrants) {
		var quadrant = interiorQuadrants[index1];

		for(var index2 in quadrant) {
			var point = quadrant[index2];
			var x = parseInt(point.x) + this.correction.x;
			var y = parseInt(point.y) + this.correction.y;

			callback(x, y, args);
		}
	}

	this.correction = {x: 0, y: 0};
}

/*
 * Gets a random point in the region.
 * 
 * @return	{Object}
 */
Heroic.Region.prototype.randomPoint = function() {
	var lengthY	= this.points.length;
	var randY	= Math.floor( Math.random() * lengthY );
	var lengthX	= this.points[randY].length;
	var randX	= Math.floor( Math.random() * lengthX );

	return {x: randX, y: randY};
}

/*
 * Gets a random point from this region's edge points.
 *
 * @return	{Object}
 */
Heroic.Region.prototype.randomEdge = function() {
	var quadrants		= Heroic.Direction.key.length;
	var randQuadrant	= Math.floor( Math.random() * quadrants );
	var length			= this.edge[randQuadrant].length;
	var rand			= Math.floor( Math.random() * length );

	return this.edge[randQuadrant][rand];
}

/*
 * Gets a random point from this region's interior points.
 *
 * @return	{Object}
 */
Heroic.Region.prototype.randomInterior = function() {
	var quadrants		= Heroic.Direction.key.length;
	var randQuadrant	= Math.floor( Math.random() * quadrants );
	var length			= this.interior[randQuadrant].length;
	var rand			= Math.floor( Math.random() * length );

	return this.interior[randQuadrant][rand];
}

/*
 * Draws a point to a layer.
 * 
 * @param	{integer}	x				X-coordinate
 * @param	{integer}	y				Y-coordinate
 * @param	{Object}	args			Object of arguments
 * @param	{Object}	args.styles		JSON object of style properties passed to the Layer
 * @param	{Object}	args.layer		A Layer object
 */
Heroic.Region.prototype.drawPoint = function(x, y, args) {
	var self	= this;
	var styles	= args.styles;
	var layer	= args.layer;

	styles.x = x + self.offset.x;
	styles.y = y + self.offset.y;
	styles.size = Heroic.Constants.tileSize;

	layer.draw(styles);
}