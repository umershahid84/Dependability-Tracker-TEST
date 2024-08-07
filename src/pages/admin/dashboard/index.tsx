import { AdminLayout } from '../../../components';
import { DashboardStats } from '../../../components/DashboardStats';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto mt-8 p-2 rounded-md">
        <div className="flex justify-between items-center bg-tertiary p-4 rounded-md mb-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <DashboardStats />
      </div>
    </AdminLayout>
  );
}
