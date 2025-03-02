import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import recipeModel from "../models/recipeModel.js";


export const updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });

    const user = await userModel.findByIdAndUpdate(
      userId,
      { profileImage: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



// Save a recipe
export const saveRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    const user = await userModel.findById(userId);
    const recipe = await recipeModel.findById(recipeId);

    if (!user || !recipe) {
      return res.status(404).json({ success: false, message: "User or Recipe not found." });
    }

    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ success: false, message: "Recipe already saved." });
    }

    user.savedRecipes.push(recipeId);
    await user.save();

    return res.status(200).json({ success: true, message: "Recipe saved successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a saved recipe
export const removeSavedRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    const user = await userModel.findById(userId); 

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (!user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ success: false, message: "Recipe not found in saved list." });
    }

    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    return res.status(200).json({ success: true, message: "Recipe removed from saved list." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get saved recipes for a user
export const getSavedRecipes = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).populate("savedRecipes");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, savedRecipes: user.savedRecipes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request parameters
    const user = await userModel.findById(userId).select("-password"); // Exclude password for security

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, user:user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Name and Email
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully.", 
      user 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
