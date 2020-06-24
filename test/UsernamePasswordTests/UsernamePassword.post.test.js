const CryptoJS = require('crypto-js');

jest.mock('login.dfe.audit.winston-sequelize-transport');
jest.mock('./../../src/infrastructure/logger', () => ({}));
jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
    hostingEnvironment: {},
    osaApi: {
        type: 'static',
    }
})));
jest.mock('./../../src/infrastructure/oidc', () => ({
    getInteractionById: jest.fn(),
}));
jest.mock('./../../src/infrastructure/applications', () => ({
    getServiceById: jest.fn(),
}));
jest.mock('./../../src/infrastructure/Config', () => {
    return jest.fn().mockImplementation(() => {
        return {
            hostingEnvironment: {},
            notifications: {
                connectionString: {},
            },
            applications: {
                type: 'static',
            },
            crypto: {
                key: 'test-key'
            }
        };
    });
});
const utils = require('./../utils');

describe('When user submits username/password', () => {
    let req;
    let res;
    let interactionCompleteProcess;
    let usersAuthenticate;
    let osaAuthenticate;
    let findByLegacyUsername;
    let clientsGet;
    let loggerAudit;
    let saUsersFind;
    let getInteractionById;

    let postHandler;

    beforeEach(() => {
        req = utils.mockRequest();
        req.query.clientid = 'test';
        req.query.redirect_uri = 'http://test';
        req.body.username = 'Tony@Stark.com';
        req.body.password = 'IAmIronman!';
        req.params.uuid = 'some-uuid';
        req.csrfToken.mockReturnValue('my-secure-token');

        res = utils.mockResponse();

        interactionCompleteProcess = jest.fn();
        const interactionComplete = require('./../../src/app/InteractionComplete');
        interactionComplete.process = interactionCompleteProcess;

        usersAuthenticate = jest.fn();
        findByLegacyUsername = jest.fn();
        const users = require('./../../src/infrastructure/Users');
        users.authenticate = usersAuthenticate;
        users.findByLegacyUsername = findByLegacyUsername;
        findByLegacyUsername.mockReset().mockReturnValue(null);

        osaAuthenticate = jest.fn();
        const osaAuth = require('./../../src/infrastructure/osa');
        osaAuth.authenticate = osaAuthenticate;

        saUsersFind = jest.fn().mockReturnValue(null);
        osaAuth.getSaUser = saUsersFind;

        clientsGet = jest.fn().mockReturnValue({
            relyingParty: {
                client_id: 'test',
            }
        });
        const applications = require('./../../src/infrastructure/applications');
        applications.getServiceById = clientsGet;

        loggerAudit = jest.fn();
        const logger = require('./../../src/infrastructure/logger');
        logger.audit = loggerAudit;
        logger.info = jest.fn();

        getInteractionById = require('./../../src/infrastructure/oidc').getInteractionById;
        getInteractionById.mockReset().mockReturnValue({
            client_id: 'test',
            redirect_uri: 'http://test',
        });

        postHandler = require('./../../src/app/UsernamePassword/postUsernamePassword');
    });

    describe('with a invalid username/password', () => {
        beforeEach(() => {
            usersAuthenticate.mockReturnValue(null);
        });

        it('then it should render usernamepassword view', async () => {
            await postHandler(req, res);

            expect(res.render.mock.calls).toHaveLength(1);
            expect(res.render.mock.calls[0][0]).toBe('UsernamePassword/views/index');
        });

        it('then a validation message will appear if the email is not present', async () => {
            req.body.username = '';

            await postHandler(req, res);

            expect(res.render.mock.calls[0][1].validationMessages.username).toBe('Please enter your email address');
        });

        it('then a validation message will appear if the username is not present and set to allow usernames', async () => {
            clientsGet.mockReset().mockReturnValue({
                relyingParty: {
                    client_id: 'test',
                    params: {
                        supportsUsernameLogin: true,
                    },
                },
            });
            req.body.username = '';

            await postHandler(req, res);

            expect(res.render.mock.calls[0][1].validationMessages.username).toBe('Please enter your email address or username');
        });

        it('then a validation message will appear if the email is not in the correct format', async () => {
            req.body.username = 'Tony';

            await postHandler(req, res);

            expect(res.render.mock.calls[0][1].validationMessages.username).toBe('Please enter a valid email address');
        });

        it('then a validation message will appear if the password is not present', async () => {
            req.body.password = '';

            await postHandler(req, res);

            expect(res.render.mock.calls[0][1].validationMessages.password).toBe('Please enter your password');
        });

        it('then a validation message will appear if the email and password is not present', async () => {
            req.body.password = '';
            req.body.username = '';

            await postHandler(req, res);

            expect(res.render.mock.calls[0][1].validationMessages.password).toBe('Please enter your password');
            expect(res.render.mock.calls[0][1].validationMessages.username).toBe('Please enter your email address');
        });

        it('then a validation message will appear if the email and password is not present', async () => {
            req.body.password = '';
            req.body.username = 'Tony';

            await postHandler(req, res);

            expect(res.render.mock.calls[0][1].validationMessages.password).toBe('Please enter your password');
            expect(res.render.mock.calls[0][1].validationMessages.username).toBe('Please enter a valid email address');
        });

        it('then it should be a failed login', async () => {
            await postHandler(req, res);

            expect(res.render.mock.calls[0][1].isFailedLogin).toBe(true);
            expect(res.render.mock.calls[0][1].validationMessages.loginError).toBe('Sorry, we did not recognise your sign-in details, please try again.');
        });

        it('then it should include the csrf token', async () => {
            await postHandler(req, res);

            expect(res.render.mock.calls[0][1].csrfToken).toBe('my-secure-token');
        });

        it('then it should audit a failed login attempt', async () => {
            await postHandler(req, res);

            expect(loggerAudit.mock.calls).toHaveLength(1);
            expect(loggerAudit.mock.calls[0][0]).toBe(`Failed login attempt for ${req.body.username}`);
            expect(loggerAudit.mock.calls[0][1]).toMatchObject({
                type: 'sign-in',
                subType: 'username-password',
                success: false,
                userEmail: req.body.username,
            });
        });
    });

    describe('with a valid username/password', () => {
        beforeEach(() => {
            usersAuthenticate.mockReturnValue({
                id: 'user1',
            });
            osaAuthenticate.mockReturnValue({
                email: 'test@test.com',
                firstName: 'Test',
                lastName: 'Tester',
                services: [
                    {
                        id: 'service1',
                    },
                ],
            });
        });

        it('then it should process interaction complete for uuid', async () => {
            await postHandler(req, res);

            expect(interactionCompleteProcess.mock.calls).toHaveLength(1);
            expect(interactionCompleteProcess.mock.calls[0][0]).toBe('some-uuid');
        });

        it('then it should process interaction complete for userid', async () => {
            await postHandler(req, res);
            const decrypted = CryptoJS.AES.decrypt(interactionCompleteProcess.mock.calls[0][1].uid, 'test-key');
            const result = decrypted.toString(CryptoJS.enc.Utf8);
            expect(interactionCompleteProcess.mock.calls[0][1]).not.toBeNull();
            expect(result).toBe('user1');
        });

        it('then it should process interaction complete for usernamepassword type', async () => {
            await postHandler(req, res);

            expect(interactionCompleteProcess.mock.calls[0][1]).not.toBeNull();
            expect(interactionCompleteProcess.mock.calls[0][1].type).toBe('usernamepassword');
        });

        it('then it should return success', async () => {
            await postHandler(req, res);

            expect(interactionCompleteProcess.mock.calls[0][1]).not.toBeNull();
            expect(interactionCompleteProcess.mock.calls[0][1].status).toBe('success');
        });

        it('then it validates against the OSA api if client is configured and the username is not an email', async () => {
            req.body.username = 'foo';
            clientsGet.mockReset().mockReturnValue({
                id: 'service1',
                relyingParty: {
                    client_id: 'test',
                    params: {
                        supportsUsernameLogin: true,
                        serviceId: 'service1',
                    },
                },
            });

            await postHandler(req, res);

            expect(osaAuthenticate.mock.calls).toHaveLength(1);
            expect(osaAuthenticate.mock.calls[0][0]).toBe('foo');
            expect(osaAuthenticate.mock.calls[0][1]).toBe('IAmIronman!');
        });

        it('then it checks to see if the username is already migrated if successfully authenticated', async () => {
            req.body.username = 'foo';
            clientsGet.mockReset().mockReturnValue({
                id: 'service1',
                relyingParty: {
                    client_id: 'test',
                    params: {
                        supportsUsernameLogin: true,
                        serviceId: 'service1',
                    },
                },
            });

            await postHandler(req, res);

            expect(findByLegacyUsername.mock.calls).toHaveLength(1);
            expect(findByLegacyUsername.mock.calls[0][0]).toBe('foo');
        });

        it('then if the username has been authenticated and user has migrated an audit record is created and the user is redirected', async () => {
            findByLegacyUsername.mockReset().mockReturnValue({sub: '1234'});
            req.body.username = 'foo';
            clientsGet.mockReset().mockReturnValue({
                relyingParty: {
                    client_id: 'test',
                    params: {
                        supportsUsernameLogin: true,
                    },
                }
            });

            await postHandler(req, res);

            expect(loggerAudit.mock.calls).toHaveLength(1);
            expect(res.redirect.mock.calls).toHaveLength(1);
            expect(res.redirect.mock.calls[0][0]).toBe('/some-uuid/migration/already-migrated');

        });

        it('then it redirects to the migration page if the login is successful through osa API', async () => {
            req.body.username = 'foo';
            clientsGet.mockReset().mockReturnValue({
                id: 'service1',
                relyingParty: {
                    client_id: 'test',
                    params: {
                        supportsUsernameLogin: true,
                        serviceId: 'service1',
                    },
                },
            });

            await postHandler(req, res);

            expect(res.redirect.mock.calls).toHaveLength(1);
            expect(res.redirect.mock.calls[0][0]).toBe('/some-uuid/migration');
        });

        it('then it should audit a successful login attempt', async () => {
            await postHandler(req, res);

            expect(loggerAudit.mock.calls).toHaveLength(1);
            expect(loggerAudit.mock.calls[0][0]).toBe(`Successful login attempt for ${req.body.username} (id: user1)`);
            expect(loggerAudit.mock.calls[0][1]).toMatchObject({
                type: 'sign-in',
                subType: 'username-password',
                success: true,
                userId: 'user1',
                userEmail: req.body.username,
            });
        });
    });

    describe('with an invalid client id', () => {
        beforeEach(() => {
            clientsGet.mockReturnValue(null);
        });

        it('then is should complete interaction', async () => {
            await postHandler(req, res);

            expect(interactionCompleteProcess.mock.calls).toHaveLength(1);
            expect(interactionCompleteProcess.mock.calls[0][0]).toBe('some-uuid');
        });

        it('then it should return a failure', async () => {
            await postHandler(req, res);

            expect(interactionCompleteProcess.mock.calls[0][1]).not.toBeNull();
            expect(interactionCompleteProcess.mock.calls[0][1].status).toBe('failed');
            expect(interactionCompleteProcess.mock.calls[0][1].reason).toBe('invalid clientid');
        });
    });

    describe('with an invalid interation id', () => {
        beforeEach(() => {
            getInteractionById.mockReturnValue(undefined);
        });

        it('then it should redirect to origin with error', async () => {
            await postHandler(req, res);

            expect(res.redirect.mock.calls).toHaveLength(1);
            expect(res.redirect.mock.calls[0][0]).toBe('http://test?error=sessionexpired');
        });
    });
});
