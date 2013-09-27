
var TestArgString = "name=Ryan&number=27&state=CO";

function setupParams(paramString) {
  //change the url without reloading page...will break in older browsers and IE below v10
  //only for testing
  window.history.pushState(null, null, window.location.pathname + paramString);
}

function clearParams() {
  setupParams("");
}

describe("Arg", function(){

  beforeEach(function(){

    // clear out any caches
    ArgReset();

  });

  it("namespace should be defined", function(){
    expect(Arg).toBeDefined();
  });

  it("should be able to parse the string into a data object", function(){
    var obj = Arg.parse(TestArgString);
    expect(obj["name"]).toEqual("Ryan");
    expect(obj["number"]).toEqual("27");
    expect(obj["state"]).toEqual("CO");
  });

  it("should be able to get the URL parameter string", function(){

    setupParams("?" + TestArgString);
    expect(Arg.querystring()).toEqual(TestArgString);

    setupParams("?" + TestArgString + "#something=else");
    expect(Arg.querystring()).toEqual(TestArgString);

  });

  it("should be able to get the hash parameter string", function(){

    setupParams("?something=else#" + TestArgString);
    expect(Arg.hashstring()).toEqual(TestArgString);

    setupParams("#" + TestArgString);
    expect(Arg.hashstring()).toEqual(TestArgString);

    setupParams("?something=else#?" + TestArgString);
    expect(Arg.hashstring()).toEqual(TestArgString);

  });

  it("should be able to get the POJO from the querystring via query()", function(){

    setupParams("?" + TestArgString);
    var args = Arg.query();

    expect(args["name"]).toEqual("Ryan");
    expect(args["number"]).toEqual("27");
    expect(args["state"]).toEqual("CO");

    expect(Arg._query).toEqual(args);

    Arg._query = {
      "name": "Mat",
      "number": "30"
    };
    var args = Arg.query();

    expect(args["name"]).toEqual("Mat");
    expect(args["number"]).toEqual("30");


  });

  it("should be able to get the POJO from the querystring via hash()", function(){

    setupParams("#" + TestArgString);
    var args = Arg.hash();

    expect(args["name"]).toEqual("Ryan");
    expect(args["number"]).toEqual("27");
    expect(args["state"]).toEqual("CO");

    expect(Arg._hash).toEqual(args);

    Arg._hash = {
      "name": "Mat",
      "number": "30"
    };
    var args = Arg.hash();

    expect(args["name"]).toEqual("Mat");
    expect(args["number"]).toEqual("30");

  });

  it("should be able to get all parameters (from query and hash) via the all() method", function(){

    setupParams("?name=Mat&eggs=true#number=30&state=CO");
    var args = Arg.all();

    expect(args["name"]).toEqual("Mat");
    expect(args["number"]).toEqual("30");
    expect(args["eggs"]).toEqual("true");
    expect(args["state"]).toEqual("CO");

    expect(Arg._all).toEqual(args);

    Arg._all = {
      "name": "Mat",
      "number": "30"
    };
    var args = Arg.all();

    expect(args["name"]).toEqual("Mat");
    expect(args["number"]).toEqual("30");

  });

  it("should be able to turn an object into a URL string via stringify()", function(){

    var s = Arg.stringify({
      name: "Ryan",
      number: 27,
      state: "CO"
    });
    expect(s).toContain("name=Ryan");
    expect(s).toContain("number=27");
    expect(s).toContain("state=CO");

  });

  if("should be able to merge data via the merge() method", function(){

    var a = {
      "one": 1,
      "override": false
    };
    var b = {
      "two": 2,
      "override": true
    };
    var c = {
      "three": 3
    };

    var all = Arg.merge(a, b, c);

    expect(all["one"]).toEqual(1);
    expect(all["two"]).toEqual(2);
    expect(all["three"]).toEqual(3);
    expect(all["override"]).toEqual(true);

  });

});
