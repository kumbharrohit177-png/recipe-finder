package com.recipefinder.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @ElementCollection
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "ingredients")
    private List<String> ingredients = new ArrayList<>();

    @Column(length = 2000)
    private String instructions;

    private Integer cookingTime; // in minutes

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Size(max = 50)
    private String cuisine;

    @Column(length = 500)
    private String imageUrl;

    @Size(max = 50)
    private String category;

    public Recipe() {
    }

    public Recipe(String name, List<String> ingredients, String instructions,
                  Integer cookingTime, Difficulty difficulty, String cuisine,
                  String imageUrl, String category) {
        this.name = name;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.cookingTime = cookingTime;
        this.difficulty = difficulty;
        this.cuisine = cuisine;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getIngredients() { return ingredients; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public Integer getCookingTime() { return cookingTime; }
    public void setCookingTime(Integer cookingTime) { this.cookingTime = cookingTime; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}