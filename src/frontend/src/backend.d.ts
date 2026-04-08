import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface AdminReport {
    topCrops: Array<{
        totalOrders: bigint;
        cropName: string;
        totalRevenue: number;
    }>;
    recentOrders: Array<Order>;
    newUsersThisMonth: bigint;
}
export type Timestamp = bigint;
export interface FarmerDashboardStats {
    acceptedOrders: bigint;
    pendingCrops: bigint;
    totalOrders: bigint;
    pendingOrders: bigint;
    approvedCrops: bigint;
    totalCrops: bigint;
    totalRevenue: number;
}
export interface Crop {
    id: CropId;
    status: CropStatus;
    farmerId: UserId;
    createdAt: Timestamp;
    unit: string;
    description: string;
    pricePerUnit: number;
    updatedAt: Timestamp;
    quantity: number;
    cropName: string;
    image?: ExternalBlob;
    location: string;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    farmerId: UserId;
    createdAt: Timestamp;
    cropId: CropId;
    updatedAt: Timestamp;
    buyerId: UserId;
    quantity: number;
    totalPrice: number;
}
export interface BusinessDashboardStats {
    pendingOrders: bigint;
    totalSpent: number;
    completedOrders: bigint;
    totalOrdersPlaced: bigint;
}
export interface AdminDashboardStats {
    pendingCrops: bigint;
    blockedUsers: bigint;
    totalOrders: bigint;
    approvedCrops: bigint;
    totalCrops: bigint;
    completedOrders: bigint;
    totalUsers: bigint;
    totalRevenue: number;
    totalBusinessUsers: bigint;
    totalFarmers: bigint;
}
export type UserId = Principal;
export type MessageId = bigint;
export type CropId = bigint;
export interface CropInput {
    unit: string;
    description: string;
    pricePerUnit: number;
    quantity: number;
    cropName: string;
    image?: ExternalBlob;
    location: string;
}
export interface ChatMessage {
    id: MessageId;
    isRead: boolean;
    receiverId: UserId;
    message: string;
    timestamp: Timestamp;
    senderId: UserId;
}
export interface ConversationSummary {
    partnerName: string;
    lastMessage: string;
    partnerId: UserId;
    unreadCount: bigint;
    lastTimestamp: Timestamp;
}
export type OrderId = bigint;
export interface UserProfile {
    id: UserId;
    isBlocked: boolean;
    name: string;
    createdAt: Timestamp;
    role: UserRole;
    email: string;
    mobile: string;
    location: string;
}
export enum CropStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum OrderStatus {
    pending = "pending",
    completed = "completed",
    rejected = "rejected",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    business = "business",
    farmer = "farmer"
}
export interface backendInterface {
    addCrop(input: CropInput): Promise<Crop>;
    approveCrop(cropId: CropId): Promise<boolean>;
    blockUser(targetId: UserId): Promise<boolean>;
    deleteCrop(cropId: CropId): Promise<boolean>;
    getAdminDashboardStats(): Promise<AdminDashboardStats>;
    getAdminReports(): Promise<AdminReport>;
    getAllOrders(): Promise<Array<Order>>;
    getBusinessDashboardStats(): Promise<BusinessDashboardStats>;
    getConversation(partnerId: UserId): Promise<Array<ChatMessage>>;
    getCropById(cropId: CropId): Promise<Crop | null>;
    getCrops(statusFilter: CropStatus | null, farmerFilter: UserId | null): Promise<Array<Crop>>;
    getFarmerDashboardStats(): Promise<FarmerDashboardStats>;
    getMyConversations(): Promise<Array<ConversationSummary>>;
    getMyCrops(): Promise<Array<Crop>>;
    getMyOrdersAsBuyer(): Promise<Array<Order>>;
    getMyOrdersAsFarmer(): Promise<Array<Order>>;
    getMyProfile(): Promise<UserProfile | null>;
    getOrderById(orderId: OrderId): Promise<Order | null>;
    getUsers(): Promise<Array<UserProfile>>;
    markMessagesRead(senderId: UserId): Promise<void>;
    placeOrder(cropId: CropId, quantity: number): Promise<Order>;
    registerUser(name: string, email: string, mobile: string, role: UserRole, location: string): Promise<boolean>;
    rejectCrop(cropId: CropId): Promise<boolean>;
    sendMessage(receiverId: UserId, message: string): Promise<ChatMessage>;
    unblockUser(targetId: UserId): Promise<boolean>;
    updateCrop(cropId: CropId, input: CropInput): Promise<boolean>;
    updateMyProfile(name: string, mobile: string, location: string): Promise<boolean>;
    updateOrderStatus(orderId: OrderId, newStatus: OrderStatus): Promise<boolean>;
}
