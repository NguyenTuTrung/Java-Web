//package org.example.demo.config.security;
//
//import org.example.demo.filters.JwtTokenFilter;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.HttpStatusEntryPoint;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import static org.springframework.http.HttpMethod.*;
//
//@Configuration
//@EnableWebSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//    private final JwtTokenFilter jwtTokenFilter;
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
//        return authConfig.getAuthenticationManager();
//    }
//
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
//                .exceptionHandling(customizer -> customizer
//                        .authenticationEntryPoint((request, response, authException) -> {
//                            System.out.println("Authentication failed: " + authException.getMessage());
//                            System.out.println("Failed request path: " + request.getServletPath());
//                            new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
//                                    .commence(request, response, authException);
//                        }))
//                .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(requests -> {
//                    requests
//                            .requestMatchers(
//                                    "/users/register",
//                                    "/users/login"
//                            ).permitAll()
//                            // client
//                            .requestMatchers(GET, "cart/new-cart").permitAll()
//                            .requestMatchers(GET, "productDetails/abc").permitAll()
//                            .requestMatchers(GET, "color/color-list").permitAll()
//                            .requestMatchers(GET, "size/size-list").permitAll()
//                            .requestMatchers(GET, "cart/check-cart-active/*").permitAll()
//                            .requestMatchers(GET, "product/*").permitAll()
//                            .requestMatchers(POST, "cart-details/create").permitAll()
//                            .requestMatchers(GET, "productDetails/product-detail-of-product/*").permitAll()
//                            .requestMatchers(GET, "cart-details/in-cart/*").permitAll()
//                            .requestMatchers(GET, "cart/detail/*").permitAll()
//                            .requestMatchers(POST, "cart/use-voucher").permitAll()
//                            .requestMatchers(PUT, "cart/v2/*").permitAll()
//                            .requestMatchers(GET, "payment/vn-pay").permitAll()
//                            .requestMatchers(PUT, "orders/status/change/*").permitAll()
//                            .requestMatchers(GET, "orders/by-code/*").permitAll()
//                            .requestMatchers(GET, "cart-details/quantity/update/*").permitAll()
//                            // role
//                            .requestMatchers(GET, "/roles**").permitAll()
//                            // product
//                            .requestMatchers(GET, "/products/**").permitAll()
//                            .requestMatchers(GET, "/products/images/*").permitAll()
//                            // order
//                            .requestMatchers(GET, "/orders/**").permitAll()
//                            .requestMatchers(GET, "/order_details/**").permitAll()
//                            // voucher
//                            .requestMatchers(GET, "/voucher/**").permitAll()
//                            .requestMatchers(POST, "/voucher/**").hasRole("ADMIN")
//                            .requestMatchers(PUT, "/voucher/**").hasRole("ADMIN")
//                            .requestMatchers(DELETE, "/voucher/**").hasRole("ADMIN")
//                            // customer
//                            .requestMatchers(GET, "/customer/*").permitAll()
//                            // statistics
//                            .requestMatchers("/statistics/**").hasAnyRole("STAFF", "ADMIN")
//
//                            .anyRequest()
//                            .permitAll();
//                })
//                .csrf(AbstractHttpConfigurer::disable);
//
//        return http.build();
//    }
//}