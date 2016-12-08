'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};


/**
 * Automatic Image resize, reduce with AWS Lambda
 * Lambda main handler
 *
 * @author Yoshiaki Sugimoto
 * @created 2015/10/29
 */
"use strict";

const ImageProcessor = require("./libs/ImageProcessor");
const Config         = require("./libs/Config");
const fs             = require("fs");
const path           = require("path");

// Lambda Handler
exports.handler.cropImage = (event, context) => {
  const s3Object   = event.Records[0].s3;
  const configPath = path.resolve(__dirname, "config.json");
  const processor  = new ImageProcessor(s3Object);
  const config     = new Config(
      JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }))
  );

  processor.run(config)
      .then((processedImages) => {
    var message = "OK, " + processedImages + " images were processed.";
  console.log(message);
  context.succeed(message);
})
.catch((messages) => {
    if ( messages === "Object was already processed." ) {
    console.log("Image already processed");
    context.succeed("Image already processed");
  } else {
    context.fail("Error processing " + s3Object.object.key + ": " + messages);
  }
});
};
