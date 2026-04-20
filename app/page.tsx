"use client"

import { useMemo, useState } from "react"
import {
  Moon,
  MoreHorizontal,
  Package,
  Plane,
  Plus,
  Settings,
  Ship,
  Sun,
  Truck,
  Users,
} from "lucide-react"
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
type TransitMode = "air" | "sea" | "land"
type TeamRoleType = "operations" | "relations" | "logistics" | "creative"

type Member = {
  id: number
  name: string
  platform: Platform
  handle: string
  status: ShipmentStatus
  size: HoodieSize
  descriptor: string
}

type InventoryDrop = {
  code: string
  units: number
  recipient: string
  profile: string
  note: string
}

type ShipmentRecord = {
  id: number
  recipient: string
  city: string
  status: ShipmentStatus
  mode: TransitMode
  detail: string
}

type TeamMember = {
  id: number
  name: string
  role: string
  area: TeamRoleType
  detail: string
}

type ChatMessage = {
  id: number
  name: string
  role: string
  text: string
  tone: "team" | "speculation" | "update"
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
  addToCircle: string
  confirmEntry: string
  registerProfile: string
  socialNetwork: string
  socialHandle: string
  name: string
  social: string
  status: string
  hoodieSize: string
  actions: string
  viewAction: string
  activeSection: string
  lastAction: string
  inventoryBoard: string
  shipmentBoard: string
  teamAccess: string
  inviteTeam: string
  addRole: string
  channels: string
  chatTitle: string
  chatPlaceholder: string
  sendMessage: string
  assignedTo: string
  role: string
  mode: string
  city: string
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
  activityTitle: string
  activityDescription: string
  dialogDescription: string
  memberDirectoryDescription: string
  inventoryDescription: string
  shipmentDescription: string
  settingsDescription: string
  sectionDescriptions: Record<SectionKey, { title: string; body: string }>
  statusText: Record<ShipmentStatus, string>
  modeText: Record<TransitMode, string>
  actions: {
    openedSection: (label: string) => string
    openedAddModal: string
    addedMember: (name: string) => string
    viewedMember: (name: string) => string
    viewedDrop: (code: string) => string
    viewedShipment: (name: string) => string
    viewedTeamMember: (name: string) => string
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
      addToCircle: "Add to The Circle",
      confirmEntry: "Confirm Entry",
      registerProfile: "Register Profile",
      socialNetwork: "Social Network",
      socialHandle: "Social Handle",
      name: "Name",
      social: "Social",
      status: "Status",
      hoodieSize: "Hoodie Size",
      actions: "Actions",
      viewAction: "View",
      activeSection: "Active Section",
      lastAction: "Last Action",
      inventoryBoard: "Drop Allocation Board",
      shipmentBoard: "Shipment Board",
      teamAccess: "Team Access",
      inviteTeam: "Invite Team",
      addRole: "Add Role",
      channels: "Channels",
      chatTitle: "Exclusive Content Chat",
      chatPlaceholder: "Write a message about the next drop...",
      sendMessage: "Send",
      assignedTo: "Assigned To",
      role: "Role",
      mode: "Mode",
      city: "City",
    },
    hero: {
      eyebrow: "The Circle",
      title: "Luxury distribution for talent, athletes, and internal teams",
      description:
        "BENARION internal dashboard for drop allocation, influencer relations, shipment follow-up, and controlled access for the operating team.",
    },
    metricDetails: {
      totalUnits: "Pieces prepared across the active seeding drops",
      distributed: "Profiles already allocated, shipped, or delivered",
      remaining: "Units still available for final approval",
    },
    activityTitle: "Interaction Preview",
    activityDescription:
      "Every section keeps a live simulation note so the prototype feels operational while the backend is still pending.",
    dialogDescription: "Register a new profile for BENARION seeding and delivery planning.",
    memberDirectoryDescription:
      "Colombian talent leads the roster, followed by selected invited names from football and culture.",
    inventoryDescription:
      "Drop planning with direct assignment to Colombian celebrities, football players, and a few invited artists before dispatch approval.",
    shipmentDescription:
      "Track delivered, pending, and in-transit pieces across air, sea, and land routes with clear route status.",
    settingsDescription:
      "Internal access, invitations, roles, and exclusive content channels for the BENARION operating team.",
    sectionDescriptions: {
      inventory: {
        title: "Inventory Allocation",
        body: "Review each active drop, available garment count, and the intended recipient before approval for dispatch.",
      },
      members: {
        title: "Circle Members",
        body: "Manage the roster with Colombian celebrities first, then selected artists with strong cultural alignment.",
      },
      shipments: {
        title: "Shipment Tracking",
        body: "Monitor what has been delivered, what is pending, and what is currently moving by air, sea, or land.",
      },
      settings: {
        title: "Team Roles",
        body: "Define who from the internal team can manage operations, logistics, invitations, and relationship handling.",
      },
    },
    statusText: {
      Pending: "Pending",
      Shipped: "In Transit",
      Delivered: "Delivered",
    },
    modeText: {
      air: "Air",
      sea: "Sea",
      land: "Land",
    },
    actions: {
      openedSection: (label) => `Opened ${label} section preview.`,
      openedAddModal: "Opened the registration dialog for a new Circle profile.",
      addedMember: (name) => `${name} was added to the roster with pending shipment status.`,
      viewedMember: (name) => `Opened the member preview for ${name}. This could later route to a full profile view.`,
      viewedDrop: (code) => `Reviewed ${code} allocation details before dispatch approval.`,
      viewedShipment: (name) => `Checked the shipment trace for ${name}.`,
      viewedTeamMember: (name) => `Reviewed access permissions and duties for ${name}.`,
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
      shipments: "Envíos",
      settings: "Configuración",
      totalUnits: "Unidades Totales",
      distributed: "Distribuidos",
      remaining: "Restantes",
      addToCircle: "Agregar a The Circle",
      confirmEntry: "Confirmar Registro",
      registerProfile: "Registrar Perfil",
      inviteTeam: "Invitar equipo",
      addRole: "Añadir rol",
      socialNetwork: "Red Social",
      socialHandle: "Usuario Social",
      name: "Nombre",
      social: "Red Social",
      status: "Estatus",
      hoodieSize: "Talla del Hoodie",
      actions: "Acciones",
      viewAction: "Ver",
      activeSection: "Seccion Activa",
      lastAction: "Ultima Accion",
      inventoryBoard: "Panel de Drops",
      shipmentBoard: "Panel de Envios",
      teamAccess: "Acceso del Equipo",
      assignedTo: "Asignado A",
      role: "Rol",
      mode: "Via",
      city: "Ciudad",
      channels: "Canales",
      chatTitle: "Chat de contenido exclusivo",
      chatPlaceholder: "Escribe un mensaje sobre el siguiente drop...",
      sendMessage: "Enviar",
    },
    hero: {
      eyebrow: "The Circle",
      title: "Distribucion de lujo para talento, atletas y equipo interno",
      description:
        "Dashboard interno de BENARION para asignacion de drops, relaciones con influencers, seguimiento de envios y control de accesos del equipo operativo.",
    },
    metricDetails: {
      totalUnits: "Prendas preparadas entre los drops activos de seeding",
      distributed: "Perfiles ya asignados, enviados o entregados",
      remaining: "Unidades todavia disponibles para aprobacion final",
    },
    activityTitle: "Vista de Interaccion",
    activityDescription:
      "Cada seccion mantiene una nota en vivo para que el prototipo se sienta operativo mientras el backend llega despues.",
    dialogDescription: "Registra un nuevo perfil para el seeding y la planeacion de entregas de BENARION.",
    memberDirectoryDescription:
      "El roster prioriza talento colombiano y suma nombres invitados de futbol y cultura.",
    inventoryDescription:
      "Planeacion de drops con asignacion directa a famosos colombianos, futbolistas y algunos artistas invitados antes de aprobar despacho.",
    shipmentDescription:
      "Seguimiento de prendas entregadas, pendientes y en ruta por via aerea, maritima o terrestre con estado claro.",
    settingsDescription:
      "Accesos internos, invitaciones, roles y canales de contenido exclusivo del equipo operativo de BENARION.",
    sectionDescriptions: {
      inventory: {
        title: "Asignacion de Inventario",
        body: "Revisa cada drop activo, cantidad de prendas y destinatario previsto antes de aprobar el despacho.",
      },
      members: {
        title: "Miembros de The Circle",
        body: "Gestiona el roster con famosos colombianos como prioridad y luego algunos artistas alineados culturalmente.",
      },
      shipments: {
        title: "Seguimiento de Envios",
        body: "Controla lo entregado, lo pendiente y lo que sigue en movimiento por aire, mar o tierra.",
      },
      settings: {
        title: "Roles del Equipo",
        body: "Define quien del equipo interno puede gestionar operaciones, logistica, invitaciones y relaciones.",
      },
    },
    statusText: {
      Pending: "Pendiente",
      Shipped: "Enviado",
      Delivered: "Entregado",
    },
    modeText: {
      air: "Aerea",
      sea: "Maritima",
      land: "Terrestre",
    },
    actions: {
      openedSection: (label) => `Se abrio la vista de ${label}.`,
      openedAddModal: "Se abrio el dialogo para registrar un nuevo perfil de The Circle.",
      addedMember: (name) => `${name} fue agregado al roster con estatus de envio pendiente.`,
      viewedMember: (name) => `Se reviso la vista del miembro ${name}. Luego esto puede llevar al perfil completo.`,
      viewedDrop: (code) => `Se reviso la asignacion del ${code} antes de aprobar despacho.`,
      viewedShipment: (name) => `Se consulto la trazabilidad de envio para ${name}.`,
      viewedTeamMember: (name) => `Se revisaron los permisos y funciones de ${name}.`,
      toggledTheme: (theme) => `El tema cambio a ${theme}.`,
      toggledLanguage: (language) => `El idioma cambio a ${language}.`,
    },
  },
}

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Karol G",
    platform: "Instagram",
    handle: "@karolg",
    status: "Delivered",
    size: "M",
    descriptor: "Artista global desde Medellin",
  },
  {
    id: 2,
    name: "Feid",
    platform: "Instagram",
    handle: "@feid",
    status: "Shipped",
    size: "L",
    descriptor: "Musico y referente cultural colombiano",
  },
  {
    id: 3,
    name: "J Balvin",
    platform: "Instagram",
    handle: "@jbalvin",
    status: "Delivered",
    size: "L",
    descriptor: "Embajador latino de alto alcance",
  },
  {
    id: 4,
    name: "Maluma",
    platform: "Instagram",
    handle: "@maluma",
    status: "Pending",
    size: "L",
    descriptor: "Artista de Medellin con perfil premium",
  },
  {
    id: 5,
    name: "Shakira",
    platform: "Instagram",
    handle: "@shakira",
    status: "Delivered",
    size: "S",
    descriptor: "Icono colombiano con presencia global",
  },
  {
    id: 6,
    name: "James Rodríguez",
    platform: "Instagram",
    handle: "@jamesrodriguez10",
    status: "Shipped",
    size: "L",
    descriptor: "Futbolista colombiano para drop athluxury",
  },
  {
    id: 7,
    name: "Luis Díaz",
    platform: "Instagram",
    handle: "@luisdiaz19_",
    status: "Pending",
    size: "M",
    descriptor: "Futbolista colombiano con alto impacto",
  },
  {
    id: 8,
    name: "Falcao García",
    platform: "Instagram",
    handle: "@falcao",
    status: "Delivered",
    size: "L",
    descriptor: "Delantero colombiano con presencia global",
  },
  {
    id: 9,
    name: "Juanes",
    platform: "Instagram",
    handle: "@juanes",
    status: "Delivered",
    size: "M",
    descriptor: "Icono musical colombiano de alcance internacional",
  },
  {
    id: 10,
    name: "Ryan Castro",
    platform: "Instagram",
    handle: "@ryancastrro",
    status: "Shipped",
    size: "L",
    descriptor: "Musico colombiano en crecimiento internacional",
  },
  {
    id: 11,
    name: "Blessd",
    platform: "TikTok",
    handle: "@blessd",
    status: "Pending",
    size: "L",
    descriptor: "Artista urbano con foco en Gen Z",
  },
  {
    id: 12,
    name: "Carlos Vives",
    platform: "Instagram",
    handle: "@carlosvives",
    status: "Delivered",
    size: "L",
    descriptor: "Representante de la musica colombiana",
  },
  {
    id: 13,
    name: "Kidd Keo",
    platform: "Instagram",
    handle: "@kiddkeo",
    status: "Pending",
    size: "M",
    descriptor: "Artista invitado de escena adyacente",
  },
  {
    id: 14,
    name: "Lucho SSJ",
    platform: "YouTube",
    handle: "@luchossj",
    status: "Pending",
    size: "L",
    descriptor: "Perfil de cultura urbana y comunidad digital",
  },
]

