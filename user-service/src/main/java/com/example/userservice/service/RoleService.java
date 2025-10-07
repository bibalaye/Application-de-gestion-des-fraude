package com.example.userservice.service;

import com.example.userservice.exception.RoleNotFoundException;
import com.example.userservice.model.Role;
import com.example.userservice.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role createRole(Role role) {
        //vérifier si le role existe déjà
        if (roleRepository.findByName(role.getName()).isPresent()) {
            throw new RuntimeException("Role already exists");
        }
        //si le role n'existe pas, on l'enregistre
        return roleRepository.save(role);
    }

    public Role updateRole(Long id, Role roleDetails) {
        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with id: " + id));

        existingRole.setName(roleDetails.getName());
        // Mettez à jour d'autres champs si nécessaire

        return roleRepository.save(existingRole);
    }
    public void deleteRole(Long id) {

        roleRepository.deleteById(id);
    }
    public Role getRoleByName(String name) {
        return roleRepository.findByName(name).orElse(null);
    }
    public List<Role> getAllRoles() {
        
        return roleRepository.findAll();
    }
    public Role getDefaultRole() {
        return roleRepository.findByName("USER").orElse(null);
    }

    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with id: " + id));
    }
}
