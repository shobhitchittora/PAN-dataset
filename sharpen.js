const fs = require('fs'),
  gm = require('gm');

// const readStream = fs.createReadStream('./pan.png');
// gm(readStream, 'pan.png')
//   .sharpen(1.5, 20)
//   .write('pan_new.png', function (err) {
//     if (err) console.error(err);
//     else console.log('DONE');
//   });

gm('pan_new.png')
  .crop(125, 30, 162, 120)
  .negative()
  .write('mask.jpg', function (err) {
    if (!err) console.log("Written mask image.");
  });

gm('pan_new.png')
  .composite('mask.jpg', 'mask.jpg')
  .geometry('+162+120')
  .write('overlap.jpg', function (err) {
    if (!err) console.log("Written composite image.");
    else console.error(err);


    gm('overlap.jpg')
      .composite('number.jpg')
      .geometry('+162+120')
      .write('overlap_final.jpg', function (err) {
        if (!err) console.log("Written composite image.");
        else console.error(err);
      });
  });


