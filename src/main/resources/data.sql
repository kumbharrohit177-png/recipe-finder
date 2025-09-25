-- ============================
-- Insert roles
-- ============================
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- ============================
-- Insert recipes
-- ============================
INSERT INTO recipes (name, instructions, cooking_time, difficulty, cuisine, image_url, category)
VALUES
('Classic Spaghetti Carbonara',
 '1. Cook spaghetti according to package instructions until al dente
2. Cut pancetta into small cubes and cook until crispy
3. Beat eggs with grated cheese and black pepper in a bowl
4. Add cooked pasta to the pan with pancetta
5. Remove from heat and quickly add egg mixture
6. Toss rapidly to create creamy sauce without scrambling eggs
7. Season with salt and pepper to taste
8. Serve immediately with extra cheese and black pepper',
 20, 'MEDIUM', 'Italian',
 'https://images.unsplash.com/photo-1574636573716-062c8c8c6179?q=80&w=770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
 'dinner'),

('Chocolate Chip Cookies',
 '1. Preheat oven to 375°F and line baking sheets with parchment paper
2. Mix flour, baking soda, and salt in a medium bowl
3. Cream butter and both sugars until light and fluffy
4. Beat in eggs one at a time, then add vanilla extract
5. Gradually mix in flour mixture until just combined
6. Fold in chocolate chips evenly throughout dough
7. Drop rounded tablespoons of dough onto prepared baking sheets
8. Bake for 9-11 minutes until edges are golden brown
9. Cool on baking sheet for 5 minutes before transferring to wire rack',
 30, 'EASY', 'American',
 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'dessert'),

('Chicken Tikka Masala',
 '1. Cut chicken into cubes and marinate with yogurt, lemon juice, and spices for 30 minutes
2. Heat oil in a large pan and cook marinated chicken until golden
3. Remove chicken and set aside
4. In the same pan, sauté diced onions until golden brown
5. Add minced garlic and ginger, cook for 1 minute
6. Add tomato sauce and simmer for 15 minutes until thickened
7. Stir in heavy cream and bring to a gentle simmer
8. Return cooked chicken to the sauce
9. Simmer for 10 minutes until chicken is heated through
10. Garnish with fresh cilantro and serve with rice or naan',
 60, 'HARD', 'Indian',
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'dinner'),

('Margherita Pizza',
 '1. Preheat oven to 500°F with pizza stone if available
2. Roll out pizza dough on a floured surface to desired thickness
3. Brush dough with olive oil and minced garlic
4. Spread tomato sauce evenly, leaving border for crust
5. Tear fresh mozzarella into pieces and distribute over sauce
6. Season with salt and pepper
7. Bake for 10-12 minutes until crust is golden and cheese is bubbly
8. Remove from oven and immediately top with fresh basil leaves
9. Drizzle with extra olive oil and sprinkle with parmesan
10. Slice and serve hot',
 45, 'EASY', 'Italian',
 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'dinner'),

('Chocolate Cake',
 '1. Preheat oven to 350°F and grease a 9x13 inch baking pan
2. In a large bowl, whisk together flour, sugar, cocoa powder, baking powder, baking soda, and salt
3. In another bowl, beat eggs, then add milk, oil, and vanilla extract
4. Pour wet ingredients into dry ingredients and mix until smooth
5. Gradually stir in boiling water until batter is well combined
6. Pour batter into prepared pan
7. Bake for 30-35 minutes until toothpick inserted in center comes out clean
8. Cool completely in pan before frosting
9. Frost with your favorite chocolate frosting when cooled',
 90, 'MEDIUM', 'American',
 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2hvY29sYXRlJTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D',
 'dessert'),

('Chicken Biriyani',
 '1. Soak basmati rice for 30 minutes, then drain
2. Marinate chicken pieces with yogurt, ginger-garlic paste, and spices for 2 hours
3. Heat ghee in a heavy-bottomed pot and deep fry sliced onions until golden
4. Remove and drain fried onions, set aside
5. In the same pot, cook marinated chicken until 70% done
6. In a separate pot, boil water with whole spices and salt
7. Add soaked rice and cook until 70% done, then drain
8. Layer the partially cooked rice over chicken
9. Sprinkle fried onions, mint, and cilantro on top
10. Cover with aluminum foil, then place lid tightly
11. Cook on high heat for 3 minutes, then reduce to low heat
12. Cook for 45 minutes on low heat
13. Let it rest for 10 minutes before opening
14. Gently mix and serve hot with raita and boiled eggs',
 120, 'MEDIUM', 'Indian',
 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
 'dinner'),

