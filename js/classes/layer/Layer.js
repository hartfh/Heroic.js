var Heroic = Heroic || {};

/*
 * Represents a layer to draw to.
 * 
 * @constructor
 */
Heroic.Layer = function() {}

/*
 * Draws something to the layer based on arguments.
 * 
 * @param	{Object}	args				Object containing tile and draw data
 * @param	{Object}	args.tile			Tile object to draw to
 * @param	{Object}	args.x				
 * @param	{Object}	args.y				
 * @param	{Object}	args.size			
 * @param	{string}	args.color			Color for the character
 * @param	{string}	args.background		Color for the background
 * @param	{string}	args.character		ASCII character
 */
Heroic.Layer.prototype.draw = function(args) {
	var ctx = this.context;

	ctx.fillStyle = Heroic.Colors[args.background];
	ctx.fillRect(args.x * args.size, args.y * args.size, args.size, args.size);

	ctx.fillStyle = Heroic.Colors[args.color];
	ctx.fillText(args.character, args.x * args.size, args.y * args.size + 4);
}

/*
 * Erases anything drawn to the layer in a specified tile.
 * 
 * @param	{Object}	tile	The tile to clear
 */
Heroic.Layer.prototype.clear = function(tile) {
	var ctx = this.context;

	ctx.clearRect(tile.x * tile.size, tile.y * tile.size, tile.size, tile.size);
}

/*
 * Sets up the layer's properties.
 *
 * @param	{string}	ID		HTML element ID
 */
Heroic.Layer.prototype.init = function(ID) {
	this.elem = document.getElementById(ID);
	this.context = this.elem.getContext('2d');
	this.context.font = "7px Source Code Pro";
}