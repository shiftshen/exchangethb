import { NextResponse } from 'next/server';

export function createTraceId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ok<T>(data: T, traceId = createTraceId()) {
  return NextResponse.json({ ok: true, traceId, data });
}

export function fail(error: string, status: number, traceId = createTraceId(), detail?: unknown) {
  return NextResponse.json({ ok: false, traceId, error, detail }, { status });
}
