package com.recipefinder.service;

import com.recipefinder.model.Recipe;
import com.recipefinder.model.Difficulty;
import com.recipefinder.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    @Autowired
    private RecipeRepository recipeRepository;

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    public Recipe saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }

    public List<Recipe> searchRecipes(String query) {
        // Search by name, ingredients, cuisine, and instructions
        List<Recipe> nameResults = recipeRepository.findByNameContainingIgnoreCase(query);
        List<Recipe> ingredientResults = recipeRepository.findByIngredientContainingIgnoreCase(query);
        List<Recipe> cuisineResults = recipeRepository.findByCuisineContainingIgnoreCase(query);
        List<Recipe> instructionResults = recipeRepository.findByInstructionsContainingIgnoreCase(query);
        
        // Combine results and remove duplicates
        List<Recipe> allResults = new ArrayList<>();
        allResults.addAll(nameResults);
        allResults.addAll(ingredientResults);
        allResults.addAll(cuisineResults);
        allResults.addAll(instructionResults);
        
        // Remove duplicates based on recipe ID
        return allResults.stream()
                .collect(Collectors.toMap(Recipe::getId, recipe -> recipe, (existing, replacement) -> existing))
                .values()
                .stream()
                .collect(Collectors.toList());
    }

    public List<Recipe> searchByCuisine(String cuisine) {
        return recipeRepository.findByCuisineContainingIgnoreCase(cuisine);
    }

    public List<Recipe> searchByIngredient(String ingredient) {
        return recipeRepository.findByIngredientContainingIgnoreCase(ingredient);
    }

    public List<Recipe> searchByInstructions(String instruction) {
        return recipeRepository.findByInstructionsContainingIgnoreCase(instruction);
    }

    public List<Recipe> filterByDifficulty(String difficulty) {
        try {
            Difficulty difficultyEnum = Difficulty.valueOf(difficulty.toUpperCase());
            return recipeRepository.findByDifficulty(difficultyEnum);
        } catch (IllegalArgumentException e) {
            // Return empty list if difficulty is invalid
            return new ArrayList<>();
        }
    }
}
