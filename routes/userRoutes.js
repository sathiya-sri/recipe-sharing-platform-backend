import express from "express";
import { 
  updateProfileImage, 
  updateUserProfile,
  getUserById,
  saveRecipe, 
  removeSavedRecipe, 
  getSavedRecipes 
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

// Profile Image Upload
userRouter.put("/:userId/profile-image", upload.single("profileImage"), updateProfileImage);

userRouter.put("/:userId", updateUserProfile);

// Save & Remove Recipes
userRouter.post("/:userId/save-recipe/:recipeId", saveRecipe); // Use POST for saving
userRouter.delete("/:userId/remove-recipe/:recipeId", removeSavedRecipe); // Use DELETE for removing
userRouter.get("/:userId/saved-recipes", getSavedRecipes); // Get saved recipes
userRouter.get("/:userId", getUserById ); // Get saved recipes

export default userRouter;











