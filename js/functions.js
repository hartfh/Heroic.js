Function.prototype.extend = function(parent) {
	this.prototype = Object.create(parent.prototype);
	this.prototype.constructor = this;
	
	return this;
}

// get points within a rectangular region
function getRectangularArea(origin, width, height) {
	var points = [];



	return points;
}

/*
 * Get an array of tile coordinates in a circular area.
 * 
 * @param	{Object}	origin		Coordinates of point on grid
 * @param	{integer}	origin.x	X-coordinate
 * @param	{integer}	origin.y	Y-coordinate
 * @param	{integer}	radius		Radius of the circle (including origin point)
 * 
 * @return	{array}
 */
function getCircularArea(origin, radius) {
	var points = [];
	var offsetPoints = [];

	if( isNaN(radius) ) {
		return points;
	}
	
	radius--;
	var halfRadius = Math.ceil( 0.5 * radius );

	// get edge points on one 45 deg arc
	for(var x = 0; x < halfRadius + 2; x++) {
		var edgePoint = [];
		var y = Math.sqrt( (radius * radius) - (x * x) );
		y = Math.round(y);

		if( !isNaN(y) ) {
			edgePoint['x'] = x;
			edgePoint['y'] = y;

			points.push(edgePoint);
		}
	}

	// mirror the points into a 90 degree arc
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = [];

		mirrorPoint['x'] = point['y'];
		mirrorPoint['y'] = point['x'];

		points.push(mirrorPoint);
	}

	// add all points inside the arc
	for(var index in points) {
		var point = points[index];

		for(var insideY = point['y'] - 1; insideY > -1; insideY--) {
			var insidePoint = [];

			insidePoint['x'] = point['x'];
			insidePoint['y'] = insideY;

			points.push(insidePoint);
		}
	}

	// mirror points about Y-axis
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = [];

		if( point['x'] != 0 ) {
			mirrorPoint['x'] = -1 * point['x'];
			mirrorPoint['y'] = point['y'];
			
			points.push(mirrorPoint);
		}
	}

	// mirror points about X-axis
	for(var index in points) {
		var point = points[index];
		var mirrorPoint = [];

		if( point['y'] != 0 ) {
			mirrorPoint['x'] = point['x'];
			mirrorPoint['y'] = -1 * point['y'];
			
			points.push(mirrorPoint);
		}
	}

	// apply offset to points based on origin
	for(var index in points) {
		var point = points[index];

		var offsetPoint = [];

		offsetPoint['x'] = point['x'] + origin.x;
		offsetPoint['y'] = point['y'] + origin.y;

		offsetPoints.push(offsetPoint);
	}

	return offsetPoints;
}

function randomDir(directions, exclude) {
	if(directions != 4 && directions != 8) {
		return false;
	}

	var rand = Math.random() * directions;

	rand = Math.ceil(rand);

	if( typeof(exclude) != 'undefined' ) {
		while( true ) {
			if( exclude.indexOf(rand) != -1 ) {
				rand++;

				if( directions == 4 && rand == 5 ) {
					rand = 1;
				}
				if( rand == 9 ) {
					rand = 1;
				}
			} else {
				break;
			}
		}
	}

	return coordsFromDir(rand);
}

function coordsFromDir(direction) {
	var directions = [];

	switch(direction) {
		case 1:
			x = -1;
			y = 0;
			break;
		case 2:
			x = 0;
			y = -1;
			break;
		case 3:
			x = 1;
			y = 0;
			break;
		case 4:
			x = 0;
			y = 1;
			break;
		case 5:
			x = -1;
			y = -1;
			break;
		case 6:
			x = 1;
			y = -1;
			break;
		case 7:
			x = 1;
			y = 1;
			break;
		case 8:
			x = -1;
			y = 1;
			break;
		default:
			break;
	}

	directions['x'] = x;
	directions['y'] = y;

	return directions;
}

function dirFromCoords(x, y) {
	var direction;

	if( x == -1 ) {
		if( y == -1 ) {
			direction = 5;
		}
		if( y == 0 ) {
			direction = 1;
		}
		if( y == 1 ) {
			direction = 8;
		}
	}
	if( x == 0 ) {
		if( y == -1 ) {
			direction = 2;
		}
		if( y == 1 ) {
			direction = 4;
		}
	}
	if( x == 1 ) {
		if( y == -1 ) {
			direction = 6;
		}
		if( y == 0 ) {
			direction = 3;
		}
		if( y == 1 ) {
			direction = 7;
		}
	}

	return direction;
}