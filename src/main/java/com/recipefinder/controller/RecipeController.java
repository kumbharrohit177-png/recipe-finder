package com.recipefinder.controller;

import com.recipefinder.model.Recipe;
import com.recipefinder.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    @Autowired
    private RecipeService recipeService;

    @GetMapping("/public")
    public ResponseEntity<List<Recipe>> getAllPublicRecipes() {
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        Optional<Recipe> recipe = recipeService.getRecipeById(id);
        return recipe.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<Recipe>> searchRecipes(@RequestParam String query) {
        return ResponseEntity.ok(recipeService.searchRecipes(query));
    }

    @GetMapping("/public/cuisine")
    public ResponseEntity<List<Recipe>> searchByCuisine(@RequestParam String cuisine) {
        return ResponseEntity.ok(recipeService.searchByCuisine(cuisine));
    }

    @GetMapping("/public/ingredient")
    public ResponseEntity<List<Recipe>> searchByIngredient(@RequestParam String ingredient) {
        return ResponseEntity.ok(recipeService.searchByIngredient(ingredient));
    }

    @GetMapping("/public/instructions")
    public ResponseEntity<List<Recipe>> searchByInstructions(@RequestParam String instruction) {
        return ResponseEntity.ok(recipeService.searchByInstructions(instruction));
    }

    @GetMapping("/public/difficulty")
    public ResponseEntity<List<Recipe>> filterByDifficulty(@RequestParam String difficulty) {
        return ResponseEntity.ok(recipeService.filterByDifficulty(difficulty));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
        return ResponseEntity.ok(recipeService.saveRecipe(recipe));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
        if (!recipeService.getRecipeById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        recipe.setId(id);
        return ResponseEntity.ok(recipeService.saveRecipe(recipe));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        if (!recipeService.getRecipeById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        recipeService.deleteRecipe(id);
        return ResponseEntity.ok().build();
    }
}
