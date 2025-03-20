import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Masonry from '@mui/lab/Masonry';
import { Box, FormControl, InputLabel, MenuItem, Select, Chip, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, AppBar, Toolbar, Card, CardMedia } from '@mui/material';
import ViewRecipe from './ViewRecipe';
import AddIngredients from './AddIngredients';
import SaveRecipe from './SaveRecipe';
import DisplayRecipes from './DisplayRecipes';

export default function Search() {
const [recipes, setRecipes] = React.useState([]);
const [filters, setFilters] = React.useState({
    dietaryPreferences: [],
    cuisine: [],
    cookingStyle: [],
    appliances: [],
    mealType: [],
    difficulty: [],
    seasonal: []
});
const [ingredients, setIngredients] = React.useState([]);
const [query, setQuery] = React.useState('');
const [openRecipeId, setOpenRecipeId] = React.useState(null);
const [feed, setFeed] = React.useState([]);

React.useEffect(() => {
    const fetchFeed = async () => {
        const storedFeed = sessionStorage.getItem('feed');
        if (storedFeed) {
            setFeed(JSON.parse(storedFeed));
            console.log('Using cached feed');
            return;
        }

        const url = 'https://tasty.p.rapidapi.com/feeds/list';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TASTY_KEY,
                'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_TASTY_HOST,
            },
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            if(!result.data){
                console.log("Could not fetch data.")
            }
            const carousels = result.data.slice(5, 10).flatMap(carousel => carousel.items);
            console.log(carousels.length);
            setFeed(carousels);
            sessionStorage.setItem('feed', JSON.stringify(carousels));
        } catch (error) {
            console.error(error);
            setFeed([]);
        }
    };

    fetchFeed();
}, []);

const truncateDescription = (description) => {
    if (!description) {
        return '';
    }
    if (description.length > 200) {
        return description.substring(0, 200) + '...';
    }
    return description;
};

const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
    ...prevFilters,
    [name]: value
    }));
};

const handleIngredientsChange = (event) => {
    setIngredients(event.target.value);
};

const handleQueryChange = (event) => {
    setQuery(event.target.value);
};

const handleRecipeOpen = (id) => {
    setOpenRecipeId(id);
};

const handleRecipeClose = () => {
    setOpenRecipeId(null);
};