('Pad Thai',
 '1. Soak rice noodles in warm water for 30 minutes until soft
2. In a small bowl, mix fish sauce, brown sugar, and tamarind paste for the sauce
3. Heat oil in a large wok or skillet over high heat
4. Add minced garlic and cook for 30 seconds until fragrant
5. Add shrimp and cook until pink and cooked through
6. Push shrimp to one side of wok and add beaten eggs
7. Scramble eggs and mix with shrimp
8. Add drained noodles and sauce mixture to the wok
9. Toss everything together for 2-3 minutes
10. Add bean sprouts and green onions, stir-fry for 1 minute
11. Remove from heat and garnish with chopped peanuts
12. Serve immediately with lime wedges and red pepper flakes',
 40, 'HARD', 'Thai',
 'https://plus.unsplash.com/premium_photo-1661610605309-77feabcc8772?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
 'dinner'),

('Greek Salad',
 '1. Wash and cut tomatoes into wedges
2. Slice cucumber into thick rounds
3. Thinly slice red onion and soak in cold water for 10 minutes
4. Cut bell pepper into strips
5. Drain and rinse red onion, then pat dry
6. In a large bowl, combine tomatoes, cucumber, onion, and bell pepper
7. Add Kalamata olives and cubed feta cheese
8. In a small bowl, whisk olive oil, red wine vinegar, and dried oregano
9. Season dressing with salt and pepper
10. Pour dressing over salad and toss gently
11. Let marinate for 15 minutes at room temperature
12. Garnish with fresh oregano and serve',
 15, 'EASY', 'Greek',
 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'salad'),

('Vegetable Stir Fry',
 '1. Prepare all vegetables by washing and cutting into uniform pieces
2. Heat vegetable oil in a large wok or skillet over high heat
3. Add harder vegetables like carrots and broccoli first
4. Stir-fry for 2-3 minutes until slightly tender
5. Add bell peppers, onions, and snap peas
6. Continue stir-frying for 2-3 minutes
7. Add minced garlic and ginger, cook for 30 seconds
8. Add soy sauce and oyster sauce, toss to coat all vegetables
9. Stir-fry for 1-2 minutes until vegetables are crisp-tender
10. Drizzle with sesame oil and toss once more
11. Garnish with chopped green onions and sesame seeds
12. Serve immediately over steamed rice',
 15, 'EASY', 'Chinese',
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'vegetarian'),

('Pancakes',
 '1. In a large bowl, whisk together flour, sugar, baking powder, and salt
2. In another bowl, beat eggs until light and fluffy
3. Add milk, melted butter, and vanilla extract to eggs
4. Pour wet ingredients into dry ingredients
5. Stir until just combined - do not overmix, lumps are okay
6. Let batter rest for 5 minutes
7. Heat griddle or large skillet over medium heat
8. Lightly grease with butter or cooking spray
9. Pour 1/4 cup batter for each pancake onto hot griddle
10. Cook until bubbles form on surface and edges look set
11. Flip and cook until golden brown on other side
12. Serve hot with maple syrup and fresh berries',
 20, 'EASY', 'American',
 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'breakfast'),

('Salmon Teriyaki',
 '1. Pat salmon fillets dry and season with salt and pepper
2. In a small bowl, whisk together soy sauce, mirin, brown sugar, and rice vinegar
3. Add minced garlic and grated ginger to sauce mixture
4. Heat vegetable oil in a large skillet over medium-high heat
5. Place salmon fillets skin-side up in the skillet
6. Cook for 4-5 minutes until golden brown on bottom
7. Flip salmon and cook for 3-4 minutes more
8. Remove salmon from pan and set aside
9. Add teriyaki sauce to the same pan and bring to a simmer
10. Mix cornstarch with water and add to thicken sauce
11. Return salmon to pan and spoon sauce over fillets
12. Garnish with sliced green onions and sesame seeds
13. Serve with steamed rice',
 25, 'MEDIUM', 'Japanese',
 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'dinner'),

