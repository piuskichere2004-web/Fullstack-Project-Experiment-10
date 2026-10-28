
package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createDefaultUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            User user = userRepository
                    .findByUsername("Pius Kichere")
                    .orElseGet(() -> new User(
                            "Pius Kichere",
                            "Pius Kichere",
                            passwordEncoder.encode("24BAI70989"),
                            "STUDENT"
                    ));

            user.setFullName("Pius Kichere");
            user.setPassword(passwordEncoder.encode("24BAI70989"));
            user.setRole("STUDENT");

            userRepository.save(user);

            System.out.println(
                    "LearnSphere user account initialized successfully."
            );
        };
    }
}
