package com.cyberwatch.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(Customizer.withDefaults())

                .csrf(csrf ->
                        csrf.disable()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * CORS preflight
                         */
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        /*
                         * AUTH
                         *
                         * Login + Register
                         * accessibles sans JWT.
                         */
                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()


                        /*
                         * USERS / ADMINISTRATION
                         *
                         * Liste complète des utilisateurs
                         * et modification des rôles :
                         * ADMIN uniquement.
                         */
                        .requestMatchers(
                                "/api/users/analysts"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )

                        .requestMatchers(
                                "/api/users/**"
                        )
                        .hasRole("ADMIN")


                        /*
                         * SECURITY ALERTS
                         *
                         * USER peut consulter.
                         * ANALYST et ADMIN peuvent modifier.
                         */

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/alerts/**"
                        )
                        .hasAnyRole(
                                "USER",
                                "ANALYST",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/alerts/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/alerts/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/alerts/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )


                        /*
                         * INCIDENTS
                         *
                         * Réservés aux analystes SOC
                         * et administrateurs.
                         */

                        .requestMatchers(
                                "/api/incidents/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )


                        /*
                         * MACHINES
                         *
                         * USER peut consulter.
                         * ANALYST / ADMIN peuvent modifier.
                         */

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/machines/**"
                        )
                        .hasAnyRole(
                                "USER",
                                "ANALYST",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/machines/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/machines/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/machines/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/machines/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )


                        /*
                         * SECURITY EVENTS
                         *
                         * Pour le moment :
                         * ANALYST + ADMIN.
                         *
                         * Plus tard, on pourra créer
                         * une authentification dédiée
                         * aux agents/machines.
                         */
                        .requestMatchers(
                                "/api/events/**"
                        )
                        .hasAnyRole(
                                "ANALYST",
                                "ADMIN"
                        )


                        /*
                         * Toute autre requête
                         * nécessite au minimum
                         * une authentification.
                         */
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:4200"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}