const inventoryDrops: InventoryDrop[] = [
  {
    code: "DROP 001",
    units: 4,
    recipient: "James Rodríguez",
    profile: "Futbolista colombiano",
    note: "4 prendas para activacion privada y despacho premium en Madrid.",
  },
  {
    code: "DROP 002",
    units: 4,
    recipient: "Karol G",
    profile: "Artista colombiana",
    note: "4 prendas en tonos oscuros para fitting editorial y gifting cerrado.",
  },
  {
    code: "DROP 003",
    units: 4,
    recipient: "Feid",
    profile: "Artista colombiano",
    note: "4 prendas reservadas para backstage, staff cercano y contenido organico.",
  },
  {
    code: "DROP 004",
    units: 4,
    recipient: "Luis Díaz",
    profile: "Futbolista colombiano",
    note: "4 prendas para despacho express con enfoque athluxury y uso off-pitch.",
  },
  {
    code: "DROP 005",
    units: 4,
    recipient: "Shakira",
    profile: "Icono global",
    note: "4 prendas con seleccion premium para estilismo y archivo personal.",
  },
  {
    code: "DROP 006",
    units: 4,
    recipient: "Falcao García",
    profile: "Futbolista colombiano",
    note: "4 prendas para entrega de equipo y uso personal en viaje.",
  },
  {
    code: "DROP 007",
    units: 4,
    recipient: "Kidd Keo",
    profile: "Artista invitado",
    note: "4 prendas para colaboracion artistica y entrega por agenda flexible.",
  },
]

