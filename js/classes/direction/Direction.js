var Heroic = Heroic || {};

Heroic.Direction = function(index) {
	if( typeof(index) == 'undefined' ) {
		this.randomize();
	} else {
		this.index = index;
	}

	this.initial	= this.index; // retain memory of initial direction?
	this.previous	= this.index;
}

Heroic.Direction.prototype.getLetter = function() {
	return Heroic.Direction.key[this.index]['letter'];
}

Heroic.Direction.prototype.getCoordinates = function() {
	return Heroic.Direction.key[this.index]['coordinates'];
}

/*
 * Set this direction to a random integer value.
 */
Heroic.Direction.prototype.randomize = function() {
	var rand = Math.floor( Math.random() * 8 );

	this.index = rand;
}

// chance to lean 45 degrees one way or another. ensure doesn't revert back to "intiial"
Heroic.Direction.prototype.veer = function() {}

// rotate 0, -90 or 90 degrees. keep track of previous?
Heroic.Direction.prototype.turn = function() {}

/*
 * Rotate this direction by some number of degrees.
 */
Heroic.Direction.prototype.rotate = function(degrees) {
	var increment	= Math.floor(degrees / 45);
	var rotated		= this.index + increment;

	if( rotated >= 8 ) {
		rotated -= 8;
	} else if( rotated < 0) {
		rotated += 8;
	}

	this.index = rotated;
}

Heroic.Direction.key = [
	{
		letter:			'e',
		coordinates:	{x: 1, y: 0}
	},
	{
		letter:			'se',
		coordinates:	{x: 1, y: 1}
	},
	{
		letter:			's',
		coordinates:	{x: 0, y: 1}
	},
	{
		letter:			'sw',
		coordinates:	{x: -1, y: 1}
	},
	{
		letter:			'w',
		coordinates:	{x: -1, y: 0}
	},
	{
		letter:			'nw',
		coordinates:	{x: -1, y: -1}
	},
	{
		letter:			'n',
		coordinates:	{x: 0, y: -1}
	},
	{
		letter:			'ne',
		coordinates:	{x: 1, y: -1}
	}
];