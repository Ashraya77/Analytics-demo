"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart2,
  Globe2,
  Settings,
  ChevronRight,
} from "lucide-react"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import UserAvatar from "@/components/custom/UserAvatar"

const navItems = [
  { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
  { label: "Countries", href: "/dashboard/countries", icon: Globe2 },
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
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-white/5">
        {/* Logo */}
        <div className="px-6 h-14 flex items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
                Acme Analytics
              </p>
              <p className="truncate text-[10px] font-medium text-sidebar-foreground/40 uppercase tracking-widest">
                Platform
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-2 pb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/30">
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
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${isActive
                    ? "bg-sidebar-accent/80 text-sidebar-accent-foreground shadow-sm ring-1 ring-white/5"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                    }`}
                >
                  {isActive && (
                    <span className="absolute -left-1 top-1/2 h-5 w-1.5 -translate-y-1/2 rounded-full bg-sidebar-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-inner"
                      : "bg-sidebar-accent/30 text-sidebar-foreground/60 group-hover:bg-sidebar-accent group-hover:text-sidebar-foreground"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 font-medium">{label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 text-sidebar-foreground/30" />}
                </Link>
              )
            })}
          </div>
        </nav>


      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center gap-4 px-8 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shrink-0 z-20">
          {/* Dynamic Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold">
            {breadcrumbs.map(({ label, href, isLast }, index) => (
              <span key={href} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                )}

                {isLast ? (
                  <span className="text-foreground tracking-tight" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="h-5 w-px bg-border/40" aria-hidden="true" />
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
