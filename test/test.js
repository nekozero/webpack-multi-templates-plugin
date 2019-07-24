const assert = require("assert");
const MultiThemesPlugin = require("../lib/index.js");
const path = require("path");
const fs = require("fs");
const { CachedInputFileSystem, ResolverFactory } = require("enhanced-resolve");
const base_dir = path.join(__dirname, "root_dir");

// create a resolver
const resolver = ResolverFactory.createResolver({
  fileSystem: new CachedInputFileSystem(fs, 4000),
  extensions: [".js", ".json"],
  plugins: [new MultiThemesPlugin("new_theme", base_dir)]
});

describe("MultiThemesPlugin", function() {
  describe("theme-specific substitute", function() {
    it("should return the original path", function(done) {
      const lookupStartPath = path.join(base_dir, "src");
      const request = "./main";
      var resolveContext = {};
      resolver.resolve(
        {},
        lookupStartPath,
        request,
        resolveContext,
        (err, filepath) => {
          assert.equal(filepath, path.join(base_dir, "src", "main.js"));
          setImmediate(done);
        }
      );
    });

    it("should return the substitued path", function(done) {
      const lookupStartPath = path.join(base_dir, "src");
      const request = "./sub.js";
      var resolveContext = {};
      resolver.resolve(
        {},
        lookupStartPath,
        request,
        resolveContext,
        (err, filepath) => {
          assert.equal(
            filepath,
            path.join(base_dir, "themes", "new_theme", "sub.js")
          );
          setImmediate(done);
        }
      );
    });

    it("should return the substitued path wite extension", function(done) {
      const lookupStartPath = path.join(base_dir, "src");
      const request = "./sub";
      var resolveContext = {};
      resolver.resolve(
        {},
        lookupStartPath,
        request,
        resolveContext,
        (err, filepath) => {
          assert.equal(
            filepath,
            path.join(base_dir, "themes", "new_theme", "sub.js")
          );
          setImmediate(done);
        }
      );
    });

    it("should return the substitued folder/index.js", function(done) {
      const lookupStartPath = path.join(base_dir, "src");
      const request = "./module";
      var resolveContext = {};
      resolver.resolve(
        {},
        lookupStartPath,
        request,
        resolveContext,
        (err, filepath) => {
          assert.equal(
            filepath,
            path.join(base_dir, "themes", "new_theme", "module", "index.js")
          );
          setImmediate(done);
        }
      );
    });
  });

  describe("theme-specific substitute", function() {
    it("should return the substitued no_substitute.js", function(done) {
      const lookupStartPath = path.join(base_dir, "themes", "new_theme");
      const request = "./no_substitute";
      var resolveContext = {};
      resolver.resolve(
        {},
        lookupStartPath,
        request,
        resolveContext,
        (err, filepath) => {
          assert.equal(
            filepath,
            path.join(base_dir, "src", "no_substitute.js")
          );
          setImmediate(done);
        }
      );
    });

    it("should return the substitued folder/index.js", function(done) {
      const lookupStartPath = path.join(base_dir, "themes", "new_theme");
      const request = "./no_substitute_module";
      var resolveContext = {};
      resolver.resolve(
        {},
        lookupStartPath,
        request,
        resolveContext,
        (err, filepath) => {
          assert.equal(
            filepath,
            path.join(base_dir, "src", "no_substitute_module", "index.js")
          );
          setImmediate(done);
        }
      );
    });
  });
});
