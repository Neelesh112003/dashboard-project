import { Users, Package } from "lucide-react";
import StatsCard from "./StatsCard";

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatsCard
        title="Customers"
        value="3,782"
        icon={Users}
        trend="11.01%"
        trendType="up"
      />
      <StatsCard
        title="Orders"
        value="5,359"
        icon={Package}
        trend="9.05%"
        trendType="down"
      />
    </div>
  );
}
