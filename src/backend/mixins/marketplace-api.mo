import Types "../types/marketplace";
import Common "../types/common";
import MarketplaceLib "../lib/marketplace";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

mixin (
  profiles : Map.Map<Common.UserId, Types.UserProfile>,
  crops : List.List<Types.Crop>,
  orders : List.List<Types.Order>,
  messages : List.List<Types.ChatMessage>,
  counters : Common.CounterState,
) {

  // ---- Auth / Profile ----

  public shared ({ caller }) func registerUser(
    name : Text,
    email : Text,
    mobile : Text,
    role : Types.UserRole,
    location : Text,
  ) : async Bool {
    MarketplaceLib.registerUser(profiles, caller, name, email, mobile, role, location);
  };

  public query ({ caller }) func getMyProfile() : async ?Types.UserProfile {
    MarketplaceLib.getMyProfile(profiles, caller);
  };

  public shared ({ caller }) func updateMyProfile(
    name : Text,
    mobile : Text,
    location : Text,
  ) : async Bool {
    MarketplaceLib.updateMyProfile(profiles, caller, name, mobile, location);
  };

  // ---- Crops ----

  public shared ({ caller }) func addCrop(input : Types.CropInput) : async Types.Crop {
    let id = counters.nextCropId;
    counters.nextCropId += 1;
    MarketplaceLib.addCrop(crops, id, caller, input, Time.now());
  };

  public query ({ caller }) func getCrops(
    statusFilter : ?Types.CropStatus,
    farmerFilter : ?Common.UserId,
  ) : async [Types.Crop] {
    MarketplaceLib.getCrops(crops, statusFilter, farmerFilter);
  };

  public query ({ caller }) func getMyCrops() : async [Types.Crop] {
    MarketplaceLib.getMyCrops(crops, caller);
  };

  public query ({ caller }) func getCropById(cropId : Common.CropId) : async ?Types.Crop {
    MarketplaceLib.getCropById(crops, cropId);
  };

  public shared ({ caller }) func updateCrop(
    cropId : Common.CropId,
    input : Types.CropInput,
  ) : async Bool {
    MarketplaceLib.updateCrop(crops, caller, cropId, input, Time.now());
  };

  public shared ({ caller }) func deleteCrop(cropId : Common.CropId) : async Bool {
    MarketplaceLib.deleteCrop(crops, caller, cropId);
  };

  public shared ({ caller }) func approveCrop(cropId : Common.CropId) : async Bool {
    switch (profiles.get(caller)) {
      case (?p) {
        if (p.role != #admin) { Runtime.trap("Unauthorized: admin only") };
      };
      case null { Runtime.trap("Unauthorized: not registered") };
    };
    MarketplaceLib.approveCrop(crops, cropId, Time.now());
  };

  public shared ({ caller }) func rejectCrop(cropId : Common.CropId) : async Bool {
    switch (profiles.get(caller)) {
      case (?p) {
        if (p.role != #admin) { Runtime.trap("Unauthorized: admin only") };
      };
      case null { Runtime.trap("Unauthorized: not registered") };
    };
    MarketplaceLib.rejectCrop(crops, cropId, Time.now());
  };

  // ---- Orders ----

  public shared ({ caller }) func placeOrder(
    cropId : Common.CropId,
    quantity : Float,
  ) : async Types.Order {
    let id = counters.nextOrderId;
    counters.nextOrderId += 1;
    MarketplaceLib.placeOrder(orders, crops, id, caller, cropId, quantity, Time.now());
  };

  public query ({ caller }) func getMyOrdersAsBuyer() : async [Types.Order] {
    MarketplaceLib.getMyOrders(orders, caller);
  };

  public query ({ caller }) func getMyOrdersAsFarmer() : async [Types.Order] {
    MarketplaceLib.getFarmerOrders(orders, caller);
  };

  public query ({ caller }) func getAllOrders() : async [Types.Order] {
    switch (profiles.get(caller)) {
      case (?p) {
        if (p.role != #admin) { Runtime.trap("Unauthorized: admin only") };
      };
      case null { Runtime.trap("Unauthorized: not registered") };
    };
    MarketplaceLib.getAllOrders(orders);
  };

  public shared ({ caller }) func updateOrderStatus(
    orderId : Common.OrderId,
    newStatus : Types.OrderStatus,
  ) : async Bool {
    MarketplaceLib.updateOrderStatus(orders, caller, orderId, newStatus, Time.now());
  };

  public query ({ caller }) func getOrderById(orderId : Common.OrderId) : async ?Types.Order {
    MarketplaceLib.getOrderById(orders, orderId);
  };

  // ---- Chat ----

  public shared ({ caller }) func sendMessage(
    receiverId : Common.UserId,
    message : Text,
  ) : async Types.ChatMessage {
    let id = counters.nextMessageId;
    counters.nextMessageId += 1;
    MarketplaceLib.sendMessage(messages, id, caller, receiverId, message, Time.now());
  };

  public query ({ caller }) func getConversation(
    partnerId : Common.UserId
  ) : async [Types.ChatMessage] {
    MarketplaceLib.getConversation(messages, caller, partnerId);
  };

  public query ({ caller }) func getMyConversations() : async [Types.ConversationSummary] {
    MarketplaceLib.getMyConversations(messages, profiles, caller);
  };

  public shared ({ caller }) func markMessagesRead(senderId : Common.UserId) : async () {
    MarketplaceLib.markMessagesRead(messages, caller, senderId);
  };

  // ---- Admin ----

  public query ({ caller }) func getUsers() : async [Types.UserProfile] {
    switch (profiles.get(caller)) {
      case (?p) {
        if (p.role != #admin) { Runtime.trap("Unauthorized: admin only") };
      };
      case null { Runtime.trap("Unauthorized: not registered") };
    };
    MarketplaceLib.getUsers(profiles);
  };

  public shared ({ caller }) func blockUser(targetId : Common.UserId) : async Bool {
    switch (profiles.get(caller)) {
      case (?p) {
        if (p.role != #admin) { Runtime.trap("Unauthorized: admin only") };
      };
      case null { Runtime.trap("Unauthorized: not registered") };
    };
    MarketplaceLib.blockUser(profiles, targetId);
  };

  public shared ({ caller }) func unblockUser(targetId : Common.UserId) : async Bool {
    switch (profiles.get(caller)) {
      case (?p) {
        if (p.role != #admin) { Runtime.trap("Unauthorized: admin only") };
      };
      case null { Runtime.trap("Unauthorized: not registered") };
    };
    MarketplaceLib.unblockUser(profiles, targetId);
  };

  public query ({ caller }) func getFarmerDashboardStats() : async Types.FarmerDashboardStats {
    MarketplaceLib.getFarmerDashboardStats(crops, orders, caller);
  };

  public query ({ caller }) func getBusinessDashboardStats() : async Types.BusinessDashboardStats {
    MarketplaceLib.getBusinessDashboardStats(orders, caller);
  };

  public query ({ caller }) func getAdminDashboardStats() : async Types.AdminDashboardStats {
    switch (profiles.get(caller)) {
      case (?p) {
        if (p.role != #admin) { Runtime.trap("Unauthorized: admin only") };
      };
      case null { Runtime.trap("Unauthorized: not registered") };
    };
    MarketplaceLib.getAdminDashboardStats(profiles, crops, orders);
  };

  public query ({ caller }) func getAdminReports() : async Types.AdminReport {
    switch (profiles.get(caller)) {
      case (?p) {
        if (p.role != #admin) { Runtime.trap("Unauthorized: admin only") };
      };
      case null { Runtime.trap("Unauthorized: not registered") };
    };
    MarketplaceLib.getAdminReports(profiles, crops, orders);
  };
};