const shipmentRecords: ShipmentRecord[] = [
  {
    id: 1,
    recipient: "Karol G",
    city: "Medellin",
    status: "Delivered",
    mode: "land",
    detail: "Entrega firmada por equipo personal y confirmada para fitting privado.",
  },
  {
    id: 2,
    recipient: "J Balvin",
    city: "Medellin",
    status: "Delivered",
    mode: "air",
    detail: "Entrega cerrada con management y validacion final de contenido exclusivo.",
  },
  {
    id: 3,
    recipient: "Feid",
    city: "Medellin",
    status: "Shipped",
    mode: "land",
    detail: "En camino terrestre hacia camerino principal para backstage y contenido.",
  },
  {
    id: 4,
    recipient: "James Rodríguez",
    city: "Madrid",
    status: "Shipped",
    mode: "air",
    detail: "Despacho aereo en ruta con liberacion aduanera aprobada.",
  },
  {
    id: 5,
    recipient: "Luis Díaz",
    city: "Liverpool",
    status: "Pending",
    mode: "air",
    detail: "Pendiente de aprobacion final de talla y ventana de recepcion del club.",
  },
  {
    id: 6,
    recipient: "Shakira",
    city: "Miami",
    status: "Delivered",
    mode: "air",
    detail: "Entrega premium confirmada con management y archivo fotografico.",
  },
  {
    id: 7,
    recipient: "Maluma",
    city: "Medellin",
    status: "Shipped",
    mode: "land",
    detail: "Ruta terrestre activa para entrega privada y ajuste de agenda.",
  },
  {
    id: 8,
    recipient: "Ryan Castro",
    city: "Medellin",
    status: "Pending",
    mode: "land",
    detail: "Pendiente de confirmacion de horario para salida del paquete.",
  },
  {
    id: 9,
    recipient: "Carlos Vives",
    city: "Santa Marta",
    status: "Delivered",
    mode: "sea",
    detail: "Entrega completada con seguimiento maritimo y recepcion final.",
  },
  {
    id: 10,
    recipient: "Kidd Keo",
    city: "Valencia",
    status: "Pending",
    mode: "sea",
    detail: "Reserva en consolidado maritimo por calendario flexible de entrega.",
  },
]

const initialChatMessages: ChatMessage[] = [
  {
    id: 1,
    name: "Valentina Muñoz",
    role: "Gestora operativa",
    text: "El siguiente drop ya esta listo. Yo creo que esta vez va para un jugador o un artista con mucho ruido.",
    tone: "team",
  },
  {
    id: 2,
    name: "Sebastián Peña",
    role: "Relaciones",
    text: "Hay que mirar a Medellin primero. Si el paquete sale hoy, mañana ya se empieza a comentar.",
    tone: "speculation",
  },
  {
    id: 3,
    name: "Camila Ordoñez",
    role: "Logistica",
    text: "Tenemos rutas aerea y terrestre activas. Falta cerrar solo un envio pendiente.",
    tone: "update",
  },
  {
    id: 4,
    name: "Mateo Castaño",
    role: "Creativo",
    text: "Yo apostaria por un drop exclusivo para un artista colombiano top. Eso se va a mover duro.",
    tone: "speculation",
  },
]

const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Valentina Muñoz",
    role: "Gerente de gestiones operativas",
    area: "operations",
    detail: "Coordina aprobaciones de drop, ventanas de despacho y seguimiento interno diario.",
  },
  {
    id: 2,
    name: "Sebastián Peña",
    role: "Responsable de relaciones con talento",
    area: "relations",
    detail: "Lidera invitaciones, confirmaciones con management y prioridad de celebridades.",
  },
  {
    id: 3,
    name: "Camila Ordoñez",
    role: "Coordinadora logistica",
    area: "logistics",
    detail: "Administra rutas aereas, maritimas y terrestres con control de tiempos y soporte.",
  },
  {
    id: 4,
    name: "Mateo Castaño",
    role: "Director creativo de gifting",
    area: "creative",
    detail: "Define combinaciones de prendas, narrativa visual y presentacion premium del envio.",
  },
  {
    id: 5,
    name: "Diana Muñoz",
    role: "Coordinadora de invitaciones",
    area: "relations",
    detail: "Gestiona acceso a colaboradores y confirma el ingreso de nuevos invitados al equipo.",
  },
  {
    id: 6,
    name: "Andrés Ñáñez",
    role: "Analista de despachos",
    area: "operations",
    detail: "Supervisa estados de salida, rutas activas y cierre de entregas con reporte diario.",
  },
]

const totalUnits = inventoryDrops.reduce((sum, item) => sum + item.units, 0)

