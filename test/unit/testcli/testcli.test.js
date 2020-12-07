'use strict';

import { assert, expect } from 'chai';
import { stub } from 'sinon';
import proxyquire from 'proxyquire';
import chalk from 'chalk';

describe('testcli', () => {
  let testcli;
  let runTestsCliStub;
  let cdCliStub;
  let infoStub;

  beforeEach(() => {
    runTestsCliStub = stub();
    cdCliStub = stub();
    infoStub = stub();
    testcli = proxyquire('../../../src/testcli/test.cli', {
      '../utils/runners.cli': { runTests: runTestsCliStub },
      'shelljs': { cd: cdCliStub },
      'console': { info: infoStub }
    }).testcli;
  });

  afterEach(() => proxyquire.callThru());

  context('when testcli is called', () => {
    it(`should call exec with the correct args`, () => {
      const args = {
        _: ['test']
      };

      testcli(args);

      assert.ok(runTestsCliStub.calledOnceWith());
    });
  });

  context('when testcli is comming with help flag such as "--help"', () => {
    it('should show the help options', () => {
      const args = {
        _: ['test'],
        help: true
      };

      testcli(args);

      assert.ok(infoStub.withArgs(chalk.green('\nTest options:\n')).calledOnce);
      assert.ok(infoStub.withArgs(chalk.grey(` -  hjs test       : execute tests related to the mock`)).calledOnce);
      assert.ok(infoStub.withArgs(chalk.grey(` -  hjs test --path: execute test in the path`)).calledOnce);
      assert.ok(infoStub.withArgs(chalk.grey(`        Example: hjs test --path folderOne/folderTwo/projectFolder`)).calledOnce);
    });
  });

  describe('arguments', () => {
    context('when the argument is "--include path/to/navigate"', () => {
      it('should navigate to the directory from where you are first', () => {
        const args = {
          _: ['test'],
          path: 'path/to/navigate'
        };

        testcli(args);

        assert.ok(runTestsCliStub.calledOnceWith());
        assert.ok(cdCliStub.calledOnceWith('path/to/navigate'));
      });
    });

    context('when the argument is "--profile flan"', () => {
      it('changes process.env.KEY to flan', () => {
        const args = {
          _: ['test'],
          profile: 'flan'
        };

        testcli(args);

        assert.ok(runTestsCliStub.calledOnceWith());
        expect(process.env.KEY).to.eq('flan');
      });
    });

    context('when the argument is "--include any-regex"', () => {
      it('includes the tests which match the regex', () => {
        const args = {
          _: ['test'],
          include: 'my-regex'
        };

        testcli(args);

        assert.ok(runTestsCliStub.calledOnceWith(undefined, 'my-regex'));
      });
    });

    context('when the argument is "--root my-root"', () => {
      it('includes test under relative path root', () => {
        const args = {
          _: ['test'],
          root: 'my-root'
        };

        testcli(args);

        assert.ok(runTestsCliStub.calledOnceWith('my-root', undefined));
      });
    });
  });
});
