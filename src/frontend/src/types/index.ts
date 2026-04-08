import type { Principal } from "@icp-sdk/core/principal";
import type { ExternalBlob } from "../backend";

export type UserId = Principal;
export type CropId = bigint;
export type OrderId = bigint;
export type Timestamp = bigint;

export type UserRole = "farmer" | "business" | "admin";

export type CropStatus = "pending" | "approved" | "rejected";

export type OrderStatus = "pending" | "accepted" | "completed" | "rejected";

export interface UserProfile {
  id: UserId;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  location: string;
  isBlocked: boolean;
  createdAt: Timestamp;
}

export interface Crop {
  id: CropId;
  farmerId: UserId;
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  description: string;
  location: string;
  image?: ExternalBlob;
  status: CropStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CropInput {
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  description: string;
  location: string;
  image?: ExternalBlob;
}

export interface Order {
  id: OrderId;
  cropId: CropId;
  buyerId: UserId;
  farmerId: UserId;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id: bigint;
  senderId: UserId;
  receiverId: UserId;
  message: string;
  timestamp: Timestamp;
  isRead: boolean;
}

export interface ConversationSummary {
  partnerId: UserId;
  partnerName: string;
  lastMessage: string;
  lastTimestamp: Timestamp;
  unreadCount: bigint;
}

export interface FarmerDashboardStats {
  totalCrops: bigint;
  approvedCrops: bigint;
  pendingCrops: bigint;
  totalOrders: bigint;
  pendingOrders: bigint;
  acceptedOrders: bigint;
  totalRevenue: number;
}

export interface BusinessDashboardStats {
  totalOrdersPlaced: bigint;
  pendingOrders: bigint;
  completedOrders: bigint;
  totalSpent: number;
}

export interface AdminDashboardStats {
  totalUsers: bigint;
  totalFarmers: bigint;
  totalBusinessUsers: bigint;
  blockedUsers: bigint;
  totalCrops: bigint;
  approvedCrops: bigint;
  pendingCrops: bigint;
  totalOrders: bigint;
  completedOrders: bigint;
  totalRevenue: number;
}

export interface AdminReport {
  newUsersThisMonth: bigint;
  recentOrders: Order[];
  topCrops: Array<{
    cropName: string;
    totalOrders: bigint;
    totalRevenue: number;
  }>;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
