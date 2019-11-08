const   chai = require('chai'),
        delay = require('../helpers.js').delay,
      { CTQueue } = require('../index.js');

describe ('Should test CTQueue', () => {

    it ('Should test helpers.delay', async () => {
        let d = delay(100);
        chai.expect(d).to.be.instanceof(Promise);
        await d;
        chai.expect(Object.entries(d).length).to.equal(0);
    });

    it ('Should instantiate queue', () => {
        let q = new CTQueue(100);
        chai.expect(q).not.to.be.null;
        chai.expect(q).to.be.instanceof(CTQueue);
    });

    it ('Should instantiate queue with default value', () => {
        let q = new CTQueue();
        chai.expect(q.timeout).to.equal(3000);
    });

    it ('Should test set timeout', () => {
        let q = new CTQueue(100);
        q.setTimeout(200);
        chai.expect(q.timeout).to.equal(200);
    });

    it ('Should test clear', () => {
        let q = new CTQueue(100000);
        q.consume('a', () => {});
        let tasks = q.tasks;
        chai.expect(Object.keys(tasks)).to.include.members(['a']);
        chai.expect(Object.keys(tasks).length).to.equal(1);
        q.clear('a');
        chai.expect(Object.keys(tasks).length).to.equal(0);
    });

    it ('Should test clearAll', () => {
        let q = new CTQueue(100000);
        q.consume('a', () => {});
        q.consume('b', () => {});
        let tasks = q.tasks;
        chai.expect(Object.keys(tasks)).to.include.members(['a', 'b']);
        chai.expect(Object.keys(tasks).length).to.equal(2);

        q.clearAll();

        chai.expect(Object.keys(tasks).length).to.equal(0);
    });

    it ('Should test emit', (done) => {
        let q = new CTQueue(0);
        q.consume('a', () => {
            chai.expect(Object.keys(q.tasks).length).to.equal(0);
            done();
        });
    });

    it ('Should test _consume', (done) => {
        let q = new CTQueue(0);
        q._consume({ key: 'b', thunk: () => {
            done();
        }});
    });

    it ('Should test _produce', (done) => {
        let q = new CTQueue(0);
        q._produce({ key: 'b', thunk: () => {
            done();
        }});
    });

    it ('Should test _getEmitter', (done) => {
        let q = new CTQueue(0);
        let em = q._getEmitter({ key: 'c', thunk: () => {
            done();
        }});
        chai.expect(typeof(em)).to.equal('function');
        em();
    });

    it ('Should test queue functionality (single task)', async () => {
        let q = new CTQueue(100);
        let x = 200;
        q.consume('a', () => {
            x = 500;
        });
        await delay(200);
        chai.expect(x).to.equal(500);
    });

    it ('Should test queue functionality (single push out)', async () => {
        let q = new CTQueue(100);
        let x = 200,
            y = 0;
        q.consume('a', () => {
            x = 500;
            y = 100;
        });
        q.consume('a', () => {
            x = 600;
            y = 100;
        });
        q.consume('a', () => {
            x = 700;
        });
        await delay(200);
        chai.expect(x).to.equal(700);
        chai.expect(y).to.equal(0);
    });

    it ('Should test queue functionality (multitple sequential)', async () => {
        let q = new CTQueue(100);
        let x = 200,
            y = 200;
        q.consume('a', () => {
            x = 500;
        });
        q.consume('b', () => {
            y = 500;
        });
        await delay(200);
        chai.expect(x).to.equal(500);
        chai.expect(y).to.equal(500);
    });

    it ('Should test queue functionality (multitple push out)', async () => {
        let q = new CTQueue(100);
        let x = 200,
            y = 0,
            z = 300,
            w = 0;
        q.consume('a', () => {
            x = 500;
            y = 100;
        });
        q.consume('b', () => {
            z = 500;
            w = 100;
        });
        q.consume('a', () => {
            x = 550;
        });
        q.consume('b', () => {
            z = 550;
        });
        await delay(200);
        chai.expect(x).to.equal(550);
        chai.expect(y).to.equal(0);
        chai.expect(z).to.equal(550);
        chai.expect(w).to.equal(0);
    });

});



















