jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
  hostingEnvironment: {
  },
  crypto: {
    signing: {
      publicKey: ''
    }
  }
})));

const RequestVerification = require('login.dfe.request-verification');
jest.mock('login.dfe.request-verification', () => jest.fn())

let requestVerificationStub = jest.fn().mockReturnValue(false);

RequestVerification.mockImplementation(() => {
  return {
    verifyRequest: requestVerificationStub,
  };
});

const utils = require('./../utils');
const postChangeEmail = require('./../../src/app/b2c/postChangeEmail');

xdescribe('When posting to resend change email for a B2C account', () => {
  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    //mock response chained functions
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    res.end = jest.fn().mockReturnThis();

    req.headers = {
      api_sec_uid: require('uuid/v4')()
    };

  });

  it('if called too many times with the same UID in headers we get an error back', async () => {

    req.headers = {
      api_sec_uid: 'repeated-uid'
    };

    await postChangeEmail(req, res);
    await postChangeEmail(req, res);
    await postChangeEmail(req, res);
    await postChangeEmail(req, res);
    await postChangeEmail(req, res);

    //reached limit of 5 calls, still not getting error back
    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.status().send).not.toHaveBeenCalledWith('Change email endpoint called too many times');

    //next call will cause an error because it has gone above max number of attempts
    await postChangeEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status().send).toHaveBeenCalledWith('Change email endpoint called too many times');
    expect(res.status().send().end).toHaveBeenCalled();
  });

  it('if header verification is not successful we get an error back', async () => {

    await postChangeEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status().send).toHaveBeenCalledWith('Change email call did not pass security checks');
    expect(res.status().send().end).toHaveBeenCalled();
  });

  describe('when header verification is successful', () => {

    beforeEach(() => {
      requestVerificationStub = jest.fn().mockReturnValue(true);
    });

    it('if request has expired we get an error back ', async () => {

      let expiredDate = new Date();
      expiredDate.setHours(expiredDate.getHours() - 1);
      req.headers.api_sec_expiry = expiredDate

      await postChangeEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().send).toHaveBeenCalledWith('Change email endpoint not called, verification details expired');
      expect(res.status().send().end).toHaveBeenCalled();
    });

    describe('when request has not expired', () => {

      beforeEach(() => {
        let notExpiredDate = new Date();
        notExpiredDate.setHours(notExpiredDate.getHours() + 1);
        req.headers.api_sec_expiry = notExpiredDate;
      });

      it('if configuration is not correct (env var not set) we get an error back', async () => {

        await postChangeEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status().send).toHaveBeenCalledWith('Change email endpoint not configured properly');
        expect(res.status().send().end).toHaveBeenCalled();
      });

      describe('when configuration is correct (env var is set)', () => {

        let nock;

        beforeEach(() => {
          process.env.B2C_SECURED_CHANGE_EMAIL_ENDPOINT = 'https://test/change-email';
          nock = require('nock')
        });

        xit('we send the request to secured endpoint and send response back', async (done) => {

          const scope = nock('https://test')
            .post('/change-email')
            .reply(200, {
              response: 'data',
            });

          await postChangeEmail(req, res);

          setTimeout(() => {
            expect(res.status).toHaveBeenCalled();
            expect(res.status().send).toHaveBeenCalledWith('{"response":"data"}');
            expect(res.status().send().end).toHaveBeenCalled();
            done();
          }, 500);

        });

        xit('we send the request to secured endpoint and send response back', async (done) => {

          const scope = nock('https://test')
            .post('/change-email')
            .replyWithError('error message');

          await postChangeEmail(req, res);

          setTimeout(() => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().send).toHaveBeenCalledWith('error message');
            expect(res.status().send().end).toHaveBeenCalled();
            done();
          }, 500);

        });

      });

    });

  });

});
