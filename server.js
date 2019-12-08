'use strict';

const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');

const server = new Koa();

render(server, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: false,
});

server.use(function (ctx, next) {
  ctx.state = ctx.state || {};
  ctx.state.now = new Date();
  ctx.state.ip = ctx.ip;
  ctx.state.version = '2.0.0';
  return next();
});

server.use(async function (ctx) {
  const users = [{ name: 'Dead Horse' }, { name: 'Jack' }, { name: 'Tom' }];
  await ctx.render('content', {
    users
  });
});

if (process.env.NODE_ENV === 'test') {
  module.exports = server.callback();
} else {
  server.listen(7001);
  console.log('open http://localhost:7001');
}

server.on('error', function (err) {
  console.log(err.stack);
});