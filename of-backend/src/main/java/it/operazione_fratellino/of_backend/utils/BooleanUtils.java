package it.operazione_fratellino.of_backend.utils;

import org.springframework.stereotype.Component;

@Component
public class BooleanUtils {

    public static Boolean exists(Object obj){
        return obj != null;
    }
}
