import { auth } from "@/auth"
import Image from "next/image"
import { redirect } from "next/navigation"
import SignOutButton from "@/components/ui/SignOutButton"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = session.user
  const displayName = user.username || user.email || "User"
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="py-7 space-y-5 max-w-md text-foreground">
      {/* Header */}
      <div className="flex items-center gap-5 pb-6 border-b border-border">
        {user.image ? (
          <Image
            src={user.image}
            alt={displayName}
            width={72}
            height={72}
            className="w-18 h-18 rounded-full object-cover ring-2 ring-ring/20"
          />
        ) : (
          <div className="w-[72px] h-[72px] shrink-0 rounded-full bg-accent ring-2 ring-ring/20 flex items-center justify-center text-xl font-medium text-accent-foreground">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
            <h1 className="text-lg font-medium text-foreground">{displayName}</h1>
            <StatusBadge />
          </div>
          <p className="text-sm text-muted-foreground truncate">{user.email ?? "No email provided"}</p>
        </div>
        <SignOutButton />
      </div>

      {/* Account Details */}
      <section className="space-y-2">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest pl-0.5">
          Account details
        </p>
        <div className="rounded-xl border border-border divide-y divide-border bg-card text-card-foreground">
          <DetailRow label="Username" value={user.username ?? "-"} />
          <DetailRow label="Email" value={user.email ?? "-"} />
          <DetailRow label="User ID" value={user.id ?? "-"} mono />
          <DetailRow label="Role" value={user.isStaff ? "Staff" : "User"} />
        </div>
      </section>

      {/* Session */}
      <section className="space-y-2">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest pl-0.5">
          Session
        </p>
        <div className="rounded-xl border border-border divide-y divide-border bg-card text-card-foreground">
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Status</span>
            <StatusBadge />
          </div>
          {session.expires && (
            <DetailRow
              label="Expires"
              value={new Date(session.expires).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
              muted
            />
          )}
        </div>
      </section>
    </div>
  )
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-success/10 text-success">
      <span className="w-1.5 h-1.5 rounded-full bg-success" />
      Authenticated
    </span>
  )
}

function DetailRow({
  label,
  value,
  mono = false,
  muted = false,
}: {
  label: string
  value: string
  mono?: boolean
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
      <span
        className={`text-sm max-w-[60%] truncate text-right ${
          mono ? "font-mono text-xs text-muted-foreground" : ""
        } ${muted ? "text-muted-foreground" : "text-card-foreground"}`}
      >
        {value}
      </span>
    </div>
  )
}
