"use client"

import { useMemo, useState } from "react"
import { Moon, MoreHorizontal, Package, Plus, Settings, Sun, Truck, Users } from "lucide-react"
import { useTheme } from "next-themes"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type ShipmentStatus = "Pending" | "Shipped" | "Delivered"
type HoodieSize = "XS" | "S" | "M" | "L" | "XL"
type Platform = "Instagram" | "TikTok" | "YouTube" | "X"
type Language = "en" | "es"
type SectionKey = "inventory" | "members" | "shipments" | "settings"

type Member = {
  id: number
  name: string
  platform: Platform
  handle: string
  status: ShipmentStatus
  size: HoodieSize
}

type Labels = {
  language: string
  theme: string
  light: string
  dark: string
  inventory: string
  members: string
  shipments: string
  settings: string
  totalUnits: string
  distributed: string
  remaining: string
  memberDirectory: string
  social: string
  status: string
  hoodieSize: string
  actions: string
  addToCircle: string
  confirmEntry: string
  registerProfile: string
  socialNetwork: string
  socialHandle: string
  name: string
  viewAction: string
  activeSection: string
  lastAction: string
}

type Copy = {
  labels: Labels
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  metricDetails: {
    totalUnits: string
    distributed: string
    remaining: string
  }
  directoryDescription: string
  activityTitle: string
  activityDescription: string
  dialogDescription: string
  sectionDescriptions: Record<SectionKey, { title: string; body: string }>
  statusText: Record<ShipmentStatus, string>
  actions: {
    openedSection: (label: string) => string
    openedAddModal: string
    addedMember: (name: string) => string
    viewedMember: (name: string) => string
    toggledTheme: (theme: string) => string
    toggledLanguage: (language: string) => string
  }
}

