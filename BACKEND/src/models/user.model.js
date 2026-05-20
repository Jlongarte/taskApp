const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    avatar: {
      type: String,
      required: false,
      default:
        "data:image/jpeg;base64,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",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function () {
  // Si no se modificó la contraseña, salimos sin hacer nada
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error; // Mongoose capturará este error automáticamente
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
