package org.example.demo.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

// Execute Before Executing Spring Security Filters
// Validate the JWT Token and Provides user details to Spring Security for Authentication
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private JwtTokenProvider jwtTokenProvider;

    private UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(HandlerExceptionResolver handlerExceptionResolver, JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Lấy JWT token từ yêu cầu HTTP
        String token = getTokenFromRequest(request);

        try {
            // Xác thực Token
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                // Lấy username từ token
                String username = jwtTokenProvider.getUsername(token);

                // Lấy thông tin người dùng từ username
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Tạo đối tượng authenticationToken để cung cấp thông tin người dùng cho Spring Security
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Thiết lập chi tiết cho authenticationToken
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Thiết lập authentication vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        } catch (ExpiredJwtException ex) {
            log.error("JWT Token expired: {}", ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // Set status 401
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"JWT token is expired. Please login again.\"}");
            return;
        } catch (MalformedJwtException ex) {
            log.error("Malformed JWT: {}", ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // Set status 401
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Malformed JWT token. Please check the token.\"}");
            return;
        } catch (SignatureException ex) {
            log.error("Invalid signature: {}", ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // Set status 401
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid token signature.\"}");
            return;
        } catch (Exception ex) {
            log.error("Authentication failed: {}", ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // Set status 401
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Authentication failed. Please check the token.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }



    private String getTokenFromRequest(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");

        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7, bearerToken.length());
        }

        return null;
    }
}