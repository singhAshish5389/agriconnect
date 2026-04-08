import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import MarketplaceMixin "mixins/marketplace-api";
import Types "types/marketplace";
import Common "types/common";
import List "mo:core/List";
import Map "mo:core/Map";

actor {
  // Object storage infrastructure (handles file upload/download proxying)
  include MixinObjectStorage();

  // --- State ---
  let profiles = Map.empty<Common.UserId, Types.UserProfile>();
  let crops = List.empty<Types.Crop>();
  let orders = List.empty<Types.Order>();
  let messages = List.empty<Types.ChatMessage>();

  // Mutable ID counters wrapped in a record so the mixin can mutate them
  let counters : Common.CounterState = {
    var nextCropId = 1;
    var nextOrderId = 1;
    var nextMessageId = 1;
  };

  // --- Domain API ---
  include MarketplaceMixin(
    profiles,
    crops,
    orders,
    messages,
    counters,
  );
};
