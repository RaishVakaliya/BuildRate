import type { Id } from "../convex/_generated/dataModel";

export type SupplierDoc = {
  _id: Id<"suppliers">;
  _creationTime: number;
  businessName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  area: string;
  address?: string;
  categories: string[];
  status: "active" | "suspended" | "pending";
  verified: boolean;
  notes?: string;
  mapUrl?: string;
  createdAt: number;
};

export type MaterialDoc = {
  _id: Id<"materials">;
  _creationTime: number;
  supplierId: Id<"suppliers">;
  category: string;
  name: string;
  brand: string;
  unit: string;
  price: number;
  status: "available" | "out_of_stock";
  notes?: string;
  createdAt: number;
};

export type SupplierApplicationDoc = {
  _id: Id<"supplierApplications">;
  _creationTime: number;
  businessName: string;
  username: string;
  phone: string;
  email: string;
  area: string;
  address?: string;
  gstNumber?: string;
  mapUrl?: string;
  categories: string[];
  notes?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: number;
  reviewedAt?: number;
};
