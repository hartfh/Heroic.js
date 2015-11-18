var Heroic = Heroic || {};

Heroic.Heartbeat = function() {}

/*
How do we hook things onto pulse()
Might need a few controllers that manage groups of things. Interact with Inventories somehow

*/

Heroic.Heartbeat.prototype.pulse = function(index) {
	// routine
	// do each task
}

Heroic.Heartbeat.prototype.addTask = function(X) {

	//this.tasks.push(X);
}

Heroic.Heartbeat.prototype.removeTask = function() {
	
}

Heroic.Heartbeat.prototype.init = function() {
	this.cycle = 500;
	this.tasks = []; // array of arrays?
	//this.intervals = [];
	

	setInterval(this.pulse, this.cycle * 1, 1);
	setInterval(this.pulse, this.cycle * 2, 2);
	setInterval(this.pulse, this.cycle * 3, 3);
	setInterval(this.pulse, this.cycle * 4, 4);
}

//var test = new Heroic.Heartbeat();
//test.init();