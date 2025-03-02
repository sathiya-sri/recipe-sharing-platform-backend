import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  getSavedRecipes
} from "../controllers/recipeController.js";
import upload from "../middleware/multer.js";

const recipeRouter = express.Router();

recipeRouter.post("/add",upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]), createRecipe);
recipeRouter.get("/get", getAllRecipes);
recipeRouter.get("/:recipeId", getRecipeById);
recipeRouter.put("/:recipeId", updateRecipe);
recipeRouter.delete("/:recipeId", deleteRecipe);
recipeRouter.post("/:userId/save/:recipeId", saveRecipe);
recipeRouter.get("/:userId/saved", getSavedRecipes);

export default recipeRouter;
