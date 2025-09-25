// Recipe Manager for Smart Recipe Finder
console.log('recipes.js loaded v2025-09-20-23:46 - Instructions should display from existing data');

class RecipeManager {
    constructor() {
        this.currentRecipes = [];
        this.currentPage = 0;
        this.pageSize = 4; // Show 4 recipes per page for better load more experience
        this.hasMore = true;
        this.setupEventListeners();
        this.loadRecipes();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => this.searchRecipes());
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchRecipes();
            }
        });

        // Filter functionality
        document.getElementById('cuisine-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('difficulty-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('time-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('category-filter').addEventListener('change', () => this.applyFilters());

        // Add recipe form
        document.getElementById('recipe-form').addEventListener('submit', (e) => this.handleAddRecipe(e));

        // Load more
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreRecipes());
        }
        
        // Test recipe button - Check if element exists before adding listener
        const testRecipeBtn = document.getElementById('test-recipe-btn');
        if (testRecipeBtn) {
            testRecipeBtn.addEventListener('click', () => this.testViewRecipe());
        }

        // Note: View recipe buttons are handled by event delegation in app.js
        console.log('Recipe manager event listeners set up successfully');
    }

    async loadRecipes() {
        this.showLoading(true);
        this.currentPage = 0;
        this.hasMore = true;

        try {
            console.log('Loading recipes from /api/recipes/public');
            const response = await fetch('/api/recipes/public');
            console.log('Recipes response status:', response.status);
            
            if (response.ok) {
                const apiRecipes = await response.json();
                console.log('Loaded recipes from API:', apiRecipes);
                if (apiRecipes && apiRecipes.length > 0) {
                    this.currentRecipes = apiRecipes;
                    this.displayRecipes(this.currentRecipes.slice(0, this.pageSize));
                    this.hasMore = this.currentRecipes.length > this.pageSize;
                    this.updateLoadMoreButton();
                } else {
                    console.log('No recipes from API, loading sample recipes');
                    this.loadSampleRecipes();
                }
            } else {
                const errorText = await response.text();
                console.error('Failed to load recipes:', response.status, errorText);
                console.log('Loading sample recipes as fallback');
                this.loadSampleRecipes();
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
            console.log('Loading sample recipes as fallback');
            this.loadSampleRecipes();
        } finally {
            this.showLoading(false);
        }
    }

    async loadMoreRecipes() {
        console.log('=== loadMoreRecipes called ===');
        console.log('Current page:', this.currentPage);
        console.log('Page size:', this.pageSize);
        console.log('Has more:', this.hasMore);
        console.log('Total recipes:', this.currentRecipes.length);
        
        if (!this.hasMore) {
            console.log('No more recipes to load');
            return;
        }

        this.currentPage++;
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        console.log('Loading recipes from index', startIndex, 'to', endIndex);
        
        const moreRecipes = this.currentRecipes.slice(startIndex, endIndex);
        console.log('More recipes to display:', moreRecipes.length);

        this.displayRecipes(moreRecipes, true);
        this.hasMore = endIndex < this.currentRecipes.length;
        
        console.log('Updated hasMore:', this.hasMore);
        console.log('Remaining recipes:', this.currentRecipes.length - endIndex);
        
        this.updateLoadMoreButton();
        
        // Show notification
        this.showNotification(`Loaded ${moreRecipes.length} more recipes!`, 'success');
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        console.log('=== updateLoadMoreButton ===');
        console.log('Button found:', !!loadMoreBtn);
        console.log('Has more recipes:', this.hasMore);
        
        if (loadMoreBtn) {
            if (!this.hasMore) {
                console.log('Hiding load more button - no more recipes');
                loadMoreBtn.style.display = 'none';
                loadMoreBtn.parentElement.style.display = 'none';
            } else {
                console.log('Showing load more button');
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.parentElement.style.display = 'block';
                // Force visibility
                loadMoreBtn.style.visibility = 'visible';
                loadMoreBtn.style.opacity = '1';
                loadMoreBtn.parentElement.style.visibility = 'visible';
                loadMoreBtn.parentElement.style.opacity = '1';
            }
        } else {
            console.error('Load more button not found in updateLoadMoreButton');
            // Try to create it
            setTimeout(() => this.createLoadMoreButton(), 100);
        }
    }

    forceShowLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.style.visibility = 'visible';
            loadMoreBtn.style.opacity = '1';
            if (loadMoreBtn.parentElement) {
                loadMoreBtn.parentElement.style.display = 'block';
                loadMoreBtn.parentElement.style.visibility = 'visible';
                loadMoreBtn.parentElement.style.opacity = '1';
            }
        } else {
            console.error('Load more button not found in forceShowLoadMoreButton');
            // Try to create it
            setTimeout(() => this.createLoadMoreButton(), 100);
        }
    }

    async searchRecipes() {
        const query = document.getElementById('search-input').value.trim();
        this.showLoading(true);

        try {
            if (!query) {
                // If no query, load all recipes
                await this.loadRecipes();
                return;
            }

            // Search in multiple ways: name, ingredients, and cuisine
            const [nameResults, ingredientResults, cuisineResults] = await Promise.all([
                fetch(`/api/recipes/public/search?query=${encodeURIComponent(query)}`).then(r => r.ok ? r.json() : []),
                fetch(`/api/recipes/public/ingredient?ingredient=${encodeURIComponent(query)}`).then(r => r.ok ? r.json() : []),
                fetch(`/api/recipes/public/cuisine?cuisine=${encodeURIComponent(query)}`).then(r => r.ok ? r.json() : [])
            ]);

            // Combine results and remove duplicates
            const allResults = [...nameResults, ...ingredientResults, ...cuisineResults];
            const uniqueResults = allResults.filter((recipe, index, self) => 
                index === self.findIndex(r => r.id === recipe.id)
            );

            this.currentRecipes = uniqueResults;
            this.displayRecipes(this.currentRecipes);
            
            // Update title
            const titleElement = document.querySelector('#recipes .section-header h2');
            if (titleElement) {
                titleElement.textContent = `Search Results for "${query}"`;
            }
            
            // Show message if no results
            if (uniqueResults.length === 0) {
                this.showNoResultsMessage(query);
            }

        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    showNoResultsMessage(query) {
        const container = document.getElementById('recipes-container');
        container.innerHTML = `
            <div class="no-recipes">
                <i class="fas fa-search" style="font-size: 3rem; color: #6b7280; margin-bottom: 1rem;"></i>
                <h3>No recipes found for "${query}"</h3>
                <p>Try searching for:</p>
                <ul style="text-align: left; max-width: 300px; margin: 1rem auto;">
                    <li>Recipe names (e.g., "pizza", "pasta")</li>
                    <li>Ingredients (e.g., "chicken", "tomato", "cheese")</li>
                    <li>Cuisines (e.g., "italian", "mexican", "chinese")</li>
                </ul>
                <button class="btn btn-primary" onclick="window.recipeManager.loadRecipes()">
                    <i class="fas fa-home"></i> View All Recipes
                </button>
            </div>
        `;
    }

    applyFilters() {
        const cuisine = document.getElementById('cuisine-filter').value;
        const difficulty = document.getElementById('difficulty-filter').value;
        const maxTime = document.getElementById('time-filter').value;
        const category = document.getElementById('category-filter').value;

        let filteredRecipes = this.currentRecipes;

        if (cuisine) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                recipe.cuisine && recipe.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
        }

        if (difficulty) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === difficulty);
        }

        if (maxTime) {
            const maxTimeNum = parseInt(maxTime);
            filteredRecipes = filteredRecipes.filter(recipe => recipe.cookingTime <= maxTimeNum);
        }

        if (category) {
            // This would need additional category field in the recipe model
            filteredRecipes = filteredRecipes.filter(recipe =>
                recipe.category && recipe.category.toLowerCase() === category.toLowerCase());
        }

        this.displayRecipes(filteredRecipes);
    }

    displayRecipes(recipes, append = false) {
        const container = document.getElementById('recipes-container');

        if (recipes.length === 0) {
            if (!append) {
                container.innerHTML = `
                    <div class="no-recipes">
                        <i class="fas fa-search" style="font-size: 3rem; color: #6b7280; margin-bottom: 1rem;"></i>
                        <h3>No recipes found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                `;
            }
            return;
        }

        const recipesHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');

        if (append) {
            container.innerHTML += recipesHTML;
        } else {
            container.innerHTML = recipesHTML;
        }

        // Event listeners are handled globally in app.js
    }

    createRecipeCard(recipe) {
        const imageUrl = recipe.imageUrl || this.getRandomFoodImage();
        const difficultyClass = this.getDifficultyClass(recipe.difficulty);
        
        // Ensure recipe has an ID
        if (!recipe.id) {
            console.error('Recipe missing ID:', recipe);
            return '';
        }

        return `
            <div class="recipe-card">
                <div class="recipe-image">
                    <img src="${imageUrl}" alt="${recipe.name}">
                    <div class="recipe-badge ${difficultyClass}">${recipe.difficulty}</div>
                </div>
                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <p class="recipe-description">${this.truncateText(recipe.instructions || '', 100)}</p>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.cookingTime} min</span>
                        <span><i class="fas fa-chart-line"></i> ${recipe.difficulty}</span>
                        ${recipe.cuisine ? `<span><i class="fas fa-globe"></i> ${recipe.cuisine}</span>` : ''}
                    </div>
                    <div class="recipe-actions">
                        <button class="btn btn-outline view-recipe" data-id="${recipe.id}" type="button">
                            <i class="fas fa-eye"></i> View Recipe
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getRandomFoodImage() {
        const foodImages = [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1484980972926-edee96e0960d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        ];
        return foodImages[Math.floor(Math.random() * foodImages.length)];
    }

    getDifficultyClass(difficulty) {
        switch (difficulty) {
            case 'EASY': return 'easy';
            case 'MEDIUM': return 'medium';
            case 'HARD': return 'hard';
            default: return '';
        }
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    async viewRecipe(recipeId) {
        console.log('=== viewRecipe called ===');
        console.log('Recipe ID:', recipeId);
        console.log('Recipe manager exists:', !!this);
        console.log('Current recipes count:', this.currentRecipes?.length || 0);
        
        // First try to find recipe in current recipes
        const recipe = this.currentRecipes.find(r => r.id == recipeId);
        if (recipe) {
            console.log('Found recipe in current recipes:', recipe.name);
            this.showRecipeModal(recipe);
            return;
        } else {
            console.log('Recipe not found in current recipes, trying API...');
        }
        
        // If not found, try API
        this.showLoading(true);
        try {
            const response = await fetch(`/api/recipes/public/${recipeId}`);
            console.log('API response status:', response.status);
            
            if (response.ok) {
                const recipe = await response.json();
                console.log('Recipe loaded from API:', recipe.name);
                this.showRecipeModal(recipe);
            } else {
                const errorText = await response.text();
                console.error('Failed to load recipe from API:', response.status, errorText);
                // Fallback to local samples
                console.log('Falling back to sample recipes for ID:', recipeId);
                if (!this.currentRecipes || this.currentRecipes.length === 0) {
                    this.loadSampleRecipes();
                }
                const fallback = this.currentRecipes.find(r => r.id == recipeId);
                if (fallback) {
                    console.log('Found fallback sample recipe:', fallback.name);
                    this.showRecipeModal(fallback);
                } else {
                    this.showError(`Recipe not found: ${errorText || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Error viewing recipe:', error);
            this.showError(`Failed to load recipe: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    showRecipeModal(recipe) {
        console.log('=== showRecipeModal called ===');
        console.log('Recipe:', recipe.name);
        console.log('Ingredients count:', recipe.ingredients?.length || 0);
        console.log('Instructions:', recipe.instructions);
        console.log('Instructions type:', typeof recipe.instructions);
        console.log('Instructions length:', recipe.instructions?.length || 0);

        // Validate recipe data
        if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
            console.error('Recipe ingredients missing or invalid:', recipe.ingredients);
            recipe.ingredients = ['No ingredients available'];
        }
        
        if (!recipe.instructions) {
            console.error('Recipe instructions missing:', recipe.instructions);
            recipe.instructions = 'No instructions available';
        }
        
        // Normalize instructions to string in case it's returned as an array or other type
        if (Array.isArray(recipe.instructions)) {
            recipe.instructions = recipe.instructions.map(step => String(step).trim()).filter(Boolean).join('\n');
        } else if (typeof recipe.instructions !== 'string') {
            try {
                recipe.instructions = String(recipe.instructions);
            } catch (e) {
                recipe.instructions = 'No instructions available';
            }
        }
        
        // Format instructions into proper numbered steps
        const formatInstructions = (instructions) => {
            if (!instructions || instructions === 'No instructions available') {
                return '<p>No cooking instructions available</p>';
            }
            
            // Split by newlines and clean up
            let steps = instructions.split(/\n+/).map(step => step.trim()).filter(Boolean);
            
            // If steps don't start with numbers, add them
            const formattedSteps = steps.map((step, index) => {
                // Remove existing numbering if present
                step = step.replace(/^\d+\.\s*/, '');
                // Add proper numbering
                return `<div class="instruction-step">
                    <span class="step-number">${index + 1}.</span>
                    <span class="step-text">${step}</span>
                </div>`;
            });
            
            return formattedSteps.join('');
        };
        
        console.log('Final instructions to display:', recipe.instructions);

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'recipe-modal-' + recipe.id;
        const imageUrl = recipe.imageUrl || this.getRandomFoodImage();

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="recipe-details">
                    <div class="recipe-header">
                        <img src="${imageUrl}" alt="${recipe.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                        <h2>${recipe.name}</h2>
                        <div class="recipe-meta">
                            <span><i class="fas fa-clock"></i> ${recipe.cookingTime} min</span>
                            <span><i class="fas fa-chart-line"></i> ${recipe.difficulty}</span>
                            ${recipe.cuisine ? `<span><i class="fas fa-globe"></i> ${recipe.cuisine}</span>` : ''}
                        </div>
                    </div>

                    <div class="recipe-section">
                        <h3><i class="fas fa-shopping-basket"></i> Ingredients (${recipe.ingredients.length} items)</h3>
                        <ul>
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}
                        </ul>
                        <div class="ingredients-actions">
                            <button class="btn-copy" onclick="copyIngredients('${recipe.name.replace(/'/g, "\\'")}', ${JSON.stringify(recipe.ingredients).replace(/"/g, '&quot;')})">
                                <i class="fas fa-copy"></i> Copy Ingredients
                            </button>
                            <button class="btn-print" onclick="printIngredients('${recipe.name.replace(/'/g, "\\'")}', ${JSON.stringify(recipe.ingredients).replace(/"/g, '&quot;')})">
                                <i class="fas fa-print"></i> Print Shopping List
                            </button>
                        </div>
                    </div>

                    <div class="recipe-section">
                        <h3><i class="fas fa-list-ol"></i> Cooking Instructions</h3>
                        <div class="instructions-container">${formatInstructions(recipe.instructions)}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('active'); // Match CSS: .modal.active { visible }

        console.log('Modal created and displayed');

        // Simple close handlers
        modal.querySelector('.close').addEventListener('click', () => {
            console.log('Modal close button clicked');
            modal.remove();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('Modal backdrop clicked');
                modal.remove();
            }
        });

        // Add global functions for ingredients actions (if not already defined)
        if (!window.copyIngredients) {
            window.copyIngredients = function(recipeName, ingredients) {
                const ingredientsList = ingredients.map(ingredient => `• ${ingredient}`).join('\n');
                const textToCopy = `${recipeName} - Shopping List:\n\n${ingredientsList}`;
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Show success notification
                    const notification = document.createElement('div');
                    notification.className = 'toast success show';
                    notification.innerHTML = '<i class="fas fa-check"></i> Ingredients copied to clipboard!';
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }).catch(err => {
                    console.error('Failed to copy ingredients:', err);
                    alert('Failed to copy ingredients to clipboard');
                });
            };
        }

        if (!window.printIngredients) {
            window.printIngredients = function(recipeName, ingredients) {
                const printWindow = window.open('', '_blank');
                const ingredientsList = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
                
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Shopping List - ${recipeName}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
                            ul { list-style: none; padding: 0; }
                            li { padding: 8px 0; border-bottom: 1px solid #eee; }
                            li:before { content: "☐ "; margin-right: 8px; }
                            .print-date { color: #666; font-size: 0.9em; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <h1>${recipeName} - Shopping List</h1>
                        <div class="print-date">Generated on ${new Date().toLocaleDateString()}</div>
                        <ul>${ingredientsList}</ul>
                    </body>
                    </html>
                `);
                
                printWindow.document.close();
                printWindow.print();
            };
        }
    }

    async handleAddRecipe(e) {
        e.preventDefault();

        if (!window.authManager.isLoggedIn()) {
            window.authManager.showNotification('Please login to add recipes', 'error');
            return;
        }

        const formData = {
            name: document.getElementById('recipe-name').value,
            ingredients: document.getElementById('recipe-ingredients').value.split('\n').filter(line => line.trim()),
            instructions: document.getElementById('recipe-instructions').value,
            cookingTime: parseInt(document.getElementById('recipe-cooking-time').value),
            difficulty: document.getElementById('recipe-difficulty').value,
            cuisine: document.getElementById('recipe-cuisine').value,
            imageUrl: document.getElementById('recipe-image').value,
            category: document.getElementById('recipe-category').value
        };

        // Validate required fields
        if (!formData.name || !formData.ingredients.length || !formData.instructions || !formData.cookingTime) {
            window.authManager.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: window.authManager.getAuthHeader(),
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newRecipe = await response.json();
                window.authManager.showNotification('Recipe added successfully!', 'success');
                document.getElementById('recipe-form').reset();
                this.loadRecipes(); // Reload recipes to show the new one
            } else {
                throw new Error('Failed to add recipe');
            }
        } catch (error) {
            console.error('Error adding recipe:', error);
            window.authManager.showNotification('Failed to add recipe', 'error');
        }
    }

    testViewRecipe() {
        console.log('Testing view recipe functionality');
        // Create a test recipe
        const testRecipe = {
            id: 999,
            name: "Test Recipe - Spaghetti Carbonara",
            ingredients: [
                "400g spaghetti",
                "200g pancetta",
                "4 large eggs",
                "100g Pecorino Romano cheese",
                "2 cloves garlic",
                "Black pepper",
                "Salt"
            ],
            instructions: "1. Cook spaghetti according to package instructions\n2. Cut pancetta into small cubes\n3. Beat eggs with grated cheese and black pepper\n4. Cook pancetta until crispy\n5. Add cooked pasta to pancetta\n6. Remove from heat and add egg mixture\n7. Toss quickly to create creamy sauce\n8. Serve immediately with extra cheese",
            cookingTime: 20,
            difficulty: "MEDIUM",
            cuisine: "Italian",
            imageUrl: "https://images.unsplash.com/photo-1574636573716-062c8c8c6179?q=80&w=770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            category: "dinner"
        };
        
        console.log('Showing test recipe modal:', testRecipe);
        this.showRecipeModal(testRecipe);
    }

    loadSampleRecipes() {
        console.log('Loading sample recipes');
        this.currentRecipes = [
            {
                id: 1,
                name: "Classic Spaghetti Carbonara",
                ingredients: [
                    "400g spaghetti",
                    "200g pancetta or guanciale",
                    "4 large eggs",
                    "100g Pecorino Romano cheese",
                    "2 cloves garlic",
                    "Black pepper",
                    "Salt"
                ],
                instructions: "1. Cook spaghetti according to package instructions\n2. Cut pancetta into small cubes\n3. Beat eggs with grated cheese and black pepper\n4. Cook pancetta until crispy\n5. Add cooked pasta to pancetta\n6. Remove from heat and add egg mixture\n7. Toss quickly to create creamy sauce\n8. Serve immediately with extra cheese",
                cookingTime: 20,
                difficulty: "MEDIUM",
                cuisine: "Italian",
                imageUrl: "https://media.istockphoto.com/id/527439685/photo/spaghetti-bolognese.webp?a=1&b=1&s=612x612&w=0&k=20&c=FKRlR5CsuBjkIpgFVxgLXDjVzlX_kwIAYIWno7QT2Rc=",
                category: "dinner"
            },
            {
                id: 2,
                name: "Chocolate Chip Cookies",
                ingredients: [
                    "2 1/4 cups all-purpose flour",
                    "1 tsp baking soda",
                    "1 tsp salt",
                    "1 cup butter, softened",
                    "3/4 cup granulated sugar",
                    "3/4 cup brown sugar",
                    "2 large eggs",
                    "2 tsp vanilla extract",
                    "2 cups chocolate chips"
                ],
                instructions: "1. Preheat oven to 375°F\n2. Mix flour, baking soda, and salt\n3. Cream butter and sugars until fluffy\n4. Beat in eggs and vanilla\n5. Gradually add flour mixture\n6. Stir in chocolate chips\n7. Drop rounded tablespoons onto ungreased cookie sheets\n8. Bake 9-11 minutes until golden brown",
                cookingTime: 30,
                difficulty: "EASY",
                cuisine: "American",
                imageUrl: "https://images.unsplash.com/photo-1499636136210-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "dessert"
            },
            {
                id: 3,
                name: "Chicken Tikka Masala",
                ingredients: [
                    "1.5 lbs chicken breast, cubed",
                    "1 cup yogurt",
                    "2 tbsp lemon juice",
                    "2 tsp garam masala",
                    "1 tsp cumin",
                    "1 tsp paprika",
                    "1 can tomato sauce",
                    "1 cup heavy cream",
                    "1 onion, diced",
                    "3 cloves garlic",
                    "1 inch ginger",
                    "2 tbsp butter",
                    "Salt to taste"
                ],
                instructions: "1. Marinate chicken in yogurt, lemon juice, and spices for 30 minutes\n2. Cook chicken until done, set aside\n3. Sauté onions until golden\n4. Add garlic and ginger, cook 1 minute\n5. Add tomato sauce and simmer 15 minutes\n6. Add cream and cooked chicken\n7. Simmer 10 minutes until heated through\n8. Serve with rice or naan",
                cookingTime: 60,
                difficulty: "HARD",
                cuisine: "Indian",
                imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                category: "dinner"
            },
            {
                id: 4,
                name: "Margherita Pizza",
                ingredients: [
                    "1 lb pizza dough",
                    "1/2 cup tomato sauce",
                    "8 oz fresh mozzarella",
                    "1/4 cup fresh basil leaves",
                    "2 tbsp olive oil",
                    "2 cloves garlic, minced",
                    "Salt and pepper to taste",
                    "1/4 cup parmesan cheese"
                ],
                instructions: "1. Preheat oven to 500°F\n2. Roll out pizza dough on floured surface\n3. Brush with olive oil and minced garlic\n4. Spread tomato sauce evenly\n5. Tear mozzarella into pieces and distribute\n6. Bake 10-12 minutes until crust is golden\n7. Remove from oven and top with fresh basil\n8. Drizzle with olive oil and serve hot",
                cookingTime: 45,
                difficulty: "EASY",
                cuisine: "Italian",
                imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "dinner"
            },
            {
                id: 5,
                name: "Chicken Tacos",
                ingredients: [
                    "1 lb chicken breast, sliced",
                    "8 taco shells",
                    "1 onion, diced",
                    "2 cloves garlic, minced",
                    "1 packet taco seasoning",
                    "1 cup lettuce, shredded",
                    "2 tomatoes, diced",
                    "1 cup cheddar cheese, shredded",
                    "1/2 cup sour cream",
                    "1/4 cup salsa",
                    "2 tbsp olive oil"
                ],
                instructions: "1. Heat olive oil in large skillet\n2. Add onion and garlic, cook until soft\n3. Add chicken and cook until golden\n4. Add taco seasoning and 1/2 cup water\n5. Simmer 5 minutes until sauce thickens\n6. Warm taco shells in oven\n7. Fill shells with chicken mixture\n8. Top with lettuce, tomatoes, cheese, sour cream, and salsa",
                cookingTime: 25,
                difficulty: "MEDIUM",
                cuisine: "Mexican",
                imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                category: "dinner"
            },
            {
                id: 6,
                name: "Chocolate Cake",
                ingredients: [
                    "2 cups all-purpose flour",
                    "2 cups sugar",
                    "3/4 cup cocoa powder",
                    "2 tsp baking powder",
                    "1 1/2 tsp baking soda",
                    "1 tsp salt",
                    "2 eggs",
                    "1 cup milk",
                    "1/2 cup vegetable oil",
                    "2 tsp vanilla extract",
                    "1 cup boiling water"
                ],
                instructions: "1. Preheat oven to 350°F\n2. Mix dry ingredients in large bowl\n3. Add eggs, milk, oil, and vanilla\n4. Beat on medium speed for 2 minutes\n5. Stir in boiling water (batter will be thin)\n6. Pour into greased 9x13 pan\n7. Bake 30-35 minutes until toothpick comes out clean\n8. Cool completely before frosting",
                cookingTime: 90,
                difficulty: "MEDIUM",
                cuisine: "American",
                imageUrl: "https://images.unsplash.com/photo-1484980972926-edee96e0960d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                category: "dessert"
            },
            {
                id: 7,
                name: "Caesar Salad",
                ingredients: [
                    "2 heads romaine lettuce",
                    "1/2 cup parmesan cheese, grated",
                    "1 cup croutons",
                    "1/4 cup olive oil",
                    "2 tbsp lemon juice",
                    "2 cloves garlic, minced",
                    "1 tsp Dijon mustard",
                    "2 anchovy fillets",
                    "1/4 cup mayonnaise",
                    "Salt to taste"
                ],
                instructions: "1. Wash and chop romaine lettuce\n2. Make dressing by blending olive oil, lemon juice, garlic, mustard, anchovies, and mayonnaise\n3. Season dressing with salt and pepper\n4. Toss lettuce with dressing until coated\n5. Add croutons and half the parmesan\n6. Toss gently to combine\n7. Top with remaining parmesan cheese\n8. Serve immediately",
                cookingTime: 15,
                difficulty: "EASY",
                cuisine: "American",
                imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "salad"
            },
            {
                id: 8,
                name: "Pad Thai",
                ingredients: [
                    "8 oz rice noodles",
                    "1/2 lb shrimp, peeled",
                    "2 eggs",
                    "1/4 cup fish sauce",
                    "3 tbsp brown sugar",
                    "2 tbsp tamarind paste",
                    "2 tbsp vegetable oil",
                    "3 cloves garlic",
                    "1/2 cup bean sprouts",
                    "2 green onions, chopped",
                    "1/4 cup peanuts, chopped",
                    "1 lime, cut into wedges",
                    "1/4 tsp red pepper flakes"
                ],
                instructions: "1. Soak rice noodles in warm water for 30 minutes\n2. Mix fish sauce, brown sugar, and tamarind paste for sauce\n3. Heat oil in large wok or skillet\n4. Add garlic and shrimp, cook until pink\n5. Push to side, add beaten eggs and scramble\n6. Add noodles and sauce, toss to combine\n7. Add bean sprouts and green onions\n8. Cook 2-3 minutes until noodles are tender\n9. Garnish with peanuts and lime wedges\n10. Serve immediately",
                cookingTime: 40,
                difficulty: "HARD",
                cuisine: "Thai",
                imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "dinner"
            },
            {
                id: 9,
                name: "Chicken Biryani",
                ingredients: [
                    "2 lbs chicken, cut into pieces",
                    "2 cups basmati rice",
                    "1 large onion, sliced",
                    "1 cup yogurt",
                    "2 tsp ginger-garlic paste",
                    "1 tsp red chili powder",
                    "1/2 tsp turmeric",
                    "1 tsp garam masala",
                    "1/4 cup mint leaves",
                    "1/4 cup cilantro",
                    "4 tbsp ghee",
                    "4 green cardamom pods",
                    "2 bay leaves",
                    "1 cinnamon stick",
                    "Salt to taste"
                ],
                instructions: "1. Marinate chicken with yogurt, ginger-garlic paste, and spices for 2 hours\n2. Soak rice for 30 minutes, then boil with whole spices until 70% cooked\n3. Deep fry onions until golden brown and crispy\n4. Cook marinated chicken until tender\n5. Layer rice and chicken alternately in heavy-bottomed pot\n6. Top with fried onions, mint, and cilantro\n7. Cover with foil and lid, cook on high heat for 3 minutes\n8. Reduce heat to low and cook for 45 minutes\n9. Let it rest for 10 minutes before opening\n10. Serve hot with raita and boiled eggs",
                cookingTime: 120,
                difficulty: "HARD",
                cuisine: "Indian",
                imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "dinner"
            },
            {
                id: 10,
                name: "Greek Salad",
                ingredients: [
                    "4 large tomatoes, cut into wedges",
                    "1 cucumber, sliced",
                    "1 red onion, thinly sliced",
                    "1 green bell pepper, sliced",
                    "1/2 cup Kalamata olives",
                    "200g feta cheese, cubed",
                    "1/4 cup olive oil",
                    "2 tbsp red wine vinegar",
                    "1 tsp dried oregano",
                    "Salt and pepper to taste",
                    "Fresh oregano for garnish"
                ],
                instructions: "1. Cut tomatoes into wedges and place in large bowl\n2. Add sliced cucumber, red onion, and bell pepper\n3. Add Kalamata olives and feta cheese cubes\n4. In small bowl, whisk olive oil, vinegar, and dried oregano\n5. Season dressing with salt and pepper\n6. Pour dressing over salad and toss gently\n7. Let marinate for 15 minutes at room temperature\n8. Garnish with fresh oregano and serve",
                cookingTime: 15,
                difficulty: "EASY",
                cuisine: "Greek",
                imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "salad"
            },
            {
                id: 11,
                name: "Vegetable Stir Fry",
                ingredients: [
                    "2 tbsp vegetable oil",
                    "1 bell pepper, sliced",
                    "1 onion, sliced",
                    "2 cups broccoli florets",
                    "1 cup snap peas",
                    "2 carrots, julienned",
                    "3 cloves garlic, minced",
                    "1 tbsp fresh ginger, minced",
                    "3 tbsp soy sauce",
                    "1 tbsp oyster sauce",
                    "1 tsp sesame oil",
                    "2 green onions, chopped",
                    "1 tsp sesame seeds"
                ],
                instructions: "1. Heat oil in wok or large skillet over high heat\n2. Add harder vegetables like carrots and broccoli first\n3. Stir-fry for 2-3 minutes until slightly tender\n4. Add bell pepper, onion, and snap peas\n5. Continue stir-frying for 2-3 minutes\n6. Add garlic and ginger, cook for 30 seconds\n7. Add soy sauce and oyster sauce, toss to coat\n8. Stir-fry for 1-2 minutes until vegetables are crisp-tender\n9. Drizzle with sesame oil and garnish with green onions\n10. Serve over rice with sesame seeds",
                cookingTime: 15,
                difficulty: "EASY",
                cuisine: "Chinese",
                imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "vegetarian"
            },
            {
                id: 12,
                name: "Pancakes",
                ingredients: [
                    "2 cups all-purpose flour",
                    "2 tbsp sugar",
                    "2 tsp baking powder",
                    "1 tsp salt",
                    "2 large eggs",
                    "1 3/4 cups milk",
                    "1/4 cup melted butter",
                    "1 tsp vanilla extract",
                    "Butter for cooking",
                    "Maple syrup for serving",
                    "Fresh berries for topping"
                ],
                instructions: "1. In large bowl, whisk together flour, sugar, baking powder, and salt\n2. In another bowl, beat eggs, then add milk, melted butter, and vanilla\n3. Pour wet ingredients into dry ingredients and stir until just combined\n4. Don't overmix - lumps are okay\n5. Heat griddle or large skillet over medium heat\n6. Lightly grease with butter\n7. Pour 1/4 cup batter for each pancake\n8. Cook until bubbles form on surface, then flip\n9. Cook until golden brown on other side\n10. Serve hot with maple syrup and fresh berries",
                cookingTime: 20,
                difficulty: "EASY",
                cuisine: "American",
                imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "breakfast"
            },
            {
                id: 13,
                name: "Salmon Teriyaki",
                ingredients: [
                    "4 salmon fillets",
                    "1/4 cup soy sauce",
                    "2 tbsp mirin",
                    "2 tbsp brown sugar",
                    "1 tbsp rice vinegar",
                    "2 cloves garlic, minced",
                    "1 tsp fresh ginger, grated",
                    "1 tbsp cornstarch",
                    "2 tbsp water",
                    "2 tbsp vegetable oil",
                    "2 green onions, sliced",
                    "1 tsp sesame seeds",
                    "Steamed rice for serving"
                ],
                instructions: "1. Pat salmon fillets dry and season with salt and pepper\n2. In small bowl, whisk soy sauce, mirin, brown sugar, and rice vinegar\n3. Add garlic and ginger to sauce mixture\n4. Heat oil in large skillet over medium-high heat\n5. Cook salmon skin-side up for 4-5 minutes until golden\n6. Flip and cook 3-4 minutes more\n7. Remove salmon and set aside\n8. Add sauce to pan and bring to simmer\n9. Mix cornstarch and water, add to thicken sauce\n10. Return salmon to pan, garnish with green onions and sesame seeds",
                cookingTime: 25,
                difficulty: "MEDIUM",
                cuisine: "Japanese",
                imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "dinner"
            },
            {
                id: 14,
                name: "Caprese Salad",
                ingredients: [
                    "4 large ripe tomatoes",
                    "1 lb fresh mozzarella cheese",
                    "1/2 cup fresh basil leaves",
                    "1/4 cup extra virgin olive oil",
                    "2 tbsp balsamic vinegar",
                    "Salt to taste",
                    "Freshly ground black pepper",
                    "Balsamic glaze for drizzling"
                ],
                instructions: "1. Slice tomatoes into 1/4-inch thick rounds\n2. Slice mozzarella into similar thickness\n3. Arrange tomato and mozzarella slices alternately on platter\n4. Tuck fresh basil leaves between slices\n5. Drizzle with olive oil and balsamic vinegar\n6. Season with salt and freshly ground pepper\n7. Let stand at room temperature for 15 minutes\n8. Drizzle with balsamic glaze just before serving",
                cookingTime: 10,
                difficulty: "EASY",
                cuisine: "Italian",
                imageUrl: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "salad"
            },
            {
                id: 15,
                name: "Chicken Fajitas",
                ingredients: [
                    "2 lbs chicken breast, sliced",
                    "2 bell peppers, sliced",
                    "1 large onion, sliced",
                    "3 tbsp olive oil",
                    "2 tsp chili powder",
                    "1 tsp cumin",
                    "1 tsp paprika",
                    "1/2 tsp garlic powder",
                    "1/2 tsp onion powder",
                    "Salt and pepper to taste",
                    "8 flour tortillas",
                    "Sour cream, guacamole, salsa for serving",
                    "Lime wedges"
                ],
                instructions: "1. Season chicken with chili powder, cumin, paprika, garlic powder, onion powder, salt, and pepper\n2. Heat 2 tbsp oil in large skillet over high heat\n3. Cook chicken until golden and cooked through, about 6-8 minutes\n4. Remove chicken and set aside\n5. Add remaining oil to pan\n6. Cook peppers and onions until softened and slightly charred\n7. Return chicken to pan and toss to combine\n8. Warm tortillas in dry skillet or microwave\n9. Serve chicken mixture with warm tortillas\n10. Top with sour cream, guacamole, salsa, and lime",
                cookingTime: 25,
                difficulty: "MEDIUM",
                cuisine: "Mexican",
                imageUrl: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "dinner"
            },
            {
                id: 16,
                name: "Mushroom Risotto",
                ingredients: [
                    "1 1/2 cups Arborio rice",
                    "6 cups warm chicken or vegetable broth",
                    "1 lb mixed mushrooms, sliced",
                    "1 onion, finely diced",
                    "3 cloves garlic, minced",
                    "1/2 cup white wine",
                    "4 tbsp butter",
                    "2 tbsp olive oil",
                    "1/2 cup grated Parmesan cheese",
                    "2 tbsp fresh parsley, chopped",
                    "Salt to taste"
                ],
                instructions: "1. Heat broth in saucepan and keep warm\n2. Heat oil and 2 tbsp butter in large pan\n3. Sauté mushrooms until golden, season and set aside\n4. In same pan, cook onion until translucent\n5. Add garlic and rice, stir for 2 minutes\n6. Add wine and stir until absorbed\n7. Add warm broth one ladle at a time, stirring constantly\n8. Continue until rice is creamy and tender, about 18-20 minutes\n9. Stir in mushrooms, remaining butter, and Parmesan\n10. Garnish with parsley and serve immediately",
                cookingTime: 35,
                difficulty: "HARD",
                cuisine: "Italian",
                imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "vegetarian"
            },
            {
                id: 17,
                name: "Fish and Chips",
                ingredients: [
                    "2 lbs white fish fillets (cod or haddock)",
                    "2 lbs potatoes, cut into thick chips",
                    "2 cups all-purpose flour",
                    "1 cup cold beer",
                    "1 tsp baking powder",
                    "1 tsp salt",
                    "Oil for deep frying",
                    "Malt vinegar for serving",
                    "Mushy peas for serving",
                    "Lemon wedges"
                ],
                instructions: "1. Cut potatoes into thick chips and soak in cold water\n2. Make batter by whisking flour, beer, baking powder, and salt\n3. Heat oil to 350°F (175°C)\n4. Pat fish dry and season with salt and pepper\n5. Fry chips in batches until golden, about 8-10 minutes\n6. Drain on paper towels and keep warm\n7. Dip fish in batter and fry until golden and crispy\n8. Drain on paper towels\n9. Serve immediately with chips, malt vinegar, and mushy peas\n10. Garnish with lemon wedges",
                cookingTime: 45,
                difficulty: "MEDIUM",
                cuisine: "British",
                imageUrl: "https://images.unsplash.com/photo-1544982503-9f984c14501a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "dinner"
            },
            {
                id: 18,
                name: "Banana Bread",
                ingredients: [
                    "3 ripe bananas, mashed",
                    "1/3 cup melted butter",
                    "3/4 cup sugar",
                    "1 egg, beaten",
                    "1 tsp vanilla extract",
                    "1 tsp baking soda",
                    "Pinch of salt",
                    "1 1/2 cups all-purpose flour",
                    "1/2 cup chopped walnuts (optional)"
                ],
                instructions: "1. Preheat oven to 350°F (175°C)\n2. Grease a 9x5 inch loaf pan\n3. In large bowl, mix melted butter with mashed bananas\n4. Add sugar, beaten egg, and vanilla extract\n5. Sprinkle baking soda and salt over mixture\n6. Add flour and mix until just combined\n7. Fold in walnuts if using\n8. Pour batter into prepared loaf pan\n9. Bake for 60-65 minutes until toothpick comes out clean\n10. Cool in pan for 10 minutes, then turn out onto wire rack",
                cookingTime: 75,
                difficulty: "EASY",
                cuisine: "American",
                imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                category: "dessert"
            }
        ];
        
        console.log('Sample recipes loaded:', this.currentRecipes.length);
        
        // Reset pagination
        this.currentPage = 0;
        
        // Display first batch of recipes
        const initialRecipes = this.currentRecipes.slice(0, this.pageSize);
        this.displayRecipes(initialRecipes);
        
        // Check if there are more recipes to load
        this.hasMore = this.currentRecipes.length > this.pageSize;
        
        console.log('Initial recipes displayed:', initialRecipes.length);
        console.log('Total recipes available:', this.currentRecipes.length);
        console.log('Has more recipes:', this.hasMore);
        
        this.updateLoadMoreButton();
        this.showNotification(`Loaded ${initialRecipes.length} recipes (${this.currentRecipes.length} total available)`, 'success');
        
        // Debug: Check if load more button exists
        this.debugLoadMoreButton();
    }

    debugLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        console.log('=== Load More Button Debug ===');
        console.log('Button exists:', !!loadMoreBtn);
        if (loadMoreBtn) {
            console.log('Button display style:', loadMoreBtn.style.display);
            console.log('Button visibility:', window.getComputedStyle(loadMoreBtn).visibility);
            console.log('Button parent:', loadMoreBtn.parentElement);
            console.log('Has click listener:', loadMoreBtn.onclick !== null);
        } else {
            console.error('Load More Button NOT FOUND in DOM!');
            // Try to create the button if it doesn't exist
            this.createLoadMoreButton();
        }
    }

    createLoadMoreButton() {
        console.log('Creating load more button...');
        
        // Remove existing button if any
        const existingBtn = document.getElementById('load-more-btn');
        if (existingBtn) {
            existingBtn.parentElement.remove();
        }
        
        // Find the recipes section
        const recipesSection = document.querySelector('.recipes-section');
        const recipesContainer = document.getElementById('recipes-container');
        
        if (recipesSection) {
            const loadMoreDiv = document.createElement('div');
            loadMoreDiv.className = 'load-more';
            loadMoreDiv.style.cssText = 'text-align: center; margin: 3rem 0; padding: 2rem; display: block !important; visibility: visible !important; opacity: 1 !important;';
            
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.id = 'load-more-btn';
            loadMoreBtn.className = 'btn btn-primary';
            loadMoreBtn.innerHTML = '<i class="fas fa-plus" style="margin-right: 0.5rem;"></i> Load More Recipes';
            loadMoreBtn.style.cssText = 'padding: 1rem 2.5rem; font-size: 1.2rem; font-weight: 600; border-radius: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); text-transform: uppercase; letter-spacing: 0.5px; display: block !important; visibility: visible !important; opacity: 1 !important;';
            
            loadMoreBtn.addEventListener('click', () => {
                console.log('Load more button clicked!');
                this.loadMoreRecipes();
            });
            
            loadMoreDiv.appendChild(loadMoreBtn);
            recipesSection.appendChild(loadMoreDiv);
            
            console.log('Load more button created and added to recipes section!');
            console.log('Button element:', loadMoreBtn);
            console.log('Button parent:', loadMoreBtn.parentElement);
            
            // Force visibility
            setTimeout(() => {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.style.visibility = 'visible';
                loadMoreBtn.style.opacity = '1';
                loadMoreDiv.style.display = 'block';
                loadMoreDiv.style.visibility = 'visible';
                loadMoreDiv.style.opacity = '1';
            }, 100);
            
            this.updateLoadMoreButton();
        } else {
            console.error('Recipes section not found!');
        }
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        const container = document.getElementById('recipes-container');
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.recipeManager.loadRecipes()">
                    Try Again
                </button>
            </div>
        `;
    }

    showNotification(message, type) {
        // Use the auth manager's notification system if available
        if (window.authManager && window.authManager.showNotification) {
            window.authManager.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize recipe manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing recipe manager...');
    window.recipeManager = new RecipeManager();
    
    // Force check for load more button after a short delay
    setTimeout(() => {
        console.log('Checking for load more button...');
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) {
            console.log('Load more button not found, creating it...');
            window.recipeManager.createLoadMoreButton();
        } else {
            console.log('Load more button found, ensuring visibility...');
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.style.visibility = 'visible';
            loadMoreBtn.style.opacity = '1';
            if (loadMoreBtn.parentElement) {
                loadMoreBtn.parentElement.style.display = 'block';
                loadMoreBtn.parentElement.style.visibility = 'visible';
                loadMoreBtn.parentElement.style.opacity = '1';
            }
        }
        
        // Force show button if we have more than 4 recipes
        if (window.recipeManager && window.recipeManager.currentRecipes && window.recipeManager.currentRecipes.length > 4) {
            console.log('We have more than 4 recipes, forcing button visibility');
            window.recipeManager.forceShowLoadMoreButton();
        }
    }, 500);
    
    // Fallback: if no recipes load after 3 seconds, load sample recipes
    setTimeout(() => {
        if (!window.recipeManager.currentRecipes || window.recipeManager.currentRecipes.length === 0) {
            console.log('No recipes loaded after 3 seconds, loading sample recipes');
            window.recipeManager.loadSampleRecipes();
        }
    }, 3000);
    
    // Additional fallback: Force create button after 5 seconds if still not visible
    setTimeout(() => {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) {
            console.log('Button still not found after 5 seconds, force creating...');
            window.recipeManager.createLoadMoreButton();
        }
    }, 5000);
});

// Manual debug functions - you can call these in browser console
window.debugLoadMore = function() {
    console.log('=== Manual Load More Debug ===');
    const btn = document.getElementById('load-more-btn');
    console.log('Button exists:', !!btn);
    if (btn) {
        console.log('Button display:', btn.style.display);
        console.log('Button visibility:', btn.style.visibility);
        console.log('Parent display:', btn.parentElement?.style.display);
        console.log('Computed display:', window.getComputedStyle(btn).display);
    }
    console.log('Recipe manager exists:', !!window.recipeManager);
    if (window.recipeManager) {
        console.log('Current recipes:', window.recipeManager.currentRecipes?.length || 0);
        console.log('Has more:', window.recipeManager.hasMore);
        console.log('Current page:', window.recipeManager.currentPage);
    }
};

window.forceCreateButton = function() {
    console.log('Forcing button creation...');
    if (window.recipeManager) {
        window.recipeManager.createLoadMoreButton();
    } else {
        console.error('Recipe manager not available');
    }
};

window.forceShowButton = function() {
    console.log('Forcing button visibility...');
    const btn = document.getElementById('load-more-btn');
    if (btn) {
        btn.style.display = 'block !important';
        btn.style.visibility = 'visible !important';
        btn.style.opacity = '1 !important';
        if (btn.parentElement) {
            btn.parentElement.style.display = 'block !important';
            btn.parentElement.style.visibility = 'visible !important';
            btn.parentElement.style.opacity = '1 !important';
        }
        console.log('Button forced visible');
    } else {
        console.error('Button not found');
        window.forceCreateButton();
    }
};

window.testLoadMore = function() {
    console.log('Testing load more functionality...');
    if (window.recipeManager) {
        window.recipeManager.loadSampleRecipes();
        setTimeout(() => {
            window.forceShowButton();
        }, 1000);
    }
};

function showSimpleModal(id, name, ingredients, instructions, cookingTime, difficulty, cuisine) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'recipe-modal-' + id;

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="recipe-details">
                <h2>${name}</h2>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${cookingTime} minutes</span>
                    <span><i class="fas fa-chart-line"></i> ${difficulty}</span>
                    ${cuisine ? `<span><i class="fas fa-globe"></i> ${cuisine}</span>` : ''}
                </div>
                <div class="recipe-section">
                    <h3><i class="fas fa-shopping-basket"></i> Ingredients (${ingredients.length} items)</h3>
                    <ul>
                        ${ingredients.map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}
                    </ul>
                </div>
                <div class="recipe-section">
                    <h3><i class="fas fa-list-ol"></i> Cooking Instructions</h3>
                    <div class="instructions">${instructions.replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.classList.add('active'); // Match CSS to make modal visible

    console.log('Modal created and displayed');

    // Simple close handlers
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}