const copy: Record<Language, Copy> = {
  en: {
    labels: {
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      inventory: "Inventory",
      members: "The Circle Members",
      shipments: "Shipments",
      settings: "Settings",
      totalUnits: "Total Units",
      distributed: "Distributed",
      remaining: "Remaining",
      memberDirectory: "Member Directory",
      social: "Social",
      status: "Status",
      hoodieSize: "Hoodie Size",
      actions: "Actions",
      addToCircle: "Add to The Circle",
      confirmEntry: "Confirm Entry",
      registerProfile: "Register Profile",
      socialNetwork: "Social Network",
      socialHandle: "Social Handle",
      name: "Name",
      viewAction: "View",
      activeSection: "Active Section",
      lastAction: "Last Action",
    },
    hero: {
      eyebrow: "The Circle",
      title: "Member distribution and shipment oversight",
      description:
        "Internal seeding workspace for BENARION. Track premium hoodie allocation, review influencer profiles, and keep shipment status aligned without noisy analytics.",
    },
    metricDetails: {
      totalUnits: "Reserved allocation for this drop",
      distributed: "Profiles already prepared or shipped",
      remaining: "Units still available for The Circle",
    },
    directoryDescription:
      "Artist, platform, shipment status, and hoodie size in one place.",
    activityTitle: "Interaction Preview",
    activityDescription:
      "Each button updates this panel with a simulated description so the prototype feels alive before backend integration.",
    dialogDescription: "BENARION internal intake for influencer seeding profiles.",
    sectionDescriptions: {
      inventory: {
        title: "Inventory Overview",
        body: "Simulated stock controls for BENARION drops, available units, and reserved allocations for The Circle.",
      },
      members: {
        title: "Member Management",
        body: "Review influencer profiles, preferred sizes, social platforms, and shipment progress from one curated directory.",
      },
      shipments: {
        title: "Shipment Coordination",
        body: "Track pending, shipped, and delivered hoodies with a clean operational view for internal follow-up.",
      },
      settings: {
        title: "Workspace Settings",
        body: "Adjust theme, language, and future internal preferences for the BENARION team experience.",
      },
    },
    statusText: {
      Pending: "Pending",
      Shipped: "Shipped",
      Delivered: "Delivered",
    },
    actions: {
      openedSection: (label) => `Opened ${label} section preview.`,
      openedAddModal: "Opened the registration dialog for a new Circle profile.",
      addedMember: (name) => `${name} was added to the prototype directory with pending shipment status.`,
      viewedMember: (name) => `Opened a quick preview for ${name}. In production this could route to the full member profile.`,
      toggledTheme: (theme) => `Theme changed to ${theme}.`,
      toggledLanguage: (language) => `Language changed to ${language}.`,
    },
  },
  es: {
    labels: {
      language: "Idioma",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      inventory: "Inventario",
      members: "Miembros de The Circle",
      shipments: "Envios",
      settings: "Configuracion",
      totalUnits: "Unidades Totales",
      distributed: "Distribuidos",
      remaining: "Restantes",
      memberDirectory: "Directorio de Miembros",
      social: "Red Social",
      status: "Estatus",
      hoodieSize: "Talla del Hoodie",
      actions: "Acciones",
      addToCircle: "Agregar a The Circle",
      confirmEntry: "Confirmar Registro",
      registerProfile: "Registrar Perfil",
      socialNetwork: "Red Social",
      socialHandle: "Usuario Social",
      name: "Nombre",
      viewAction: "Ver",
      activeSection: "Seccion Activa",
      lastAction: "Ultima Accion",
    },
    hero: {
      eyebrow: "The Circle",
      title: "Distribucion de miembros y supervision de envios",
      description:
        "Espacio interno de seeding para BENARION. Controla la asignacion de hoodies premium, revisa perfiles de influencers y manten el estado de envios alineado sin analiticas genericas.",
    },
    metricDetails: {
      totalUnits: "Asignacion reservada para este drop",
      distributed: "Perfiles ya preparados o enviados",
      remaining: "Unidades aun disponibles para The Circle",
    },
    directoryDescription:
      "Artista, plataforma, estatus del envio y talla del hoodie en un solo lugar.",
    activityTitle: "Vista de Interaccion",
    activityDescription:
      "Cada boton actualiza este panel con una descripcion simulada para que el prototipo se sienta interactivo antes de conectar el backend.",
    dialogDescription: "Registro interno de BENARION para perfiles de influencers y seeding.",
    sectionDescriptions: {
      inventory: {
        title: "Resumen de Inventario",
        body: "Controles simulados de stock para drops de BENARION, unidades disponibles y asignaciones reservadas para The Circle.",
      },
      members: {
        title: "Gestion de Miembros",
        body: "Revisa perfiles de influencers, tallas preferidas, redes sociales y progreso del envio desde un directorio curado.",
      },
      shipments: {
        title: "Coordinacion de Envios",
        body: "Haz seguimiento a hoodies pendientes, enviados y entregados con una vista operativa mas limpia para el equipo interno.",
      },
      settings: {
        title: "Configuracion del Espacio",
        body: "Ajusta tema, idioma y futuras preferencias internas para la experiencia del equipo BENARION.",
      },
    },
    statusText: {
      Pending: "Pendiente",
      Shipped: "Enviado",
      Delivered: "Entregado",
    },
    actions: {
      openedSection: (label) => `Se abrio la vista simulada de ${label}.`,
      openedAddModal: "Se abrio el dialogo para registrar un nuevo perfil de The Circle.",
      addedMember: (name) => `${name} fue agregado al directorio de prueba con estatus de envio pendiente.`,
      viewedMember: (name) => `Se abrio una vista rapida de ${name}. En produccion esto podria ir al perfil completo del miembro.`,
      toggledTheme: (theme) => `El tema cambio a ${theme}.`,
      toggledLanguage: (language) => `El idioma cambio a ${language}.`,
    },
  },
}

const initialMembers: Member[] = [
  { id: 1, name: "A$AP Rocky", platform: "Instagram", handle: "@asaprocky", status: "Delivered", size: "L" },
  { id: 2, name: "Rosalia", platform: "TikTok", handle: "@rosalia.vt", status: "Pending", size: "S" },
  { id: 3, name: "Kendrick Lamar", platform: "YouTube", handle: "@kendricklamar", status: "Shipped", size: "M" },
  { id: 4, name: "Zendaya", platform: "Instagram", handle: "@zendaya", status: "Delivered", size: "S" },
  { id: 5, name: "Jacob Elordi", platform: "X", handle: "@jacobelordi", status: "Pending", size: "L" },
]

const totalUnits = 30

