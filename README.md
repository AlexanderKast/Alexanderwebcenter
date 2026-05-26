# Alexander Cast — Portal Personal Unificado

> Portal completo de marca personal: sitio web, blog, admin panel, onboarding de clientes y generación de contenido con IA.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **DB**: Supabase (PostgreSQL + Auth + Storage)
- **Email**: Resend (newsletter + transaccional)
- **Rate limiting**: Upstash Redis
- **IA**: Claude (Anthropic) + Gemini + Groq + WaveSpeed
- **Calendario**: Cal.com embed
- **Analytics**: Vercel Analytics + Speed Insights
- **Deploy**: Vercel

## Módulos

### Portal público (`/`)
Sitio web personal de Alexander Cast con Hero, About, Pilares, Servicios, Testimonios, Galería, Blog MDX, Consultoría (Cal.com), Lead magnets, Newsletter y Contacto.

### Admin panel (`/admin`)
Panel privado con Supabase Auth. Dashboard con métricas, Leads Kanban, Suscriptores, Consultorias, Mensajes, Manual de marca, Estrategia, Guiones, Content Forge.

### Módulo Clientes (`/clientes`)
Onboarding de marca personal para clientes. Formulario multi-paso de 9 secciones (~30 min), auto-guardado, sugerencias IA con Groq, guardado en Google Drive.

### Content Forge (`scripts/content-forge/`)
Motor de generación de contenido: carruseles IG, guiones Reels/TikTok, calendarios, imágenes con WaveSpeed + Gemini, análisis de virales con Apify.

## Estructura

```
alexander-cast-portal/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Home portfolio
│   ├── admin/               # Panel admin (auth)
│   │   └── content-forge/   # Motor IA contenido
│   └── clientes/            # Onboarding de marca
│       ├── onboarding/      # Formulario 9 pasos
│       └── gracias/         # Confirmación
├── components/              # Componentes React
│   ├── clientes/            # Formulario onboarding
│   ├── sections/            # Secciones del site
│   ├── admin/               # Admin (Header, Sidebar)
│   └── ui/                  # shadcn/ui primitives
├── lib/clientes/            # Libs del módulo clientes
├── content/                 # Datos del sitio (site.ts, pilares, etc.)
├── supabase/                # Migraciones SQL + RLS
├── scripts/content-forge/   # Motor generación contenido
├── agents/                  # Agentes Claude
├── core/                    # Identidad y voz
├── knowledge/               # Frameworks aplicados
├── skills/                  # Habilidades
├── memory/                  # Memoria persistente
└── davies/                  # Template HTML original (referencia visual)
```

## Variables de entorno

```bash
cp .env.example .env.local
```

Claves principales: Supabase, Resend, Upstash Redis, Google OAuth (módulo clientes), Groq API.

## Desarrollo

```bash
npm install && npm run dev
```

## Deploy

Vercel. Configurar variables de entorno en el dashboard antes del primer deploy.

---

**Alexander Cast** · Medellín, Colombia · [@alexemprendee](https://instagram.com/alexemprendee)
