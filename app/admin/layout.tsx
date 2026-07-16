import type { ReactNode } from "react";

import AdminGuard from "@/components/AdminGuard";
import HeaderAdmin from "@/components/HeaderAdmin";
import Sidebar from "@/components/Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen flex-col bg-slate-100">
        <HeaderAdmin />

        <div className="flex flex-1 gap-6 p-6">
          <Sidebar />

          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}