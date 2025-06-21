import * as React from 'react';
import { auth, db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { Box, Typography, List, ListItem, ListItemText, Card, CardContent, Checkbox, Tab, Tabs, Button, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar';
import Masonry from '@mui/lab/Masonry';
import RemoveIngredients from '../components/RemoveIngredients';

export default function GroceryList() {
    const [groceryList, setGroceryList] = React.useState([]);
    const [selectedIngredients, setSelectedIngredients] = React.useState({});
    const [tabIndex, setTabIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const groceryListData = userDoc.data().groceryList || [];
                    setGroceryList(groceryListData);

                    const initialSelected = groceryListData.reduce((acc, item) => {
                        acc[item.ingredient] = false;
                        return acc;
                    }, {});
                    setSelectedIngredients(initialSelected);
                } else {
                    console.log("No such document!");
                }
            } else {
                console.error("User not authenticated");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const groupedByRecipe = groceryList.reduce((acc, item) => {
        const { recipeId, recipeName, ingredient } = item;
        if (!acc[recipeId]) {
            acc[recipeId] = { recipeName, ingredients: [] };
        }
        acc[recipeId].ingredients.push(ingredient);
        return acc;
    }, {});

    const allIngredients = groceryList.map(item => item.ingredient);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleToggle = (ingredient) => {
        setSelectedIngredients((prevSelected) => ({
            ...prevSelected,
            [ingredient]: !prevSelected[ingredient],
        }));
    };

    const handleSelectAll = (ingredients, select) => {
        const newSelected = { ...selectedIngredients };
        ingredients.forEach(ingredient => {
            newSelected[ingredient] = select;
        });
        setSelectedIngredients(newSelected);
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Grocery List</Typography>
                <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 1 }}>
                    <Tab label="Sort By Recipe" />
                    <Tab label="All Items" />
                </Tabs>
                {tabIndex === 0 && (
                    <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
                        {Object.entries(groupedByRecipe).map(([recipeId, { recipeName, ingredients }]) => (
                            <Card key={recipeId} sx={{ border: '1px solid #ccc', borderRadius: 2, boxShadow: 0 }}>
                                <CardContent>
                                    <Typography variant="h6">{recipeName}</Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleSelectAll(ingredients, true)}
                                        sx={{ mt: 1, mb: 0 }}
                                    >
                                        Select All
                                    </Button>
                                    <RemoveIngredients recipeId={recipeId} />
                                    <List>
                                        {ingredients.map((ingredient, index) => (
                                            <ListItem key={index} sx={{ py: 0 }}>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedIngredients[ingredient] || false}
                                                    onChange={() => handleToggle(ingredient)}
                                                />
                                                <ListItemText primary={ingredient} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        ))}
                    </Masonry>
                )}
                {tabIndex === 1 && (
                    <Card sx={{ border: '1px solid #ccc', borderRadius: 2, boxShadow: 0 }}>
                        <CardContent>
                            <Typography variant="h6">All Ingredients</Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleSelectAll(allIngredients, true)}
                                sx={{ mt: 1, mb: 0 }}
                            >
                                Select All
                            </Button>
                            <List>
                                {allIngredients.map((ingredient, index) => (
                                    <ListItem key={index} sx={{ py: 0.1 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedIngredients[ingredient] || false}
                                            onChange={() => handleToggle(ingredient)}
                                        />
                                        <ListItemText primary={ingredient} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </div>
    );
}