export default function Page() {
  const [members, setMembers] = useState(initialMembers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const [activeSection, setActiveSection] = useState<SectionKey>("members")
  const [activityMessage, setActivityMessage] = useState(copy.en.sectionDescriptions.members.body)
  const [form, setForm] = useState({
    name: "",
    platform: "Instagram" as Platform,
    handle: "",
    size: "M" as HoodieSize,
  })
  const { resolvedTheme, setTheme } = useTheme()

  const text = copy[language]
  const isDark = (resolvedTheme ?? "dark") === "dark"
  const distributed = useMemo(() => members.filter((member) => member.status !== "Pending").length, [members])
  const remaining = totalUnits - distributed

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function setSection(section: SectionKey) {
    setActiveSection(section)
    setActivityMessage(text.actions.openedSection(getSectionLabel(section, text.labels)))
  }

  function changeLanguage(nextLanguage: Language) {
    const label = nextLanguage === "es" ? "Espanol" : "English"
    setLanguage(nextLanguage)
    setActivityMessage(copy[nextLanguage].actions.toggledLanguage(label))
  }

  function changeTheme(nextTheme: "light" | "dark") {
    setTheme(nextTheme)
    const themeLabel = nextTheme === "dark" ? text.labels.dark : text.labels.light
    setActivityMessage(text.actions.toggledTheme(themeLabel))
  }

  function openDialog(open: boolean) {
    setDialogOpen(open)
    if (open) {
      setActivityMessage(text.actions.openedAddModal)
    }
  }

  function handleAddMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = form.name.trim()
    const handle = form.handle.trim()
    if (!name || !handle) return

    setMembers((current) => [
      {
        id: current.length + 1,
        name,
        platform: form.platform,
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        status: "Pending",
        size: form.size,
      },
      ...current,
    ])

    setForm({ name: "", platform: "Instagram", handle: "", size: "M" })
    setDialogOpen(false)
    setActivityMessage(text.actions.addedMember(name))
  }

  function previewMember(member: Member) {
    setActivityMessage(text.actions.viewedMember(member.name))
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-black/10 bg-black text-white dark:border-white/10 dark:bg-black">
          <div className="flex h-full flex-col px-6 py-8">
            <div className="border-b border-white/10 pb-6">
              <p className="text-[10px] uppercase tracking-[0.45em] text-white/45">Luxury Internal System</p>
              <h1 className="mt-3 text-2xl font-light tracking-[0.35em] text-white">BENARION</h1>
            </div>

            <nav className="mt-8 flex flex-1 flex-col gap-2">
              <NavItem icon={Package} label={text.labels.inventory} active={activeSection === "inventory"} onClick={() => setSection("inventory")} />
              <NavItem icon={Users} label={text.labels.members} active={activeSection === "members"} onClick={() => setSection("members")} />
              <NavItem icon={Truck} label={text.labels.shipments} active={activeSection === "shipments"} onClick={() => setSection("shipments")} />
              <NavItem icon={Settings} label={text.labels.settings} active={activeSection === "settings"} onClick={() => setSection("settings")} />
            </nav>

            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
              <ControlGroup label={text.labels.language}>
                <ControlButton active={language === "es"} onClick={() => changeLanguage("es")}>ES</ControlButton>
                <ControlButton active={language === "en"} onClick={() => changeLanguage("en")}>EN</ControlButton>
              </ControlGroup>

              <ControlGroup label={text.labels.theme}>
                <ControlButton active={!isDark} onClick={() => changeTheme("light")}>
                  <Sun className="size-3.5" />
                  {text.labels.light}
                </ControlButton>
                <ControlButton active={isDark} onClick={() => changeTheme("dark")}>
                  <Moon className="size-3.5" />
                  {text.labels.dark}
                </ControlButton>
              </ControlGroup>
            </div>
          </div>
        </aside>

        <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.02),transparent_22%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%)]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
            <header className="flex flex-col gap-6 border-b border-black/10 pb-8 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.4em] text-black/40 dark:text-white/40">{text.hero.eyebrow}</p>
                <h2 className="mt-3 text-4xl font-light tracking-[0.08em] text-black dark:text-white">{text.hero.title}</h2>
                <p className="mt-4 text-sm leading-6 text-black/58 dark:text-white/55">{text.hero.description}</p>
              </div>

              <AddMemberDialog
                dialogOpen={dialogOpen}
                form={form}
                labels={text.labels}
                dialogDescription={text.dialogDescription}
                onDialogChange={openDialog}
                onFieldChange={updateField}
                onSubmit={handleAddMember}
              />
            </header>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard title={text.labels.totalUnits} value={String(totalUnits)} detail={text.metricDetails.totalUnits} />
                <MetricCard title={text.labels.distributed} value={String(distributed)} detail={text.metricDetails.distributed} />
                <MetricCard title={text.labels.remaining} value={String(Math.max(remaining, 0))} detail={text.metricDetails.remaining} />
              </div>

              <InteractivePanel
                labels={text.labels}
                title={text.activityTitle}
                description={text.activityDescription}
                sectionTitle={text.sectionDescriptions[activeSection].title}
                sectionBody={text.sectionDescriptions[activeSection].body}
                activityMessage={activityMessage}
              />
            </section>

            <section className="border border-black/10 bg-black/[0.02] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40">{text.labels.memberDirectory}</p>
                  <h3 className="mt-2 text-xl font-light tracking-[0.08em] text-black dark:text-white">{text.labels.members}</h3>
                </div>
                <p className="text-sm text-black/50 dark:text-white/45">{text.directoryDescription}</p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-black/10 hover:bg-transparent dark:border-white/10">
                    <TableHead className="h-14 px-6 text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{text.labels.name}</TableHead>
                    <TableHead className="h-14 text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{text.labels.social}</TableHead>
                    <TableHead className="h-14 text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{text.labels.status}</TableHead>
                    <TableHead className="h-14 text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{text.labels.hoodieSize}</TableHead>
                    <TableHead className="h-14 px-6 text-right text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{text.labels.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="border-black/10 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.03]">
                      <TableCell className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium tracking-[0.03em] text-black dark:text-white">{member.name}</span>
                          <span className="text-xs uppercase tracking-[0.24em] text-black/35 dark:text-white/35">BENARION Circle</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-black/78 dark:text-white/80">{member.handle}</span>
                          <span className="text-xs uppercase tracking-[0.24em] text-black/35 dark:text-white/35">{member.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <ShipmentBadge label={text.statusText[member.status]} status={member.status} />
                      </TableCell>
                      <TableCell className="py-5 text-sm text-black/72 dark:text-white/75">{member.size}</TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => previewMember(member)}
                            className="rounded-none border border-black/10 text-[11px] uppercase tracking-[0.2em] text-black/65 hover:bg-black/[0.04] hover:text-black dark:border-white/10 dark:text-white/65 dark:hover:bg-white/[0.04] dark:hover:text-white"
                          >
                            {text.labels.viewAction}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => previewMember(member)}
                            className="rounded-none border border-black/10 bg-transparent text-black/45 hover:bg-black/[0.04] hover:text-black dark:border-white/10 dark:text-white/45 dark:hover:bg-white/[0.03] dark:hover:text-white"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

