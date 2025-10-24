import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type CartItemWithProduct, type OrderSummary } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const USER_ID = "demo-user"; // In a real app, this would come from authentication

export function useCart() {
  const { toast } = useToast();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["/api/cart", USER_ID],
    select: (data: { items: CartItemWithProduct[]; summary: OrderSummary }) => data,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (data: { productId: string; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", {
        userId: USER_ID,
        productId: data.productId,
        quantity: data.quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", USER_ID] });
      toast({
        title: "Added to Cart",
        description: "Item successfully added to your cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async (data: { id: string; quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/cart/${data.id}`, {
        quantity: data.quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", USER_ID] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/cart/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", USER_ID] });
      toast({
        title: "Item Removed",
        description: "Item removed from cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/cart/user/${USER_ID}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", USER_ID] });
      toast({
        title: "Cart Cleared",
        description: "All items removed from cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  return {
    items: cartData?.items || [],
    summary: cartData?.summary || {
      subtotal: "0.00",
      tax: "0.00",
      total: "0.00",
      savings: "0.00",
      itemCount: 0,
    },
    itemCount: cartData?.summary?.itemCount || 0,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
    userId: USER_ID,
  };
}
