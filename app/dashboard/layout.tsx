"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart2,
  Settings,
  ChevronRight,
} from "lucide-react"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import UserAvatar from "@/components/custom/UserAvatar"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Countries", href: "/dashboard/countries", icon: BarChart2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

/** Maps raw path segments to human-readable labels */
const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  countries: "Countries",
  users: "Users",
  reports: "Reports",
  settings: "Settings",
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function useBreadcrumbs() {
  const pathname = usePathname()

  // Split and filter empty strings
  const segments = pathname.split("/").filter(Boolean)

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = segmentLabels[segment] ?? capitalize(segment)
    const isLast = index === segments.length - 1
    return { label, href, isLast }
  })

  return crumbs
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const breadcrumbs = useBreadcrumbs()

  return (
    <div className="flex h-screen bg-muted overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-68 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
                Acme Analytics
              </p>
              <p className="truncate text-xs text-sidebar-foreground/55">
                Business intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
            Workspace
          </p>
          <div className="space-y-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href)

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                    }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                  )}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "bg-sidebar-accent/50 text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 font-medium">{label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 text-sidebar-foreground/45" />}
                </Link>
              )
            })}
          </div>
        </nav>

       

      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center gap-4 px-6 bg-card border-b border-border shrink-0">
          {/* Dynamic Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-medium">
            {breadcrumbs.map(({ label, href, isLast }, index) => (
              <span key={href} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                )}

                {isLast ? (
                  <span className="text-foreground" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserAvatar />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
