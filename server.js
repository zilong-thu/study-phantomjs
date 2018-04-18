const Koa      = require('koa');
const fs       = require('fs');
const phantom  = require('phantom');
const request  = require('request-promise-native');
const nunjucks = require('nunjucks');
const app      = new Koa();

let instance;
let page;

(async () => {
  instance = await phantom.create();
  page = await instance.createPage();
  await page.property('viewportSize', { width: 375, height: 300 });
})();


// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(async ctx => {
  // const options = {
  //   method: 'POST',
  //   uri: 'http',
  //   body: {celebrityId: 663},
  //   headers: {
  //     'cache-control': 'no-cache',
  //     'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
  //   },
  //   json: true,
  // };

  console.time('image-generate');
  let status = await page.open('./layout.html');
  console.log(`Page opened with status [${status}].`);
  await page.render('res.png');
  console.timeEnd('image-generate');

  console.time('data');
  let cDetailRes = await Promise.resolve({
    data: [],
  });
  const cDetail = cDetailRes.data;
  console.timeEnd('data');

  console.time('image-send');
  content = fs.readFileSync('res.png');
  ctx.set('Content-Type', 'image/png');
  ctx.body = content;
  console.timeEnd('image-send');
});

app.listen(5000);