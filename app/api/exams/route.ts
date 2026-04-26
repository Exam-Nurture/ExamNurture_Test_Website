/**
 * GET /api/exams
 *
 * Query params:
 *   ?board=<boardId>        — filter to a single board
 *   ?tier=<1|2|3>           — return only boards accessible at this tier (cumulative)
 *   ?hasTests=true          — only exams with test series
 *   ?hasPYQ=true            — only exams with PYQ papers
 *   ?hasGuide=true          — only exams with a guide
 *
 * Replace the static import with real DB queries when the backend is ready.
 * The response shape (ExamBoard[]) must stay the same — it's the DTO contract.
 */

import { NextRequest, NextResponse } from "next/server";
import { EXAM_BOARDS, getBoardsForTier, type TierLevel } from "@/lib/data/examData";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const boardId  = searchParams.get("board");
  const tierStr  = searchParams.get("tier");
  const hasTests = searchParams.get("hasTests") === "true";
  const hasPYQ   = searchParams.get("hasPYQ")   === "true";
  const hasGuide = searchParams.get("hasGuide")  === "true";

  let boards = tierStr
    ? getBoardsForTier(parseInt(tierStr) as TierLevel)
    : EXAM_BOARDS;

  if (boardId) {
    boards = boards.filter((b) => b.id === boardId);
  }

  // Filter exams within boards if content-type filters are set
  if (hasTests || hasPYQ || hasGuide) {
    boards = boards
      .map((board) => ({
        ...board,
        exams: board.exams.filter((e) =>
          (!hasTests || e.hasTests) &&
          (!hasPYQ   || e.hasPYQ)   &&
          (!hasGuide || e.hasGuide),
        ),
      }))
      .filter((board) => board.exams.length > 0);
  }

  return NextResponse.json(boards);
}
