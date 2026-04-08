import Types "../types/marketplace";
import Common "../types/common";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";

module {

  // ---- Auth / Profile ----

  public func registerUser(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    caller : Common.UserId,
    name : Text,
    email : Text,
    mobile : Text,
    role : Types.UserRole,
    location : Text,
  ) : Bool {
    if (profiles.containsKey(caller)) {
      return false;
    };
    let profile : Types.UserProfile = {
      id = caller;
      name;
      email;
      mobile;
      role;
      location;
      isBlocked = false;
      createdAt = Time.now();
    };
    profiles.add(caller, profile);
    true;
  };

  public func getMyProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    caller : Common.UserId,
  ) : ?Types.UserProfile {
    profiles.get(caller);
  };

  public func updateMyProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    caller : Common.UserId,
    name : Text,
    mobile : Text,
    location : Text,
  ) : Bool {
    switch (profiles.get(caller)) {
      case null { false };
      case (?existing) {
        profiles.add(caller, { existing with name; mobile; location });
        true;
      };
    };
  };

  // ---- Crops ----

  public func addCrop(
    crops : List.List<Types.Crop>,
    nextId : Nat,
    caller : Common.UserId,
    input : Types.CropInput,
    now : Common.Timestamp,
  ) : Types.Crop {
    let crop : Types.Crop = {
      id = nextId;
      farmerId = caller;
      cropName = input.cropName;
      quantity = input.quantity;
      pricePerUnit = input.pricePerUnit;
      unit = input.unit;
      location = input.location;
      image = input.image;
      status = #pending;
      description = input.description;
      createdAt = now;
      updatedAt = now;
    };
    crops.add(crop);
    crop;
  };

  public func getCrops(
    crops : List.List<Types.Crop>,
    statusFilter : ?Types.CropStatus,
    farmerFilter : ?Common.UserId,
  ) : [Types.Crop] {
    let filtered = crops.filter(func(c : Types.Crop) : Bool {
      let statusOk = switch (statusFilter) {
        case null { true };
        case (?s) { c.status == s };
      };
      let farmerOk = switch (farmerFilter) {
        case null { true };
        case (?f) { Principal.equal(c.farmerId, f) };
      };
      statusOk and farmerOk;
    });
    filtered.toArray();
  };

  public func getMyCrops(
    crops : List.List<Types.Crop>,
    caller : Common.UserId,
  ) : [Types.Crop] {
    crops.filter(func(c : Types.Crop) : Bool {
      Principal.equal(c.farmerId, caller)
    }).toArray();
  };

  public func getCropById(
    crops : List.List<Types.Crop>,
    cropId : Common.CropId,
  ) : ?Types.Crop {
    crops.find(func(c : Types.Crop) : Bool { c.id == cropId });
  };

  public func updateCrop(
    crops : List.List<Types.Crop>,
    caller : Common.UserId,
    cropId : Common.CropId,
    input : Types.CropInput,
    now : Common.Timestamp,
  ) : Bool {
    var found = false;
    crops.mapInPlace(func(c : Types.Crop) : Types.Crop {
      if (c.id == cropId and Principal.equal(c.farmerId, caller)) {
        found := true;
        {
          c with
          cropName = input.cropName;
          quantity = input.quantity;
          pricePerUnit = input.pricePerUnit;
          unit = input.unit;
          location = input.location;
          image = input.image;
          description = input.description;
          updatedAt = now;
        };
      } else { c };
    });
    found;
  };

  public func deleteCrop(
    crops : List.List<Types.Crop>,
    caller : Common.UserId,
    cropId : Common.CropId,
  ) : Bool {
    let before = crops.size();
    let remaining = crops.filter(func(c : Types.Crop) : Bool {
      not (c.id == cropId and Principal.equal(c.farmerId, caller))
    });
    let after = remaining.size();
    crops.clear();
    crops.append(remaining);
    before != after;
  };

  public func approveCrop(
    crops : List.List<Types.Crop>,
    cropId : Common.CropId,
    now : Common.Timestamp,
  ) : Bool {
    var found = false;
    crops.mapInPlace(func(c : Types.Crop) : Types.Crop {
      if (c.id == cropId) {
        found := true;
        { c with status = #approved; updatedAt = now };
      } else { c };
    });
    found;
  };

  public func rejectCrop(
    crops : List.List<Types.Crop>,
    cropId : Common.CropId,
    now : Common.Timestamp,
  ) : Bool {
    var found = false;
    crops.mapInPlace(func(c : Types.Crop) : Types.Crop {
      if (c.id == cropId) {
        found := true;
        { c with status = #rejected; updatedAt = now };
      } else { c };
    });
    found;
  };

  // ---- Orders ----

  public func placeOrder(
    orders : List.List<Types.Order>,
    crops : List.List<Types.Crop>,
    nextId : Nat,
    caller : Common.UserId,
    cropId : Common.CropId,
    quantity : Float,
    now : Common.Timestamp,
  ) : Types.Order {
    let crop = switch (crops.find(func(c : Types.Crop) : Bool { c.id == cropId })) {
      case (?c) { c };
      case null { Runtime.trap("Crop not found") };
    };
    if (crop.status != #approved) {
      Runtime.trap("Crop is not available for ordering");
    };
    let order : Types.Order = {
      id = nextId;
      cropId;
      buyerId = caller;
      farmerId = crop.farmerId;
      quantity;
      totalPrice = crop.pricePerUnit * quantity;
      status = #pending;
      createdAt = now;
      updatedAt = now;
    };
    orders.add(order);
    order;
  };

  public func getMyOrders(
    orders : List.List<Types.Order>,
    caller : Common.UserId,
  ) : [Types.Order] {
    orders.filter(func(o : Types.Order) : Bool {
      Principal.equal(o.buyerId, caller)
    }).toArray();
  };

  public func getFarmerOrders(
    orders : List.List<Types.Order>,
    caller : Common.UserId,
  ) : [Types.Order] {
    orders.filter(func(o : Types.Order) : Bool {
      Principal.equal(o.farmerId, caller)
    }).toArray();
  };

  public func getAllOrders(
    orders : List.List<Types.Order>,
  ) : [Types.Order] {
    orders.toArray();
  };

  public func updateOrderStatus(
    orders : List.List<Types.Order>,
    caller : Common.UserId,
    orderId : Common.OrderId,
    newStatus : Types.OrderStatus,
    now : Common.Timestamp,
  ) : Bool {
    var found = false;
    orders.mapInPlace(func(o : Types.Order) : Types.Order {
      if (o.id == orderId) {
        // Farmer can accept/reject; either party or farmer can complete
        let authorized = Principal.equal(o.farmerId, caller) or Principal.equal(o.buyerId, caller);
        if (not authorized) {
          Runtime.trap("Unauthorized: not your order");
        };
        found := true;
        { o with status = newStatus; updatedAt = now };
      } else { o };
    });
    found;
  };

  public func getOrderById(
    orders : List.List<Types.Order>,
    orderId : Common.OrderId,
  ) : ?Types.Order {
    orders.find(func(o : Types.Order) : Bool { o.id == orderId });
  };

  // ---- Chat ----

  public func sendMessage(
    messages : List.List<Types.ChatMessage>,
    nextId : Nat,
    caller : Common.UserId,
    receiverId : Common.UserId,
    message : Text,
    now : Common.Timestamp,
  ) : Types.ChatMessage {
    let msg : Types.ChatMessage = {
      id = nextId;
      senderId = caller;
      receiverId;
      message;
      timestamp = now;
      isRead = false;
    };
    messages.add(msg);
    msg;
  };

  public func getConversation(
    messages : List.List<Types.ChatMessage>,
    userA : Common.UserId,
    userB : Common.UserId,
  ) : [Types.ChatMessage] {
    messages.filter(func(m : Types.ChatMessage) : Bool {
      (Principal.equal(m.senderId, userA) and Principal.equal(m.receiverId, userB))
      or
      (Principal.equal(m.senderId, userB) and Principal.equal(m.receiverId, userA))
    }).toArray();
  };

  public func getMyConversations(
    messages : List.List<Types.ChatMessage>,
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    caller : Common.UserId,
  ) : [Types.ConversationSummary] {
    // Collect all partner IDs
    let partnerMap = Map.empty<Common.UserId, ()>();
    messages.forEach(func(m : Types.ChatMessage) {
      if (Principal.equal(m.senderId, caller)) {
        partnerMap.add(m.receiverId, ());
      } else if (Principal.equal(m.receiverId, caller)) {
        partnerMap.add(m.senderId, ());
      };
    });

    let summaries = List.empty<Types.ConversationSummary>();
    for ((partnerId, _) in partnerMap.entries()) {
      // Get all messages in this conversation
      let conv = messages.filter(func(m : Types.ChatMessage) : Bool {
        (Principal.equal(m.senderId, caller) and Principal.equal(m.receiverId, partnerId))
        or
        (Principal.equal(m.senderId, partnerId) and Principal.equal(m.receiverId, caller))
      });
      // Find last message
      let lastMsg = switch (conv.last()) {
        case (?m) { m };
        case null { Runtime.trap("unreachable: conv has at least one message") };
      };
      // Count unread
      let unreadCount : Nat = conv.foldLeft(
        0,
        func(acc : Nat, m : Types.ChatMessage) : Nat {
          if (Principal.equal(m.senderId, partnerId) and not m.isRead) { acc + 1 } else { acc }
        },
      );
      let partnerName = switch (profiles.get(partnerId)) {
        case (?p) { p.name };
        case null { "Unknown" };
      };
      summaries.add({
        partnerId;
        partnerName;
        lastMessage = lastMsg.message;
        lastTimestamp = lastMsg.timestamp;
        unreadCount;
      });
    };
    summaries.toArray();
  };

  public func markMessagesRead(
    messages : List.List<Types.ChatMessage>,
    caller : Common.UserId,
    senderId : Common.UserId,
  ) : () {
    messages.mapInPlace(func(m : Types.ChatMessage) : Types.ChatMessage {
      if (Principal.equal(m.senderId, senderId) and Principal.equal(m.receiverId, caller)) {
        { m with isRead = true };
      } else { m };
    });
  };

  // ---- Admin ----

  public func getUsers(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
  ) : [Types.UserProfile] {
    profiles.values().toArray();
  };

  public func blockUser(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    targetId : Common.UserId,
  ) : Bool {
    switch (profiles.get(targetId)) {
      case null { false };
      case (?p) {
        profiles.add(targetId, { p with isBlocked = true });
        true;
      };
    };
  };

  public func unblockUser(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    targetId : Common.UserId,
  ) : Bool {
    switch (profiles.get(targetId)) {
      case null { false };
      case (?p) {
        profiles.add(targetId, { p with isBlocked = false });
        true;
      };
    };
  };

  public func getFarmerDashboardStats(
    crops : List.List<Types.Crop>,
    orders : List.List<Types.Order>,
    caller : Common.UserId,
  ) : Types.FarmerDashboardStats {
    let myCrops = crops.filter(func(c : Types.Crop) : Bool {
      Principal.equal(c.farmerId, caller)
    });
    let myOrders = orders.filter(func(o : Types.Order) : Bool {
      Principal.equal(o.farmerId, caller)
    });
    let totalCrops = myCrops.size();
    let pendingCrops = myCrops.filter(func(c : Types.Crop) : Bool { c.status == #pending }).size();
    let approvedCrops = myCrops.filter(func(c : Types.Crop) : Bool { c.status == #approved }).size();
    let totalOrders = myOrders.size();
    let pendingOrders = myOrders.filter(func(o : Types.Order) : Bool { o.status == #pending }).size();
    let acceptedOrders = myOrders.filter(func(o : Types.Order) : Bool { o.status == #accepted }).size();
    let totalRevenue : Float = myOrders.foldLeft(
      0.0,
      func(acc : Float, o : Types.Order) : Float {
        if (o.status == #completed) { acc + o.totalPrice } else { acc }
      },
    );
    { totalCrops; pendingCrops; approvedCrops; totalOrders; pendingOrders; acceptedOrders; totalRevenue };
  };

  public func getBusinessDashboardStats(
    orders : List.List<Types.Order>,
    caller : Common.UserId,
  ) : Types.BusinessDashboardStats {
    let myOrders = orders.filter(func(o : Types.Order) : Bool {
      Principal.equal(o.buyerId, caller)
    });
    let totalOrdersPlaced = myOrders.size();
    let pendingOrders = myOrders.filter(func(o : Types.Order) : Bool { o.status == #pending }).size();
    let completedOrders = myOrders.filter(func(o : Types.Order) : Bool { o.status == #completed }).size();
    let totalSpent : Float = myOrders.foldLeft(
      0.0,
      func(acc : Float, o : Types.Order) : Float {
        if (o.status == #completed) { acc + o.totalPrice } else { acc }
      },
    );
    { totalOrdersPlaced; pendingOrders; completedOrders; totalSpent };
  };

  public func getAdminDashboardStats(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    crops : List.List<Types.Crop>,
    orders : List.List<Types.Order>,
  ) : Types.AdminDashboardStats {
    let allProfiles = profiles.values().toArray();
    let totalUsers = allProfiles.size();
    let totalFarmers = allProfiles.filter(func(p : Types.UserProfile) : Bool { p.role == #farmer }).size();
    let totalBusinessUsers = allProfiles.filter(func(p : Types.UserProfile) : Bool { p.role == #business }).size();
    let blockedUsers = allProfiles.filter(func(p : Types.UserProfile) : Bool { p.isBlocked }).size();
    let totalCrops = crops.size();
    let pendingCrops = crops.filter(func(c : Types.Crop) : Bool { c.status == #pending }).size();
    let approvedCrops = crops.filter(func(c : Types.Crop) : Bool { c.status == #approved }).size();
    let totalOrders = orders.size();
    let completedOrders = orders.filter(func(o : Types.Order) : Bool { o.status == #completed }).size();
    let totalRevenue : Float = orders.foldLeft(
      0.0,
      func(acc : Float, o : Types.Order) : Float {
        if (o.status == #completed) { acc + o.totalPrice } else { acc }
      },
    );
    {
      totalUsers;
      totalFarmers;
      totalBusinessUsers;
      blockedUsers;
      totalCrops;
      pendingCrops;
      approvedCrops;
      totalOrders;
      completedOrders;
      totalRevenue;
    };
  };

  public func getAdminReports(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    crops : List.List<Types.Crop>,
    orders : List.List<Types.Order>,
  ) : Types.AdminReport {
    // Build top crops stats: count orders and revenue per crop
    let cropsArr = crops.toArray();
    let topCrops = cropsArr.map(func(c : Types.Crop) : { cropName : Text; totalOrders : Nat; totalRevenue : Float } {
      let cropOrders = orders.filter(func(o : Types.Order) : Bool { o.cropId == c.id });
      let totalOrders = cropOrders.size();
      let totalRevenue : Float = cropOrders.foldLeft(
        0.0,
        func(acc : Float, o : Types.Order) : Float { if (o.status == #completed) { acc + o.totalPrice } else { acc } },
      );
      { cropName = c.cropName; totalOrders; totalRevenue };
    }).sort(func(
      a : { cropName : Text; totalOrders : Nat; totalRevenue : Float },
      b : { cropName : Text; totalOrders : Nat; totalRevenue : Float },
    ) : Order.Order {
      if (a.totalOrders > b.totalOrders) { #less }
      else if (a.totalOrders < b.totalOrders) { #greater }
      else { #equal }
    });

    // Recent orders (last 10 sorted by createdAt descending)
    let ordersArr = orders.toArray().sort(func(a : Types.Order, b : Types.Order) : Order.Order {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    });
    let take10 = if (ordersArr.size() < 10) { ordersArr.size() } else { 10 };
    let recentOrders = ordersArr.sliceToArray(0, take10);

    // New users this month
    let now = Time.now();
    let oneMonthNs : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
    let monthStart = now - oneMonthNs;
    let newUsersThisMonth = profiles.values().toArray().filter(func(p : Types.UserProfile) : Bool {
      p.createdAt >= monthStart
    }).size();

    { topCrops; recentOrders; newUsersThisMonth };
  };
};
