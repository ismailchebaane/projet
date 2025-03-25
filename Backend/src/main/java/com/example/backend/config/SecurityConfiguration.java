package com.example.backend.config;

import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor

public class SecurityConfiguration {

    private final jwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/signin", "/api/auth/login").permitAll() // Public routes
                        
                        // User Management (Only ADMIN can add/update/delete users)
                        .requestMatchers("/add/user", "/api/user", "/api/user/**", "/delete/user/**", "/update/user/**")
                        .hasAuthority("ADMIN")

                        // Equipment Management
                        .requestMatchers("/api/equipment/**").authenticated() // General equipment routes require authentication
                        .requestMatchers("/api/equipment/add", "/api/equipment/update/**", "/api/equipment/delete/**")
                        .hasAuthority("ADMIN") // Only ADMIN can add, update, or delete equipment

                        // Document Management (Admins can delete/update, but users can view)
                        .requestMatchers("/api/document/**").authenticated()
                        .requestMatchers("/api/document/delete/**", "/api/document/update/**").hasAuthority("ADMIN")

                        .anyRequest().authenticated() // All other requests require authentication
                )
                .sessionManagement(session -> 
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}