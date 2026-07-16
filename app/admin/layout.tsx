import type { ReactNode } from "react";

import AdminGuard from "@/components/AdminGuard";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-100">
        {children}
      </div>
    </AdminGuard>
  );
}