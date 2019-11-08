## Collapse Tasks Queue

```js
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