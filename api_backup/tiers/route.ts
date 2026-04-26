/**
 * GET /api/tiers
 *
 * Returns all subscription tier definitions including their
 * inclusive board/exam mappings. Used by the /plans page
 * and anywhere that needs tier details.
 *
 * Query params:
 *   ?id=<1|2|3>   — return only that specific tier
 *   ?withBoards=true — embed full ExamBoard objects (not just IDs)
 */

import { NextRequest, NextResponse } from "next/server";
import { TIERS, EXAM_BOARDS, type TierLevel } from "@/lib/data/examData";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const idStr      = searchParams.get("id");
  const withBoards = searchParams.get("withBoards") === "true";

  let tiers = idStr
    ? TIERS.filter((t) => t.id === parseInt(idStr))
    : TIERS;

  if (withBoards) {
    // Embed full board + exam objects so the client doesn't need a second fetch
    const tiersWithBoards = tiers.map((tier) => ({
      ...tier,
      exclusiveBoards: EXAM_BOARDS.filter((b) =>
        tier.exclusiveBoardIds.includes(b.id)
      ),
      allBoards: EXAM_BOARDS.filter((b) =>
        tier.allBoardIds.includes(b.id)
      ),
    }));
    return NextResponse.json(tiersWithBoards);
  }

  return NextResponse.json(tiers);
}
