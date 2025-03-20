import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { auth, db } from '../config';

export default function RemoveIngredients({ recipeId }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemoveIngredients = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.error("User document not found");
            return;
        }

        const groceryList = userDoc.data().groceryList || [];
        const ingredientsToRemove = groceryList.filter(item => item.recipeId === recipeId);

        try {
            await updateDoc(userDocRef, {
                groceryList: arrayRemove(...ingredientsToRemove)
            });
            console.log("Ingredients removed from grocery list");
            handleClose();
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error("Error removing ingredients from grocery list:", error);
        }
    };

    return (
        <>
            <Button variant='outlined' size='small' sx={{ mt: 1, ml: .5 }} onClick={handleClickOpen}>
                Remove Recipe<DeleteIcon sx={{ ml: .5, width: 18, height: 16 }} />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Removal"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove this recipe and its ingredients from your grocery list?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleRemoveIngredients} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}