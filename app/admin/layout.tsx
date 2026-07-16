import type { ReactNode } from "react";

import AdminGuard from "@/components/AdminGuard";
import HeaderAdmin from "@/components/HeaderAdmin";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-100">
        <HeaderAdmin />

        <main className="p-6">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}