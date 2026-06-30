import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export const addSupplier = mutation({
  args: {
    businessName: v.string(),
    username: v.string(),
    email: v.string(),
    phone: v.string(),
    password: v.string(),
    area: v.string(),
    address: v.optional(v.string()),
    categories: v.array(v.string()),
    notes: v.optional(v.string()),
    mapUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("suppliers", {
      ...args,
      status: "active",
      verified: true,
      createdAt: Date.now(),
    });
  },
});

export const listSuppliers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("suppliers").order("desc").collect();
  },
});

export const getSupplier = query({
  args: { id: v.id("suppliers") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const updateSupplier = mutation({
  args: {
    id: v.id("suppliers"),
    businessName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    area: v.optional(v.string()),
    address: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    mapUrl: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const cleaned = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(id, cleaned);
  },
});

export const changePassword = mutation({
  args: {
    id: v.id("suppliers"),
    oldPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { id, oldPassword, newPassword }) => {
    const supplier = await ctx.db.get(id);
    if (!supplier) throw new Error("Supplier not found");
    if (supplier.password !== oldPassword) throw new ConvexError("Incorrect old password");
    
    await ctx.db.patch(id, { password: newPassword });
  },
});

export const toggleStatus = mutation({
  args: { id: v.id("suppliers") },
  handler: async (ctx, { id }) => {
    const supplier = await ctx.db.get(id);
    if (!supplier) throw new Error("Supplier not found");
    const next = supplier.status === "active" ? "suspended" : "active";
    await ctx.db.patch(id, { status: next });
    return next;
  },
});

export const deleteSupplier = mutation({
  args: { id: v.id("suppliers") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const getSupplierByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, { phone }) => {
    return await ctx.db
      .query("suppliers")
      .filter((q) => q.eq(q.field("phone"), phone))
      .first();
  },
});
