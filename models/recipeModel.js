import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    preparationTime: { type: String, required: true }, // e.g., "30 mins"
    preparationProcess : { type:String, required: true},
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isSaved: { type: Boolean , default:false},
    category: { type: String, required: true }, // e.g., "Dessert", "Main Course"
    cuisine: { type: String, required: true }, // e.g., "Italian", "Indian"
    mealType: { type: String, required: true }, // e.g., "Breakfast", "Dinner"
    dietType: { type: String, required: true }, // e.g., "Vegetarian", "Vegan"
    image: { type: String, required: true }, // Image URL is required
    video: { type: String , required:true},
    ingredients:[
      {
        type: String,
        required: true
      },
    ],
    nutrition: {
      calories: { type: Number },
      protein: { type: Number }, // in grams
      fat: { type: Number }, // in grams
      carbohydrates: { type: Number }, // in grams
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewText: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 }, // 1 to 5 stars
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const recipeModel =
  mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default recipeModel;
