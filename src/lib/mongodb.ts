import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "booknook";

const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 150;

type MongoStore = { client: MongoClient | undefined };

const globalStore = globalThis as typeof globalThis & {
  __booknookMongoStore?: MongoStore;
};

function store(): MongoStore {
  globalStore.__booknookMongoStore ??= { client: undefined };
  return globalStore.__booknookMongoStore;
}

function createClient(): MongoClient {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  return new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 7500,
    connectTimeoutMS: 10000,
  });
}

type TopologyInternals = {
  isConnected?: () => boolean;
  isDestroyed?: () => boolean;
};

type ClientInternals = {
  s?: { hasBeenClosed?: boolean };
  topology?: TopologyInternals | null;
  connectionLock?: Promise<unknown> | null;
};

/**
 * A client is unusable once it has been closed by us or its topology was
 * destroyed (e.g. a failed initial connect closes the topology permanently and
 * every later operation throws `MongoTopologyClosedError: Topology is closed`).
 */
function isClientUsable(client: MongoClient): boolean {
  const internals = client as unknown as ClientInternals;
  if (internals.s?.hasBeenClosed) return false;
  const topology = internals.topology;
  if (!topology) return true;
  if (internals.connectionLock) return true;
  try {
    if (topology.isConnected?.()) return true;
    if (topology.isDestroyed?.()) return false;
    return true;
  } catch {
    return true;
  }
}

function getMongoClient(): MongoClient {
  const cached = store().client;
  if (cached && isClientUsable(cached)) return cached;
  if (cached) closeClient(cached);
  const client = createClient();
  store().client = client;
  return client;
}

function closeClient(client: MongoClient): void {
  try {
    void client.close().catch(() => undefined);
  } catch {
    // best effort: the cached reference is dropped either way
  }
}

/**
 * Drops the cached client so the next operation transparently starts from a
 * fresh connection. Safe to call repeatedly and from concurrent requests.
 */
export function resetMongoClient(): void {
  const cached = store().client;
  store().client = undefined;
  if (cached) closeClient(cached);
}

function createLiveProxy<T extends object>(resolve: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const live = resolve();
      const value = Reflect.get(live, property);
      if (typeof value === "function") {
        return function (this: unknown, ...args: unknown[]) {
          return value.apply(live, args);
        };
      }
      return value;
    },
    set(_target, property, value) {
      return Reflect.set(resolve(), property, value);
    },
    has(_target, property) {
      return Reflect.has(resolve(), property);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(resolve());
    },
  });
}

/**
 * Stable proxies handed to the BetterAuth MongoDB adapter. Every property
 * access resolves the current client, so a closed or poisoned connection is
 * replaced transparently instead of throwing `Topology is closed`.
 */
export const mongoDbProxy = createLiveProxy<Db>(() =>
  getMongoClient().db(DB_NAME),
);

export const mongoClientProxy = createLiveProxy<MongoClient>(() =>
  getMongoClient(),
);

const TRANSIENT_ERROR_NAMES = new Set([
  "MongoTopologyClosedError",
  "MongoServerSelectionError",
  "MongoNetworkError",
  "MongoNetworkTimeoutError",
  "MongoClientDisconnectedError",
  "MongoClientClosedError",
  "MongoSocketClosedError",
  "MongoNotConnectedError",
  "MongoWaitQueueTimeoutError",
  "MongoOperationTimeoutError",
  "MongoServerClosedError",
]);

const TRANSIENT_SERVER_CODES = new Set([
  6, 7, 89, 91, 189, 262, 9001, 10107, 11600, 11602, 13435, 13436,
]);

const TRANSIENT_MESSAGE_PATTERNS = [
  "topology is closed",
  "server selection timed out",
  "server selection failed",
  "connection is closed",
  "connection timed out",
  "client is disconnected",
  "client must be connected",
  "pool was destroyed",
  "socket closed",
  "network error",
  "econnreset",
  "econnrefused",
  "etimedout",
  "enotfound",
  "socket hang up",
];

type ErrorLike = {
  name?: unknown;
  message?: unknown;
  code?: unknown;
  statusCode?: unknown;
  body?: { code?: unknown };
  cause?: unknown;
};

/**
 * Detects transient connection/topology failures, including the
 * `FAILED_TO_GET_SESSION` error BetterAuth raises when a session lookup hits a
 * dead MongoDB connection (walking the `cause` chain it wraps).
 */
export function isTransientMongoError(error: unknown, depth = 0): boolean {
  if (typeof error !== "object" || error === null || depth > 5) return false;
  const err = error as ErrorLike;
  const name = typeof err.name === "string" ? err.name : "";
  if (TRANSIENT_ERROR_NAMES.has(name)) return true;
  if (typeof err.statusCode === "number" && err.statusCode >= 500) return true;
  if (err.body?.code === "FAILED_TO_GET_SESSION") return true;
  if (typeof err.code === "number" && TRANSIENT_SERVER_CODES.has(err.code)) {
    return true;
  }
  const message = typeof err.message === "string" ? err.message.toLowerCase() : "";
  if (TRANSIENT_MESSAGE_PATTERNS.some((pattern) => message.includes(pattern))) {
    return true;
  }
  if (err.cause !== undefined && err.cause !== null) {
    return isTransientMongoError(err.cause, depth + 1);
  }
  return false;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs `operation`, and on a transient connection failure resets the cached
 * client and retries with a fresh connection before giving up.
 */
export async function withMongoRetry<T>(
  operation: () => Promise<T>,
  attempts = MAX_ATTEMPTS,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransientMongoError(error) || attempt === attempts - 1) {
        throw error;
      }
      resetMongoClient();
      await sleep(RETRY_BASE_DELAY_MS * (attempt + 1));
    }
  }
  throw lastError;
}
