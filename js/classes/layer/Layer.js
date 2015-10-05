var GAME = GAME || {};

/*
 * Represents a layer to draw to.
 * 
 * @constructor
 */
GAME.Layer = function() {}

/*
 * Draws something to the layer based on arguments.
 * 
 * @param	{Object}	args				JSON object containing tile and draw data
 * @param	{Object}	args.tile			Tile object to draw to
 * @param	{string}	args.color			Color for the character
 * @param	{string}	args.background		Color for the background
 * @param	{string}	args.character		ASCII character
 * @return	void
 */
GAME.Layer.prototype.draw = function(args) {
	var ctx = this.context;

	ctx.fillStyle = GAME.Colors[args.background];
	ctx.fillRect(args.tile.x * args.tile.size, args.tile.y * args.tile.size, args.tile.size, args.tile.size);

	ctx.fillStyle = GAME.Colors[args.color];
	ctx.fillText(args.character, args.tile.x * args.tile.size + 3, args.tile.y * args.tile.size + 11);
}

GAME.Layer.prototype.clear = function(tile) {
	var ctx = this.context;

	ctx.clearRect(tile.x * tile.size, tile.y * tile.size, tile.size, tile.size);
}

/*
 * Sets up the layer's properties.
 *
 * @param	{string}	ID		HTML element ID
 * @return	void
 */
GAME.Layer.prototype.init = function(ID) {
	this.elem = document.getElementById(ID);
	this.context = this.elem.getContext('2d');
	this.context.font = "12px Source Code Pro";
}