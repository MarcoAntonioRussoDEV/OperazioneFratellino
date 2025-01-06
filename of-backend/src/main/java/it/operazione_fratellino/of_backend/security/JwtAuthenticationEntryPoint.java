package it.operazione_fratellino.of_backend.security;

import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        //        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token scaduto o non valido.");
        LogUtils.log(String.format("Responding with unauthorized error. Message - {%s}", authException.getMessage()), SeverityEnum.ERROR);

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        PrintWriter writer = response.getWriter();
        if("TokenExpired".equals(authException.getMessage())){
            writer.write("{\"message\": \"TokenExpired\"}");
        }else{
            writer.write("{\"message\": \"TokenError\"}");
        }
        writer.flush();
        writer.close();
    }
}

