## Collapse Tasks Queue

`CTQueue` executes latest task defined by unique key `ms` milliseconds after latest `consume` call.

This library was created for firebase push notifications management (but you can use it for anything else, of course). In out case, client pushes button frequently; we need
to bound notifications, collapse them and send only latest one. For some reasons we can not do that on client side and
we can not use `collapse_key` across all devices.

```js
let { CTQueue } = require('collapse-tasks-queue');

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
/*
delay 100 ms
x === 550;
y === 0;
z === 550;
w === 0;
*/
```