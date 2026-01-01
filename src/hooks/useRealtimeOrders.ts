import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
}

export const useRealtimeOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // Initial fetch
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, status, total_amount")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          
          setOrders((prev) =>
            prev.map((order) =>
              order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
            )
          );

          // Show notification for status changes
          const oldOrder = payload.old as Order;
          if (oldOrder.status !== updatedOrder.status) {
            const statusMessages: Record<string, string> = {
              preparing: "Your order is being prepared! 👨‍🍳",
              ready: "Your order is ready for pickup! 🎉",
              delivered: "Order delivered! Enjoy your meal! 🍽️",
              cancelled: "Your order has been cancelled.",
            };

            const message = statusMessages[updatedOrder.status];
            if (message) {
              toast.info(message, {
                duration: 5000,
              });

              // Browser notification if permitted
              if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Tiffin Table", {
                  body: message,
                  icon: "/favicon.ico",
                });
              }
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { orders, loading };
};
