import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box, FormControl, InputLabel, MenuItem, Select, Chip, Typography } from '@mui/material';
import DisplayRecipes from './DisplayRecipes';
import { dietaryPreferences, cuisine, cookingStyle, appliances, mealType, difficulty, seasonal } from '../data/menuItems';

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
            {ingredients.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
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
            {dietaryPreferences.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
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
            {cuisine.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
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
            {cookingStyle.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
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
            {appliances.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
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
            {mealType.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
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
            {difficulty.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
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
            {seasonal.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
        </Select>
        </FormControl>
    </Box>

    <Box sx={{ width: '100%' }}>
        {recipes.length > 0 ? (
            <>
                <Typography variant="h5" sx={{ mt: 3, mb: 3 }}>Search Results</Typography>
                <DisplayRecipes
                    recipes={recipes}
                    openRecipeId={openRecipeId}
                    handleRecipeOpen={handleRecipeOpen}
                    handleRecipeClose={handleRecipeClose}
                />
            </>
        ) : (
            feed.length > 0 ? (
                <>
                    <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>Explore</Typography>
                    <DisplayRecipes
                        recipes={feed}
                        openRecipeId={openRecipeId}
                        handleRecipeOpen={handleRecipeOpen}
                        handleRecipeClose={handleRecipeClose}
                    />
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