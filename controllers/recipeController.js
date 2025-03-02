import recipeModel from "../models/recipeModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      createdBy,
      preparationTime,
      preparationProcess,
      category,
      cuisine,
      mealType,
      dietType,
      nutrition,
      ingredients,
    } = req.body;

    const user = await userModel.findById(createdBy);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let imageUrl = "";
    let videoUrl = "";

    if (req.files?.image?.[0]) {
      const imageUpload = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          resource_type: "image",
        }
      );
      imageUrl = imageUpload.secure_url;
    }

    if (req.files?.video?.[0]) {
      const videoUpload = await cloudinary.uploader.upload(
        req.files.video[0].path,
        {
          resource_type: "video",
        }
      );
      videoUrl = videoUpload.secure_url;
    }

    const newRecipe = new recipeModel({
      title,
      description,
      createdBy,
      preparationTime,
      preparationProcess,
      category,
      cuisine,
      mealType,
      dietType,
      image: imageUrl,
      video: videoUrl,
      ingredients,
      nutrition,
    });

    await newRecipe.save();
    user.addedRecipes.push(newRecipe._id);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
   const recipes = await recipeModel.find().populate("createdBy", "name");


 
    return res.status(200).json({ success: true, recipes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await recipeModel
      .findById(recipeId)
      .populate("createdBy", "name profileImage");

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    return res.status(200).json({ success: true, recipe });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update a recipe
export const updateRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const updatedRecipe = await recipeModel.findByIdAndUpdate(
      recipeId,
      req.body,
      { new: true }
    );

    if (!updatedRecipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Recipe updated successfully",
        recipe: updatedRecipe,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const deletedRecipe = await recipeModel.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Save a recipe (Add to user’s savedRecipes)
export const saveRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    // Find user and recipe
    const user = await userModel.findById(userId);
    const recipe = await recipeModel.findById(recipeId);

    if (!user || !recipe) {
      return res.status(404).json({ success: false, message: "User or Recipe not found" });
    }

    // Check if the recipe is already saved
    const isSaved = user.savedRecipes.includes(recipeId);

    if (isSaved) {
      // If already saved, unsave it
      user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeId);
    } else {
      // If not saved, save it
      user.savedRecipes.push(recipeId);
    }

    // Save the user data
    await user.save();

    return res.json({
      success: true,
      message: `Recipe ${isSaved ? "removed from" : "added to"} saved recipes successfully`,
      isSaved: !isSaved, // To update the UI state in the frontend
    });
  } catch (error) {
    console.error("Error saving recipe:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



// Get saved recipes of a user
export const getSavedRecipes = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).populate("savedRecipes");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, savedRecipes: user.savedRecipes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
