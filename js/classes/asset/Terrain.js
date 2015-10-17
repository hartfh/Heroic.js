var Heroic = Heroic || {};

Heroic.Terrain = function() {}

Heroic.Terrain.extend(Heroic.Asset);

/*
 * Sets up terrain properties.
 *
 * @return void
 */
Heroic.Terrain.prototype.init = function(tile) {
	this.tile		= null;
	this.ascii		= '.';
	this.color		= 'white';
	this.background	= 'black';
	this.layer		= Heroic.Layers.terrain;
	this.type		= 'open';
	this.tile		= tile;
}