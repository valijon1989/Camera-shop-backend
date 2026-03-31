import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";

const MongoDBStore = connectMongoDBSession(session);

type StoreWithExtras = session.Store & {
  all?: (
    callback: (
      err: any,
      obj?: session.SessionData[] | { [sid: string]: session.SessionData } | null
    ) => void
  ) => void;
  clear?: (callback?: (err?: any) => void) => void;
  touch?: (
    sid: string,
    sessionData: session.SessionData,
    callback?: () => void
  ) => void;
};

class ResilientSessionStore extends session.Store {
  private readonly memoryStore: session.MemoryStore;
  private activeStore: StoreWithExtras;

  constructor(mongoUri?: string) {
    super();
    this.memoryStore = new session.MemoryStore();
    this.activeStore = this.memoryStore;

    if (!mongoUri) return;

    const mongoStore = new MongoDBStore({
      uri: mongoUri,
      collection: "sessions",
      connectionOptions: {
        serverSelectionTimeoutMS: 5000,
      },
    });

    mongoStore.on("connected", () => {
      this.activeStore = mongoStore;
      this.emit("connect");
      console.info("Session store connected to MongoDB");
    });

    mongoStore.on("error", (error: Error) => {
      console.warn("Session store warning:", error.message);
      if (this.activeStore !== this.memoryStore) {
        this.activeStore = this.memoryStore;
        this.emit("disconnect");
      }
    });
  }

  get(
    sid: string,
    callback: (err: any, sessionData?: session.SessionData | null) => void
  ): void {
    this.activeStore.get(sid, callback);
  }

  set(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void
  ): void {
    this.activeStore.set(sid, sessionData, callback);
  }

  destroy(sid: string, callback?: (err?: any) => void): void {
    this.activeStore.destroy(sid, callback);
  }

  all(
    callback: (
      err: any,
      obj?: session.SessionData[] | { [sid: string]: session.SessionData } | null
    ) => void
  ): void {
    if (this.activeStore.all) {
      this.activeStore.all(callback);
      return;
    }
    callback(null, null);
  }

  clear(callback?: (err?: any) => void): void {
    if (this.activeStore.clear) {
      this.activeStore.clear(callback);
      return;
    }
    callback?.();
  }

  touch(
    sid: string,
    sessionData: session.SessionData,
    callback?: () => void
  ): void {
    if (this.activeStore.touch) {
      this.activeStore.touch(sid, sessionData, callback);
      return;
    }
    callback?.();
  }
}

export function createSessionStore(mongoUri?: string): session.Store {
  return new ResilientSessionStore(mongoUri);
}
