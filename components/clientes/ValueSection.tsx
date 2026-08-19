'use client';

import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ValueSectionProps {
  queOfrece: string;
  promesaRealista: string;
  precioInversion: string;
  formatoEntrega: string;
  garantia: string;
  noPromete: string;
  resultadosClientes: string;
  onUpdate: (field: string, value: unknown) => void;
}

export function ValueSection({
  queOfrece,
  promesaRealista,
  precioInversion,
  formatoEntrega,
  garantia,
  noPromete,
  resultadosClientes,
  onUpdate,
}: ValueSectionProps) {
  return (
    <div className="space-y-6">
      {/* Qué ofreces */}
      <div className="field-group">
        <Label htmlFor="queOfrece" className="label-text">
          ¿Qué ofreces? *
        </Label>
        <p className="helper-text">
          Describe tu oferta principal con detalle: qué incluye, cómo funciona, qué entrega.
        </p>
        <Textarea
          id="queOfrece"
          className="mt-2 min-h-[100px]"
          value={queOfrece}
          onChange={(e) => onUpdate('queOfrece', e.target.value)}
          placeholder="Programa de 8 semanas en el que enseño a freelancers a atraer clientes premium con contenido en LinkedIn. Incluye: sesiones 1:1 semanales, comunidad privada, plantillas y revisiones..."
        />
      </div>

      {/* Promesa realista */}
      <div className="field-group">
        <Label htmlFor="promesaRealista" className="label-text">
          Promesa realista *
        </Label>
        <p className="helper-text">El resultado concreto y alcanzable que puedes comprometer.</p>
        <Textarea
          id="promesaRealista"
          className="mt-2 min-h-[80px]"
          value={promesaRealista}
          onChange={(e) => onUpdate('promesaRealista', e.target.value)}
          placeholder='"En 90 días tendrás un sistema de contenido que atrae al menos 2 clientes nuevos por mes sin pagar ads"'
        />
      </div>

      {/* Grid: precio + formato */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="field-group">
          <Label htmlFor="precioInversion" className="label-text">
            Precio / Inversión *
          </Label>
          <p className="helper-text">Rango o precio fijo de tu oferta.</p>
          <Input
            id="precioInversion"
            className="mt-2"
            value={precioInversion}
            onChange={(e) => onUpdate('precioInversion', e.target.value)}
            placeholder="Ej: Desde $497 USD / $97/mes"
          />
        </div>

        <div className="field-group">
          <Label htmlFor="garantia" className="label-text">
            Garantía{' '}
            <span className="font-normal text-gray-600">(opcional)</span>
          </Label>
          <p className="helper-text">¿Ofreces garantía de devolución?</p>
          <Input
            id="garantia"
            className="mt-2"
            value={garantia}
            onChange={(e) => onUpdate('garantia', e.target.value)}
            placeholder='"30 días de devolución sin preguntas"'
          />
        </div>
      </div>

      {/* Formato de entrega */}
      <div className="field-group">
        <Label htmlFor="formatoEntrega" className="label-text">
          Formato de entrega *
        </Label>
        <p className="helper-text">Cómo se entrega el producto o servicio.</p>
        <Textarea
          id="formatoEntrega"
          className="mt-2 min-h-[80px]"
          value={formatoEntrega}
          onChange={(e) => onUpdate('formatoEntrega', e.target.value)}
          placeholder="Programa 1:1 de 8 semanas por Zoom / Plataforma online 24/7 / Servicio mensual con reunión semanal..."
        />
      </div>

      {/* Qué NO prometes */}
      <div className="field-group">
        <Label htmlFor="noPromete" className="label-text">
          ¿Qué NO prometes? *
        </Label>
        <p className="helper-text">Construye credibilidad y filtra clientes incorrectos.</p>
        <Textarea
          id="noPromete"
          className="mt-2 min-h-[80px]"
          value={noPromete}
          onChange={(e) => onUpdate('noPromete', e.target.value)}
          placeholder='"No prometemos resultados de la noche a la mañana. Requiere trabajo consistente durante 3+ meses."'
        />
      </div>

      {/* Resultados reales */}
      <div className="field-group">
        <Label htmlFor="resultadosClientes" className="label-text">
          Resultados reales con clientes{' '}
          <span className="font-normal text-gray-600">(opcional)</span>
        </Label>
        <p className="helper-text">
          Ejemplos concretos. Si no tienes clientes aún, describe el resultado esperado en tu primer caso.
        </p>
        <Textarea
          id="resultadosClientes"
          className="mt-2 min-h-[100px]"
          value={resultadosClientes}
          onChange={(e) => onUpdate('resultadosClientes', e.target.value)}
          placeholder={`"Juan (35, vendedor) pasó de 0 a $4k/mes en 60 días.\nAna cerró su primera venta enterprise en semana 3 del programa."`}
        />
      </div>
    </div>
  );
}

