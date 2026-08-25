export type CasoEtapa =
  | "identificacion"
  | "diseno"
  | "implementacion"
  | "marketplace";

export type CasoEstado = "enproceso" | "implementado" | "publicado";

export type CasoCoach = "jhonatan" | "dario";

export type CasoOla = "ola_1" | "ola_2" | "ola_3";

export type FlujoPasos = {
  entradas: string[];
  pasos: string[];
  salidas: string[];
};

/** Prompt o skill del champion (orden = índice en el array). */
export type RecursoTexto = {
  titulo: string;
  contenido: string;
};

export type EtapaChecklistItem = {
  key: CasoEtapa;
  label: string;
  completed: boolean;
};

export type CasoPublic = {
  id: string;
  codigo: string | null;
  slug: string;
  titulo: string;
  resumen: string;
  champion: string;
  area: string;
  coach: CasoCoach | null;
  ola: CasoOla | null;
  descripcion: string | null;
  problema: string | null;
  valor_esperado: string | null;
  publico_objetivo: string | null;
  alcance: string | null;
  diseno: string | null;
  herramientas: string[];
  beneficiarios: string[];
  tags: string[];
  flujo: FlujoPasos;
  prompts: RecursoTexto[];
  skills: RecursoTexto[];
  etapa_actual: CasoEtapa;
  estado: CasoEstado;
  visible_publico: boolean;
  adopcion_nivel: string | null;
  adopcion_detalle: string | null;
  participacion_nivel: string | null;
  participacion_detalle: string | null;
  eficiencia_resumen: string | null;
  eficiencia_detalle: string | null;
  fecha_identificado: string | null;
  created_at: string;
  updated_at: string;
  avance_pct: number;
  etapas_checklist: EtapaChecklistItem[];
  dias_activo: number | null;
};

export type CasoAdmin = CasoPublic & {
  owner_user_id: string;
};

export type ChampionSummary = {
  champion: string;
  areas: string[];
  case_count: number;
};

export type PaginationMeta = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type ModuloPublic = {
  slug: string;
  titulo: string;
  duracion_estimada: string;
  total_pasos: number;
};

export type ModuloProgreso = {
  modulo_slug: string;
  current_step: number;
  visited: number[];
  quizzes: Record<string, string>;
  matrix: Record<string, string>;
  reflexiones: Record<string, string>;
  completed_at: string | null;
  updated_at: string | null;
};

export type UserPublic = {
  id: string;
  email: string;
  nombre: string;
  role: "super_admin" | "coach" | "viewer";
  is_active: boolean;
  created_at: string;
};

export type AssistSuggestion = {
  titulo?: string | null;
  resumen?: string | null;
  champion?: string | null;
  area?: string | null;
  descripcion?: string | null;
  problema?: string | null;
  valor_esperado?: string | null;
  publico_objetivo?: string | null;
  alcance?: string | null;
  diseno?: string | null;
  herramientas?: string[] | null;
  beneficiarios?: string[] | null;
  tags?: string[] | null;
  flujo?: FlujoPasos | null;
  codigo?: string | null;
};

export type CasoWritePayload = {
  codigo?: string | null;
  slug?: string | null;
  titulo: string;
  resumen: string;
  champion: string;
  area: string;
  coach?: CasoCoach | null;
  ola?: CasoOla | null;
  descripcion?: string | null;
  problema?: string | null;
  valor_esperado?: string | null;
  publico_objetivo?: string | null;
  alcance?: string | null;
  diseno?: string | null;
  herramientas?: string[];
  beneficiarios?: string[];
  tags?: string[];
  flujo?: FlujoPasos;
  prompts?: RecursoTexto[];
  skills?: RecursoTexto[];
  etapa_actual?: CasoEtapa;
  estado?: CasoEstado;
  avance_pct?: number;
  visible_publico?: boolean;
  adopcion_nivel?: string | null;
  adopcion_detalle?: string | null;
  participacion_nivel?: string | null;
  participacion_detalle?: string | null;
  eficiencia_resumen?: string | null;
  eficiencia_detalle?: string | null;
  fecha_identificado?: string | null;
};
