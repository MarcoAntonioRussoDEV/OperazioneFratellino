package it.operazione_fratellino.of_backend.utils;


import it.operazione_fratellino.of_backend.entities.Role;

public class AuthorityUtils {

    public static boolean hasAccess(Role userRole, AutorityEnum requiredRole) {
        try {
            AutorityEnum userRoleEnum = AutorityEnum.valueOf(userRole.getAuthority().toUpperCase());
            return userRoleEnum.compareTo(requiredRole) >= 0;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}