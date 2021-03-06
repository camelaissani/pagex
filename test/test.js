var expect = chai.expect;

// Testing the main file
describe("pagex()", function() {
  it("should be defined", function() {
    expect(!!pagex).to.equal(true);
  });

  it("can handle fake urls", function(done) {
    pagex(/hi/, false, done, '/hi');
  });
});



describe("Regex", function(){

  it("can handle a simple regex", function(done) {
    pagex(/./, false, function () {
      done();
    }, '/');
  });

  it('Can retrieve a root variable', function(done){
    pagex(/^\/([0-9]+)/, false, function (number) {
      expect(number).to.equal('42');
      done();
    }, '/42');
  });

  it('Can retrieve a sub variable', function(done){
    pagex(/^\/users\/([0-9]+)/, false, function (number) {
      expect(number).to.equal('42');
      done();
    }, '/users/42');
  });

  it("can load recursively", function(done) {
    pagex(/test/, false, function () {
      pagex(/test/, false, function(){
        done();
      }, '/test');
    }, '/test');
  });

  it("can export variables async", function (done) {
    pagex.after(function(actions){
      if (actions.done) {
        actions.done();
      }
    });
    pagex(/test/, false, function () {
      this.exports.done = done;
    });
  });

  it("can use exported async variable", function (done) {
    pagex(/test/, false, function () {
      this.exports.done = done;
    });
  });

  it("can export data before", function (done) {
    pagex.before(function(){
      this.exports.user = 'pepe';
    });
    pagex.after(function(actions){
      if (actions.checkUser) {
        actions.checkUser();
      }
    });
    pagex(/^\/haspepe/, false, function () {
      expect(this.exports.user).to.equal('pepe');
      this.exports.checkUser = function(){
        expect(this.user).to.equal('pepe');
        done();
      }
    }, '/haspepe');
  });
});



describe("Paths", function(){
  it("can handle a simple path", function(done) {
    pagex('*', false, function () {
      done();
    }, '/');
  });

  it("can retrieve a root variable", function(done) {
    pagex('/:id', false, function (id) {
      expect(id).to.equal('42');
      done();
    }, '/42');
  });

  it("can retrieve a sub variable", function(done) {
    pagex('/users/:id', false, function (id) {
      expect(id).to.equal('42');
      done();
    }, '/users/42');
  });

  it("optional parameter is undefined if not there", function(done) {
    pagex('/users/:id?', false, function (id) {
      expect(id).to.equal(undefined);
      done();
    }, '/users');
  });

  it("can load recursively", function(done) {
    pagex('/test', false, function () {
      pagex('/test', false, function(){
        done();
      }, '/test');
    }, '/test');
  });

  it("Works with base", function (done) {
    pagex.base = '/test';
    pagex('/abc', false, function(){
      done();
    }, '/test/abc');
  });

  it("Works with base ending with slash", function (done) {
    pagex.base = '/test/';
    pagex('/abc', false, function(){
      done();
    }, '/test/abc');
    pagex.base = false;
  });

  it("Works with base ending with slash", function (done) {
    pagex.base = '/test/';
    pagex('/abc', false, function () {
      done();
    }, '/test/abc');
    pagex.base = false;
  });

  it("Can reset params", function (done) {
    pagex.base = '/test/';
    pagex('/abc', false, function () {
    }, '/test/abc');
    pagex.base = false;
    pagex('/aaa', false, function () {
      done();
    }, '/aaa');
  });
});
