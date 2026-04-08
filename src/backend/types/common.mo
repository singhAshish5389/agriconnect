module {
  public type Timestamp = Int;
  public type UserId = Principal;
  public type CropId = Nat;
  public type OrderId = Nat;
  public type MessageId = Nat;

  /// Mutable counter state injected from main.mo to allow ID increments in the mixin.
  public type CounterState = {
    var nextCropId : Nat;
    var nextOrderId : Nat;
    var nextMessageId : Nat;
  };
};
