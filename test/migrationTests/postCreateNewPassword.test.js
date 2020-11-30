jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('./../../src/infrastructure/Users');
jest.mock('./../../src/infrastructure/Services');
jest.mock('./../../src/infrastructure/access', () => ({
  create: jest.fn(),
  getRolesOfService: jest.fn(),
}));
jest.mock('./../../src/infrastructure/Organisations');
jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
  loggerSettings: {
    applicationName: 'test',
  },
  hostingEnvironment: {
    env: 'test',
  },
})));
jest.mock('./../../src/infrastructure/logger', () => ({
  info: jest.fn(),
  audit: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const { getCode: userCodesGetCode, deleteCode: userCodesDeleteCode } = require('./../../src/infrastructure/UserCodes');
const { create: createUser, find: findUser } = require('./../../src/infrastructure/Users');
const { create: addServiceMapping, getRolesOfService } = require('./../../src/infrastructure/access');
const { getOrganisationByExternalId, setUsersRoleAtOrg } = require('./../../src/infrastructure/Organisations');
const utils = require('./../utils');
const postCreateNewPassword = require('./../../src/app/migration/postCreateNewPassword');

describe('When posting to create a user from migration', () => {
  let req;
  let res;
  const expectedUserCodeId = 'some-uid';
  const expectedPassword = 'my-super-strong-password-for-test';
  const expectedEmail = 'test@local';
  const expectedUserId = 'user-1';
  const expectedOrgId = '33421d3e-54ba-44ac-c453-2d42b9a05492';

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.body = {
      newPassword: expectedPassword,
      confirmPassword: expectedPassword,
      emailConfId: expectedUserCodeId,
    };

    userCodesDeleteCode.mockReset();
    userCodesGetCode.mockReset().mockReturnValue({
      userCode: {
        email: expectedEmail,
        code: '',
        contextData: '{"service":{"roles":["group1","group2"]}, "firstName":"Roger","lastName":"Johnson","email":"foo3@example.com","organisation":{"id":"72711ff9-2da1-4135-8a20-3de1fea31073","name":"Some School - MAT","osaId":"95137","urn":null,"localAuthority":null,"type":"010","uid":"MAT1234","role":{"id":10000}},"clientName":"Some very friendly client","clientId":"profiles","redirectUri":"https://localhost:4431","serviceId":"svc1", "userName":"old_user_name","osaUserId":"45632"}',
        redirectUri: 'https://localhost:4431',
      },
    });


    createUser.mockReset().mockReturnValue({ id: expectedUserId });
    findUser.mockReset().mockReturnValue({ sub: expectedUserId });

    addServiceMapping.mockReset().mockReturnValue(true);
    getRolesOfService.mockReset().mockReturnValue([
      { id: 'role1', code: 'group1' },
      { id: 'role2', code: 'group2' },
    ]);

    getOrganisationByExternalId.mockReset().mockReturnValue({
      id: expectedOrgId,
    });
    setUsersRoleAtOrg.mockReset().mockReturnValue(true);
  });

  it('then if the password is empty an error is returned', async () => {
    req.body.newPassword = '';

    await postCreateNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(Object.keys(res.render.mock.calls[0][1].validationMessages).length).toBeGreaterThanOrEqual(1);
  });

  it('then if the confirm password does not match the password an error is returned', async () => {
    req.body.newPassword = 'my-super-strong-password';
    req.body.confirmPassword = 'my-super-strong-password-1';

    await postCreateNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(Object.keys(res.render.mock.calls[0][1].validationMessages).length).toBeGreaterThanOrEqual(1);
  });

  it('then the code is checked against the API', async () => {
    await postCreateNewPassword(req, res);

    expect(userCodesGetCode.mock.calls).toHaveLength(1);
    expect(userCodesGetCode.mock.calls[0][0]).toBe(expectedUserCodeId);
    expect(userCodesGetCode.mock.calls[0][1]).toBe(req.id);
    expect(userCodesGetCode.mock.calls[0][2]).toBe('ConfirmMigratedEmail');
  });

  it('then if no data is returned from the code API then an error is returned', async () => {
    userCodesGetCode.mockReset().mockReturnValue(null);

    await postCreateNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(Object.keys(res.render.mock.calls[0][1].validationMessages).length).toBeGreaterThanOrEqual(1);
  });

  it('then the user is created if the request is valid', async () => {
    await postCreateNewPassword(req, res);

    expect(createUser.mock.calls).toHaveLength(1);
    expect(createUser.mock.calls[0][0]).toBe(expectedEmail);
    expect(createUser.mock.calls[0][1]).toBe(expectedPassword);
    expect(createUser.mock.calls[0][2]).toBe('Roger');
    expect(createUser.mock.calls[0][3]).toBe('Johnson');
    expect(createUser.mock.calls[0][4]).toBe('old_user_name');
    expect(createUser.mock.calls[0][5]).toBe(req.id);
  });

  it('then if an error is returned while creating the user an error is returned', async () => {
    createUser.mockReset().mockImplementation(() => {
      const e = new Error('test error');
      e.statusCode = 500;
      throw e;
    });

    await postCreateNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(Object.keys(res.render.mock.calls[0][1].validationMessages).length).toBeGreaterThanOrEqual(1);
  });

  it('then the user is mapped to the organisation', async () => {
    await postCreateNewPassword(req, res);

    expect(addServiceMapping.mock.calls).toHaveLength(1);
    expect(addServiceMapping.mock.calls[0][0]).toBe(expectedUserId);
    expect(addServiceMapping.mock.calls[0][1]).toBe('svc1');
    expect(addServiceMapping.mock.calls[0][2]).toBe(expectedOrgId);
    expect(addServiceMapping.mock.calls[0][3]).toEqual([
      { key: 'organisationId', value: '95137' },
      { key: 'groups', value: 'group1,group2' },
      { key: 'saUserId', value: '45632' },
      { key: 'saUserName', value: 'old_user_name' },
    ]);
    expect(addServiceMapping.mock.calls[0][4]).toEqual([
      'role1',
      'role2',
    ]);
    expect(addServiceMapping.mock.calls[0][5]).toBe(req.id);
  });

  it('then if the user is successfully created the usercode is deleted', async () => {
    await postCreateNewPassword(req, res);

    expect(userCodesDeleteCode.mock.calls).toHaveLength(1);
    expect(userCodesDeleteCode.mock.calls[0][0]).toBe(expectedUserCodeId);
    expect(userCodesDeleteCode.mock.calls[0][1]).toBe(req.id);
    expect(userCodesDeleteCode.mock.calls[0][2]).toBe('ConfirmMigratedEmail');
  });

  it('then the usercode is deleted if the user already exists', async () => {
    createUser.mockReset().mockReturnValue(null);

    await postCreateNewPassword(req, res);

    expect(userCodesDeleteCode.mock.calls).toHaveLength(1);
  });

  it('then the user org to service assocation is still created if the user exists', async () => {
    createUser.mockReset().mockReturnValue(null);

    await postCreateNewPassword(req, res);

    expect(findUser.mock.calls).toHaveLength(1);
    expect(findUser.mock.calls[0][0]).toBe(expectedEmail);
    expect(addServiceMapping.mock.calls).toHaveLength(1);
    expect(addServiceMapping.mock.calls[0][0]).toBe(expectedUserId);
    expect(addServiceMapping.mock.calls[0][1]).toBe('svc1');
    expect(addServiceMapping.mock.calls[0][2]).toBe(expectedOrgId);
    expect(addServiceMapping.mock.calls[0][5]).toBe(req.id);
  });

  it('then the user is redirected to the migration complete view when the request is valid', async () => {
    await postCreateNewPassword(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe(`/${req.params.uuid}/migration/complete`);
  });

  it('then the users role is set with the organisation', async () => {
    await postCreateNewPassword(req, res);

    expect(setUsersRoleAtOrg).toHaveBeenCalledTimes(1);
    expect(setUsersRoleAtOrg.mock.calls[0][0]).toBe(expectedUserId);
    expect(setUsersRoleAtOrg.mock.calls[0][1]).toBe(expectedOrgId);
    expect(setUsersRoleAtOrg.mock.calls[0][2]).toBe(10000);
  });
});
