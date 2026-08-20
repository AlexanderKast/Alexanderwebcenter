/**
 * Cuestionario de descubrimiento de marca / tienda online.
 * Fuente unica de verdad: el navegador lo usa para pintar y el
 * servidor para validar. No duplicar preguntas en ningun otro lado.
 */
import type { BriefCliente, BriefSeccion } from '@/types/brief';

export const BRIEF_CLIENTES: Record<string, BriefCliente> = {
  "biolipo": {
    "marca": "Biolipo",
    "categoria": "gomitas saludables",
    "sector": "salud",
    "acento": "#C0762A"
  },
  "demo": {
    "marca": "Tu marca",
    "categoria": "productos",
    "sector": "general",
    "acento": "#C0762A"
  }
};

export const BRIEF_SECCIONES: BriefSeccion[] = [
  {
    "n": "0",
    "t": "Datos de quien diligencia",
    "note": "Para saber a quién responderle y con quién coordinar.",
    "f": [
      {
        "id": "contacto_nombre",
        "l": "Nombre y apellido",
        "ty": "text",
        "r": 1,
        "ph": "Ej. María Restrepo"
      },
      {
        "id": "contacto_cargo",
        "l": "Cargo en la empresa",
        "ty": "text",
        "r": 1,
        "ph": "Ej. Gerente comercial"
      },
      {
        "id": "contacto_whatsapp",
        "l": "WhatsApp de contacto",
        "ty": "tel",
        "r": 1,
        "ph": "Ej. 300 123 4567"
      },
      {
        "id": "contacto_correo",
        "l": "Correo electrónico",
        "ty": "email",
        "r": 1,
        "ph": "nombre@empresa.com"
      },
      {
        "id": "empresa",
        "l": "Razón social o nombre de la empresa",
        "ty": "text",
        "r": 1
      }
    ]
  },
  {
    "n": "1",
    "t": "Negocio y estado actual",
    "f": [
      {
        "id": "q1_1",
        "l": "¿Por dónde vende {{M}} hoy?",
        "ty": "check",
        "o": [
          "WhatsApp",
          "Instagram",
          "TikTok",
          "Marketplaces",
          "Distribuidores",
          "Punto físico",
          "Todavía no vendemos"
        ],
        "r": 1
      },
      {
        "id": "q1_2",
        "l": "¿Cuántas ventas al mes hacen hoy y a qué ticket promedio?",
        "ty": "area",
        "h": "Ejemplo: 120 pedidos al mes, ticket promedio $95.000",
        "r": 1
      },
      {
        "id": "q1_3",
        "l": "¿Hace cuánto existe la marca y quién está detrás?",
        "ty": "area",
        "h": "¿Fabricación propia, maquila, importación o distribución de un tercero?",
        "r": 1
      },
      {
        "id": "q1_4",
        "l": "¿Quién toma la decisión final sobre la tienda?",
        "ty": "text",
        "h": "Nombre y cargo. ¿Hay socios que deban aprobar?",
        "r": 1
      },
      {
        "id": "q1_5",
        "l": "¿Habían tenido una tienda online antes?",
        "ty": "radio",
        "o": [
          "No, esta sería la primera",
          "Sí, en Shopify",
          "Sí, en otra plataforma"
        ],
        "r": 1
      },
      {
        "id": "q1_5b",
        "l": "¿Qué pasó con esa tienda?",
        "ty": "area",
        "when": {
          "f": "q1_5",
          "v": [
            "Sí, en Shopify",
            "Sí, en otra plataforma"
          ]
        },
        "r": 1
      },
      {
        "id": "q1_6",
        "l": "¿Cuál es la meta concreta de esta tienda a 90 días?",
        "ty": "area",
        "h": "En número de pedidos o en facturación. “Vender más” no nos sirve para diseñar.",
        "r": 1
      }
    ]
  },
  {
    "n": "2",
    "t": "Producto",
    "f": [
      {
        "id": "q2_1",
        "l": "¿Cuántas referencias (SKU) van a vender y cómo se llama cada una?",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q2_2",
        "l": "Detalle de cada referencia",
        "ty": "area",
        "h": "Presentación · contenido · duración si aplica · precio al público",
        "r": 1
      },
      {
        "id": "q2_3",
        "l": "¿Qué hace exactamente el producto?",
        "ty": "area",
        "h": "Beneficio principal y beneficios secundarios, en las palabras de la marca.",
        "r": 1
      },
      {
        "id": "q2_4",
        "l": "Composición, ingredientes o ficha técnica",
        "ty": "area",
        "h": "Puedes pegarla aquí o indicarnos que la envías como archivo.",
        "r": 1
      },
      {
        "id": "q2_5",
        "l": "¿Para quién es apto?",
        "ty": "check",
        "o": [
          "Veganos",
          "Celíacos / sin gluten",
          "Diabéticos / sin azúcar",
          "Embarazadas",
          "Menores de edad",
          "No aplica",
          "No sabemos"
        ]
      },
      {
        "id": "q2_5b",
        "l": "¿Qué contraindicaciones o advertencias tiene?",
        "ty": "area"
      },
      {
        "id": "q2_6",
        "l": "Modo de uso y tiempo estimado de resultados según la ficha técnica",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q2_7",
        "l": "¿Qué NO hace el producto?",
        "ty": "area",
        "h": "Ser claros aquí evita devoluciones y reclamos.",
        "r": 1
      }
    ]
  },
  {
    "n": "3",
    "t": "Legal y regulatorio",
    "soloSalud": 1,
    "note": "Bloque crítico. Sin esta información no podemos escribir los textos de venta.",
    "callout": {
      "tipo": "warn",
      "txt": "<strong>Por qué insistimos en esto:</strong> las promesas de adelgazamiento o de efecto terapéutico en alimentos y suplementos están restringidas por la normativa sanitaria colombiana, y Meta y TikTok prohíben en publicidad los antes y después, señalar el cuerpo de la persona y prometer pérdida de peso. Si la tienda se construye sobre afirmaciones que no se pueden respaldar, el riesgo es cuenta publicitaria bloqueada y sanción. Definimos juntos qué sí se puede decir."
    },
    "f": [
      {
        "id": "q3_1",
        "l": "¿Tienen registro o notificación sanitaria INVIMA?",
        "ty": "radio",
        "o": [
          "Sí, vigente",
          "En trámite",
          "No tenemos",
          "No sé"
        ],
        "r": 1
      },
      {
        "id": "q3_1b",
        "l": "Número de registro y fecha de vencimiento",
        "ty": "text",
        "when": {
          "f": "q3_1",
          "v": [
            "Sí, vigente",
            "En trámite"
          ]
        },
        "r": 1
      },
      {
        "id": "q3_2",
        "l": "¿A nombre de quién está el registro?",
        "ty": "radio",
        "o": [
          "De la marca",
          "Del maquilador o fabricante",
          "No sé"
        ],
        "when": {
          "f": "q3_1",
          "v": [
            "Sí, vigente",
            "En trámite"
          ]
        }
      },
      {
        "id": "q3_3",
        "l": "¿Cómo está clasificado el producto en ese registro?",
        "ty": "radio",
        "o": [
          "Alimento",
          "Suplemento dietario",
          "Producto fitoterapéutico",
          "No sé"
        ],
        "r": 1
      },
      {
        "id": "q3_3b",
        "l": "¿Qué afirmaciones autoriza el registro exactamente?",
        "ty": "area",
        "h": "Copia textual de lo aprobado, si lo tienes a la mano."
      },
      {
        "id": "q3_4",
        "l": "¿Tienen respaldo documental para cada beneficio que quieren publicar?",
        "ty": "radio",
        "o": [
          "Sí, estudios o fichas técnicas",
          "Solo testimonios de clientes",
          "No tenemos"
        ],
        "r": 1
      }
    ]
  },
  {
    "n": "4",
    "t": "Datos legales de la empresa",
    "f": [
      {
        "id": "q3_5",
        "l": "Datos para facturación y pie de página",
        "ty": "area",
        "h": "Razón social · NIT · dirección · ciudad · teléfono · correo de PQR",
        "r": 1
      },
      {
        "id": "q3_6",
        "l": "¿Tienen política de datos personales y política de devoluciones redactadas?",
        "ty": "radio",
        "o": [
          "Sí, las dos",
          "Solo una",
          "Ninguna, necesitamos ayuda"
        ],
        "r": 1
      },
      {
        "id": "q3_7",
        "l": "¿Emiten factura electrónica? ¿Con qué proveedor?",
        "ty": "text",
        "h": "Siigo, Alegra, World Office, otro."
      },
      {
        "id": "q3_8",
        "l": "¿La marca está registrada ante la SIC?",
        "ty": "radio",
        "o": [
          "Sí",
          "En trámite",
          "No",
          "No sé"
        ]
      }
    ]
  },
  {
    "n": "5",
    "t": "Cliente objetivo y mensaje",
    "f": [
      {
        "id": "q4_1",
        "l": "¿Quién compra hoy?",
        "ty": "area",
        "h": "Edad, género, ciudad y ocupación.",
        "r": 1
      },
      {
        "id": "q4_2",
        "l": "¿Qué problema real quiere resolver esa persona cuando compra?",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q4_3",
        "l": "¿Qué ha intentado antes y no le funcionó?",
        "ty": "area"
      },
      {
        "id": "q4_4",
        "l": "Las cinco objeciones que más escuchan antes de que compren",
        "ty": "area",
        "h": "Una por línea.",
        "r": 1
      },
      {
        "id": "q4_5",
        "l": "¿Qué preguntas repiten siempre los clientes?",
        "ty": "area",
        "h": "Esto se convierte en las preguntas frecuentes de la tienda.",
        "r": 1
      },
      {
        "id": "q4_6",
        "l": "¿Tienen testimonios reales con autorización de uso?",
        "ty": "radio",
        "o": [
          "Sí, en texto",
          "Sí, en video",
          "Sí, texto y video",
          "No tenemos"
        ],
        "r": 1
      },
      {
        "id": "q4_6b",
        "l": "¿Cuántos y de qué tipo?",
        "ty": "text",
        "when": {
          "f": "q4_6",
          "v": [
            "Sí, en texto",
            "Sí, en video",
            "Sí, texto y video"
          ]
        }
      }
    ]
  },
  {
    "n": "6",
    "t": "Competencia y referentes",
    "f": [
      {
        "id": "q5_1",
        "l": "Tres competidores directos con su sitio web",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q5_2",
        "l": "Tres tiendas online que les gusten y por qué",
        "ty": "area",
        "h": "De cualquier categoría. Lo importante es qué les gusta de cada una: colores, orden, fotos, forma de explicar.",
        "r": 1
      },
      {
        "id": "q5_3",
        "l": "¿Qué hace la competencia mejor que ustedes hoy?",
        "ty": "area"
      },
      {
        "id": "q5_4",
        "l": "¿En qué se quiere diferenciar la marca?",
        "ty": "check",
        "o": [
          "Precio",
          "Formulación o calidad",
          "Resultados",
          "Servicio",
          "Comunidad",
          "Experiencia de producto",
          "Origen natural"
        ],
        "r": 1
      }
    ]
  },
  {
    "n": "7",
    "t": "Marca y activos gráficos",
    "note": "Sin material fotográfico profesional, la tienda no se ve profesional. Es la primera brecha a cerrar.",
    "f": [
      {
        "id": "q6_1",
        "l": "¿Tienen el logo en archivo vectorial (.AI, .SVG o .EPS)?",
        "ty": "radio",
        "o": [
          "Sí, vectorial",
          "Solo en imagen (JPG/PNG)",
          "No tenemos logo"
        ],
        "r": 1
      },
      {
        "id": "q6_2",
        "l": "¿Tienen manual de marca con colores y tipografías?",
        "ty": "radio",
        "o": [
          "Sí, completo",
          "Solo colores",
          "No existe, hay que desarrollarlo"
        ],
        "r": 1
      },
      {
        "id": "q6_3",
        "l": "¿Cuántas fotos de producto en alta resolución tienen?",
        "ty": "text",
        "h": "Y díganos si son de fondo blanco, de estilo de vida, o ambas.",
        "r": 1
      },
      {
        "id": "q6_1c",
        "l": "Logo: subilo acá o pegá el link",
        "ty": "archivo",
        "h": "Si tenés el vectorial (.AI, .SVG, .EPS) mejor. También sirve un link de Drive o Dropbox con la carpeta.",
        "ph": "https://drive.google.com/...",
        "when": { "f": "q6_1", "v": ["Sí, vectorial", "Solo en imagen (JPG/PNG)"] }
      },
      {
        "id": "q6_2c",
        "l": "Manual de marca, colores o tipografías",
        "ty": "archivo",
        "h": "PDF, imagen o link. Si no hay manual, sirve una captura con los colores que usan.",
        "ph": "https://drive.google.com/...",
        "when": { "f": "q6_2", "v": ["Sí, completo", "Solo colores"] }
      },
      {
        "id": "q6_3c",
        "l": "Fotos de producto",
        "ty": "archivo",
        "h": "Pegá el link de la carpeta con las fotos en alta, o subí una de muestra.",
        "ph": "https://drive.google.com/..."
      },
      {
        "id": "q6_4",
        "l": "¿Tienen video de producto o contenido de clientes?",
        "ty": "area"
      },
      {
        "id": "q6_5",
        "l": "¿Tienen fotos del equipo, la planta o el proceso de fabricación?",
        "ty": "radio",
        "o": [
          "Sí",
          "No",
          "Podemos conseguirlas"
        ]
      },
      {
        "id": "q6_5b",
        "l": "Fotos del equipo, la planta o el proceso",
        "ty": "archivo",
        "h": "Subí una o pegá el link de la carpeta.",
        "ph": "https://drive.google.com/...",
        "when": { "f": "q6_5", "v": ["Sí"] }
      },
      {
        "id": "q6_6",
        "l": "Mockups de empaque, render 3D o packaging fotografiado",
        "ty": "archivo",
        "h": "Si existe, subilo o pegá el link. Si no hay nada todavía, dejalo vacío.",
        "ph": "https://drive.google.com/..."
      }
    ]
  },
  {
    "n": "8",
    "t": "Oferta, precios y estructura de venta",
    "f": [
      {
        "id": "q7_1",
        "l": "Precio de venta unitario y costo real por unidad",
        "ty": "area",
        "h": "Incluyendo empaque y envío. Este dato define si el negocio aguanta pauta.",
        "r": 1
      },
      {
        "id": "q7_2",
        "l": "¿Van a manejar packs?",
        "ty": "area",
        "h": "Por ejemplo x1, x2, x3 o tratamientos de 30, 60 y 90 días. Indiquen el descuento de cada uno.",
        "r": 1
      },
      {
        "id": "q7_3",
        "l": "¿Hay precio ancla o precio tachado que se pueda sustentar honestamente?",
        "ty": "area"
      },
      {
        "id": "q7_4",
        "l": "¿Envío gratis desde qué monto y quién asume ese costo?",
        "ty": "text",
        "r": 1
      },
      {
        "id": "q7_5",
        "l": "¿Quieren manejar suscripción con entrega recurrente?",
        "ty": "radio",
        "o": [
          "Sí, nos interesa",
          "No por ahora",
          "Queremos que nos asesoren"
        ],
        "r": 1
      },
      {
        "id": "q7_6",
        "l": "¿Qué productos o servicios pueden funcionar como complemento en el carrito?",
        "ty": "area"
      },
      {
        "id": "q7_7",
        "l": "¿Manejan cupones, referidos o programa de puntos?",
        "ty": "check",
        "o": [
          "Cupones",
          "Referidos",
          "Puntos o fidelización",
          "Ninguno"
        ]
      },
      {
        "id": "q7_8",
        "l": "¿Venden al por mayor o a distribuidores?",
        "ty": "radio",
        "o": [
          "Sí, y necesitamos precios diferenciados",
          "Sí, pero por fuera de la tienda",
          "No"
        ],
        "r": 1
      }
    ]
  },
  {
    "n": "9",
    "t": "Operación y logística",
    "f": [
      {
        "id": "q8_1",
        "l": "¿Dónde está el inventario y quién empaca los pedidos?",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q8_2",
        "l": "Unidades disponibles hoy y tiempo de reposición del proveedor",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q8_3",
        "l": "¿A qué ciudades y países envían?",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q8_4",
        "l": "¿Con qué transportadora trabajan?",
        "ty": "check",
        "o": [
          "Coordinadora",
          "Servientrega",
          "Interrapidísimo",
          "Envía",
          "Domicilio propio",
          "Ninguna todavía"
        ],
        "r": 1
      },
      {
        "id": "q8_4b",
        "l": "¿Tienen cuenta corporativa con esa transportadora?",
        "ty": "radio",
        "o": [
          "Sí",
          "No",
          "En trámite"
        ]
      },
      {
        "id": "q8_5",
        "l": "Tiempos de entrega reales y tarifas de envío por zona",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q8_6",
        "l": "¿Cómo van a vender?",
        "ty": "radio",
        "o": [
          "Solo prepago",
          "Solo contraentrega",
          "Ambos"
        ],
        "r": 1
      },
      {
        "id": "q8_6b",
        "l": "¿Qué proporción es contraentrega hoy?",
        "ty": "text",
        "h": "Ejemplo: 70% contraentrega, 30% prepago.",
        "when": {
          "f": "q8_6",
          "v": [
            "Solo contraentrega",
            "Ambos"
          ]
        }
      },
      {
        "id": "q8_7",
        "l": "¿Quién atiende el WhatsApp, en qué horario y con cuántas personas?",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q8_8",
        "l": "¿Qué hacen hoy con las devoluciones y los pedidos rechazados?",
        "ty": "area"
      }
    ]
  },
  {
    "n": "10",
    "t": "Pagos",
    "f": [
      {
        "id": "q9_1",
        "l": "¿Tienen pasarela de pago activa?",
        "ty": "radio",
        "o": [
          "Wompi",
          "Bold",
          "Mercado Pago",
          "ePayco",
          "Ninguna todavía"
        ],
        "r": 1
      },
      {
        "id": "q9_2",
        "l": "¿Tienen cuenta bancaria empresarial a nombre de la razón social?",
        "ty": "radio",
        "o": [
          "Sí",
          "No, es cuenta personal",
          "En trámite"
        ],
        "r": 1
      },
      {
        "id": "q9_3",
        "l": "¿Qué medios de pago quieren habilitar?",
        "ty": "check",
        "o": [
          "Tarjeta débito y crédito",
          "PSE",
          "Nequi",
          "Daviplata",
          "Contraentrega",
          "Transferencia"
        ],
        "r": 1
      },
      {
        "id": "q9_4",
        "l": "¿Quién queda como titular y administrador de la pasarela?",
        "ty": "text",
        "r": 1
      }
    ]
  },
  {
    "n": "11",
    "t": "Tecnología, dominios y accesos",
    "callout": {
      "tipo": "info",
      "txt": "<strong>Regla del proyecto:</strong> todas las cuentas quedan a nombre de la marca, con nosotros como colaboradores. Nunca al revés. Así ustedes siempre son dueños de sus activos digitales."
    },
    "f": [
      {
        "id": "q10_1",
        "l": "¿El dominio ya está comprado?",
        "ty": "radio",
        "o": [
          "Sí, y tenemos los accesos",
          "Sí, pero no sabemos quién lo tiene",
          "No, hay que comprarlo"
        ],
        "r": 1
      },
      {
        "id": "q10_1b",
        "l": "¿Cuál es el dominio y en qué proveedor está?",
        "ty": "text",
        "h": "GoDaddy, Hostinger, Namecheap, otro.",
        "when": {
          "f": "q10_1",
          "v": [
            "Sí, y tenemos los accesos",
            "Sí, pero no sabemos quién lo tiene"
          ]
        },
        "r": 1
      },
      {
        "id": "q10_2",
        "l": "¿Tienen correo corporativo con ese dominio?",
        "ty": "radio",
        "o": [
          "Sí",
          "No"
        ]
      },
      {
        "id": "q10_3",
        "l": "¿Ya existe una cuenta de Shopify?",
        "ty": "radio",
        "o": [
          "Sí, activa",
          "Sí, pero inactiva",
          "No"
        ],
        "r": 1
      },
      {
        "id": "q10_4",
        "l": "¿Qué tienen configurado en Meta?",
        "ty": "check",
        "o": [
          "Business Manager",
          "Píxel instalado",
          "Cuenta publicitaria",
          "Catálogo",
          "Nada todavía"
        ],
        "r": 1
      },
      {
        "id": "q10_5",
        "l": "¿Qué otras herramientas tienen?",
        "ty": "check",
        "o": [
          "TikTok Business",
          "Google Analytics 4",
          "Google Search Console",
          "Ninguna"
        ]
      },
      {
        "id": "q10_6",
        "l": "¿Usan alguna herramienta de email o WhatsApp marketing?",
        "ty": "text",
        "h": "Klaviyo, Mailchimp, Pancake, ManyChat, otra."
      },
      {
        "id": "q10_7",
        "l": "¿Hay software administrativo o de inventario con el que la tienda deba integrarse?",
        "ty": "text"
      }
    ]
  },
  {
    "n": "12",
    "t": "Contenido y posicionamiento",
    "f": [
      {
        "id": "q11_1",
        "l": "¿Quién escribe los textos de la tienda?",
        "ty": "radio",
        "o": [
          "Los escribimos nosotros",
          "Preferimos que ustedes los escriban",
          "Los hacemos juntos"
        ],
        "r": 1
      },
      {
        "id": "q11_2",
        "l": "Historia de la marca: ¿quién la fundó y por qué?",
        "ty": "area",
        "h": "Esta historia es de las cosas que más venden en una página de marca.",
        "r": 1
      },
      {
        "id": "q11_3",
        "l": "¿Quieren blog para posicionamiento orgánico?",
        "ty": "radio",
        "o": [
          "Sí",
          "No",
          "Más adelante"
        ]
      },
      {
        "id": "q11_4",
        "l": "¿En qué búsquedas les gustaría aparecer en Google?",
        "ty": "area"
      },
      {
        "id": "q11_5",
        "l": "¿Qué contenido de redes se puede reutilizar en la web?",
        "ty": "area"
      }
    ]
  },
  {
    "n": "13",
    "t": "Post-venta y recompra",
    "f": [
      {
        "id": "q12_1",
        "l": "¿Qué pasa hoy después de que alguien compra?",
        "ty": "area",
        "r": 1
      },
      {
        "id": "q12_2",
        "l": "¿Cuántos clientes recompran y a los cuántos días?",
        "ty": "text",
        "r": 1
      },
      {
        "id": "q12_3",
        "l": "¿Qué quieren automatizar?",
        "ty": "check",
        "o": [
          "Carrito abandonado",
          "Confirmación de pedido",
          "Recordatorio de recompra",
          "Solicitud de reseña",
          "Todo lo anterior"
        ],
        "r": 1
      },
      {
        "id": "q12_4",
        "l": "¿Piden reseñas a los clientes hoy? ¿Con qué herramienta?",
        "ty": "text"
      }
    ]
  },
  {
    "n": "14",
    "t": "Tráfico y crecimiento",
    "f": [
      {
        "id": "q13_1",
        "l": "¿Quién va a pautar cuando la tienda esté lista?",
        "ty": "radio",
        "o": [
          "Equipo interno",
          "Una agencia externa",
          "Nadie todavía",
          "Queremos que ustedes lo hagan"
        ],
        "r": 1
      },
      {
        "id": "q13_2",
        "l": "Presupuesto mensual de pauta previsto",
        "ty": "text",
        "r": 1
      },
      {
        "id": "q13_3",
        "l": "¿Para qué es la tienda principalmente?",
        "ty": "radio",
        "o": [
          "Venta directa al consumidor",
          "Soportar la pauta",
          "Respaldo para distribuidores",
          "Todas las anteriores"
        ],
        "r": 1
      },
      {
        "id": "q13_4",
        "l": "¿Hay influenciadores o creadores trabajando con la marca hoy?",
        "ty": "area"
      }
    ]
  },
  {
    "n": "15",
    "t": "Activos que debe entregar la marca",
    "note": "El cronograma del proyecto arranca el día que esté completa esta lista. Marca lo que ya tienes listo para enviar.",
    "f": [
      {
        "id": "q14",
        "l": "Material disponible hoy",
        "ty": "check",
        "r": 1,
        "o": [
          "Logo vectorial (.AI o .SVG)",
          "Manual de marca o colores y tipografías",
          "Fotos de producto en alta",
          "Video y contenido de clientes",
          "Registro sanitario o permisos",
          "Ficha técnica e ingredientes",
          "Datos legales de la empresa",
          "Lista de precios y costos",
          "Tarifas y tiempos de envío por zona",
          "Testimonios con autorización",
          "Accesos de dominio, correo y redes",
          "Pasarela de pago aprobada"
        ]
      },
      {
        "id": "q14_b",
        "l": "¿Para qué fecha pueden entregar lo que falta?",
        "ty": "text",
        "r": 1
      }
    ]
  },
  {
    "n": "16",
    "t": "Expectativas del proyecto",
    "f": [
      {
        "id": "q15_1",
        "l": "¿Qué es para ustedes una tienda “bien hecha”?",
        "ty": "area",
        "h": "Ayuda a que no discutamos gustos después.",
        "r": 1
      },
      {
        "id": "q15_2",
        "l": "¿Hay algo que definitivamente NO quieren en la tienda?",
        "ty": "area"
      },
      {
        "id": "q15_3",
        "l": "¿Quién administrará la tienda después de la entrega?",
        "ty": "radio",
        "o": [
          "Alguien del equipo interno",
          "Queremos plan de soporte mensual",
          "Todavía no lo decidimos"
        ],
        "r": 1
      }
    ]
  },
  {
    "n": "17",
    "t": "Cierre comercial",
    "f": [
      {
        "id": "q16_1",
        "l": "Presupuesto asignado para el desarrollo de la tienda",
        "ty": "text",
        "r": 1
      },
      {
        "id": "q16_2",
        "l": "¿Hay fecha de lanzamiento o campaña ya comprometida?",
        "ty": "text",
        "r": 1
      },
      {
        "id": "q16_3",
        "l": "¿Quién será la contraparte del día a día y por qué canal se coordina?",
        "ty": "text",
        "r": 1
      },
      {
        "id": "q16_4",
        "l": "¿Algo más que debamos saber antes de empezar?",
        "ty": "area"
      }
    ]
  }
];
