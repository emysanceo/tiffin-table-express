import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Phone, Check, X, ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const statuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-500/20 text-yellow-500" },
    { value: "preparing", label: "Preparing", color: "bg-blue-500/20 text-blue-500" },
    { value: "ready", label: "Ready", color: "bg-purple-500/20 text-purple-500" },
    { value: "completed", label: "Completed", color: "bg-green-500/20 text-green-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500/20 text-red-500" },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load orders");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
    } else {
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    }
  };

  const getStatusStyle = (status: string) => {
    return statuses.find((s) => s.value === status)?.color || "bg-muted text-muted-foreground";
  };

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
          className="rounded-full whitespace-nowrap"
        >
          All ({orders.length})
        </Button>
        {statuses.slice(0, 4).map((status) => (
          <Button
            key={status.value}
            variant={statusFilter === status.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status.value)}
            className="rounded-full whitespace-nowrap"
          >
            {status.label} ({orders.filter((o) => o.status === status.value).length})
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No orders found</div>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{order.customer_name}</h3>
                          <Badge className={getStatusStyle(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(order.created_at), "HH:mm")}
                          </span>
                          {order.customer_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {order.customer_phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-lg font-bold text-primary">৳{order.total_amount}</span>
                    </div>

                    {order.notes && (
                      <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
                        {order.notes}
                      </p>
                    )}

                    {/* Quick Actions */}
                    {order.status !== "completed" && order.status !== "cancelled" && (
                      <div className="flex gap-2 pt-2 border-t border-border/50">
                        {order.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(order.id, "preparing")}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 gap-1"
                          >
                            <ChefHat className="w-4 h-4" />
                            Start Preparing
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(order.id, "ready")}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(order.id, "completed")}
                            className="flex-1 bg-green-500 hover:bg-green-600 gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(order.id, "cancelled")}
                          className="text-destructive hover:text-destructive gap-1"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
