import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Changed fallback from 'ep-01' to 'frontier-01'
  const episodeId = searchParams.get("id") || "frontier-01";

  try {
    const filePath = path.join(process.cwd(), "public", "transcripts", `${episodeId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `Archive target ${episodeId} not found.` }, { status: 404 });
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(fileData);

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: "Internal System Failure reading archive data." }, { status: 500 });
  }
}