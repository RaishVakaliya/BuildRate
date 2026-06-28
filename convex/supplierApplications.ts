import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitApplication = mutation({
  args: {
    businessName: v.string(),
    username: v.string(),
    phone: v.string(),
    email: v.string(),
    area: v.string(),
    address: v.optional(v.string()),
    gstNumber: v.optional(v.string()),
    mapUrl: v.optional(v.string()),
    categories: v.array(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("supplierApplications", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listApplications = query({
  args: { status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))) },
  handler: async (ctx, { status }) => {
    if (status) {
      return await ctx.db
        .query("supplierApplications")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("supplierApplications").order("desc").collect();
  },
});

export const getApplication = query({
  args: { id: v.id("supplierApplications") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const approveApplication = mutation({
  args: { id: v.id("supplierApplications") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "approved", reviewedAt: Date.now() });
  },
});

export const rejectApplication = mutation({
  args: {
    id: v.id("supplierApplications"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { id, reason }) => {
    await ctx.db.patch(id, {
      status: "rejected",
      rejectionReason: reason,
      reviewedAt: Date.now(),
    });
  },
});

export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("supplierApplications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return pending.length;
  },
});
