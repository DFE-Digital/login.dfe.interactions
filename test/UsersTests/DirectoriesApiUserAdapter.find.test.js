jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');
const rp = require('login.dfe.request-promise-retry');

describe('When finding a user with the api', () => {
  const username = 'user.one@unit.tests';
  const bearerToken = 'some-token';

  let jwtGetBearerToken;

  let directoriesApiUserAdapter;

  beforeEach(() => {
    rp.mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue(bearerToken);
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation(jwtConfig => ({
      getBearerToken: jwtGetBearerToken,
    }));

    const config = require('./../../src/infrastructure/Config');
    config.mockImplementation(() => ({
      directories: {
        service: {
          url: 'https://directories.login.dfe.test',
        },
      }
    }));

    directoriesApiUserAdapter = require('./../../src/infrastructure/Users/DirectoriesApiUserAdapter');
  });


   it('it calls the clients directory at the user endpoint with the user identifier', async () => {
     await directoriesApiUserAdapter.find(username);

     expect(rp.mock.calls[0][0].method).toBe('GET');
     expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/users/${username}`);
   });
});
