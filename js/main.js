var Heroic = Heroic || {};

Heroic.Constants = {
	tileSize:		5
}

// consider removing entirely, since it's covered in Constants
Heroic.TileX = function(x, y) {
	this.size = 5;
	this.x = x;
	this.y = y;
}

/*
 * 
 * 
 * @param	{Object}	args	Contains parameters for defining a shape (origin, terminus, radius)
 */
Heroic.RegionX = function(args, parent) {
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
Heroic.RegionX.prototype.master = function() {
	// ?????
}

Heroic.RegionX.prototype.calcShape = function(args) {
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
	}

	for(var index in Heroic.Direction.key) {
		this.quadrants.push([]);
	}

	this.each(function(x, y) {
		var quadrant = self.calcQuadrant(x, y);
		self.quadrants[quadrant].push({x: x, y: y});
	});
}

Heroic.RegionX.prototype.calcQuadrant = function(x, y) {
	var slope, horz, vert;

	// find approximate center
	var width	= this.terminus.x - this.origin.x;
	var height	= this.terminus.y - this.origin.y;

	var centerX = this.origin.x + width * 0.5;
	var centerY = this.origin.y + height * 0.5;

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
		if( x < centerY ) {
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

Heroic.RegionX.prototype.rectangle = function(args) {
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

// clean this up
Heroic.RegionX.prototype.line = function(args) {
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
Heroic.RegionX.prototype.circle = function(args) {
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

Heroic.RegionX.prototype.blank = function(args) {
	return;
}

Heroic.RegionX.prototype.blob = function(args) {
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
Heroic.RegionX.prototype.grid = function(args) {}

// Heroic.RegionX.prototype.calcOrigin = function() {}

Heroic.RegionX.prototype.calcTerminus = function() {
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

Heroic.RegionX.prototype.calcOffset = function() {
	this.offset = this.sumPoints(this.origin, this.parent.offset);
	//this.offset = this.sumPoints( this.origin, this.getCompositeOffset() );
}

/*
 * Determine which tiles lie on the edge of the region's shape and which lie on its interior.
 */
Heroic.RegionX.prototype.calcEdge = function() {
	var self = this;

	this.edge		= [];
	this.interior	= [];

	this.each(function(x, y) {
		if(x == 0 || y == 0 || x == self.terminus.x || y == self.terminus.y) {
			self.edge.push({x: x, y: y});
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
							self.edge.push({x: x, y: y});
							return;
						}
					}
				}
			}
		}
		// everything which is not an edge point makes up the interior
		self.interior.push({x: x, y: y});
	});
}

Heroic.RegionX.prototype.hasPoint = function(x, y) {
	if( this.points[y] ) {
		if( this.points[y][x] ) {
			return true;
		}
	}

	return false;
}

Heroic.RegionX.prototype.addPoint = function(x, y) {
	if( !this.hasPoint(x, y) ) {
		if( !this.points[y] ) {
			this.points[y] = [];
		}
		this.points[y][x] = true;
	}
}

Heroic.RegionX.prototype.sumPoints = function(pointOne, pointTwo) {
	return {x: pointOne.x + pointTwo.x, y: pointOne.y + pointTwo.y};
}

Heroic.RegionX.prototype.getTile = function(x, y) {
	// first check if hasPoint?
	// apply offset when getting tile (first calculate combined offset)
	// get Tile from master Region (how is this referenced? recursively up through parents?)
}

Heroic.RegionX.prototype.removePoint = function(tile) {
	// check if [y] exists
	this.points[y][x] = false;
	// recalculate edge and interior?
}

// check if this region exceeds the boundaries of its direct parent
Heroic.RegionX.prototype.isOutOfBounds = function() {
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
Heroic.RegionX.prototype.fixBoundaries = function() {
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
//Heroic.RegionX.prototype.minimize = function() {}

/*
 * Shift the region by a given amount
 * 
 * @param	{integer}	x	Amount to shift on the X-axis
 * @param	{integer}	y	Amount to shift on the Y-axis
 */
Heroic.RegionX.prototype.translate = function(x, y) {
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
Heroic.RegionX.prototype.expand = function(xNeg, xPos, yNeg, yPos) {
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

Heroic.RegionX.prototype.translatePoints = function(xShift, yShift) {
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

Heroic.RegionX.prototype.rotate = function(degrees) {}

Heroic.RegionX.prototype.addChild = function(args) {
	var child = new this.constructor(args, this);
	this.children.push(child);

	if( child.isOutOfBounds() ) {
		child.fixBoundaries();
	}
}

/*
 * Remove the reference to this region from its parent's list of children.
 */
Heroic.RegionX.prototype.destroy = function() {
	var children	= this.parent.children;
	var index		= children.indexOf(this);

	if( index != -1 ) {
		children.splice(index, 1);
	}
}

// merge this region with all children, sub-childre, etc.
Heroic.RegionX.prototype.flatten = function() {
	// what sub-routines do we need
	// mergeWith()
	// merge all siblings
	// recursively merge through children
}

Heroic.RegionX.prototype.mergeWith = function(region) {
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
 * Applies a function to each point in the region.
 * 
 * @param	{Object}	callback
 */
Heroic.RegionX.prototype.each = function(callback, args) {
	var points = this.points;

	for(var y in points) {
		var row = points[y];

		for(var x in row) {
			callback(parseInt(x) + this.correction.x, parseInt(y) + this.correction.y, args);
		}
	}
}

Heroic.RegionX.prototype.eachChild = function(callback, args) {
	var children	= this.children;
	var length		= children.length;

	for(var i = length - 1; i > -1; i--) {
		var child = children[i];

		callback(child);
	}
}

Heroic.RegionX.prototype.eachSibling = function(callback, args) {
	var children = this.parent.children;

	for( var index in children) {
		var child = children[index];

		if( this != child ) {
			callback(child);
		}
	}
}

Heroic.RegionX.prototype.eachEdge = function(callback, args) {
	var edgePoints = this.edge;

	for(var index in edgePoints) {
		var point = edgePoints[index];
		var x = parseInt(point.x) + this.correction.x;
		var y = parseInt(point.y) + this.correction.y;

		callback(x, y, args);
	}

	this.correction = {x: 0, y: 0};
}

Heroic.RegionX.prototype.eachInterior = function(callback, args) {
	var interiorPoints = this.interior;

	for(var index in interiorPoints) {
		var point = interiorPoints[index];
		var x = parseInt(point.x) + this.correction.x;
		var y = parseInt(point.y) + this.correction.y;

		callback(x, y, args);
	}

	this.correction = {x: 0, y: 0};
}

/*
 * Returns a random point in the region.
 */
Heroic.RegionX.prototype.randomPoint = function() {
	var lengthY	= this.points.length;
	var randY	= Math.floor( Math.random() * lengthY );
	var lengthX	= this.points[randY].length;
	var randX	= Math.floor( Math.random() * lengthX );

	return {x: randX, y: randY};
}

Heroic.RegionX.prototype.randomEdge = function() {
	var length = this.edge.length;
	var rand = Math.floor( Math.random() * length );

	return this.edge[rand];
}

Heroic.RegionX.prototype.randomInterior = function() {
	var length = this.interior.length;
	var rand = Math.floor( Math.random() * length );

	return this.interior[rand];
}

Heroic.RegionX.prototype.drawPoint = function(x, y, args) {
	var self	= this;
	var styles	= args.styles;
	var layer	= args.layer;

	styles.x = x + self.offset.x;
	styles.y = y + self.offset.y;
	styles.size = Heroic.Constants.tileSize;

	layer.draw(styles);
}


function initializeEngine() {
	Heroic.Entities	= {};
	Heroic.Layers	= {};

	Heroic.Layers.terrain			= new Heroic.Layer();
	Heroic.Layers.terrain.init('canvas1');
	Heroic.Layers.characters		= new Heroic.Layer();
	Heroic.Layers.characters.init('canvas2');

	Heroic.Entities.characters	= new Heroic.Inventory();
	Heroic.Entities.items		= new Heroic.Inventory();
	Heroic.Entities.terrain		= new Heroic.Inventory();
	Heroic.Entities.terrain.init();

	//Heroic.Entities.map			= new Heroic.TestMap();
	Heroic.Entities.map			= new Heroic.TestStructures();
	Heroic.Entities.map.init();

	Heroic.Entities.regions = new Heroic.Inventory();
	Heroic.Entities.regions.init();

	var test = new Heroic.RegionX({shape: 'circle', origin: {x: 0, y: 0}, radius: 45});
	Heroic.Entities.regions.load(test);
	//var test = new Heroic.RegionX({shape: 'rectangle', origin: {x: 2, y: 2}, terminus: {x: 55, y: 15}});

	/*
	for(var index in test.edge) {
		var point = test.edge[index];

		var args = {};
		//args.tile = {x: point.x, y: point.y, size: 5};
		args.x = point.x;
		args.y = point.y;
		args.size = Heroic.Constants.tileSize;
		args.color = 'black';
		args.background = 'white';
		args.character = '';
		Heroic.Layers.terrain.draw(args);		
	}
	*/

	var layer = Heroic.Layers.terrain;
	var styles = {color: 'black', background: 'green', character: ''};
	var drawArgs = {styles: styles, layer: layer};
	test.eachInterior(function(x, y, args) {
		test.drawPoint(x, y, args);
	}, drawArgs);
	styles.background = 'white';
	test.eachEdge(function(x, y, args) {
		test.drawPoint(x, y, args);
	}, drawArgs);

	var args = {shape: 'rectangle', origin: {x: 2, y: 2}, terminus: {x: 30, y: 35}};
	test.addChild(args);

	var args = {shape: 'blob', origin: {x: 40, y: 40}, radius: 10};
	test.addChild(args);


	for(var index1 in test.children) {
		var childRegion = test.children[index1];

		var layer = Heroic.Layers.terrain;
		var styles = {color: 'black', background: 'lightblue', character: ''};
		var drawArgs = {styles: styles, layer: layer};
		//childRegion.drawEdge(styles, layer);
		childRegion.eachEdge(function(x, y, args) {
			childRegion.drawPoint(x, y, args);
		}, drawArgs);

		drawArgs.styles = {color: 'black', background: 'darkblue', character: ''};
		childRegion.eachInterior(function(x, y, args) {
			childRegion.drawPoint(x, y, args);
		}, drawArgs);
	}

	var args = {shape: 'rectangle', origin: {x: 2, y: 2}, terminus: {x: 70, y: 70}};
	test.addChild(args);
	var randRegion = test.children[2];

	var styles = {background: 'black', color: 'white', character: ''};
	drawArgs.styles = styles;
	randRegion.each(function(x, y, args) {
		randRegion.drawPoint(x, y, args);
	}, drawArgs);

	var ne = [].concat(randRegion.quadrants[1], randRegion.quadrants[3], randRegion.quadrants[5], randRegion.quadrants[7]);
	for(var index in ne) {
		var point = ne[index];
		var draw = {styles: {background: 'white', color: 'white', character: ''}, layer: layer};
		randRegion.drawPoint(point.x, point.y, draw);
	}
	/*
	var randPoint = randRegion.randomPoint();
	var off = {x: 0, y: 0};
	for(var i = 0; i < 44; i++) {
		//var args = {shape: 'circle', origin: randRegion.sumPoints(off, randPoint), radius: i + 2};
		
		var randDims = Math.random();
		if( randDims > 0.5 ) {
			var randX = 4;
			var randY = 0;
		} else {
			var randX = 0;
			var randY = 4;
		}
		if( !lastChild ) {
			var lastChild = {};
			lastChild.terminus = randPoint;
		}
		var newPoint = randRegion.sumPoints(off, lastChild.terminus);
		var args = {shape: 'rectangle', origin: newPoint, terminus: randRegion.sumPoints(newPoint, {x: randX, y: randY})};
		randRegion.addChild(args);

		var firstChild = randRegion.children[0];
		var lastChild = randRegion.children[ randRegion.children.length - 1 ];

		off = lastChild.origin;
		var randTranslate = Math.random();
		if( randTranslate > 0.66 && randDims > 0.5 ) {
			lastChild.translate(-4, 0);
			off.x -= 4;
		} else if( randTranslate > 0.33 && randDims < 0.5 ) {
			lastChild.translate(0, -4);
			off.y -= 4;
		}
		
	}
	for(var i = 6; i > 0; i--) {
		var firstChild = randRegion.children[0];
		var lastChild = randRegion.children[i];

		firstChild.mergeWith(lastChild);
	}
	*/

	drawArgs.styles = {background: 'white', color: 'white', character: ''};
	
	randRegion.eachChild(function(child) {
		child.eachEdge(function(x, y, args) {
			child.drawPoint(x, y, args);
		}, drawArgs);
	});

	/*
	var randPoint = test.children[1].random();
	// rand Rectangle
	var args = {shape: 'rectangle', origin: randPoint, terminus: {x: randPoint.x + 5, y: randPoint.y + 5}};
	test.children[1].addChild(args);
	var layer = Heroic.Layers.terrain;
	//test.children[1].children[0].draw({color: 'black', background: 'black', character: ''}, layer);
	var args2 = {};
	args2.styles = {color: 'black', background: 'black', character: ''};
	args2.layer = layer;
	test.children[1].children[0].each(function(x, y, args) {
		test.children[1].children[0].drawPoint(x, y, args);
	}, args2);
	*/

	/*
	child.each(function(x, y) {
		this.drawPoint(x, y, args.styles, args.layer);
	}, args);
	*/
	/*
	var args = {shape: 'circle', origin: {x: 9, y: 9}, radius: 7};
	var child = test.children[0];
	child.addChild(args);
	var grandChild = child.children[0];

	var layer = Heroic.Layers.terrain;
	var styles = {color: 'black', background: 'white', character: ''};
	var drawArgs = {styles: styles, layer: layer};
	grandChild.eachEdge(function(x, y, args) {
		grandChild.drawPoint(x, y, args);
	}, drawArgs);

	drawArgs.styles = {color: 'black', background: 'darkblue', character: ''};
	grandChild.eachInterior(function(x, y, args) {
		grandChild.drawPoint(x, y, args);
	}, drawArgs);
	*/

	/*
	var args = {shape: 'rectangle', origin: {x: 1, y: 1}, terminus: {x: 6, y: 6}};
	grandChild.addChild(args);
	var args = {shape: 'rectangle', origin: {x: 1, y: 1}, terminus: {x: 6, y: 6}};
	grandChild.addChild(args);
	var args = {shape: 'circle', origin: {x: 13, y: 5}, radius: 7};
	grandChild.addChild(args);

	var gg = grandChild.children[0];
	var gg2 = grandChild.children[1];
	var gg3 = grandChild.children[2];
	
	gg.translate(2, 2);
	gg.mergeWith(gg2);
	gg.mergeWith(gg3);
	styles = {color: 'black', background: 'pink', character: ''};
	gg.drawEdge(styles, layer);
	styles = {color: 'black', background: 'black', character: ''};
	gg.drawInterior(styles, layer);
	*/

	/*
	grandChild.eachEdge(function(x, y) {
		//var args = {shape: 'circle', origin: {x: x+4, y: y+4}, radius: 4};
		var args = {shape: 'rectangle', origin: {x: x, y: y}, terminus: {x: x + 4, y: y + 4}};
		//var args = {shape: 'line', origin: {x: x, y: y}, terminus: {x: x+1, y: y+1}};
		grandChild.addChild(args);
	});
	*/


	/*
	var args = {shape: 'rectangle', origin: {x: 0, y: 0}, terminus: {x: 4, y: 4}};
	grandChild.addChild(args);
	var gg = grandChild.children[0];
	gg.translate(-2, -2);
	styles.color = 'white';
	styles.background = 'black';
	gg.drawEdge(styles, layer);
	styles.color = 'white';
	styles.background = 'green';
	gg.drawInterior(styles, layer);
	*/

	//var gg = grandChild.children[0];
	//var gg1 = grandChild.children[1];
	//gg.mergeWith(gg1);
	/*
	for(var index in grandChild.children) {
		var gg = grandChild.children[index];

		styles.color = 'white';
		styles.background = 'pink';
		gg.drawEdge(styles, layer);
	}
	*/

	/*
	// circular merging test
	var gg = grandChild.children[0];
	//gg.translate(-2, -2);
	for(var i = grandChild.children.length - 1; i > 0; i--) {
		var ggx = grandChild.children[i];
		ggx.translate(-1, 0);
		gg.mergeWith(ggx);
		//styles.color = 'white';
		//styles.background = 'pink';
		//ggx.drawEdge(styles, layer);
	}

	styles.color = 'white';
	styles.background = 'black';
	gg.drawEdge(styles, layer);
	styles.color = 'white';
	styles.background = 'green';
	gg.drawInterior(styles, layer);
	*/


	/*
	// simple rectangles
	var args = {shape: 'rectangle', origin: {x: 2, y: 0}, terminus: {x: 5, y: 9}};
	grandChild.addChild(args);
	var gg1 = grandChild.children[0];


	var args = {shape: 'rectangle', origin: {x: 2, y: 10}, terminus: {x: 8, y: 5}};
	grandChild.addChild(args);
	var gg2 = grandChild.children[1];
	gg2.translate(-3, 0);
	gg1.mergeWith(gg2);

	styles.background = 'pink';
	gg1.drawEdge(styles, layer);
	styles.background = 'green';
	//gg2.drawEdge(styles, layer);
	*/
}

/*
jQuery(window).load(function() {
	jQuery(window).on('keyup', function(e) {
		switch(e.keyCode) {
			case 37:
				Player.move('left');
				break;
			case 38:
				Player.move('up');
				break;
			case 39:
				Player.move('right');
				break;
			case 40:
				Player.move('down');
				break;
			default:
				break;
		}
	});
});
*/