import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../modules/admin/admin.model.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({
      email: "admin@skepticcore.com"
    });

    if (existing) {
      console.log("Super admin already exists");
      process.exit(0);
    }

    await Admin.create({
      name: "SkepticCore Admin",
      email: "admin@skepticcore.com",
      password: "1Prem@chand",
      role: "super_admin"
    });

    console.log("Super admin created");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createSuperAdmin();