export default function Page() {
  const [members, setMembers] = useState(initialMembers)
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [inventoryChecked, setInventoryChecked] = useState<number[]>([1, 2, 5])
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [teamDialogOpen, setTeamDialogOpen] = useState(false)
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [language, setLanguage] = useState<Language>("es")
  const [activeSection, setActiveSection] = useState<SectionKey>("members")
  const [activityMessage, setActivityMessage] = useState(copy.es.sectionDescriptions.members.body)
  const [form, setForm] = useState({
    name: "",
    platform: "Instagram" as Platform,
    handle: "",
    size: "M" as HoodieSize,
  })
  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    area: "operations" as TeamRoleType,
    detail: "",
  })
  const [chatForm, setChatForm] = useState("")
  const { resolvedTheme, setTheme } = useTheme()

  const text = copy[language]
  const isDark = (resolvedTheme ?? "dark") === "dark"
  const distributed = useMemo(
    () => members.filter((member) => member.status !== "Pending").length,
    [members]
  )
  const remaining = Math.max(totalUnits - distributed, 0)
  const deliveredCount = shipmentRecords.filter((record) => record.status === "Delivered").length
  const inTransitCount = shipmentRecords.filter((record) => record.status === "Shipped").length
  const pendingCount = shipmentRecords.filter((record) => record.status === "Pending").length

  const readyInventoryCount = inventoryChecked.length
  const pendingInventoryCount = Math.max(inventoryDrops.length - readyInventoryCount, 0)

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateTeamField<K extends keyof typeof teamForm>(key: K, value: (typeof teamForm)[K]) {
    setTeamForm((current) => ({ ...current, [key]: value }))
  }

  function toggleInventoryCheck(dropId: number) {
    setInventoryChecked((current) =>
      current.includes(dropId) ? current.filter((id) => id !== dropId) : [...current, dropId]
    )
  }

  function openChatDialog(open: boolean) {
    setChatDialogOpen(open)
    if (open) {
      setActivityMessage(
        language === "es"
          ? "Se abrio el chat de canales de contenido exclusivo."
          : "Opened the exclusive content channels chat."
      )
    }
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

  function openTeamDialog(open: boolean) {
    setTeamDialogOpen(open)
    if (open) {
      setActivityMessage(
        language === "es"
          ? "Se abrio el panel para invitar equipo y añadir roles."
          : "Opened the team invite panel to add roles."
      )
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
        descriptor:
          language === "es"
            ? "Nuevo perfil agregado para evaluacion interna"
            : "New profile added for internal review",
      },
      ...current,
    ])

    setForm({ name: "", platform: "Instagram", handle: "", size: "M" })
    setDialogOpen(false)
    setActivityMessage(text.actions.addedMember(name))
  }

  function handleAddTeamMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = teamForm.name.trim()
    const role = teamForm.role.trim()
    const detail = teamForm.detail.trim()
    if (!name || !role || !detail) return

    setTeamMembers((current) => [
      {
        id: current.length + 1,
        name,
        role,
        area: teamForm.area,
        detail,
      },
      ...current,
    ])

    setTeamForm({ name: "", role: "", area: "operations", detail: "" })
    setTeamDialogOpen(false)
    setActivityMessage(
      language === "es"
        ? `${name} fue invitado al equipo con el rol ${role}.`
        : `${name} was invited to the team with the role ${role}.`
    )
  }

  function handleSendChat(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const textValue = chatForm.trim()
    if (!textValue) return

    setChatMessages((current) => [
      {
        id: current.length + 1,
        name: language === "es" ? "Equipo BENARION" : "BENARION Team",
        role: language === "es" ? "Canal interno" : "Internal channel",
        text: textValue,
        tone: "update",
      },
      ...current,
    ])
    setChatForm("")
    setActivityMessage(
      language === "es"
        ? "Se publico un mensaje en el chat de contenido exclusivo."
        : "A message was posted in the exclusive content chat."
    )
  }

  function previewMember(member: Member) {
    setActivityMessage(text.actions.viewedMember(member.name))
  }

  function previewDrop(drop: InventoryDrop) {
    setActivityMessage(text.actions.viewedDrop(drop.code))
  }

  function previewShipment(record: ShipmentRecord) {
    setActivityMessage(text.actions.viewedShipment(record.recipient))
  }

  function previewTeamMember(member: TeamMember) {
    setActivityMessage(text.actions.viewedTeamMember(member.name))
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
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.4em] text-black/40 dark:text-white/40">{text.hero.eyebrow}</p>
                <h2 className="mt-3 text-4xl font-light tracking-[0.08em] text-black dark:text-white">
                  {getSectionHero(activeSection, language).title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-black/58 dark:text-white/55">
                  {getSectionHero(activeSection, language).description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <AddMemberDialog
                  dialogOpen={dialogOpen}
                  form={form}
                  labels={text.labels}
                  dialogDescription={text.dialogDescription}
                  onDialogChange={openDialog}
                  onFieldChange={updateField}
                  onSubmit={handleAddMember}
                />
                {activeSection === "settings" ? (
                  <AddTeamMemberDialog
                    dialogOpen={teamDialogOpen}
                    form={teamForm}
                    labels={text.labels}
                    onDialogChange={openTeamDialog}
                    onFieldChange={updateTeamField}
                    onSubmit={handleAddTeamMember}
                  />
                ) : null}
              </div>
            </header>

            <SectionShowcase
              activeSection={activeSection}
              activityMessage={activityMessage}
              deliveredCount={deliveredCount}
              distributed={distributed}
              inTransitCount={inTransitCount}
              inventoryCount={inventoryDrops.length}
              labels={text.labels}
              language={language}
              members={members}
              pendingCount={pendingCount}
              remaining={remaining}
              sectionBody={text.sectionDescriptions[activeSection].body}
              sectionTitle={text.sectionDescriptions[activeSection].title}
              teamMembers={teamMembers}
              teamCount={teamMembers.length}
              totalUnits={totalUnits}
            />

            {activeSection === "inventory" ? (
              <InventorySection
                checkedIds={inventoryChecked}
                drops={inventoryDrops}
                description={text.inventoryDescription}
                labels={text.labels}
                onToggleCheck={toggleInventoryCheck}
                onPreview={previewDrop}
                pendingCount={pendingInventoryCount}
                readyCount={readyInventoryCount}
                members={members}
              />
            ) : null}

            {activeSection === "members" ? (
              <MembersSection
                members={members}
                description={text.memberDirectoryDescription}
                labels={text.labels}
                statusText={text.statusText}
                onPreview={previewMember}
              />
            ) : null}

            {activeSection === "shipments" ? (
              <ShipmentsSection
                description={text.shipmentDescription}
                labels={text.labels}
                modeText={text.modeText}
                records={shipmentRecords}
                statusText={text.statusText}
                onPreview={previewShipment}
              />
            ) : null}

            {activeSection === "settings" ? (
              <SettingsSection
                description={text.settingsDescription}
                labels={text.labels}
                teamMembers={teamMembers}
                onPreview={previewTeamMember}
                chatDialogOpen={chatDialogOpen}
                chatForm={chatForm}
                chatMessages={chatMessages}
                onChatDialogChange={openChatDialog}
                onChatFieldChange={setChatForm}
                onChatSubmit={handleSendChat}
              />
            ) : null}
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

function getSectionHero(section: SectionKey, language: Language) {
  const copyMap = {
    es: {
      inventory: {
        title: "Curaduria de drops y asignacion a perfiles clave",
        description:
          "Cada capsule se organiza por prioridad, numero de prendas y destinatario antes de aprobar el despacho final.",
      },
      members: {
        title: "Roster premium con foco en talento colombiano",
        description:
          "The Circle prioriza artistas, futbolistas y perfiles culturales con afinidad real para BENARION.",
      },
      shipments: {
        title: "Seguimiento logistico por estado y via de entrega",
        description:
          "Visualiza rapidamente que ya llego, que esta en camino y que aun espera validacion operacional.",
      },
      settings: {
        title: "Accesos y funciones del equipo interno",
        description:
          "La operacion se sostiene con responsables claros para gestiones, talento, logistica y direccion creativa.",
      },
    },
    en: {
      inventory: {
        title: "Drop curation and allocation for priority profiles",
        description:
          "Each capsule is organized by garment count, recipient, and dispatch readiness before final approval.",
      },
      members: {
        title: "Premium roster with Colombian talent at the center",
        description:
          "The Circle prioritizes artists, football players, and culturally aligned profiles for BENARION.",
      },
      shipments: {
        title: "Logistics tracking by status and transit route",
        description:
          "See at a glance what has arrived, what is moving, and what still needs operational validation.",
      },
      settings: {
        title: "Access control and responsibilities for the internal team",
        description:
          "The operation runs through clear owners across management, talent, logistics, and creative direction.",
      },
    },
  }

  return copyMap[language][section]
}

function SectionShowcase({
  activeSection,
  activityMessage,
  deliveredCount,
  distributed,
  inTransitCount,
  inventoryCount,
  labels,
  language,
  members,
  pendingCount,
  remaining,
  sectionBody,
  sectionTitle,
  teamMembers,
  teamCount,
  totalUnits,
}: {
  activeSection: SectionKey
  activityMessage: string
  deliveredCount: number
  distributed: number
  inTransitCount: number
  inventoryCount: number
  labels: Labels
  language: Language
  members: Member[]
  pendingCount: number
  remaining: number
  sectionBody: string
  sectionTitle: string
  teamMembers: TeamMember[]
  teamCount: number
  totalUnits: number
}) {
  if (activeSection === "inventory") {
    return (
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="overflow-hidden border-black/10 bg-[linear-gradient(135deg,rgba(0,0,0,0.04),transparent_60%)] shadow-none dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_60%)]">
          <CardHeader className="border-b border-black/10 pb-5 dark:border-white/10">
            <CardTitle className="text-[11px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
              {labels.inventoryBoard}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div>
                <p className="text-5xl font-light tracking-[0.05em] text-black dark:text-white">
                  {inventoryCount}
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-black/55 dark:text-white/55">
                  {language === "es"
                    ? "Drops activos con destinatario definido y narrativa de despacho premium."
                    : "Active drops with defined recipients and premium dispatch narratives."}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <CompactMetric
                  title={labels.totalUnits}
                  value={String(totalUnits)}
                  detail={language === "es" ? "Prendas curadas" : "Curated garments"}
                />
                <CompactMetric
                  title={labels.distributed}
                  value={String(distributed)}
                  detail={language === "es" ? "Con destino" : "Assigned"}
                />
                <CompactMetric
                  title={labels.remaining}
                  value={String(remaining)}
                  detail={language === "es" ? "Por validar" : "To review"}
                />
              </div>
            </div>
            <div className="space-y-3 border-t border-black/10 pt-4 dark:border-white/10 md:border-t-0 md:border-l md:pl-6 md:pt-0 dark:md:border-white/10">
              {inventoryDrops.slice(0, 3).map((drop) => (
                <div key={drop.code} className="border border-black/10 p-4 dark:border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 dark:text-white/38">
                        {drop.code}
                      </p>
                      <p className="mt-2 text-lg font-light text-black dark:text-white">
                        {drop.recipient}
                      </p>
                    </div>
                    <span className="text-xl font-light text-black/75 dark:text-white/75">
                      {drop.units}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-black/52 dark:text-white/50">
                    {drop.note}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <ActivityRail
          activityMessage={activityMessage}
          description={sectionBody}
          labels={labels}
          sectionTitle={sectionTitle}
        />
      </section>
    )
  }

  if (activeSection === "members") {
    return (
      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card className="border-black/10 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.06),transparent_40%)] shadow-none dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_40%)]">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
                  {labels.members}
                </p>
                <p className="mt-3 text-3xl font-light tracking-[0.04em] text-black dark:text-white">
                  {language === "es"
                    ? "Talento colombiano como centro del circulo"
                    : "Colombian talent at the center of the circle"}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <CompactMetric
                  title={labels.distributed}
                  value={String(distributed)}
                  detail={language === "es" ? "Ya asignados" : "Already assigned"}
                />
                <CompactMetric
                  title={labels.status}
                  value={String(members.filter((member) => member.status === "Delivered").length)}
                  detail={language === "es" ? "Entregados" : "Delivered"}
                />
                <CompactMetric
                  title={labels.remaining}
                  value={String(members.filter((member) => member.status === "Pending").length)}
                  detail={language === "es" ? "Pendientes" : "Pending"}
                />
              </div>
            </div>
            <div className="grid gap-3">
              {members.slice(0, 4).map((member) => (
                <div key={member.id} className="flex items-start justify-between border border-black/10 p-4 dark:border-white/10">
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">{member.name}</p>
                    <p className="mt-1 text-xs tracking-[0.08em] text-black/40 dark:text-white/40">
                      {member.descriptor}
                    </p>
                  </div>
                  <ShipmentBadge
                    label={
                      language === "es"
                        ? copy.es.statusText[member.status]
                        : copy.en.statusText[member.status]
                    }
                    status={member.status}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <ActivityRail
          activityMessage={activityMessage}
          description={sectionBody}
          labels={labels}
          sectionTitle={sectionTitle}
        />
      </section>
    )
  }

  if (activeSection === "shipments") {
    return (
      <section className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <Card className="border-black/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),transparent_70%)] shadow-none dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_70%)]">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
                  {labels.shipmentBoard}
                </p>
                <p className="mt-3 text-3xl font-light tracking-[0.04em] text-black dark:text-white">
                  {language === "es"
                    ? "Rutas limpias y estados operativos visibles"
                    : "Clean routes and visible operational states"}
                </p>
              </div>
              <div className="text-sm text-black/50 dark:text-white/50">
                {language === "es" ? "Aire, mar y tierra" : "Air, sea, and land"}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <RouteMetric
                icon={<Plane className="size-4" />}
                label={language === "es" ? "Entregados" : "Delivered"}
                value={String(deliveredCount)}
              />
              <RouteMetric
                icon={<Truck className="size-4" />}
                label={language === "es" ? "En camino" : "In transit"}
                value={String(inTransitCount)}
              />
              <RouteMetric
                icon={<Ship className="size-4" />}
                label={language === "es" ? "Pendientes" : "Pending"}
                value={String(pendingCount)}
              />
            </div>
          </CardContent>
        </Card>
        <ActivityRail
          activityMessage={activityMessage}
          description={sectionBody}
          labels={labels}
          sectionTitle={sectionTitle}
        />
      </section>
    )
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <Card className="border-black/10 bg-[linear-gradient(135deg,rgba(0,0,0,0.04),transparent_55%)] shadow-none dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_55%)]">
        <CardContent className="space-y-6 p-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
              {labels.teamAccess}
            </p>
            <p className="mt-3 text-3xl font-light tracking-[0.04em] text-black dark:text-white">
              {language === "es"
                ? "Estructura interna para operar con criterio"
                : "Internal structure built to operate with precision"}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <CompactMetric
              title={labels.role}
              value={String(teamCount)}
              detail={language === "es" ? "Roles activos" : "Active roles"}
            />
            <CompactMetric
              title={labels.settings}
              value={String(2)}
              detail={language === "es" ? "Niveles de acceso" : "Access levels"}
            />
          </div>
          <div className="grid gap-3">
            {teamMembers.slice(0, 4).map((member) => (
              <div key={member.id} className="border border-black/10 p-4 dark:border-white/10">
                <p className="text-sm font-medium text-black dark:text-white">{member.name}</p>
                <p className="mt-1 text-sm text-black/48 dark:text-white/48">{member.role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <ActivityRail
        activityMessage={activityMessage}
        description={sectionBody}
        labels={labels}
        sectionTitle={sectionTitle}
      />
    </section>
  )
}

function CompactMetric({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="border border-black/10 p-4 dark:border-white/10">
      <p className="text-[10px] uppercase tracking-[0.28em] text-black/40 dark:text-white/40">{title}</p>
      <p className="mt-3 text-3xl font-light text-black dark:text-white">{value}</p>
      <p className="mt-2 text-sm text-black/48 dark:text-white/48">{detail}</p>
    </div>
  )
}

function RouteMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between border border-black/10 p-4 dark:border-white/10">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-black/40 dark:text-white/40">
          {label}
        </p>
        <p className="mt-3 text-3xl font-light text-black dark:text-white">{value}</p>
      </div>
      <div className="text-black/50 dark:text-white/50">{icon}</div>
    </div>
  )
}

function ActivityRail({
  activityMessage,
  description,
  labels,
  sectionTitle,
}: {
  activityMessage: string
  description: string
  labels: Labels
  sectionTitle: string
}) {
  return (
    <Card className="border-black/10 bg-black/[0.02] shadow-none dark:border-white/10 dark:bg-white/[0.03]">
      <CardHeader className="space-y-3 pb-3">
        <CardTitle className="text-[11px] font-medium uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
          {labels.activeSection}
        </CardTitle>
        <p className="text-2xl font-light tracking-[0.04em] text-black dark:text-white">{sectionTitle}</p>
        <p className="text-sm leading-6 text-black/55 dark:text-white/50">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border border-black/10 p-4 dark:border-white/10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-black/40 dark:text-white/38">
            {labels.lastAction}
          </p>
          <p className="mt-3 text-sm leading-6 text-black/72 dark:text-white/72">{activityMessage}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function InventorySection({
  checkedIds,
  drops,
  description,
  members,
  labels,
  onToggleCheck,
  onPreview,
  pendingCount,
  readyCount,
}: {
  checkedIds: number[]
  drops: InventoryDrop[]
  description: string
  members: Member[]
  labels: Labels
  onToggleCheck: (dropId: number) => void
  onPreview: (drop: InventoryDrop) => void
  pendingCount: number
  readyCount: number
}) {
  return (
    <section className="border border-black/10 bg-black/[0.02] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40">{labels.inventoryBoard}</p>
          <h3 className="mt-2 text-xl font-light tracking-[0.08em] text-black dark:text-white">
            {labels.inventory} para The Circle
          </h3>
        </div>
        <p className="max-w-2xl text-sm text-black/50 dark:text-white/45">{description}</p>
      </div>

      <div className="grid gap-4 p-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {drops.map((drop) => {
            const dropId = Number(drop.code.split(" ")[1])
            const checked = checkedIds.includes(dropId)

            return (
              <Card
                key={drop.code}
                className={cn(
                  "border-black/10 bg-background shadow-none transition-all dark:border-white/10",
                  checked && "border-black bg-black/[0.03] dark:border-white dark:bg-white/[0.05]"
                )}
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-[11px] uppercase tracking-[0.32em] text-black/45 dark:text-white/45">
                      {drop.code}
                    </CardTitle>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-black/45 dark:text-white/45">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleCheck(dropId)}
                        className="size-4 rounded border-black/20 text-black accent-black dark:border-white/20 dark:accent-white"
                      />
                      Listo
                    </label>
                  </div>
                  <p className="text-3xl font-light text-black dark:text-white">{drop.units}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-black/40 dark:text-white/35">
                      {labels.assignedTo}
                    </p>
                    <p className="mt-2 text-base text-black dark:text-white">{drop.recipient}</p>
                    <p className="mt-1 text-sm text-black/45 dark:text-white/45">{drop.profile}</p>
                  </div>
                  <p className="text-sm leading-6 text-black/60 dark:text-white/55">{drop.note}</p>
                  <Button
                    variant="ghost"
                    onClick={() => onPreview(drop)}
                    className="w-full rounded-none border border-black/10 text-[11px] uppercase tracking-[0.24em] text-black/68 hover:bg-black/[0.04] hover:text-black dark:border-white/10 dark:text-white/68 dark:hover:bg-white/[0.04] dark:hover:text-white"
                  >
                    {labels.viewAction}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="space-y-4">
          <Card className="border-black/10 bg-background shadow-none dark:border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.32em] text-black/45 dark:text-white/45">
                Miembros de The Circle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CompactMetric title="Listos" value={String(readyCount)} detail="Casillas marcadas" />
              <CompactMetric title="Pendientes" value={String(pendingCount)} detail="Por confirmar" />
            </CardContent>
          </Card>

          <Card className="border-black/10 bg-background shadow-none dark:border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.32em] text-black/45 dark:text-white/45">
                Cola del Circle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.slice(0, 5).map((member) => (
                <div key={member.id} className="border border-black/10 p-3 dark:border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{member.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                        {member.platform}
                      </p>
                    </div>
                    <ShipmentBadge
                      label={
                        member.status === "Delivered"
                          ? "Entregado"
                          : member.status === "Shipped"
                          ? "Enviado"
                          : "Pendiente"
                      }
                      status={member.status}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function MembersSection({
  members,
  description,
  labels,
  statusText,
  onPreview,
}: {
  members: Member[]
  description: string
  labels: Labels
  statusText: Record<ShipmentStatus, string>
  onPreview: (member: Member) => void
}) {
  return (
    <section className="border border-black/10 bg-black/[0.02] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40">Member Directory</p>
          <h3 className="mt-2 text-xl font-light tracking-[0.08em] text-black dark:text-white">{labels.members}</h3>
        </div>
        <p className="max-w-2xl text-sm text-black/50 dark:text-white/45">{description}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-black/10 hover:bg-transparent dark:border-white/10">
            <TableHead className="h-14 px-6 text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{labels.name}</TableHead>
            <TableHead className="h-14 text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{labels.social}</TableHead>
            <TableHead className="h-14 text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{labels.status}</TableHead>
            <TableHead className="h-14 text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{labels.hoodieSize}</TableHead>
            <TableHead className="h-14 px-6 text-right text-[11px] font-medium uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{labels.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="border-black/10 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.03]">
              <TableCell className="px-6 py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium tracking-[0.03em] text-black dark:text-white">{member.name}</span>
                  <span className="text-xs tracking-[0.08em] text-black/38 dark:text-white/35">{member.descriptor}</span>
                </div>
              </TableCell>
              <TableCell className="py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-black/78 dark:text-white/80">{member.handle}</span>
                  <span className="text-xs uppercase tracking-[0.24em] text-black/35 dark:text-white/35">{member.platform}</span>
                </div>
              </TableCell>
              <TableCell className="py-5">
                <ShipmentBadge label={statusText[member.status]} status={member.status} />
              </TableCell>
              <TableCell className="py-5 text-sm text-black/72 dark:text-white/75">{member.size}</TableCell>
              <TableCell className="px-6 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(member)}
                    className="rounded-none border border-black/10 text-[11px] uppercase tracking-[0.2em] text-black/65 hover:bg-black/[0.04] hover:text-black dark:border-white/10 dark:text-white/65 dark:hover:bg-white/[0.04] dark:hover:text-white"
                  >
                    {labels.viewAction}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPreview(member)}
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
  )
}

function ShipmentsSection({
  description,
  labels,
  modeText,
  records,
  statusText,
  onPreview,
}: {
  description: string
  labels: Labels
  modeText: Record<TransitMode, string>
  records: ShipmentRecord[]
  statusText: Record<ShipmentStatus, string>
  onPreview: (record: ShipmentRecord) => void
}) {
  const grouped = {
    Delivered: records.filter((record) => record.status === "Delivered"),
    Shipped: records.filter((record) => record.status === "Shipped"),
    Pending: records.filter((record) => record.status === "Pending"),
  }

  return (
    <section className="border border-black/10 bg-black/[0.02] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40">{labels.shipmentBoard}</p>
          <h3 className="mt-2 text-xl font-light tracking-[0.08em] text-black dark:text-white">{labels.shipments}</h3>
        </div>
        <p className="max-w-2xl text-sm text-black/50 dark:text-white/45">{description}</p>
      </div>

      <div className="grid gap-4 p-6 xl:grid-cols-3">
        <Card className="border-black/10 bg-background shadow-none dark:border-white/10 xl:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-[11px] uppercase tracking-[0.32em] text-black/45 dark:text-white/45">
              Artistas colombianos con BENARION
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {records.slice(0, 5).map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => onPreview(record)}
                className="border border-black/10 p-4 text-left transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">{record.recipient}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                      {record.city}
                    </p>
                  </div>
                  <ShipmentBadge label={statusText[record.status]} status={record.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-black/55 dark:text-white/55">{record.detail}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {(Object.keys(grouped) as ShipmentStatus[]).map((status) => (
          <Card key={status} className="border-black/10 bg-background shadow-none dark:border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.32em] text-black/45 dark:text-white/45">{statusText[status]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {grouped[status].map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => onPreview(record)}
                  className="w-full border border-black/10 p-4 text-left transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{record.recipient}</p>
                      <p className="mt-1 text-xs tracking-[0.08em] text-black/40 dark:text-white/38">{record.detail}</p>
                    </div>
                    <TransitIcon mode={record.mode} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-black/48 dark:text-white/45">
                    <span>{record.city}</span>
                    <span>{modeText[record.mode]}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function SettingsSection({
  description,
  chatDialogOpen,
  chatForm,
  chatMessages,
  labels,
  teamMembers,
  onChatDialogChange,
  onChatFieldChange,
  onChatSubmit,
  onPreview,
}: {
  description: string
  chatDialogOpen: boolean
  chatForm: string
  chatMessages: ChatMessage[]
  labels: Labels
  teamMembers: TeamMember[]
  onChatDialogChange: (open: boolean) => void
  onChatFieldChange: (value: string) => void
  onChatSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onPreview: (member: TeamMember) => void
}) {
  return (
    <section className="border border-black/10 bg-black/[0.02] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40">{labels.teamAccess}</p>
          <h3 className="mt-2 text-xl font-light tracking-[0.08em] text-black dark:text-white">{labels.settings}</h3>
        </div>
        <div className="flex flex-col gap-3">
          <p className="max-w-2xl text-sm text-black/50 dark:text-white/45">{description}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onChatDialogChange(!chatDialogOpen)}
              className="h-10 rounded-none border-black/10 bg-transparent text-[11px] uppercase tracking-[0.24em] text-black hover:bg-black/[0.03] dark:border-white/10 dark:text-white dark:hover:bg-white/[0.04]"
            >
              {chatDialogOpen ? "Cerrar canales" : labels.channels}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="grid gap-4">
          <Card className="border-black/10 bg-background shadow-none dark:border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.32em] text-black/45 dark:text-white/45">
                Gestor de roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="border border-black/10 p-4 dark:border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{member.name}</p>
                      <p className="mt-1 text-sm text-black/48 dark:text-white/48">{member.role}</p>
                      <p className="mt-2 text-xs text-black/35 dark:text-white/35">{member.detail}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => onPreview(member)}
                      className="rounded-none border border-black/10 text-[11px] uppercase tracking-[0.22em] text-black/68 hover:bg-black/[0.04] hover:text-black dark:border-white/10 dark:text-white/68 dark:hover:bg-white/[0.04] dark:hover:text-white"
                    >
                      {labels.viewAction}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-black/10 bg-background shadow-none dark:border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] uppercase tracking-[0.32em] text-black/45 dark:text-white/45">
                Canales de difusión
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="border border-black/10 p-4 dark:border-white/10">
                <p className="text-sm font-medium text-black dark:text-white">Contenido exclusivo</p>
                <p className="mt-2 text-sm text-black/48 dark:text-white/48">
                  Acceso cerrado para novedades, previews y publicaciones privadas.
                </p>
              </div>
              <div className="border border-black/10 p-4 dark:border-white/10">
                <p className="text-sm font-medium text-black dark:text-white">Alerta de drops</p>
                <p className="mt-2 text-sm text-black/48 dark:text-white/48">
                  Notificaciones rapidas sobre la salida del siguiente drop.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-black/10 bg-background shadow-none dark:border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-[11px] uppercase tracking-[0.32em] text-black/45 dark:text-white/45">
              {chatDialogOpen ? labels.chatTitle : "Vista de chat"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {chatDialogOpen ? (
              <>
                <div className="space-y-3">
                  {chatMessages.slice(0, 4).map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "border p-4 transition-colors",
                        message.tone === "speculation"
                          ? "border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.03]"
                          : message.tone === "update"
                          ? "border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]"
                          : "border-black/10 bg-background dark:border-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-black dark:text-white">{message.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/35 dark:text-white/35">
                            {message.role}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-black/35 dark:text-white/35">
                          {message.tone}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/60">{message.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={onChatSubmit} className="space-y-3 border-t border-black/10 pt-4 dark:border-white/10">
                  <Input
                    value={chatForm}
                    onChange={(event) => onChatFieldChange(event.target.value)}
                    placeholder={labels.chatPlaceholder}
                    className="rounded-none border-black/10 bg-black/[0.02] text-black placeholder:text-black/25 dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:placeholder:text-white/25"
                  />
                  <Button
                    type="submit"
                    className="h-10 rounded-none border border-black bg-black px-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white hover:bg-black/90 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    {labels.sendMessage}
                  </Button>
                </form>
              </>
            ) : (
              <div className="border border-dashed border-black/15 p-5 text-sm leading-6 text-black/55 dark:border-white/15 dark:text-white/55">
                Haz clic en canales para abrir el chat interno, seguir especulaciones y dejar mensajes sobre el siguiente drop.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function TransitIcon({ mode }: { mode: TransitMode }) {
  if (mode === "air") {
    return <Plane className="size-4 text-black/45 dark:text-white/45" />
  }

  if (mode === "sea") {
    return <Ship className="size-4 text-black/45 dark:text-white/45" />
  }

  return <Truck className="size-4 text-black/45 dark:text-white/45" />
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

function AddTeamMemberDialog({
  dialogOpen,
  form,
  labels,
  onDialogChange,
  onFieldChange,
  onSubmit,
}: {
  dialogOpen: boolean
  form: {
    name: string
    role: string
    area: TeamRoleType
    detail: string
  }
  labels: Labels
  onDialogChange: (open: boolean) => void
  onFieldChange: <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-none border border-black bg-black px-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white hover:bg-black/90 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90">
          <Plus className="size-4" />
          {labels.inviteTeam}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-black/10 bg-background text-foreground dark:border-white/10 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-[0.08em]">{labels.addRole}</DialogTitle>
          <DialogDescription className="text-sm leading-6 text-black/50 dark:text-white/50">
            {labels.inviteTeam} members for operations, logistics, relations, or creative direction.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="team-name" className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
                Nombre
              </Label>
              <Input
                id="team-name"
                value={form.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
                placeholder="Valentina Muñoz"
                className="rounded-none border-black/10 bg-black/[0.02] text-black placeholder:text-black/25 dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:placeholder:text-white/25"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
                Rol
              </Label>
              <Input
                value={form.role}
                onChange={(event) => onFieldChange("role", event.target.value)}
                placeholder="Gerente de gestiones operativas"
                className="rounded-none border-black/10 bg-black/[0.02] text-black placeholder:text-black/25 dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:placeholder:text-white/25"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
                Area
              </Label>
              <Select value={form.area} onValueChange={(value) => onFieldChange("area", value as TeamRoleType)}>
                <SelectTrigger className="rounded-none border-black/10 bg-black/[0.02] text-black dark:border-white/10 dark:bg-white/[0.02] dark:text-white">
                  <SelectValue placeholder="Selecciona un area" />
                </SelectTrigger>
                <SelectContent className="border-black/10 bg-background text-foreground dark:border-white/10">
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="relations">Relations</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="team-detail" className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
                Descripcion
              </Label>
              <Input
                id="team-detail"
                value={form.detail}
                onChange={(event) => onFieldChange("detail", event.target.value)}
                placeholder="Coordina entregas, accesos y seguimiento."
                className="rounded-none border-black/10 bg-black/[0.02] text-black placeholder:text-black/25 dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:placeholder:text-white/25"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="h-11 rounded-none border border-black bg-black px-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white hover:bg-black/90 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90">
              {labels.inviteTeam}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

