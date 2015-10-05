var GAME = GAME || {};

GAME.Palette = function() {}

GAME.Palette.prototype.key = {
	// Floor
	0:	{
		0:		'.',
		1:		','
	},
	// Wall
	1:	{
		0:		'o',
		1:		'Q',
		2:		'q'
	},
	// Temp: Wall Face
	2:	{
		0:		'}'
	},
	// Temp: Player
	3:	{
		0:		'@'
	}
}

GAME.Palette.prototype.getChar = function(type, subtype) {
	return this.key[type][subtype];
}

GAME.Palette.prototype.getRandType = function() {
	var len = Object.keys(this.key).length;
	var rand = Math.random() * len;

	rand = Math.floor(rand);

	return rand;
}

GAME.Palette.prototype.getRandSubtype = function(type) {
	var len = Object.keys( this.key[type] ).length;
	var rand = Math.random() * len;

	rand = Math.floor(rand);

	return rand;
}

/*
 * Sets up palette's properties.
 */
GAME.Palette.prototype.init = function() {

}