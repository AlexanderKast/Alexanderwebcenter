export type NavItem = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export const navPrimary: NavItem[] = [
  { label: "Problema", href: "/#problema" },
  { label: "Beneficios", href: "/#beneficios" },
  { label: "Recurso", href: "/#recurso" },
  { label: "Consultoría", href: "/consultoria" },
  { label: "Formulario", href: "/brief" },
  { label: "Blog", href: "/blog" },
];

export const navFooter: { title: string; items: NavItem[] }[] = [
  {
    title: "Sitio",
    items: [
      { label: "Problema", href: "/#problema" },
      { label: "Beneficios", href: "/#beneficios" },
      { label: "Recurso", href: "/#recurso" },
      { label: "Consultoría", href: "/consultoria" },
      { label: "Formulario", href: "/brief" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Recursos",
    items: [
      { label: "10 Prompts de IA", href: "/descargas/10-prompts-ia-estrategas" },
      { label: "El Sistema DEI", href: "/descargas/el-sistema-dei" },
      { label: "Canvas Marca Personal", href: "/descargas/canvas-marca-personal" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
  {
    title: "Ecosistema",
    items: [
      { label: "KREOON", href: "https://kreoon.com", external: true },
      { label: "UGC Colombia", href: "https://ugccolombia.com", external: true },
      { label: "Infiny Group", href: "https://infinygroup.com", external: true },
      { label: "Los Reyes del Contenido", href: "https://losreyesdelcontenido.com", external: true },
    ],
  },
  {
    title: "Contacto",
    items: [
      { label: "Escribir", href: "/contacto" },
      { label: "founder@kreoon.com", href: "mailto:founder@kreoon.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/alexandercast", external: true },
      { label: "Instagram @alexemprendee", href: "https://instagram.com/alexemprendee", external: true },
    ],
  },
];

export const ctaPrincipal: NavItem = {
  label: "Descargar gratis",
  href: "/#recurso",
};
