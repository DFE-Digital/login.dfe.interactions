const utils = require('./../utils');

jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('login.dfe.audit.winston-sequelize-transport');
jest.mock('./../../src/infrastructure/logger', () => {
  return {
    info: jest.fn(),
    audit: jest.fn(),
  }
});
jest.mock('./../../src/infrastructure/Config', () => {
  return jest.fn().mockImplementation(() => {
    return {
      loggerSettings: {
        applicationName: 'test',
      },
      hostingEnvironment: {
        env: 'test',
      },
    };
  });
});
describe('When posting the confirm password reset view', () => {

  let req;
  let res;
  let userCodesValidateCode;
  let loggerAudit;

  let postConfirmPasswordReset;
  const userId = '12345EDC';

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    userCodesValidateCode = jest.fn().mockReturnValue({ code: '' });
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.validateCode = userCodesValidateCode;


    loggerAudit = require('./../../src/infrastructure/logger');

    postConfirmPasswordReset = require('./../../src/app/ResetPassword/postConfirmPasswordReset');
  });

  describe('and the details are valid', () => {

    beforeEach(() => {
      req.body = {
        uid: userId,
        code: '123456',
      };
      req.query = {
        clientid: 'client1',
      };


    });
    it('then a user code is validated for that user id', async () => {
      await postConfirmPasswordReset(req, res);

      expect(userCodesValidateCode.mock.calls.length).toBe(1);
      expect(userCodesValidateCode.mock.calls[0][0]).toBe('12345EDC');
      expect(userCodesValidateCode.mock.calls[0][1]).toBe('123456');
    });

    it('then it should redirect to newpassword view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.redirect.mock.calls[0][0]).toBe('/123-abc/resetpassword/newpassword');
    });
  });
  describe('and the code is missing', () => {
    beforeEach(() => {
      req.body = {
        code: '',
        uid: userId,
      };
    });

    it('then it should render the confirm view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include the posted uid', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].uid).toBe(userId);
    });

    it('then it should be a validation failure', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.code).toBe('Enter the verification code included in the email we sent you.');
    });
  });

  describe('and the code is incorrect', () => {
    beforeEach(() => {
      req.body = {
        uid: userId,
        code: '654321',
      };

      userCodesValidateCode.mockReturnValue(null);
    });

    it('then it should render the confirm view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include the posted code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].code).toBe('654321');
    });

    it('then it should be a validation failure', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.code).toBe('The code you entered is incorrect. Please check and try again.');
    });

    it('then it should audit a failed reset attempt', async () => {
      await postConfirmPasswordReset(req, res);

      expect(loggerAudit.audit.mock.calls.length).toBe(1);
      expect(loggerAudit.audit.mock.calls[0][0].message).toBe('Failed attempt to reset password id: 12345EDC - Invalid code');
      expect(loggerAudit.audit.mock.calls[0][0].type).toBe('reset-password');
    });
  });

});
