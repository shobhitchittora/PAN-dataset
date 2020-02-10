const fs = require('fs'),
  gm = require('gm'),
  csvParser = require('csv-parse'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  promisify = require('util').promisify

const fsUnlink = promisify(fs.unlink)

let panData = []
const DATASET_PATH = path.resolve('./dataset')
const ASSET_PATH = path.resolve('./assets')

mkdirp.sync(DATASET_PATH);

fs.createReadStream(path.join(ASSET_PATH, './Indian-PAN.csv'))
  .pipe(csvParser())
  .on('data', function (csvrow) {
    panData.push(...csvrow)
  })
  .on('end', function () {
    console.log(`Total PAN numbers - ${panData.length}`)
    generateDataSet()
  })
  .on('error', function (e) {
    console.error(e)
  })


function generateText(pan, textLabelPath) {
  return new Promise((resolve, reject) => {
    gm(125, 30, "#accadb ")
      .font("Frygia.ttf", 18)
      .drawText(5, 20, pan)
      .write(textLabelPath, function (err) {
        if (err) {
          console.log(err)
          reject(textLabelPath)
        }
        resolve(textLabelPath)
      })
  })

}

function overlapImages(textLabelPath, storePath) {
  return new Promise((resolve, reject) => {
    gm(path.join(ASSET_PATH, 'pan_sharp.png'))
      .composite(textLabelPath)
      .geometry('+162+120')
      .write(storePath, function (err) {
        if (err) {
          console.log(err)
          reject(storePath)
        }
        resolve(storePath)
      })
  })
}

function generateDataSet() {
  const DATASET_SIZE = panData.length
  const BATCH_SIZE = 100
  let currentIndex = 0

  while (currentIndex <= DATASET_SIZE) {
    let endIndex = BATCH_SIZE + currentIndex;
    console.log(`----- ${parseInt(endIndex * 10 / DATASET_SIZE) * 10}%`)
    panData.slice(currentIndex, endIndex).forEach(async (pan) => {
      let textLabelPath = path.join(DATASET_PATH, `${pan}.label.jpg`)
      let finalStorePath = path.join(DATASET_PATH, `${pan}.jpg`)

      try {
        // Generate text to overlap
        await generateText(pan, textLabelPath)
        // Overlap them
        await overlapImages(textLabelPath, finalStorePath)
        // Clear the text label created
        await fsUnlink(textLabelPath)

      } catch (e) {
        console.error(e)
      }

    })
    currentIndex = BATCH_SIZE + currentIndex;
  }

}