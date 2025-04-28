'use strict';

function add({ a, b }) { return a + b; }

function multiply({ a, b }) { return a * b; }

add.add = add;
add.multiply = multiply;

module.exports = add;