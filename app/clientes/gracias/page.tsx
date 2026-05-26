'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';

export default function GraciasClientesPage() {
  const [result, setResult] = useState<{ fileId?: string; fileName?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('submit_result');
      if (stored) {
        setResult(JSON.parse(stored));
        sessionStorage.removeItem('submit_result');
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-yellow-400" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            ¡Tu marca está tomando forma!
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Tu ADN de marca fue generado y guardado correctamente.
            En las próximas horas recibirás el documento final con toda tu estrategia.
          </p>
        </div>

        {result?.fileName && (
          <div className="p-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5 text-sm text-yellow-300">
            <p className="font-medium mb-1">Archivo generado:</p>
            <p className="font-mono text-xs text-yellow-400/70 break-all">{result.fileName}</p>
          </div>
        )}

        <div className="text-left space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">Próximos pasos</p>
          {[
            'Revisa tu correo en las próximas 24 horas',
            'Alexander analizará tu información personalmente',
            'Recibirás tu estrategia de marca personalizada',
          ].map((paso, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-gray-300 text-sm">{paso}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <Link
            href="/recursos"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 transition-all text-sm font-semibold"
          >
            <Download className="w-4 h-4" />
            Ver recursos gratuitos
          </Link>
        </div>
      </div>
    </div>
  );
}
