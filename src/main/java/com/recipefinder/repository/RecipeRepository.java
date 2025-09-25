package com.recipefinder.repository;

import com.recipefinder.model.Recipe;
import com.recipefinder.model.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByNameContainingIgnoreCase(String name);

    @Query("SELECT r FROM Recipe r WHERE LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :cuisine, '%'))")
    List<Recipe> findByCuisineContainingIgnoreCase(@Param("cuisine") String cuisine);

    @Query("SELECT DISTINCT r FROM Recipe r JOIN r.ingredients i WHERE LOWER(i) LIKE LOWER(CONCAT('%', :ingredient, '%'))")
    List<Recipe> findByIngredientContainingIgnoreCase(@Param("ingredient") String ingredient);

    @Query("SELECT r FROM Recipe r WHERE LOWER(r.instructions) LIKE LOWER(CONCAT('%', :instruction, '%'))")
    List<Recipe> findByInstructionsContainingIgnoreCase(@Param("instruction") String instruction);

    List<Recipe> findByDifficulty(Difficulty difficulty);
}