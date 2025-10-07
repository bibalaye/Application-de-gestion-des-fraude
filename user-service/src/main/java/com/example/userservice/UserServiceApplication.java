package com.example.userservice;

import com.example.userservice.model.Role;
import com.example.userservice.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner initRoles(RoleRepository roleRepository) {
		return args -> {
			// Vérifier si le rôle "USER" existe, sinon le créer
			if (roleRepository.findByName("USER").isEmpty()) {
				Role userRole = new Role();
				userRole.setName("USER");
				roleRepository.save(userRole);
				System.out.println("Rôle 'USER' créé.");
			}
			// Vous pouvez ajouter d'autres rôles ici si nécessaire
			// if (roleRepository.findByName("ADMIN").isEmpty()) {
			//     Role adminRole = new Role();
			//     adminRole.setName("ADMIN");
			//     roleRepository.save(adminRole);
			//     System.out.println("Rôle 'ADMIN' créé.");
			// }
		};
	}
} 