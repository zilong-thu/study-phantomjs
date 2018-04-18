const phantom = require('phantom');

(async function() {
  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.property('viewportSize', { width: 375, height: 300 });
  const status = await page.open('./index.html');
  console.log(`Page opened with status [${status}].`);

  await page.render('stackoverflow.png');
  console.log(`File created at [./stackoverflow.png]`);

  await instance.exit();
})();