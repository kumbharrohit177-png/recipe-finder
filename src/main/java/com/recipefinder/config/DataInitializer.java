package com.recipefinder.config;

import com.recipefinder.model.ERole;
import com.recipefinder.model.Role;
import com.recipefinder.model.Recipe;
import com.recipefinder.model.Difficulty;
import com.recipefinder.repository.RoleRepository;
import com.recipefinder.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure roles exist
        createRoleIfNotFound(ERole.ROLE_USER);
        createRoleIfNotFound(ERole.ROLE_ADMIN);

        // Add sample recipes if none exist
        if (recipeRepository.count() == 0) {
            addSampleRecipes();
        }

        System.out.println("Data initialization completed successfully");
    }

    private void createRoleIfNotFound(ERole roleName) {
        Optional<Role> role = roleRepository.findByName(roleName);
        if (!role.isPresent()) {
            Role newRole = new Role();
            newRole.setName(roleName);
            roleRepository.save(newRole);
            System.out.println("Created role: " + roleName);
        }
    }

    private void addSampleRecipes() {
        List<Recipe> recipes = Arrays.asList(
                // Add your 100 recipes here with imageUrl and category
                new Recipe("Spaghetti Carbonara",
                        Arrays.asList("Spaghetti", "Eggs", "Pancetta", "Cheese", "Black Pepper"),
                        "1. Cook pasta al dente\n2. Fry pancetta until crispy\n3. Whisk eggs with parmesan\n4. Combine everything while hot",
                        20, Difficulty.MEDIUM, "Italian",
                        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        "dinner"),

                new Recipe("Chicken Curry",
                        Arrays.asList("Chicken", "Curry Powder", "Coconut Milk", "Onions", "Garlic"),
                        "1. Sauté onions and garlic\n2. Add chicken and brown\n3. Add curry spices\n4. Simmer with coconut milk",
                        40, Difficulty.MEDIUM, "Indian",
                        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        "dinner")
                // Add more recipes...
        );

        recipeRepository.saveAll(recipes);
        System.out.println("Added " + recipes.size() + " sample recipes");
    }
}