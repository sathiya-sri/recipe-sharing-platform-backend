import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: { type: String, default: "default-profile.png" },
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    addedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
