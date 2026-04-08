import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserId = Common.UserId;
  public type CropId = Common.CropId;
  public type OrderId = Common.OrderId;
  public type MessageId = Common.MessageId;
  public type Timestamp = Common.Timestamp;

  // --- Roles & Users ---

  public type UserRole = {
    #farmer;
    #business;
    #admin;
  };

  public type UserProfile = {
    id : UserId;
    name : Text;
    email : Text;
    mobile : Text;
    role : UserRole;
    location : Text;
    isBlocked : Bool;
    createdAt : Timestamp;
  };

  // --- Crops ---

  public type CropStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Crop = {
    id : CropId;
    farmerId : UserId;
    cropName : Text;
    quantity : Float;
    pricePerUnit : Float;
    unit : Text;
    location : Text;
    image : ?Storage.ExternalBlob;
    status : CropStatus;
    description : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  // Input type for creating/updating crops (no id/timestamps)
  public type CropInput = {
    cropName : Text;
    quantity : Float;
    pricePerUnit : Float;
    unit : Text;
    location : Text;
    image : ?Storage.ExternalBlob;
    description : Text;
  };

  // --- Orders ---

  public type OrderStatus = {
    #pending;
    #accepted;
    #rejected;
    #completed;
  };

  public type Order = {
    id : OrderId;
    cropId : CropId;
    buyerId : UserId;
    farmerId : UserId;
    quantity : Float;
    totalPrice : Float;
    status : OrderStatus;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  // --- Chat ---

  public type ChatMessage = {
    id : MessageId;
    senderId : UserId;
    receiverId : UserId;
    message : Text;
    timestamp : Timestamp;
    isRead : Bool;
  };

  // Conversation summary returned in list view
  public type ConversationSummary = {
    partnerId : UserId;
    partnerName : Text;
    lastMessage : Text;
    lastTimestamp : Timestamp;
    unreadCount : Nat;
  };

  // --- Dashboard Stats ---

  public type FarmerDashboardStats = {
    totalCrops : Nat;
    pendingCrops : Nat;
    approvedCrops : Nat;
    totalOrders : Nat;
    pendingOrders : Nat;
    acceptedOrders : Nat;
    totalRevenue : Float;
  };

  public type BusinessDashboardStats = {
    totalOrdersPlaced : Nat;
    pendingOrders : Nat;
    completedOrders : Nat;
    totalSpent : Float;
  };

  public type AdminDashboardStats = {
    totalUsers : Nat;
    totalFarmers : Nat;
    totalBusinessUsers : Nat;
    blockedUsers : Nat;
    totalCrops : Nat;
    pendingCrops : Nat;
    approvedCrops : Nat;
    totalOrders : Nat;
    completedOrders : Nat;
    totalRevenue : Float;
  };

  // --- Reports ---

  public type AdminReport = {
    topCrops : [{ cropName : Text; totalOrders : Nat; totalRevenue : Float }];
    recentOrders : [Order];
    newUsersThisMonth : Nat;
  };
};
