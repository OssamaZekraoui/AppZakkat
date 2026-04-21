// Shared in-memory store for development
// In production, replace with Prisma queries

const globalForStore = globalThis as unknown as {
  requestsStore: Record<string, unknown> | undefined;
  requestCount: number;
};

export function getRequestsStore(): Record<string, unknown> {
  if (!globalForStore.requestsStore) {
    globalForStore.requestsStore = {};
  }
  return globalForStore.requestsStore;
}

export function getNextRequestCount(): number {
  if (!globalForStore.requestCount) {
    globalForStore.requestCount = 0;
  }
  globalForStore.requestCount++;
  return globalForStore.requestCount;
}

export function generateReferenceCode(): string {
  const count = getNextRequestCount();
  const year = new Date().getFullYear();
  return `DY-${year}-${String(count).padStart(4, "0")}`;
}
