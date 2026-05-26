"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { createSupabaseServiceRole } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity-logger";

const VALID_STAGES = [
  "nuevo",
  "contactado",
  "nutriendo",
  "calificado",
  "convertido",
  "descartado",
] as const;

type Result = { ok: true } | { ok: false; error: string };

export async function updateLeadStage({
  id,
  stage,
}: {
  id: string;
  stage: string;
}): Promise<Result> {
  const user = await requireAuth();
  if (!VALID_STAGES.includes(stage as (typeof VALID_STAGES)[number])) {
    return { ok: false, error: "Estado inválido" };
  }

  const supabase = createSupabaseServiceRole();
  const { error } = await supabase
    .from("ac_leads")
    .update({ stage })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  await logActivity({
    action: "lead_stage_changed",
    resourceType: "ac_leads",
    resourceId: id,
    metadata: { stage, by: user.email },
    userId: user.id,
  });

  revalidatePath("/admin/leads");
  return { ok: true };
}
