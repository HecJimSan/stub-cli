import { describe } from './sections/describe.template';
import { it } from './sections/it.template';
import { methodReq } from './sections/method.template';
import { headers } from './sections/headers.template';
import { bodyReq } from './sections/body-req.template';
import { assert, status, noErrors, body, endAssert, bodyG, emptyBody } from './sections/assert.template';
import { libraries } from './sections/libraries.template';
import { cookies } from './sections/cookies.template';

export class TestBuilder {
  constructor(args, methodName) {
    this.template = ``;
    this.args = args;
    this.methodName = methodName;
  }

  static aTemplate(args, methodName) {
    return new TestBuilder(args, methodName);
  }

  libraries() {
    this.template = this.template + libraries(this.args);
    return this;
  }

  describe() {
    this.template = this.template + describe(this.args._[2], this.methodName);
    return this;
  }

  it() {
    this.template = this.template + it();
    return this;
  }

  request() {
    this.template = this.template + `\n    request(app)`;
    return this;
  }

  method(idFormatted) {
    this.template = this.template + methodReq(this.methodName, this.args, idFormatted);
    return this;
  }

  headers() {
    this.template = this.template + headers(this.args);
    return this;
  }
  cookies() {
    this.template = this.template + cookies(this.args);
    return this;
  }

  bodyReq() {
    this.template = this.template + bodyReq();
    return this;
  }

  assert() {
    this.template = this.template + assert();
    return this;
  }

  noErrors() {
    this.template = this.template + noErrors();
    return this;
  }

  status() {
    this.template = this.template + status(this.args);
    return this;
  }

  body() {
    this.template = this.template + body();
    return this;
  }

  bodyG() {
    this.template = this.template + bodyG();
    return this;
  }

  emptyBody() {
    this.template = this.template + emptyBody();
    return this;
  }

  endAssert() {
    this.template = this.template + endAssert();
    return this;
  }

  endDes() {
    this.template = this.template + `\n});`;
    return this;
  }

  endIt() {
    this.template = this.template + `\n  });`;
    return this;
  }

  build() {
    return this.template;
  }
}

