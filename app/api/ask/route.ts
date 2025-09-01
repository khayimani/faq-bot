import { NextResponse } from "next/server";
import { faqs } from '@/data/faqs';

function findBestAnswer(query: string) {
  const q = query.toLowerCase();
  const match = faqs.find(f => q.includes(f.q.split(" ")[0].toLowerCase())); // naive
  return match ? match.a : "Sorry, I don’t know that one yet.";
}

export async function POST(req: Request) {
  const { question } = await req.json();
  const answer = findBestAnswer(question);
  return NextResponse.json({ answer });
}
