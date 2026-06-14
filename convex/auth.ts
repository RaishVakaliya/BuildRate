import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const login = action({
  args: {
    phone: v.string(),
    password: v.string(),
  },
  handler: async (
    ctx,
    { phone, password },
  ): Promise<{
    success: boolean;
    token: string;
    user: {
      id?: string;
      username: string;
      email: string;
      role: "admin" | "supplier";
      memberSince: string;
      phone?: string;
      businessName?: string;
      city?: string;
      address?: string;
      categories?: string[];
      gstNumber?: string;
    };
  }> => {
    const adminPhone = process.env.ADMIN_PHONE;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPhone || !adminPassword) {
      throw new Error(
        "Admin credentials not configured in environment variables.",
      );
    }

    if (phone === adminPhone && password === adminPassword) {
      const token = `admin_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      return {
        success: true,
        token,
        user: {
          username: "BuildRate Admin",
          email: "adminbuildrate@gmail.com",
          role: "admin" as const,
          memberSince: "2026-06-09",
          phone: adminPhone,
        },
      };
    }

    const supplier = await ctx.runQuery(api.suppliers.getSupplierByPhone, {
      phone,
    });
    if (supplier && supplier.password === password) {
      if (supplier.status !== "active") {
        throw new Error(
          `Your account status is ${supplier.status}. Please contact the administrator.`,
        );
      }

      const token = `supplier_${supplier._id}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      return {
        success: true,
        token,
        user: {
          id: supplier._id,
          username: supplier.username,
          email: supplier.email,
          phone: supplier.phone,
          businessName: supplier.businessName,
          city: supplier.city,
          address: supplier.address,
          categories: supplier.categories,
          gstNumber: supplier.gstNumber,
          role: "supplier" as const,
          memberSince: new Date(supplier.createdAt).toISOString(),
        },
      };
    }

    throw new Error("Invalid phone number or password.");
  },
});
