import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Start from './pages/Start';
import Home from './pages/Home';
import GroceryList from './pages/GroceryList';
import SavedRecipes from './pages/SavedRecipes';

function App() {
  return (
    <BrowserRouter basename="/grocerywiz">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/grocerylist" element={<GroceryList />} />
        <Route path="/savedrecipes" element={<SavedRecipes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;