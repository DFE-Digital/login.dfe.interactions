const create = async () => {
  return Promise.resolve({ id: '33421d3e-54ba-44ac-c453-2d42b9a05492' });
};
const getRolesOfService = async (serviceId, correlationId) => {
  return Promise.resolve([
    {
      id: 'D8CB7D4D-BB9F-4F32-AAD5-103993DB90BB',
      name: 'Role 1',
      code: 'role1',
      status: {
        id: 1,
      },
    },
  ]);
};
const getUsersAccessForServiceInOrganisation = async (userId, serviceId, organisationId, correlationId) => {
  return undefined;
};
const getUsersWithAccessToServiceInOrganisation = async (serviceId, organisationId, pageNumber, correlationId) => {
  return Promise.resolve({
    services: [],
    page: 1,
    totalNumberOfPages: 0,
    totalNumberOfRecords: 0,
  });
};

const listUserServices = async (userId, correlationId) => {
  return undefined;
};

module.exports = {
  create,
  getRolesOfService,
  getUsersAccessForServiceInOrganisation,
  getUsersWithAccessToServiceInOrganisation,
  listUserServices,
};
