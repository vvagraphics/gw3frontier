import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const episodeId = searchParams.get("id") || "ep-01";

  try {
    // Look inside your public directory for the specific episode config file
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