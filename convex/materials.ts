import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listSupplierMaterials = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, { supplierId }) => {
    return await ctx.db
      .query("materials")
      .withIndex("by_supplier", (q) => q.eq("supplierId", supplierId))
      .order("desc")
      .collect();
  },
});

export const addMaterial = mutation({
  args: {
    supplierId: v.id("suppliers"),
    category: v.string(),
    name: v.string(),
    brand: v.string(),
    unit: v.string(),
    price: v.number(),
    status: v.union(v.literal("available"), v.literal("out_of_stock")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("materials", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateMaterial = mutation({
  args: {
    id: v.id("materials"),
    category: v.optional(v.string()),
    name: v.optional(v.string()),
    brand: v.optional(v.string()),
    unit: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.optional(v.union(v.literal("available"), v.literal("out_of_stock"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const cleaned = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteMaterial = mutation({
  args: { id: v.id("materials") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
