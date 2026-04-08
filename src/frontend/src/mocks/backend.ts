import type { backendInterface } from "../backend.d";
import { CropStatus, OrderStatus, UserRole } from "../backend.d";

// Mock Principal-like object
const mockPrincipal = {
  toText: () => "aaaaa-aa",
  toUint8Array: () => new Uint8Array(0),
  isAnonymous: () => false,
  compareTo: () => 0,
  _isPrincipal: true,
} as unknown as import("@icp-sdk/core/principal").Principal;

const now = BigInt(Date.now()) * BigInt(1_000_000);

const mockCrop1 = {
  id: BigInt(1),
  status: CropStatus.approved,
  farmerId: mockPrincipal,
  createdAt: now,
  unit: "kg",
  description: "Fresh organic wheat harvested from Punjab farms",
  pricePerUnit: 25.5,
  updatedAt: now,
  quantity: 500,
  cropName: "Organic Wheat",
  image: undefined,
  location: "Punjab, India",
};

const mockCrop2 = {
  id: BigInt(2),
  status: CropStatus.approved,
  farmerId: mockPrincipal,
  createdAt: now,
  unit: "kg",
  description: "Premium Basmati rice, long grain, aromatic variety",
  pricePerUnit: 45.0,
  updatedAt: now,
  quantity: 300,
  cropName: "Basmati Rice",
  image: undefined,
  location: "Haryana, India",
};

const mockCrop3 = {
  id: BigInt(3),
  status: CropStatus.pending,
  farmerId: mockPrincipal,
  createdAt: now,
  unit: "dozen",
  description: "Fresh corn on the cob, harvested daily",
  pricePerUnit: 12.0,
  updatedAt: now,
  quantity: 200,
  cropName: "Sweet Corn",
  image: undefined,
  location: "Maharashtra, India",
};

const mockOrder1 = {
  id: BigInt(1),
  status: OrderStatus.pending,
  farmerId: mockPrincipal,
  createdAt: now,
  cropId: BigInt(1),
  updatedAt: now,
  buyerId: mockPrincipal,
  quantity: 50,
  totalPrice: 1275.0,
};

const mockOrder2 = {
  id: BigInt(2),
  status: OrderStatus.accepted,
  farmerId: mockPrincipal,
  createdAt: now,
  cropId: BigInt(2),
  updatedAt: now,
  buyerId: mockPrincipal,
  quantity: 100,
  totalPrice: 4500.0,
};

const mockUserProfile = {
  id: mockPrincipal,
  isBlocked: false,
  name: "Rajan Kumar",
  createdAt: now,
  role: UserRole.farmer,
  email: "rajan@agri.com",
  mobile: "+91 9876543210",
  location: "Punjab, India",
};

const mockBusinessUser = {
  id: mockPrincipal,
  isBlocked: false,
  name: "Amit Sharma",
  createdAt: now,
  role: UserRole.business,
  email: "amit@business.com",
  mobile: "+91 9876543211",
  location: "Delhi, India",
};

export const mockBackend: backendInterface = {
  addCrop: async (input) => ({
    id: BigInt(4),
    status: CropStatus.pending,
    farmerId: mockPrincipal,
    createdAt: now,
    unit: input.unit,
    description: input.description,
    pricePerUnit: input.pricePerUnit,
    updatedAt: now,
    quantity: input.quantity,
    cropName: input.cropName,
    image: undefined,
    location: input.location,
  }),

  approveCrop: async () => true,
  blockUser: async () => true,
  deleteCrop: async () => true,

  getAdminDashboardStats: async () => ({
    pendingCrops: BigInt(5),
    blockedUsers: BigInt(1),
    totalOrders: BigInt(48),
    approvedCrops: BigInt(32),
    totalCrops: BigInt(37),
    completedOrders: BigInt(31),
    totalUsers: BigInt(24),
    totalRevenue: 127500.0,
    totalBusinessUsers: BigInt(10),
    totalFarmers: BigInt(14),
  }),

  getAdminReports: async () => ({
    topCrops: [
      { totalOrders: BigInt(15), cropName: "Organic Wheat", totalRevenue: 38250.0 },
      { totalOrders: BigInt(12), cropName: "Basmati Rice", totalRevenue: 54000.0 },
      { totalOrders: BigInt(8), cropName: "Sweet Corn", totalRevenue: 9600.0 },
    ],
    recentOrders: [mockOrder1, mockOrder2],
    newUsersThisMonth: BigInt(6),
  }),

  getAllOrders: async () => [mockOrder1, mockOrder2],

  getBusinessDashboardStats: async () => ({
    pendingOrders: BigInt(3),
    totalSpent: 18750.0,
    completedOrders: BigInt(12),
    totalOrdersPlaced: BigInt(15),
  }),

  getConversation: async () => [
    {
      id: BigInt(1),
      isRead: true,
      receiverId: mockPrincipal,
      message: "Hello, are your crops still available?",
      timestamp: now,
      senderId: mockPrincipal,
    },
    {
      id: BigInt(2),
      isRead: false,
      receiverId: mockPrincipal,
      message: "Yes, we have 500kg of wheat in stock. Interested?",
      timestamp: now,
      senderId: mockPrincipal,
    },
  ],

  getCropById: async () => mockCrop1,

  getCrops: async () => [mockCrop1, mockCrop2, mockCrop3],

  getFarmerDashboardStats: async () => ({
    acceptedOrders: BigInt(8),
    pendingCrops: BigInt(2),
    totalOrders: BigInt(12),
    pendingOrders: BigInt(4),
    approvedCrops: BigInt(5),
    totalCrops: BigInt(7),
    totalRevenue: 45250.0,
  }),

  getMyConversations: async () => [
    {
      partnerName: "Amit Sharma",
      lastMessage: "Yes, we have 500kg of wheat in stock!",
      partnerId: mockPrincipal,
      unreadCount: BigInt(1),
      lastTimestamp: now,
    },
  ],

  getMyCrops: async () => [mockCrop1, mockCrop2, mockCrop3],
  getMyOrdersAsBuyer: async () => [mockOrder1, mockOrder2],
  getMyOrdersAsFarmer: async () => [mockOrder1, mockOrder2],
  getMyProfile: async () => mockUserProfile,
  getOrderById: async () => mockOrder1,
  getUsers: async () => [mockUserProfile, mockBusinessUser],
  markMessagesRead: async () => undefined,

  placeOrder: async (_cropId, quantity) => ({
    id: BigInt(3),
    status: OrderStatus.pending,
    farmerId: mockPrincipal,
    createdAt: now,
    cropId: _cropId,
    updatedAt: now,
    buyerId: mockPrincipal,
    quantity,
    totalPrice: quantity * 25.5,
  }),

  registerUser: async () => true,
  rejectCrop: async () => true,

  sendMessage: async (_receiverId, message) => ({
    id: BigInt(3),
    isRead: false,
    receiverId: _receiverId,
    message,
    timestamp: now,
    senderId: mockPrincipal,
  }),

  unblockUser: async () => true,
  updateCrop: async () => true,
  updateMyProfile: async () => true,
  updateOrderStatus: async () => true,
};
