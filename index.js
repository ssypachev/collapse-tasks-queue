let { EventEmitter } = require('events');

let CONSUME = 'consume',
	PRODUCE = 'produce';

class CTQueue {
	
	constructor (timeout = 3000) {
		let self = this;
		
		self.tasks = {};
		self.timeout = timeout;
		self.emitter = new EventEmitter;
		
		self.emitter.on(CONSUME, self._consume.bind(self));
		self.emitter.on(PRODUCE, self._produce.bind(self));
	}
	
	_getEmitter ({ key, thunk }) {
		let self = this;
		return () => {
			self.emitter.emit(PRODUCE, arguments[0]);
		};
	}
	
	_consume ({ key, thunk }) {
		let self = this;
		self.clear(key);				
		self.tasks[key] = setTimeout(self._getEmitter(arguments[0]), self.timeout);
	}
	
	_produce ({ key, thunk }) {
		delete this.tasks[key];
		thunk();
	}
	
	consume (key, thunk) {
		this.emitter.emit(CONSUME, { key, thunk });
	}
	
	setTimeout (ms) {
		this.timeout = ms;
	}
	
	clear (key) {
		if (this.tasks.hasOwnProperty(key)) {
			let task = this.tasks[key];
			delete this.tasks[key];
			clearTimeout(task);
			task = null;				
		}
	}
	
	clearAll () {
		for (let key of Object.keys(this.tasks)) {
			this.clear(key);
		}
	}
}

module.exports.CTQueue = CTQueue;