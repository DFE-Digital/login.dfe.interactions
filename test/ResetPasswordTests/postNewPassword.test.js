jest.mock('./../../src/infrastructure/Users');
jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('./../../src/infrastructure/logger', () => {
  return {};
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
jest.mock('login.dfe.validation');

describe('when posting new password', () => {
  const expectedRedirectUri = 'http://localhost.test';

  let userAdapterChangePassword;
  let doesPasswordMeetPolicy;

  let userCodesDeleteCode;
  let userCodesGetCode;

  const req = {
    params: {
      uuid: '123-abc',
    },
    session: {
      clientId: 'UnitTests',
      uid: 'user1',
    },
    csrfToken: () => 'token',
  };

  let render;
  let redirect;
  let res;
  let loggerAudit;

  let postNewPassword;

  beforeEach(() => {

    userAdapterChangePassword = jest.fn();
    const userAdapter = require('./../../src/infrastructure/Users');
    userAdapter.changePassword = userAdapterChangePassword;

    userCodesDeleteCode = jest.fn().mockReturnValue(true);
    userCodesGetCode = jest.fn().mockReturnValue({ userCode: { uid: '123', code: 'abc123', redirectUri: expectedRedirectUri } });
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.deleteCode = userCodesDeleteCode;
    userCodes.getCode = userCodesGetCode;

    doesPasswordMeetPolicy = jest.fn().mockReturnValue(true);
    const validation = require('login.dfe.validation');
    validation.passwordPolicy.doesPasswordMeetPolicy = doesPasswordMeetPolicy;

    render = jest.fn();
    redirect = jest.fn();
    res = {
      render,
      redirect,
    };

    loggerAudit = jest.fn();
    const logger = require('./../../src/infrastructure/logger');
    logger.audit = loggerAudit;
    logger.info = jest.fn();

    postNewPassword = require('./../../src/app/ResetPassword/postNewPassword');
  });

  describe('and the details are valid', () => {
    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: 'mary-had-a-little-lamb',
      };
    });

    it('then it should redirect to complete', async () => {
      await postNewPassword(req, res);

      expect(redirect.mock.calls).toHaveLength(1);
      expect(redirect.mock.calls[0][0]).toBe('/123-abc/resetpassword/complete');
    });

    it('then it should change the users password', async () => {
      await postNewPassword(req, res);

      expect(userAdapterChangePassword.mock.calls).toHaveLength(1);
      expect(userAdapterChangePassword.mock.calls[0][0]).toBe(req.session.uid);
      expect(userAdapterChangePassword.mock.calls[0][1]).toBe(req.body.newPassword);
    });
    it('then the usercode is retrieved to get the redirectUri', async () => {
      await postNewPassword(req, res);

      expect(userCodesGetCode.mock.calls).toHaveLength(1);
    });
    it('then it should delete the users reset codes', async () => {
      await postNewPassword(req, res);

      expect(userCodesDeleteCode.mock.calls).toHaveLength(1);
      expect(userCodesDeleteCode.mock.calls[0][0]).toBe(req.session.uid);
    });

    it('then it should audit a successful password reset', async () => {
      await postNewPassword(req, res);

      expect(loggerAudit.mock.calls).toHaveLength(1);
      expect(loggerAudit.mock.calls[0][0].message).toBe('Successful reset password for user id: user1');
      expect(loggerAudit.mock.calls[0][0].type).toBe('reset-password');
    });
  });

  describe('and new password is missing', () => {
    beforeEach(() => {
      req.body = {
        newPassword: '',
        confirmPassword: 'mary-had-a-little-lamb',
      };
    });

    it('then it should render the newpassword view', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls).toHaveLength(1);
      expect(render.mock.calls[0][0]).toBe('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include a blank new password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].newPassword).toBe('');
    });

    it('then it should include a blank confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].confirmPassword).toBe('');
    });

    it('then it should be a validation failure', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationMessages.newPassword).toBe('Please enter a password');
    });
  });

  describe('and confirm password is missing', () => {
    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: '',
      };
    });

    it('then it should render the newpassword view', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls).toHaveLength(1);
      expect(render.mock.calls[0][0]).toBe('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include a blank new password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].newPassword).toBe('');
    });

    it('then it should include a blank confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].confirmPassword).toBe('');
    });

    it('then it should be a validation failure', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationMessages.confirmPassword).toBe('Please confirm your new password');
    });
  });

  describe('and confirm password does not match new password', () => {
    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: 'mary-had-a-large-lamb',
      };
    });

    it('then it should render the newpassword view', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls).toHaveLength(1);
      expect(render.mock.calls[0][0]).toBe('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include a blank new password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].newPassword).toBe('');
    });

    it('then it should include a blank confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].confirmPassword).toBe('');
    });

    it('then it should be a validation failure', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationMessages.confirmPassword).toBe('Please enter matching passwords');
    });
  });

  describe('and the password does not meet the policy', () => {
    beforeEach(() => {
      doesPasswordMeetPolicy.mockReturnValue(false);
    });

    it('then it should render the newpassword view', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls).toHaveLength(1);
      expect(render.mock.calls[0][0]).toBe('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include a blank new password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].newPassword).toBe('');
    });

    it('then it should include a blank confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].confirmPassword).toBe('');
    });

    it('then it should be a validation failure', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationMessages.newPassword).toBe('Please enter a password of at least 12 characters');
    });
  });
});
