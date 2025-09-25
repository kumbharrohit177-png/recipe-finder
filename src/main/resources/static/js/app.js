// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Add some custom styles
    const style = document.createElement('style');
    style.textContent = `
        .no-recipes, .error {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
        }

        .recipe-details {
            padding: 2rem;
            max-height: 80vh;
            overflow-y: auto;
        }

        .recipe-header {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid rgba(102, 126, 234, 0.2);
            text-align: center;
        }

        .recipe-header h2 {
            color: #1f2937;
            margin: 1rem 0;
            font-size: 2rem;
        }

        .recipe-meta {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
            flex-wrap: wrap;
        }

        .recipe-meta span {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(102, 126, 234, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 500;
            color: #4f46e5;
        }

        .recipe-section {
            margin-bottom: 2.5rem;
            background: rgba(255, 255, 255, 0.5);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .recipe-section h3 {
            color: #1f2937;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            border-bottom: 2px solid rgba(102, 126, 234, 0.2);
            padding-bottom: 0.5rem;
        }

        .recipe-section h3 i {
            color: #667eea;
            font-size: 1.25rem;
        }

        .recipe-section ul {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 0.75rem;
        }

        .recipe-section li {
            padding: 1rem;
            background: rgba(102, 126, 234, 0.05);
            border-radius: 8px;
            border-left: 4px solid #667eea;
            transition: all 0.3s ease;
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .recipe-section li:hover {
            background: rgba(102, 126, 234, 0.1);
            transform: translateX(5px);
        }

        .recipe-section li::before {
            content: '✓';
            color: #667eea;
            font-weight: bold;
            font-size: 1.1rem;
        }

        .instructions {
            line-height: 1.8;
            white-space: pre-line;
            background: rgba(102, 126, 234, 0.05);
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .instructions-container {
            background: rgba(102, 126, 234, 0.05);
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .instruction-step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 1rem;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            border: 1px solid rgba(102, 126, 234, 0.1);
            transition: all 0.3s ease;
        }

        .instruction-step:hover {
            background: rgba(102, 126, 234, 0.1);
            transform: translateX(5px);
        }

        .instruction-step:last-child {
            margin-bottom: 0;
        }

        .step-number {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: bold;
            padding: 0.5rem 0.75rem;
            border-radius: 50%;
            margin-right: 1rem;
            min-width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .step-text {
            flex: 1;
            line-height: 1.6;
            font-size: 1rem;
            color: #2d3748;
            padding-top: 0.5rem;
        }

        .modal-content {
            max-width: 900px !important;
            width: 95% !important;
        }

        .close {
            position: absolute;
            right: 1.5rem;
            top: 1.5rem;
            font-size: 2rem;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            background: rgba(255, 255, 255, 0.9);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .close:hover {
            color: #ef4444;
            transform: rotate(90deg);
            background: rgba(239, 68, 68, 0.1);
        }

        /* Notification styles */
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: rgba(15, 15, 35, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease-out;
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 400px;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            border-left: 4px solid #10b981;
        }

        .notification.error {
            border-left: 4px solid #ef4444;
        }

        .notification.warning {
            border-left: 4px solid #f59e0b;
        }

        .notification i {
            font-size: 1.2rem;
        }

        .notification.success i {
            color: #10b981;
        }

        .notification.error i {
            color: #ef4444;
        }

        .notification.warning i {
            color: #f59e0b;
        }

        .ingredients-actions {
            margin-top: 1rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .btn-print {
            background: #10b981;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-print:hover {
            background: #059669;
            transform: translateY(-2px);
        }

        .btn-copy {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-copy:hover {
            background: #2563eb;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .recipe-details {
                padding: 1rem;
            }
            
            .recipe-section ul {
                grid-template-columns: 1fr;
            }
            
            .recipe-meta {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .modal-content {
                width: 98% !important;
                margin: 1rem;
            }
            
            .instruction-step {
                flex-direction: column;
                text-align: center;
            }
            
            .step-number {
                margin-right: 0;
                margin-bottom: 0.5rem;
                align-self: center;
            }
            
            .step-text {
                padding-top: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add keyboard shortcut for search (Ctrl/Cmd + K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('Smart Recipe Finder initialized successfully!');
    
    // Simple and reliable event delegation for view recipe buttons
    document.body.addEventListener('click', function(e) {
        // Check if clicked element is a view-recipe button or contains one
        let target = e.target;
        
        // Look up the DOM tree for view-recipe class
        while (target && target !== document.body) {
            if (target.classList && target.classList.contains('view-recipe')) {
                e.preventDefault();
                e.stopPropagation();
                
                const recipeId = target.getAttribute('data-id') || target.dataset.id;
                console.log('View Recipe clicked - ID:', recipeId);
                
                // Call viewRecipe method
                if (window.recipeManager && recipeId) {
                    console.log('Calling viewRecipe with ID:', recipeId);
                    window.recipeManager.viewRecipe(recipeId);
                } else {
                    console.error('Recipe manager not available or missing recipe ID');
                    // Try again after a short delay in case the manager is still loading
                    setTimeout(() => {
                        if (window.recipeManager && recipeId) {
                            window.recipeManager.viewRecipe(recipeId);
                        } else {
                            console.error('Recipe manager still not available after delay');
                        }
                    }, 100);
                }
                return;
            }
            target = target.parentElement;
        }
    });
    
    // Debug function to manually test view recipe
    window.debugViewRecipe = function(id = 1) {
        console.log('Manual debug test with ID:', id);
        if (window.recipeManager) {
            window.recipeManager.viewRecipe(id);
        } else {
            console.error('Recipe manager not available');
        }
    };
    
    // Test if buttons exist and are clickable
    window.testButtons = function() {
        const buttons = document.querySelectorAll('.view-recipe');
        console.log('Found buttons:', buttons.length);
        buttons.forEach((btn, i) => {
            console.log(`Button ${i}:`, btn.getAttribute('data-id'), btn.onclick ? 'has onclick' : 'no onclick');
        });
        
        if (buttons.length > 0) {
            console.log('Clicking first button...');
            buttons[0].click();
        }
    };
    
    // Simple test to verify button clicks are detected
    window.testButtonClick = function() {
        console.log('Testing button click detection...');
        const buttons = document.querySelectorAll('.view-recipe');
        console.log('Found buttons:', buttons.length);
        
        if (buttons.length > 0) {
            const firstButton = buttons[0];
            console.log('First button:', firstButton);
            console.log('Button ID:', firstButton.getAttribute('data-id'));
            
            // Simulate click
            firstButton.click();
        } else {
            console.log('No buttons found - checking if recipes are loaded...');
            if (window.recipeManager) {
                console.log('Recipe manager exists, loading sample recipes...');
                window.recipeManager.loadSampleRecipes();
            }
        }
    };
    
    // Debug function to check recipes
    window.debugRecipes = function() {
        console.log('Current recipes:', window.recipeManager?.currentRecipes);
        console.log('Recipe buttons found:', document.querySelectorAll('.view-recipe').length);
        document.querySelectorAll('.view-recipe').forEach((btn, index) => {
            console.log(`Button ${index}:`, btn.dataset.id, btn.textContent);
        });
    };
    
    // Force load sample recipes
    window.loadSampleRecipes = function() {
        if (window.recipeManager) {
            window.recipeManager.loadSampleRecipes();
        } else {
            console.error('Recipe manager not found');
        }
    };
    
    // Recipe data is now handled by recipes.js
    
    // Modal functionality is now handled by recipes.js
    
    // Close test modal
    const testClose = document.getElementById('test-close');
    if (testClose) {
        testClose.addEventListener('click', function() {
            const modal = document.getElementById('test-modal');
            modal.style.display = 'none';
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    const testModal = document.getElementById('test-modal');
    if (testModal) {
        testModal.addEventListener('click', function(e) {
            if (e.target === testModal) {
                testModal.style.display = 'none';
                testModal.classList.remove('active');
            }
        });
    }
});