function getSectionLabel(section: SectionKey, labels: Labels) {
  const sections: Record<SectionKey, string> = {
    inventory: labels.inventory,
    members: labels.members,
    shipments: labels.shipments,
    settings: labels.settings,
  }

  return sections[section]
}

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Package
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 border px-4 py-3 text-left text-sm tracking-[0.08em] transition-colors",
        active
          ? "border-white/10 bg-white/[0.06] text-white"
          : "border-transparent text-white/58 hover:border-white/10 hover:bg-white/[0.03] hover:text-white/92"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </button>
  )
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function ControlButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 border px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors",
        active
          ? "border-white bg-white text-black"
          : "border-white/10 text-white/68 hover:border-white/18 hover:bg-white/[0.04] hover:text-white"
      )}
    >
      {children}
    </button>
  )
}

function MetricCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card className="border-black/10 bg-black/[0.02] shadow-none dark:border-white/10 dark:bg-white/[0.03]">
      <CardHeader className="pb-3">
        <CardTitle className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/45 dark:text-white/45">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-4xl font-light tracking-[0.06em] text-black dark:text-white">{value}</p>
        <p className="text-sm text-black/50 dark:text-white/45">{detail}</p>
      </CardContent>
    </Card>
  )
}

function InteractivePanel({
  labels,
  title,
  description,
  sectionTitle,
  sectionBody,
  activityMessage,
}: {
  labels: Labels
  title: string
  description: string
  sectionTitle: string
  sectionBody: string
  activityMessage: string
}) {
  return (
    <Card className="border-black/10 bg-black/[0.02] shadow-none dark:border-white/10 dark:bg-white/[0.03]">
      <CardHeader className="space-y-3 pb-3">
        <CardTitle className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/45 dark:text-white/45">{title}</CardTitle>
        <p className="text-sm leading-6 text-black/55 dark:text-white/50">{description}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="border border-black/10 p-4 dark:border-white/10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-black/40 dark:text-white/38">{labels.activeSection}</p>
          <p className="mt-3 text-lg font-light tracking-[0.04em] text-black dark:text-white">{sectionTitle}</p>
          <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/50">{sectionBody}</p>
        </div>
        <div className="border border-black/10 p-4 dark:border-white/10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-black/40 dark:text-white/38">{labels.lastAction}</p>
          <p className="mt-3 text-sm leading-6 text-black/72 dark:text-white/72">{activityMessage}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ShipmentBadge({ label, status }: { label: string; status: ShipmentStatus }) {
  const styles: Record<ShipmentStatus, string> = {
    Pending: "border-black/10 bg-black/[0.04] text-black/62 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/55",
    Shipped: "border-black/15 bg-black/[0.06] text-black/82 dark:border-white/20 dark:bg-white/[0.05] dark:text-white/82",
    Delivered: "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black",
  }

  return (
    <Badge variant="outline" className={cn("rounded-none", styles[status])}>
      {label}
    </Badge>
  )
}

function AddMemberDialog({
  dialogOpen,
  form,
  labels,
  dialogDescription,
  onDialogChange,
  onFieldChange,
  onSubmit,
}: {
  dialogOpen: boolean
  form: {
    name: string
    platform: Platform
    handle: string
    size: HoodieSize
  }
  labels: Labels
  dialogDescription: string
  onDialogChange: (open: boolean) => void
  onFieldChange: <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-none border border-black bg-black px-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white hover:bg-black/90 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90">
          <Plus className="size-4" />
          {labels.addToCircle}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-black/10 bg-background text-foreground dark:border-white/10 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-[0.08em]">{labels.registerProfile}</DialogTitle>
          <DialogDescription className="text-sm leading-6 text-black/50 dark:text-white/50">{dialogDescription}</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="member-name" className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
                {labels.name}
              </Label>
              <Input
                id="member-name"
                value={form.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
                placeholder="Artist or influencer name"
                className="rounded-none border-black/10 bg-black/[0.02] text-black placeholder:text-black/25 dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:placeholder:text-white/25"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-2 md:gap-4">
              <div className="grid gap-2">
                <Label className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45 dark:text-white/45">{labels.socialNetwork}</Label>
                <Select value={form.platform} onValueChange={(value) => onFieldChange("platform", value as Platform)}>
                  <SelectTrigger className="rounded-none border-black/10 bg-black/[0.02] text-black dark:border-white/10 dark:bg-white/[0.02] dark:text-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="border-black/10 bg-background text-foreground dark:border-white/10">
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="X">X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45 dark:text-white/45">{labels.hoodieSize}</Label>
                <Select value={form.size} onValueChange={(value) => onFieldChange("size", value as HoodieSize)}>
                  <SelectTrigger className="rounded-none border-black/10 bg-black/[0.02] text-black dark:border-white/10 dark:bg-white/[0.02] dark:text-white">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="border-black/10 bg-background text-foreground dark:border-white/10">
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="member-handle" className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
                {labels.socialHandle}
              </Label>
              <Input
                id="member-handle"
                value={form.handle}
                onChange={(event) => onFieldChange("handle", event.target.value)}
                placeholder="@username"
                className="rounded-none border-black/10 bg-black/[0.02] text-black placeholder:text-black/25 dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:placeholder:text-white/25"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="h-11 rounded-none border border-black bg-black px-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white hover:bg-black/90 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90">
              {labels.confirmEntry}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
