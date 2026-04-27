import DashboardStats from "./overview/DashboardStats";
import MonthlyTarget from "./overview/MonthlyTarget";
import MonthlySalesChart from "./overview/MonthlySalesChart";
import RecentOrders from "./overview/RecentOrders";
import AddProduct from "./overview/AddProduct";

export default function Overview() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:items-end">
        <div className="col-span-1 space-y-4 lg:col-span-2">
          <DashboardStats />
          <MonthlySalesChart />
        </div>
        <div className="col-span-1">
          <MonthlyTarget />
        </div>
      </div>

      <RecentOrders />
      <AddProduct />
    </div>
  );
}
