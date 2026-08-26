/**
 * Utilidades para leer el Google Sheet financiero.
 *
 * El export CSV de Google entrecomilla cualquier celda con comas, comillas o
 * saltos de linea, asi que un split por coma no alcanza.
 */

/** Parser CSV minimo: comillas dobles, comillas escapadas y saltos internos. */
export function parsearCSV(texto: string): string[][] {
  if (!texto) return [];

  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = "";
  let enComillas = false;

  const normalizado = texto.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < normalizado.length; i++) {
    const c = normalizado[i];

    if (enComillas) {
      if (c === '"') {
        if (normalizado[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          enComillas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') {
      enComillas = true;
    } else if (c === ",") {
      fila.push(campo);
      campo = "";
    } else if (c === "\n") {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = "";
    } else {
      campo += c;
    }
  }

  if (campo !== "" || fila.length > 0) {
    fila.push(campo);
    filas.push(fila);
  }

  return filas;
}

/** Contenido recortado de una celda, o cadena vacia si no existe. */
export function celda(fila: string[], indice: number): string {
  return (fila[indice] ?? "").trim();
}

/**
 * El Sheet escribe las fechas como 21/7/2026. La base las quiere ISO.
 * Cualquier cosa que no sea una fecha real devuelve null.
 */
export function normalizarFecha(valor: string | undefined | null): string | null {
  const texto = (valor ?? "").trim();
  if (!texto) return null;

  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return esFechaReal(Number(iso[1]), Number(iso[2]), Number(iso[3])) ? texto : null;
  }

  const latino = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!latino) return null;

  const dia = Number(latino[1]);
  const mes = Number(latino[2]);
  const anio = Number(latino[3]);
  if (!esFechaReal(anio, mes, dia)) return null;

  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function esFechaReal(anio: number, mes: number, dia: number): boolean {
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return false;
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

/**
 * Los montos vienen como $655,601 y los negativos entre parentesis, que es
 * como Excel muestra la contabilidad. El guion solo significa "vacio".
 */
export function limpiarMoneda(valor: string | undefined | null): number | null {
  const texto = (valor ?? "").trim();
  if (!texto || texto === "-" || texto === "—") return null;

  const negativo = texto.startsWith("(") && texto.endsWith(")");
  const soloNumero = texto.replace(/[()$\s]/g, "").replace(/,/g, "");
  if (!soloNumero) return null;

  const numero = Number(soloNumero);
  if (!Number.isFinite(numero)) return null;

  return negativo ? -numero : numero;
}

/** 33.3% devuelve 33.3. */
export function limpiarPorcentaje(valor: string | undefined | null): number | null {
  const texto = (valor ?? "").trim().replace("%", "");
  if (!texto) return null;
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : null;
}
