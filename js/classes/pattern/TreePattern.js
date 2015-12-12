var Heroic = Heroic || {};

Heroic.TreePattern = function(args) {
	this.initialize(args)
}

Heroic.TreePattern.extend(Heroic.RegionPattern);

Heroic.TreePattern.prototype.maybeRecurse = function() {
	if( false ) {
		return true;
	}

	return false;
}

Heroic.TreePattern.prototype.maybeTerminate	= function() {
	if( true ) {
		return true;
	}

	return false;
}

Heroic.TreePattern.prototype.realign = function() {
	this.shape.origin = this.lastChild.terminus;
}

Heroic.TreePattern.prototype.recurse = function(args) {

}

Heroic.TreePattern.prototype.reduce = function() {
	// make terminus closer to origin by X and Y amount
}

Heroic.TreePattern.prototype.turn = function() {
	// ??????
}