('Caprese Salad',
 '1. Select ripe, firm tomatoes and slice into 1/4-inch thick rounds
2. Slice fresh mozzarella into similar thickness
3. Arrange tomato and mozzarella slices alternately on a large platter
4. Tuck fresh basil leaves between the slices
5. Drizzle extra virgin olive oil over the arrangement
6. Add a splash of balsamic vinegar
7. Season with salt and freshly ground black pepper
8. Let stand at room temperature for 15 minutes to develop flavors
9. Just before serving, drizzle with balsamic glaze
10. Serve immediately as an appetizer or light meal',
 10, 'EASY', 'Italian',
 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'salad'),

('Chicken Fajitas',
 '1. Slice chicken breast into thin strips
2. In a bowl, combine chili powder, cumin, paprika, garlic powder, onion powder, salt, and pepper
3. Toss chicken strips with spice mixture until well coated
4. Let marinate for 15 minutes
5. Heat 2 tablespoons oil in a large skillet over high heat
6. Add seasoned chicken and cook for 6-8 minutes until golden and cooked through
7. Remove chicken and set aside
8. Add remaining oil to the same pan
9. Add sliced bell peppers and onions to the pan
10. Cook for 5-7 minutes until softened and slightly charred
11. Return chicken to pan and toss to combine
12. Warm flour tortillas in a dry skillet or microwave
13. Serve chicken mixture with warm tortillas
14. Provide toppings: sour cream, guacamole, salsa, and lime wedges',
 25, 'MEDIUM', 'Mexican',
 'https://images.unsplash.com/photo-1565299585323-38174c4a6471?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'dinner'),

('Mushroom Risotto',
 '1. Heat vegetable or chicken broth in a saucepan and keep warm
2. Heat olive oil and 2 tablespoons butter in a large, heavy-bottomed pan
3. Add sliced mushrooms and cook until golden brown
4. Season mushrooms with salt and pepper, then set aside
5. In the same pan, cook diced onion until translucent
6. Add minced garlic and Arborio rice, stir for 2 minutes until rice is coated
7. Pour in white wine and stir until completely absorbed
8. Add warm broth one ladle at a time, stirring constantly
9. Wait until each addition is absorbed before adding more broth
10. Continue for 18-20 minutes until rice is creamy and tender
11. Stir in cooked mushrooms, remaining butter, and grated Parmesan
12. Season with salt and pepper to taste
13. Garnish with fresh parsley and serve immediately',
 35, 'HARD', 'Italian',
 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'vegetarian'),

('Fish and Chips',
 '1. Cut potatoes into thick chips and soak in cold water for 30 minutes
2. Pat fish fillets dry and season with salt and pepper
3. Make batter by whisking flour, beer, baking powder, and salt until smooth
4. Heat oil to 350°F in a deep fryer or large pot
5. Drain and dry potato chips thoroughly
6. Fry chips in batches for 8-10 minutes until golden
7. Remove chips and drain on paper towels, keep warm
8. Dip fish fillets in batter, letting excess drip off
9. Carefully lower battered fish into hot oil
10. Fry for 4-6 minutes until golden and crispy
11. Remove fish and drain on paper towels
12. Season chips with salt while hot
13. Serve immediately with malt vinegar, mushy peas, and lemon wedges',
 45, 'MEDIUM', 'British',
 'https://images.unsplash.com/photo-1544982503-9f984c14501a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'dinner'),

('Banana Bread',
 '1. Preheat oven to 350°F and grease a 9x5 inch loaf pan
2. In a large bowl, mash ripe bananas until smooth
3. Mix melted butter into the mashed bananas
4. Add sugar, beaten egg, and vanilla extract, mix well
5. Sprinkle baking soda and salt over the mixture
6. Add flour and mix until just combined - do not overmix
7. If using, fold in chopped walnuts
8. Pour batter into prepared loaf pan
9. Bake for 60-65 minutes until toothpick inserted in center comes out clean
10. Cool in pan for 10 minutes
11. Turn out onto wire rack to cool completely
12. Slice and serve at room temperature',
 75, 'EASY', 'American',
 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'dessert'),

('Caesar Salad',
 '1. Wash and dry romaine lettuce thoroughly
2. Chop lettuce into bite-sized pieces
3. Make dressing by blending olive oil, lemon juice, minced garlic, Dijon mustard, and anchovies
4. Add mayonnaise to dressing and blend until smooth
5. Season dressing with salt and pepper to taste
6. Place chopped lettuce in a large salad bowl
7. Pour dressing over lettuce and toss until well coated
8. Add croutons and half of the grated Parmesan cheese
9. Toss gently to combine all ingredients
10. Top with remaining Parmesan cheese
11. Add freshly cracked black pepper
12. Serve immediately while lettuce is crisp',
 15, 'EASY', 'American',
 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
 'salad');

-- Insert recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredients) VALUES
(1, '400g spaghetti'),
(1, '200g pancetta or guanciale'),
(1, '4 large eggs'),
(1, '100g Pecorino Romano cheese'),
(1, '2 cloves garlic'),
(1, 'Black pepper'),
(1, 'Salt'),

(2, '2 1/4 cups all-purpose flour'),
(2, '1 tsp baking soda'),
(2, '1 tsp salt'),
(2, '1 cup butter, softened'),
(2, '3/4 cup granulated sugar'),
(2, '3/4 cup brown sugar'),
(2, '2 large eggs'),
(2, '2 tsp vanilla extract'),
(2, '2 cups chocolate chips'),

(3, '1.5 lbs chicken breast, cubed'),
(3, '1 cup yogurt'),
(3, '2 tbsp lemon juice'),
(3, '2 tsp garam masala'),
(3, '1 tsp cumin'),
(3, '1 tsp paprika'),
(3, '1 can tomato sauce'),
(3, '1 cup heavy cream'),
(3, '1 onion, diced'),
(3, '3 cloves garlic'),
(3, '1 inch ginger'),
(3, '2 tbsp butter'),
(3, 'Salt to taste'),

(4, '1 lb pizza dough'),
(4, '1/2 cup tomato sauce'),
(4, '8 oz fresh mozzarella'),
(4, '1/4 cup fresh basil leaves'),
(4, '2 tbsp olive oil'),
(4, '2 cloves garlic, minced'),
(4, 'Salt and pepper to taste'),
(4, '1/4 cup parmesan cheese'),

(5, '2 cups all-purpose flour'),
(5, '2 cups sugar'),
(5, '3/4 cup cocoa powder'),
(5, '2 tsp baking powder'),
(5, '1 1/2 tsp baking soda'),
(5, '1 tsp salt'),
(5, '2 eggs'),
(5, '1 cup milk'),
(5, '1/2 cup vegetable oil'),
(5, '2 tsp vanilla extract'),
(5, '1 cup boiling water'),
(5, '1 cup butter'),
(5, '4 cups powdered sugar'),
(5, '1/2 cup cocoa powder'),

(6, 'Chicken (on bone)'),
(6, 'yogurt'),
(6, 'ginger-garlic paste'),
(6, 'lemon juice'),
(6, 'red chili powder'),
(6, 'turmeric'),
(6, 'garam masala'),
(6, 'salt'),
(6, 'basmati rice'),
(6, 'bay leaf'),
(6, 'cinnamon'),
(6, 'cloves'),
(6, 'cardamom'),
(6, 'cumin seeds'),
(6, 'onions'),
(6, 'mint'),
(6, 'cilantro'),
(6, 'saffron'),
(6, 'ghee/oil'),
(6, 'fried onions'),

(7, '8 oz rice noodles'),
(7, '1/2 lb shrimp, peeled'),
(7, '2 eggs'),
(7, '1/4 cup fish sauce'),
(7, '3 tbsp brown sugar'),
(7, '2 tbsp tamarind paste'),
(7, '2 tbsp vegetable oil'),
(7, '3 cloves garlic, minced'),
(7, '1/2 cup bean sprouts'),
(7, '2 green onions, chopped'),
(7, '1/4 cup peanuts, chopped'),
(7, '1 lime, cut into wedges'),
(7, '1/4 tsp red pepper flakes'),

(8, '4 tomatoes'),
(8, '1 cucumber'),
(8, '1/2 cup Kalamata olives'),
(8, '1/2 cup crumbled feta cheese'),
(8, '1/4 cup olive oil'),
(8, '2 tbsp red wine vinegar'),
(8, '1 tsp dried oregano'),
(8, 'Salt and pepper to taste'),

(9, '2 cups mixed vegetables'),
(9, '2 tbsp vegetable oil'),
(9, '2 cloves garlic, minced'),
(9, '1 tsp grated ginger'),
(9, '2 tbsp soy sauce'),
(9, '1 tsp sesame oil'),
(9, 'Salt and pepper to taste'),

(10, '1 cup all-purpose flour'),
(10, '2 tsp baking powder'),
(10, '1 tsp salt'),
(10, '1 cup milk'),
(10, '1 large egg'),
(10, '2 tbsp butter, melted'),
(10, '1 tsp vanilla extract'),
(10, 'Maple syrup and fresh berries for serving'),

(11, '4 salmon fillets'),
(11, '1/2 cup teriyaki sauce'),
(11, '2 tbsp vegetable oil'),
(11, '2 cloves garlic, minced'),
(11, '1 tsp grated ginger'),
(11, '1 tsp sesame oil'),
(11, 'Salt and pepper to taste'),

(12, '4 tomatoes'),
(12, '8 oz fresh mozzarella'),
(12, '1/4 cup fresh basil leaves'),
(12, '2 tbsp olive oil'),
(12, '2 tbsp balsamic glaze'),
(12, 'Salt and pepper to taste'),

(13, '1 lb boneless chicken breast'),
(13, '1/2 cup lime juice'),
(13, '1/4 cup olive oil'),
(13, '2 cloves garlic, minced'),
(13, '1 tsp dried oregano'),
(13, '1/2 tsp ground cumin'),
(13, '1/4 tsp cayenne pepper'),
(13, 'Salt and pepper to taste'),
(13, '4 small flour tortillas'),
(13, 'Optional toppings: avocado, sour cream, salsa, shredded cheese, cilantro'),

(14, '1 cup Arborio rice'),
(14, '4 cups vegetable broth'),
(14, '2 tbsp olive oil'),
(14, '1 small onion, finely chopped'),
(14, '2 cloves garlic, minced'),
(14, '8 oz mixed mushrooms'),
(14, '1/2 cup white wine'),
(14, '1/4 cup grated Parmesan cheese'),
(14, '2 tbsp butter'),
(14, 'Salt and pepper to taste'),
(14, 'Fresh parsley, chopped (optional)'),

(15, '4 fish fillets'),
(15, '1 cup all-purpose flour'),
(15, '1 tsp paprika'),
(15, '1 tsp garlic powder'),
(15, '1 tsp salt'),
(15, '1/2 tsp black pepper'),
(15, '1 cup beer'),
(15, '1 cup panko breadcrumbs'),
(15, '2 tbsp vegetable oil'),
(15, '2 cups thick-cut chips'),
(15, '1 cup mushy peas'),
(15, 'Tartar sauce for serving'),

(16, '3 large ripe bananas'),
(16, '1 1/2 cups all-purpose flour'),
(16, '1 tsp baking powder'),
(16, '1/2 tsp baking soda'),
(16, '1/2 tsp salt'),
(16, '1 cup granulated sugar'),
(16, '1/2 cup unsalted butter, softened'),
(16, '2 large eggs'),
(16, '1 tsp vanilla extract'),
(16, '1/2 cup chopped walnuts (optional)'),

(17, '1 large head romaine lettuce'),
(17, '1/2 cup homemade Caesar dressing'),
(17, '1 cup homemade croutons'),
(17, '1/2 cup shaved Parmesan cheese'),
(17, '1 tsp lemon zest'),
(17, 'Salt and pepper to taste');