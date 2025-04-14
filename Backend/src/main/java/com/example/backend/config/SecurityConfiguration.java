package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final jwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfiguration(jwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider, CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Ensure the CORS configuration is applied
                .csrf(csrf -> csrf.disable()) // Disable CSRF if using JWT
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/signin", "/api/auth/login").permitAll() 
                        .requestMatchers("/add/user", "/api/user", "/api/user/**", "/delete/user/**","/update/user/{userName}", "/update/user/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/equipment/**").authenticated()
                        .requestMatchers("/api/equipment/add", "/api/equipment/update/**", "/api/equipment/delete/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/document/**").authenticated()
                        .requestMatchers("/api/document/delete/**", "/api/document/update/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/equipment/{equipmentId}/document/{fileIdToReplace}").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
