Function.prototype.extend = function(parent) {
	this.prototype = Object.create(parent.prototype);
	this.prototype.constructor = this;
	
	return this;
}

Array.prototype.shuffle = function() {
	var currentIndex = this.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = this[currentIndex];
		this[currentIndex] = this[randomIndex];
		this[randomIndex] = temporaryValue;
	}
}

Object.defineProperty(
	Array.prototype, 'shuffle', {enumerable: false}
);

/*
Function.prototype.init = function() {

}
*/

function getDirections() {
	var directions = [];

	directions[0] = {
		name:			'n',
		coordinates:	{x: 0, y: -1}
	};
	directions[1] = {
		name:			'ne',
		coordinates:	{x: 1, y: -1}
	};
	directions[2] = {
		name:			'e',
		coordinates:	{x: 1, y: 0}
	};
	directions[3] = {
		name:			'se',
		coordinates:	{x: 1, y: 1}
	};
	directions[4] = {
		name:			's',
		coordinates:	{x: 0, y: 1}
	};
	directions[5] = {
		name:			'sw',
		coordinates:	{x: -1, y: 1}
	};
	directions[6] = {
		name:			'w',
		coordinates:	{x: -1, y: 0}
	};
	directions[7] = {
		name:			'nw',
		coordinates:	{x: -1, y: -1}
	};

	return directions;
}

function directionToNumber(letter) {
	var key = getDirectionKey();

	return key[letter];
}

function directionToLetter(number) {
	var directions = getDirections();
	var direction = directions[number];

	return direction.name;
}

function getDirectionKey() {
	var key = [];

	key['n']	= 0;
	key['ne']	= 1;
	key['e']	= 2;
	key['se']	= 3;
	key['s']	= 4;
	key['sw']	= 5;
	key['w']	= 6;
	key['nw']	= 7;

	return key;
}

function rotateDirection(dir, degrees) {
	var increment	= Math.floor(degrees / 45);
	var rotated		= dir + increment;

	if( rotated >= 8 ) {
		rotated -= 8;
	} else if( rotated < 0) {
		rotated += 8;
	}

	return rotated;
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