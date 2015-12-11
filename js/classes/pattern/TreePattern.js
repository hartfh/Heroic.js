var Heroic = Heroic || {};

Heroic.TreePattern = function(args) {
	this.initialize(args)
}

Heroic.TreePattern.extend(Heroic.RegionPattern);

Heroic.TreePattern.prototype.realign = function() {}
Heroic.TreePattern.prototype.reduce = function() {}
Heroic.TreePattern.prototype.turn = function() {}
Heroic.TreePattern.prototype.maybeRecurse = function() {}
Heroic.TreePattern.prototype.maybeTerminate	= function() {}
Heroic.TreePattern.prototype.recurse = function() {}