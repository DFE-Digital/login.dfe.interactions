const utils = require('./../utils');
jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('./../../src/infrastructure/Users');
jest.mock('./../../src/infrastructure/logger', () => {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});
jest.mock('./../../src/infrastructure/applications', () => ({
  getServiceById: jest.fn(),
}));

jest.mock('./../../src/infrastructure/Config', () => {
  return jest.fn().mockImplementation(() => {
    return {
      hostingEnvironment: {
        profileUrl: "profile.test.url"
      },
      notifications: {
        connectionString: {},
      },
    };
  });
});

describe('when handling a password reset request for an activated user', () => {
  let req;
  let res;
  let userCodesUpsertCode;
  let usersFind;
  let saUsersFind;
  let invitationsFind;

  let postRequestPasswordReset;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse().mockResetAll();

    userCodesUpsertCode = jest.fn().mockReset();
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.upsertCode = userCodesUpsertCode;

    usersFind = jest.fn().mockReset().mockReturnValue({ sub: '12345' });
    invitationsFind = jest.fn().mockReset().mockReturnValue(null);
    const users = require('./../../src/infrastructure/Users');
    users.find = usersFind;
    users.findInvitationByEmail = invitationsFind;

    postRequestPasswordReset = require('./../../src/app/ResetPassword/postRequestPasswordReset');
  });

  describe('and the details are valid', () => {
    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.test',
        clientId: 'client1',
        redirectUri: 'https://local.test',
      };
    });

    it('then the user is retrieved from the directories api', async () => {
      await postRequestPasswordReset(req, res);

      expect(usersFind.mock.calls.length).toBe(1);
      expect(invitationsFind.mock.calls.length).toBe(0);
      expect(usersFind.mock.calls[0][0]).toBe('user.one@unit.test');
    });

    it('then a user code is requested for that user id', async () => {
      await postRequestPasswordReset(req, res);

      expect(userCodesUpsertCode.mock.calls.length).toBe(1);
      expect(userCodesUpsertCode.mock.calls[0][0]).toBe('12345');
      expect(userCodesUpsertCode.mock.calls[0][1]).toBe('client1');
      expect(userCodesUpsertCode.mock.calls[0][2]).toBe('https://local.test');
    });

    it('then it should render the confirm view', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.redirect.mock.calls).toHaveLength(1);
      expect(res.redirect.mock.calls[0][0]).toBe('/123-abc/resetpassword/12345/confirm?clientid=client1&redirect_uri=https://local.test');
    });
  });

  describe('and the details are missing', () => {
    beforeEach(() => {
      req.body = {
        email: '',
      };
    });

    it('then it should render the request view', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/request');
    });

    it('then it should include the csrf token on the model', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should be a validation failure', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.email).toBe('Please enter a valid email address');
    });
  });

  describe('and the details are invalid', () => {
    beforeEach(() => {
      req.body = {
        email: 'not-a-valid-email-address',
      };
    });

    it('then it should render the request view', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/request');
    });

    it('then it should include the csrf token on the model', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include the posted email', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].email).toBe('not-a-valid-email-address');
    });

    it('then it should be a validation failure', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.email).toBe('Please enter a valid email address');
    });
  });

});

describe('when handling a password reset request for a invited user', () => {
  let req;
  let res;
  let usersFind;
  let invitationsFind;

  let postRequestPasswordReset;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse().mockResetAll();

    usersFind = jest.fn().mockReset().mockReturnValue(null);
    invitationsFind = jest.fn().mockReset().mockReturnValue({ id: '12345', isCompleted: false, deactivated: false });
    invitationsResend = jest.fn();

    const users = require('./../../src/infrastructure/Users');
    users.find = usersFind;
    users.findInvitationByEmail = invitationsFind;
    users.resendInvitation = invitationsResend;

    postRequestPasswordReset = require('./../../src/app/ResetPassword/postRequestPasswordReset');
  });

  describe('and the details are valid', () => {
    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.test',
        clientId: 'client1',
        redirectUri: 'https://local.test',
      };
    });

    it('then the invite is retrieved from the directories api', async () => {
      await postRequestPasswordReset(req, res);

      expect(usersFind.mock.calls.length).toBe(1);
      expect(invitationsFind.mock.calls.length).toBe(1);
      expect(usersFind.mock.calls[0][0]).toBe('user.one@unit.test');
      expect(invitationsFind.mock.calls[0][0]).toBe('user.one@unit.test');
    });

    it('then a an invite is resent for that user', async () => {
      await postRequestPasswordReset(req, res);

      expect(invitationsResend.mock.calls).toHaveLength(1);
      expect(invitationsResend.mock.calls[0][0]).toBe('12345');
    });

    it('then it should render the invitation confirmation view', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.redirect.mock.calls).toHaveLength(1);
      expect(res.redirect.mock.calls[0][0]).toBe(`profile.test.url/register/12345?clientid=client1&redirect_uri=https://local.test`);
    });
  });
});