const fetchRecipes = async (query, ingredients, tags) => {
    const formattedQuery = query.replace(/_/g, '%20');
    const formattedIngredients = ingredients.map(ingredient => ingredient.replace(/_/g, '%20')).join('%20');
    const searchQuery = `${formattedQuery}${formattedIngredients ? `%20${formattedIngredients}` : ''}`;
    const url = `https://tasty-co1.p.rapidapi.com/recipes/list?query=${searchQuery}${tags ? `&tags=${tags}` : ''}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TASTY_KEY,
            'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_TASTY_HOST,
        },
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (result.data.count === 0) {
            console.log("No results found");

        }
        setRecipes(result.data.results || []); 
        console.log(url);
        
    } catch (error) {
        console.error(error);
        setRecipes([]); 
    }
};

const handleSearch = () => {
    const tags = [
    ...filters.dietaryPreferences,
    ...filters.cuisine,
    ...filters.cookingStyle,
    ...filters.appliances,
    ...filters.mealType,
    ...filters.difficulty,
    ...filters.seasonal
    ].join('%2C');
    fetchRecipes(query, ingredients, tags);
};

const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
};

return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, boxShadow: 0, border: 1, borderRadius: 3, borderColor: 'lightgray' }}
    >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Recipes..."
            inputProps={{ 'aria-label': 'search recipes' }}
            value={query}
            onChange={handleQueryChange}
            onKeyPress={handleKeyPress}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
        <SearchIcon />
        </IconButton>
    </Paper>
    <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.75rem' }}>Ingredients</InputLabel>
        <Select
            name="ingredients"
            value={ingredients}
            onChange={handleIngredientsChange}
            multiple
            renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
                ))}
            </Box>
            )}
            sx={{ fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
            <MenuItem value="all_purpose_flour">All purpose flour</MenuItem>
            <MenuItem value="allspice">Allspice</MenuItem>
            <MenuItem value="almond">Almond</MenuItem>
            <MenuItem value="almond_extract">Almond extract</MenuItem>
            <MenuItem value="almond_meal">Almond meal</MenuItem>
            <MenuItem value="anise">Anise</MenuItem>
            <MenuItem value="apple">Apple</MenuItem>
            <MenuItem value="apricot">Apricot</MenuItem>
            <MenuItem value="artichoke">Artichoke</MenuItem>
            <MenuItem value="arugula">Arugula</MenuItem>
            <MenuItem value="asparagus">Asparagus</MenuItem>
            <MenuItem value="aubergine">Aubergine</MenuItem>
            <MenuItem value="avocado">Avocado</MenuItem>
            <MenuItem value="avocado_oil">Avocado oil</MenuItem>
            <MenuItem value="baby_back_ribs">Baby back ribs</MenuItem>
            <MenuItem value="bacon">Bacon</MenuItem>
            <MenuItem value="banana">Banana</MenuItem>
            <MenuItem value="basil">Basil</MenuItem>
            <MenuItem value="bay_leaf">Bay leaf</MenuItem>
            <MenuItem value="bean_sprouts">Bean sprouts</MenuItem>
            <MenuItem value="beetroot">Beetroot</MenuItem>
            <MenuItem value="bell_pepper">Bell pepper</MenuItem>
            <MenuItem value="black_beans">Black beans</MenuItem>
            <MenuItem value="blackberry">Blackberry</MenuItem>
            <MenuItem value="blue_cheese">Blue cheese</MenuItem>
            <MenuItem value="blueberry">Blueberry</MenuItem>
            <MenuItem value="bok_choy">Bok choy</MenuItem>
            <MenuItem value="bread_flour">Bread flour</MenuItem>
            <MenuItem value="brie">Brie</MenuItem>
            <MenuItem value="broccoli">Broccoli</MenuItem>
            <MenuItem value="brown_rice">Brown rice</MenuItem>
            <MenuItem value="brussels_sprouts">Brussels sprouts</MenuItem>
            <MenuItem value="butter">Butter</MenuItem>
            <MenuItem value="buttermilk">Buttermilk</MenuItem>
            <MenuItem value="butternut_squash">Butternut squash</MenuItem>
            <MenuItem value="cabbage">Cabbage</MenuItem>
            <MenuItem value="cake_flour">Cake flour</MenuItem>
            <MenuItem value="caper">Caper</MenuItem>
            <MenuItem value="cardamom">Cardamom</MenuItem>
            <MenuItem value="carrot">Carrot</MenuItem>
            <MenuItem value="cauliflower">Cauliflower</MenuItem>
            <MenuItem value="cayenne_pepper">Cayenne pepper</MenuItem>
            <MenuItem value="celery">Celery</MenuItem>
            <MenuItem value="cheddar_cheese">Cheddar cheese</MenuItem>
            <MenuItem value="cheese">Cheese</MenuItem>
            <MenuItem value="cherry">Cherry</MenuItem>
            <MenuItem value="chia_seed">Chia seed</MenuItem>
            <MenuItem value="chicken">Chicken</MenuItem>
            <MenuItem value="chicken_breast">Chicken breast</MenuItem>
            <MenuItem value="chicken_thigh">Chicken thigh</MenuItem>
            <MenuItem value="chicken_wing">Chicken wing</MenuItem>
            <MenuItem value="chickpea_flour">Chickpea flour</MenuItem>
            <MenuItem value="chickpeas">Chickpeas</MenuItem>
            <MenuItem value="chives">Chives</MenuItem>
            <MenuItem value="chocolate">Chocolate</MenuItem>
            <MenuItem value="cilantro">Cilantro</MenuItem>
            <MenuItem value="cinnamon">Cinnamon</MenuItem>
            <MenuItem value="clove">Clove</MenuItem>
            <MenuItem value="cocoa_powder">Cocoa powder</MenuItem>
            <MenuItem value="coconut">Coconut</MenuItem>
            <MenuItem value="coconut_oil">Coconut oil</MenuItem>
            <MenuItem value="coriander">Coriander</MenuItem>
            <MenuItem value="coriander_seed">Coriander seed</MenuItem>
            <MenuItem value="corn_flour">Corn flour</MenuItem>
            <MenuItem value="corn_kernel">Corn kernel</MenuItem>
            <MenuItem value="cornmeal">Cornmeal</MenuItem>
            <MenuItem value="cotija_cheese">Cotija cheese</MenuItem>
            <MenuItem value="courgette">Courgette</MenuItem>
            <MenuItem value="crab">Crab</MenuItem>
            <MenuItem value="cranberry">Cranberry</MenuItem>
            <MenuItem value="cream_cheese">Cream cheese</MenuItem>
            <MenuItem value="cucumber">Cucumber</MenuItem>
            <MenuItem value="cumin">Cumin</MenuItem>
            <MenuItem value="daikon">Daikon</MenuItem>
            <MenuItem value="dairy">Dairy</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="dill">Dill</MenuItem>
            <MenuItem value="dutch_cocoa_powder">Dutch cocoa powder</MenuItem>
            <MenuItem value="eggplant">Eggplant</MenuItem>
            <MenuItem value="fennel">Fennel</MenuItem>
            <MenuItem value="fennel_seed">Fennel seed</MenuItem>
            <MenuItem value="fenugreek">Fenugreek</MenuItem>
            <MenuItem value="feta_cheese">Feta cheese</MenuItem>
            <MenuItem value="flank_steak">Flank steak</MenuItem>
            <MenuItem value="garam_masala">Garam masala</MenuItem>
            <MenuItem value="garlic">Garlic</MenuItem>
            <MenuItem value="ghee">Ghee</MenuItem>
            <MenuItem value="ginger">Ginger</MenuItem>
            <MenuItem value="goat_cheese">Goat cheese</MenuItem>
            <MenuItem value="grape">Grape</MenuItem>
            <MenuItem value="grapefruit">Grapefruit</MenuItem>
            <MenuItem value="green_beans">Green beans</MenuItem>
            <MenuItem value="ground_beef">Ground beef</MenuItem>
            <MenuItem value="habanero">Habanero</MenuItem>
            <MenuItem value="ham">Ham</MenuItem>
            <MenuItem value="jackfruit">Jackfruit</MenuItem>
            <MenuItem value="jalapeno">Jalapeño</MenuItem>
            <MenuItem value="kale">Kale</MenuItem>
            <MenuItem value="kidney_beans">Kidney beans</MenuItem>
            <MenuItem value="lavender">Lavender</MenuItem>
            <MenuItem value="leek">Leek</MenuItem>
            <MenuItem value="lemon">Lemon</MenuItem>
            <MenuItem value="lemongrass">Lemongrass</MenuItem>
            <MenuItem value="lentils">Lentils</MenuItem>
            <MenuItem value="lettuce">Lettuce</MenuItem>
            <MenuItem value="lime">Lime</MenuItem>
            <MenuItem value="liquid_smoke">Liquid smoke</MenuItem>
            <MenuItem value="mango">Mango</MenuItem>
            <MenuItem value="melon">Melon</MenuItem>
            <MenuItem value="mint">Mint</MenuItem>
            <MenuItem value="monterey_jack_cheese">Monterey jack cheese</MenuItem>
            <MenuItem value="mozzarella_cheese">Mozzarella cheese</MenuItem>
            <MenuItem value="mushrooms">Mushrooms</MenuItem>
            <MenuItem value="mustard">Mustard</MenuItem>
            <MenuItem value="nutmeg">Nutmeg</MenuItem>
            <MenuItem value="oat">Oat</MenuItem>
            <MenuItem value="oat_flour">Oat flour</MenuItem>
            <MenuItem value="olive">Olive</MenuItem>
            <MenuItem value="olive_oil">Olive oil</MenuItem>
            <MenuItem value="onion">Onion</MenuItem>
            <MenuItem value="orange">Orange</MenuItem>
            <MenuItem value="oregano">Oregano</MenuItem>
            <MenuItem value="oyster">Oyster</MenuItem>
            <MenuItem value="paprika">Paprika</MenuItem>
            <MenuItem value="parmesan_cheese">Parmesan cheese</MenuItem>
            <MenuItem value="parsley">Parsley</MenuItem>
            <MenuItem value="pea">Pea</MenuItem>
            <MenuItem value="peach">Peach</MenuItem>
            <MenuItem value="peanut">Peanut</MenuItem>
            <MenuItem value="peanut_butter">Peanut butter</MenuItem>
            <MenuItem value="peanuts">Peanuts</MenuItem>
            <MenuItem value="pear">Pear</MenuItem>
            <MenuItem value="peas">Peas</MenuItem>
            <MenuItem value="pecan">Pecan</MenuItem>
            <MenuItem value="pepper">Pepper</MenuItem>
            <MenuItem value="peppercorn">Peppercorn</MenuItem>
            <MenuItem value="peppermint">Peppermint</MenuItem>
            <MenuItem value="peppers">Peppers</MenuItem>
            <MenuItem value="pineapple">Pineapple</MenuItem>
            <MenuItem value="pinto_beans">Pinto beans</MenuItem>
            <MenuItem value="plantain">Plantain</MenuItem>
            <MenuItem value="plum">Plum</MenuItem>
            <MenuItem value="pomegranate">Pomegranate</MenuItem>
            <MenuItem value="poppy_seed">Poppy seed</MenuItem>
            <MenuItem value="pork">Pork</MenuItem>
            <MenuItem value="pork_belly">Pork belly</MenuItem>
            <MenuItem value="pork_chop">Pork chop</MenuItem>
            <MenuItem value="potato">Potato</MenuItem>
            <MenuItem value="prawns">Prawns</MenuItem>
            <MenuItem value="prosciutto">Prosciutto</MenuItem>
            <MenuItem value="provolone_cheese">Provolone cheese</MenuItem>
            <MenuItem value="pumpkin">Pumpkin</MenuItem>
            <MenuItem value="queso_fresco">Queso fresco</MenuItem>
            <MenuItem value="quinoa">Quinoa</MenuItem>
            <MenuItem value="radish">Radish</MenuItem>
            <MenuItem value="raisin">Raisin</MenuItem>
            <MenuItem value="raspberry">Raspberry</MenuItem>
            <MenuItem value="red_cabbage">Red cabbage</MenuItem>
            <MenuItem value="ricotta_cheese">Ricotta cheese</MenuItem>
            <MenuItem value="rose">Rose</MenuItem>
            <MenuItem value="rosemary">Rosemary</MenuItem>
            <MenuItem value="saffron">Saffron</MenuItem>
            <MenuItem value="sage">Sage</MenuItem>
            <MenuItem value="salami">Salami</MenuItem>
            <MenuItem value="salmon">Salmon</MenuItem>
            <MenuItem value="sausage">Sausage</MenuItem>
            <MenuItem value="scallion">Scallion</MenuItem>
            <MenuItem value="self_rising_flour">Self rising flour</MenuItem>
            <MenuItem value="sesame_oil">Sesame oil</MenuItem>
            <MenuItem value="sesame_seed">Sesame seed</MenuItem>
            <MenuItem value="shallot">Shallot</MenuItem>
            <MenuItem value="shrimp">Shrimp</MenuItem>
            <MenuItem value="sirloin_steak">Sirloin steak</MenuItem>
            <MenuItem value="skirt_steak">Skirt steak</MenuItem>
            <MenuItem value="sour_cream">Sour cream</MenuItem>
            <MenuItem value="spaghetti_squash">Spaghetti squash</MenuItem>
            <MenuItem value="spinach">Spinach</MenuItem>
            <MenuItem value="squash">Squash</MenuItem>
            <MenuItem value="sriracha_sauce">Sriracha sauce</MenuItem>
            <MenuItem value="star_anise">Star anise</MenuItem>
            <MenuItem value="strawberry">Strawberry</MenuItem>
            <MenuItem value="sumac">Sumac</MenuItem>
            <MenuItem value="sweet_potato">Sweet potato</MenuItem>
            <MenuItem value="swiss_cheese">Swiss cheese</MenuItem>
            <MenuItem value="taco_seasoning">Taco seasoning</MenuItem>
            <MenuItem value="tamarind">Tamarind</MenuItem>
            <MenuItem value="tenderloin">Tenderloin</MenuItem>
            <MenuItem value="thyme">Thyme</MenuItem>
            <MenuItem value="tomato">Tomato</MenuItem>
            <MenuItem value="turkey">Turkey</MenuItem>
            <MenuItem value="turmeric">Turmeric</MenuItem>
            <MenuItem value="vanilla">Vanilla</MenuItem>
            <MenuItem value="vanilla_bean">Vanilla bean</MenuItem>
            <MenuItem value="vanilla_extract">Vanilla extract</MenuItem>
            <MenuItem value="watermelon">Watermelon</MenuItem>
            <MenuItem value="white_pepper">White pepper</MenuItem>
            <MenuItem value="whole_grain">Whole grain</MenuItem>
            <MenuItem value="zucchini">Zucchini</MenuItem>
        </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.75rem' }}>Preferences</InputLabel>
        <Select
            name="dietaryPreferences"
            value={filters.dietaryPreferences}
            onChange={handleFilterChange}
            multiple
            renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
                ))}
            </Box>
            )}
            sx={{ fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
            <MenuItem value="vegetarian">Vegetarian</MenuItem>
            <MenuItem value="pescatarian">Pescatarian</MenuItem>
            <MenuItem value="kosher">Kosher</MenuItem>
            <MenuItem value="dairy_free">Dairy Free</MenuItem>
            <MenuItem value="vegan">Vegan</MenuItem>
            <MenuItem value="keto">Keto</MenuItem>
            <MenuItem value="alcohol_free">Alcohol Free</MenuItem>
            <MenuItem value="halal">Halal</MenuItem>
            <MenuItem value="gluten_free">Gluten Free</MenuItem>
            <MenuItem value="low_calorie">Low Calorie</MenuItem>
            <MenuItem value="high_fiber">High Fiber</MenuItem>
            <MenuItem value="high_protein">High Protein</MenuItem>
            <MenuItem value="low_sugar">Low Sugar</MenuItem>
            <MenuItem value="healthy">Healthy</MenuItem>
            <MenuItem value="low_carb">Low Carb</MenuItem>
            <MenuItem value="low_fat">Low Fat</MenuItem>
        </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.75rem' }}>Cuisine</InputLabel>
        <Select
            name="cuisine"
            value={filters.cuisine}
            onChange={handleFilterChange}
            multiple
            renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
                ))}
            </Box>
            )}
            sx={{ fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
            <MenuItem value="italian">Italian</MenuItem>
            <MenuItem value="thai">Thai</MenuItem>
            <MenuItem value="caribbean">Caribbean</MenuItem>
            <MenuItem value="filipino">Filipino</MenuItem>
            <MenuItem value="taiwanese">Taiwanese</MenuItem>
            <MenuItem value="swedish">Swedish</MenuItem>
            <MenuItem value="lebanese">Lebanese</MenuItem>
            <MenuItem value="asian">Asian</MenuItem>
            <MenuItem value="european">European</MenuItem>
            <MenuItem value="southern">Southern</MenuItem>
            <MenuItem value="mediterranean">Mediterranean</MenuItem>
            <MenuItem value="japanese">Japanese</MenuItem>
            <MenuItem value="korean">Korean</MenuItem>
            <MenuItem value="laotian">Laotian</MenuItem>
            <MenuItem value="cuban">Cuban</MenuItem>
            <MenuItem value="venezuelan">Venezuelan</MenuItem>
            <MenuItem value="brazilian">Brazilian</MenuItem>
            <MenuItem value="british">British</MenuItem>
            <MenuItem value="chinese">Chinese</MenuItem>
            <MenuItem value="german">German</MenuItem>
            <MenuItem value="indian">Indian</MenuItem>
            <MenuItem value="mexican">Mexican</MenuItem>
            <MenuItem value="hawaiian">Hawaiian</MenuItem>
            <MenuItem value="dominican">Dominican</MenuItem>
            <MenuItem value="puerto_rican">Puerto Rican</MenuItem>
            <MenuItem value="southwestern">Southwestern</MenuItem>
            <MenuItem value="north_american">North American</MenuItem>
            <MenuItem value="vietnamese">Vietnamese</MenuItem>
            <MenuItem value="african">African</MenuItem>
            <MenuItem value="kenyan">Kenyan</MenuItem>
            <MenuItem value="south_african">South African</MenuItem>
            <MenuItem value="haitian">Haitian</MenuItem>
            <MenuItem value="persian">Persian</MenuItem>
            <MenuItem value="jamaican">Jamaican</MenuItem>
            <MenuItem value="soul_food">Soul Food</MenuItem>
            <MenuItem value="jewish">Jewish</MenuItem>
            <MenuItem value="french">French</MenuItem>
            <MenuItem value="central_south_american">Central/South American</MenuItem>
            <MenuItem value="middle_eastern">Middle Eastern</MenuItem>
            <MenuItem value="fusion">Fusion</MenuItem>
            <MenuItem value="ethiopian">Ethiopian</MenuItem>
            <MenuItem value="west_african">West African</MenuItem>
            <MenuItem value="peruvian">Peruvian</MenuItem>
            <MenuItem value="indigenous_cuisine">Indigenous Cuisine</MenuItem>
            <MenuItem value="polish">Polish</MenuItem>
        </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.75rem' }}>Cooking Style</InputLabel>
        <Select
            name="cookingStyle"
            value={filters.cookingStyle}
            onChange={handleFilterChange}
            multiple
            renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
                ))}
            </Box>
            )}
            sx={{ fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
            <MenuItem value="kid_friendly">Kid Friendly</MenuItem>
            <MenuItem value="big_batch">Big Batch</MenuItem>
            <MenuItem value="pan_fry">Pan Fry</MenuItem>
            <MenuItem value="deep_fry">Deep Fry</MenuItem>
            <MenuItem value="cooking_style">Cooking Style</MenuItem>
            <MenuItem value="comfort_food">Comfort Food</MenuItem>
            <MenuItem value="mashup">Mashup</MenuItem>
            <MenuItem value="no_bake_desserts">No Bake Desserts</MenuItem>
            <MenuItem value="steam">Steam</MenuItem>
            <MenuItem value="meal_prep">Meal Prep</MenuItem>
            <MenuItem value="stuffed">Stuffed</MenuItem>
            <MenuItem value="grill">Grill</MenuItem>
            <MenuItem value="one_pot_or_pan">One Pot or Pan</MenuItem>
            <MenuItem value="budget">Budget</MenuItem>
        </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.75rem' }}>Appliances</InputLabel>
        <Select
            name="appliances"
            value={filters.appliances}
            onChange={handleFilterChange}
            multiple
            renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
                ))}
            </Box>
            )}
            sx={{ fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
            <MenuItem value="blender">Blender</MenuItem>
            <MenuItem value="hand_mixer">Hand Mixer</MenuItem>
            <MenuItem value="microwave">Microwave</MenuItem>
            <MenuItem value="stove_top">Stove Top</MenuItem>
            <MenuItem value="air_fryer">Air Fryer</MenuItem>
            <MenuItem value="bread">Bread</MenuItem>
            <MenuItem value="baking">Baking</MenuItem>
            <MenuItem value="broiler">Broiler</MenuItem>
            <MenuItem value="cast_iron_pan">Cast Iron Pan</MenuItem>
            <MenuItem value="slow_cooker">Slow Cooker</MenuItem>
            <MenuItem value="wok">Wok</MenuItem>
            <MenuItem value="rolls">Rolls</MenuItem>
            <MenuItem value="dutch_oven">Dutch Oven</MenuItem>
            <MenuItem value="food_processor">Food Processor</MenuItem>
            <MenuItem value="appliance">Appliance</MenuItem>
            <MenuItem value="freezer_friendly">Freezer Friendly</MenuItem>
            <MenuItem value="bakery_goods">Bakery Goods</MenuItem>
            <MenuItem value="pressure_cooker">Pressure Cooker</MenuItem>
        </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.75rem' }}>Meal Type</InputLabel>
        <Select
            name="mealType"
            value={filters.mealType}
            onChange={handleFilterChange}
            multiple
            renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
                ))}
            </Box>
            )}
            sx={{ fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
            <MenuItem value="appetizers">Appetizers</MenuItem>
            <MenuItem value="brunch">Brunch</MenuItem>
            <MenuItem value="desserts">Desserts</MenuItem>
            <MenuItem value="drinks">Drinks</MenuItem>
            <MenuItem value="breakfast">Breakfast</MenuItem>
            <MenuItem value="lunch">Lunch</MenuItem>
            <MenuItem value="dinner">Dinner</MenuItem>
            <MenuItem value="meal">Meal</MenuItem>
        </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.75rem' }}>Difficulty</InputLabel>
        <Select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            multiple
            renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
                ))}
            </Box>
            )}
            sx={{ fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
            <MenuItem value="under_30_minutes">Under 30 Minutes</MenuItem>
            <MenuItem value="under_45_minutes">Under 45 Minutes</MenuItem>
            <MenuItem value="5_ingredients_or_less">5 Ingredients or Less</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="under_1_hour">Under 1 Hour</MenuItem>
            <MenuItem value="under_15_minutes">Under 15 Minutes</MenuItem>
        </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel sx={{ fontSize: '0.75rem' }}>Seasonal</InputLabel>
        <Select
            name="seasonal"
            value={filters.seasonal}
            onChange={handleFilterChange}
            multiple
            renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
                ))}
            </Box>
            )}
            sx={{ fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
            <MenuItem value="happy_hour">Happy Hour</MenuItem>
            <MenuItem value="indulgent_sweets">Indulgent Sweets</MenuItem>
            <MenuItem value="valentines_day">Valentine's Day</MenuItem>
            <MenuItem value="party">Party</MenuItem>
            <MenuItem value="passover">Passover</MenuItem>
            <MenuItem value="holidays">Holidays</MenuItem>
            <MenuItem value="occasion">Occasion</MenuItem>
            <MenuItem value="date_night">Date Night</MenuItem>
            <MenuItem value="special_occasion">Special Occasion</MenuItem>
            <MenuItem value="lunar_new_year">Lunar New Year</MenuItem>
            <MenuItem value="st_patrick_s_day">St. Patrick's Day</MenuItem>
            <MenuItem value="cinco_de_mayo">Cinco de Mayo</MenuItem>
            <MenuItem value="mothers_day">Mother's Day</MenuItem>
            <MenuItem value="picnic">Picnic</MenuItem>
            <MenuItem value="new_years">New Year's</MenuItem>
            <MenuItem value="4th_of_july">4th of July</MenuItem>
        </Select>
        </FormControl>
    </Box>

    <Box sx={{ width: '100%' }}>
        {recipes.length > 0 ? (
            <DisplayRecipes
                recipes={recipes}
                openRecipeId={openRecipeId}
                handleRecipeOpen={handleRecipeOpen}
                handleRecipeClose={handleRecipeClose}
            />
        ) : (
            feed.length > 0 ? (
                <>
                    <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>Explore</Typography>
                    <Masonry columns={{ xs: 1, sm: 2, md: 4 }} spacing={2}>
                        {feed.map((recipe, index) => (
                            <Card key={`${recipe.id}-${index}`} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, boxShadow: 0 }}>
                                <Typography variant="h7">{recipe.name}</Typography>
                                {recipe.original_video_url && (
                                    <CardMedia
                                        component="img"
                                        image={recipe.thumbnail_url}
                                        sx={{ mt: 2, width: '100%', height: 'auto', borderRadius: 2 }}
                                    />
                                )}
                                <Typography variant="body2" sx={{ mt: 1, mb: 1, minHeight: '3em' }}>{truncateDescription(recipe.description)}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '3em' }}>
                                    <Button variant='outlined' size='small' sx={{ height: 36, mr: .5, fontSize: 12 }} onClick={() => handleRecipeOpen(recipe.id)}>Recipe</Button>
                                    <ViewRecipe open={openRecipeId === recipe.id} onClose={handleRecipeClose} recipe={recipe} />
                                    <AddIngredients recipe={recipe} />
                                    <SaveRecipe recipe={recipe} />
                                </Box>
                                <Typography variant="caption">Time: {recipe.total_time_minutes} minutes</Typography>
                            </Card>
                        ))}
                    </Masonry>
                </>
            ) : (
                <div className="home-container">
                    <Typography variant="body1">Unable to load results. Please try again.</Typography>
                </div>
            )
        )}
    </Box>
    </Box>
    );
}