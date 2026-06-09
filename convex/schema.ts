import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  suppliers: defineTable({
    businessName: v.string(),
    username: v.string(),
    email: v.string(),
    phone: v.string(),
    password: v.string(),
    city: v.string(),
    address: v.optional(v.string()),
    categories: v.array(v.string()),
    status: v.union(v.literal('active'), v.literal('suspended'), v.literal('pending')),
    verified: v.boolean(),
    gstNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
