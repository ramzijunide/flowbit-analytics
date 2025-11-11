"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "📊 Dashboard" },
    { href: "/chat", label: "💬 Chat with Data" },
  ];

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 shadow-md p-4 fixed top-0 left-0">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Flowbit</h1>
      <nav className="flex flex-col gap-3">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`p-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

