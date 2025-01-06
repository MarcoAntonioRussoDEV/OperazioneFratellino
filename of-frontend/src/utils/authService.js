import { USER_ROLES } from './userRoles';

// export const login = async (username, password) => {
//   const response = await axios.post(`${BASE_URL}auth/login`, {
//     username,
//     password,
//   });
//   return response.data;
// };

export const hasAccess = (userRole, requiredRole) => {
  const rolesHierarchy = [...Object.values(USER_ROLES)];
  return (
    rolesHierarchy.indexOf(userRole) >= rolesHierarchy.indexOf(requiredRole)
  );
};
