"use strict";

const ImageResizer = require("../libs/ImageResizer");
const ImageData    = require("../libs/ImageData");
const gm = require("gm").subClass({ imageMagick: true });

const expect     = require("chai").expect;
const fs         = require("fs");
const path       = require("path");
const destPath   = path.join(__dirname, "/fixture/fixture_resized.jpg");

describe("Resize JPEG Test", () => {

    it("Resize JPEG with cjpeg", (done) => {
        var size_ratio_base = 4.0
        var size_ratio = 2.0
        var percent = (size_ratio / size_ratio_base) * 100

        const resizer = new ImageResizer({size_ratio_base:4.0, size_ratio: 2.0});
        const buffer  = fs.readFileSync(path.join(__dirname, "/fixture/fixture.jpg"), {encoding: "binary"});
        const image   = new ImageData("fixture/fixture.jpg", "fixture", buffer);

        resizer.exec(image)
        .then((resized) => {
            fs.writeFileSync(destPath, resized.data, {encoding: "binary"});

            gm(path.join(__dirname, "/fixture/fixture.jpg")).size((err, fixture_image) => {
                console.log(err)
                gm(destPath).size((err, out) => {
                    if ( err ) {
                        expect.fail(err);
                    } else {
                        expect(out.width).to.equal(Math.ceil(fixture_image.width - (fixture_image.width*percent)/100));
                    }
                    // fs.unlinkSync(destPath);
                    done();
                });
            });
        })
        .catch((err) => {
            done(err);
        });

    });

    it("Resize JPEG with jpegoptim", (done) => {
        var size_ratio_base = 4.0
        var size_ratio = 2.0
        var percent = (size_ratio / size_ratio_base) * 100

        const resizer = new ImageResizer({size_ratio_base:size_ratio_base, size_ratio: size_ratio, jpegOptimizer: "jpegoptim"});
        const buffer  = fs.readFileSync(path.join(__dirname, "/fixture/fixture.jpg"), {encoding: "binary"});
        const image   = new ImageData("fixture/fixture.jpg", "fixture", buffer);

        resizer.exec(image)
        .then((resized) => {
            fs.writeFileSync(destPath, resized.data, {encoding: "binary"});
            gm(path.join(__dirname, "/fixture/fixture.jpg")).size((err, fixture_image) => {
                console.log(err)
                gm(destPath).size((err, out) => {
                    if ( err ) {
                        expect.fail(err);
                    } else {
                        expect(out.width).to.equal(Math.ceil(fixture_image.width - (fixture_image.width*percent)/100));
                    }
                    // fs.unlinkSync(destPath);
                    done();
                });
            });

        })
        .catch((err) => {
            done(err);
        });

    });
});
