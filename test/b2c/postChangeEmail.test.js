jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
  hostingEnvironment: {
  }
})));

jest.mock('./../../src/infrastructure/logger', () => ({
  info: jest.fn(),
}));

const utils = require('./../utils');
const postChangeEmail = require('./../../src/app/b2c/postChangeEmail');

describe('When posting to resend change email for a B2C account', () => {
  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();
    //mock response chained functions
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    res.end = jest.fn().mockReturnThis();
    res.redirect = jest.fn().mockReturnThis();
  });

  describe('when the request received does contain wrong or insufficient information', () => {

    afterEach(() => {
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().send).toHaveBeenCalledWith('Invalid details provided with the request');
      expect(res.status().send().end).toHaveBeenCalled();
    });

    it('returns a 400 error if body is not defined', async () => {
      await postChangeEmail(req, res);
    });

    it('returns a 400 error if body is defined but id_token_hint is not present', async () => {
      req.body = {
        redirect_url: 'aaa'
      }
      await postChangeEmail(req, res);
    });

    it('returns a 400 error if body is defined but redirect_url is not present', async () => {
      req.body = {
        id_token_hint: 'aaa'
      }
      await postChangeEmail(req, res);
    });

  });

  describe('when the request received has all required information', () => {

    describe('when the same token has been used more than 10 times', () => {

      beforeEach(() => {
        req.body = {
          id_token_hint: 'repeated',
          redirect_url: 'test_url'
        }
      });

      it('returns a 400 error', async () => {
        for (let i = 0; i < 10; i++) {
          await postChangeEmail(req, res);
        }
        //next call will cause an error as we have done 10 already with same token
        await postChangeEmail(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status().send).toHaveBeenCalledWith('Change email endpoint called too many times');
        expect(res.status().send().end).toHaveBeenCalled();
      });

    });

    describe('when the same token has NOT been used more than 10 times', () => {

      let url = 'test_url';
      let token = 'new_token';

      beforeEach(() => {
        req.body = {
          id_token_hint: token,
          redirect_url: url
        }
      });

      it('redirects the request to the correct URL adding the token as its first and only query param', async () => {
        await postChangeEmail(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith(`${url}?id_token_hint=${token}`);
      });

      it('redirects the request to the correct URL adding the token as one of its query params', async () => {

        //add query params to passed in url
        let queryString = `?param1=value1&param2=value2`;
        req.body.redirect_url += queryString;

        await postChangeEmail(req, res);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith(`${url}${queryString}&id_token_hint=${token}`);
      });

    });

  });

});
