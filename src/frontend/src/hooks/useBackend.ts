import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createActor } from "../backend";
import {
  CropStatus as BackendCropStatus,
  OrderStatus as BackendOrderStatus,
  UserRole as BackendUserRole,
} from "../backend";
import { useAppStore } from "../store/useAppStore";
import type {
  CropId,
  CropInput,
  CropStatus,
  OrderId,
  OrderStatus,
  UserId,
  UserRole,
} from "../types";

// Convert frontend role string to backend enum
function toBackendRole(role: UserRole): BackendUserRole {
  if (role === "farmer") return BackendUserRole.farmer;
  if (role === "business") return BackendUserRole.business;
  return BackendUserRole.admin;
}

function toBackendCropStatus(status: CropStatus): BackendCropStatus {
  if (status === "approved") return BackendCropStatus.approved;
  if (status === "rejected") return BackendCropStatus.rejected;
  return BackendCropStatus.pending;
}

function toBackendOrderStatus(status: OrderStatus): BackendOrderStatus {
  if (status === "accepted") return BackendOrderStatus.accepted;
  if (status === "completed") return BackendOrderStatus.completed;
  if (status === "rejected") return BackendOrderStatus.rejected;
  return BackendOrderStatus.pending;
}

export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}

export function useAuth() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { login, clear } = useInternetIdentity();
  const setUser = useAppStore((s) => s.setUser);
  const setAuthLoading = useAppStore((s) => s.setAuthLoading);
  const user = useAppStore((s) => s.auth.user);
  const isAuthenticated = useAppStore((s) => s.auth.isAuthenticated);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  useEffect(() => {
    if (profileQuery.isLoading) {
      setAuthLoading(true);
    } else {
      setAuthLoading(false);
      if (profileQuery.data) {
        setUser(profileQuery.data as unknown as Parameters<typeof setUser>[0]);
      } else if (!identity) {
        setUser(null);
      }
    }
  }, [
    profileQuery.data,
    profileQuery.isLoading,
    identity,
    setUser,
    setAuthLoading,
  ]);

  const registerMutation = useMutation({
    mutationFn: async (params: {
      name: string;
      email: string;
      mobile: string;
      role: UserRole;
      location: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerUser(
        params.name,
        params.email,
        params.mobile,
        toBackendRole(params.role),
        params.location,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  return {
    user,
    isAuthenticated: isAuthenticated && !!identity,
    login,
    logout: clear,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    profileLoading: profileQuery.isLoading,
  };
}

export function useCrops() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const addToast = useAppStore((s) => s.addToast);

  const cropsQuery = useQuery({
    queryKey: ["crops"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCrops(null, null);
    },
    enabled: !!actor && !isFetching,
  });

  const myCropsQuery = useQuery({
    queryKey: ["myCrops"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCrops();
    },
    enabled: !!actor && !isFetching,
  });

  const addCropMutation = useMutation({
    mutationFn: async (input: CropInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCrop(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCrops"] });
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      addToast("Crop added successfully", "success");
    },
    onError: () => addToast("Failed to add crop", "error"),
  });

  const updateCropMutation = useMutation({
    mutationFn: async ({ id, input }: { id: CropId; input: CropInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCrop(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCrops"] });
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      addToast("Crop updated", "success");
    },
    onError: () => addToast("Failed to update crop", "error"),
  });

  const deleteCropMutation = useMutation({
    mutationFn: async (cropId: CropId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCrop(cropId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCrops"] });
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      addToast("Crop deleted", "success");
    },
    onError: () => addToast("Failed to delete crop", "error"),
  });

  const approveCropMutation = useMutation({
    mutationFn: async (cropId: CropId) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveCrop(cropId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      addToast("Crop approved", "success");
    },
  });

  const rejectCropMutation = useMutation({
    mutationFn: async (cropId: CropId) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectCrop(cropId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      addToast("Crop rejected", "info");
    },
  });

  const getCropsByStatus = async (status: CropStatus) => {
    if (!actor) return [];
    return actor.getCrops(toBackendCropStatus(status), null);
  };

  return {
    crops: cropsQuery.data ?? [],
    myCrops: myCropsQuery.data ?? [],
    isLoading: cropsQuery.isLoading || myCropsQuery.isLoading,
    addCrop: addCropMutation.mutateAsync,
    updateCrop: updateCropMutation.mutateAsync,
    deleteCrop: deleteCropMutation.mutateAsync,
    approveCrop: approveCropMutation.mutateAsync,
    rejectCrop: rejectCropMutation.mutateAsync,
    getCropsByStatus,
    isAddingCrop: addCropMutation.isPending,
  };
}

export function useOrders() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const addToast = useAppStore((s) => s.addToast);

  const myOrdersQuery = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrdersAsBuyer();
    },
    enabled: !!actor && !isFetching,
  });

  const farmerOrdersQuery = useQuery({
    queryKey: ["farmerOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrdersAsFarmer();
    },
    enabled: !!actor && !isFetching,
  });

  const allOrdersQuery = useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });

  const placeOrderMutation = useMutation({
    mutationFn: async ({
      cropId,
      quantity,
    }: { cropId: CropId; quantity: number }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(cropId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      addToast("Order placed successfully", "success");
    },
    onError: () => addToast("Failed to place order", "error"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: OrderId; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(orderId, toBackendOrderStatus(status));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["farmerOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      addToast("Order status updated", "success");
    },
    onError: () => addToast("Failed to update order", "error"),
  });

  return {
    orders: myOrdersQuery.data ?? [],
    farmerOrders: farmerOrdersQuery.data ?? [],
    allOrders: allOrdersQuery.data ?? [],
    isLoading: myOrdersQuery.isLoading,
    placeOrder: placeOrderMutation.mutateAsync,
    updateOrderStatus: updateStatusMutation.mutateAsync,
    isPlacingOrder: placeOrderMutation.isPending,
  };
}

export function useChat() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const addToast = useAppStore((s) => s.addToast);

  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyConversations();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });

  // Expose actor for ad-hoc queries in conversation page
  const chatActor = actor;

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      receiverId,
      message,
    }: { receiverId: UserId; message: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage(receiverId, message);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", variables.receiverId.toText()],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => addToast("Failed to send message", "error"),
  });

  return {
    conversations: conversationsQuery.data ?? [],
    isLoading: conversationsQuery.isLoading,
    sendMessage: sendMessageMutation.mutateAsync,
    getMessages: async (partnerId: UserId) => {
      if (!chatActor) return [];
      const msgs = await chatActor.getConversation(partnerId);
      chatActor.markMessagesRead(partnerId).catch(() => {});
      return msgs;
    },
    chatActor,
    isSending: sendMessageMutation.isPending,
  };
}

export function useFarmerDashboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["farmerDashboard"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFarmerDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBusinessDashboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["businessDashboard"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBusinessDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminDashboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminUsers() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const addToast = useAppStore((s) => s.addToast);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUsers();
    },
    enabled: !!actor && !isFetching,
  });

  const blockUserMutation = useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.blockUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast("User blocked", "info");
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.unblockUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast("User unblocked", "success");
    },
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    blockUser: blockUserMutation.mutateAsync,
    unblockUser: unblockUserMutation.mutateAsync,
  };
}

export function useAdminReports() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminReports"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminReports();
    },
    enabled: !!actor && !isFetching,
  });
}
