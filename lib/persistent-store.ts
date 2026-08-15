/**
 * A tiny localStorage-backed store read through `useSyncExternalStore`.
 *
 * Reading persisted state in an effect and calling setState causes a cascading
 * render (and trips the React Compiler lint rules). Treating storage as what it
 * actually is — an external system — removes the effect entirely: the server
 * and hydration render use the initial snapshot, and the client swaps to the
 * stored value on the first post-hydration render.
 *
 * A `storage` listener keeps two tabs of the same bag in step for free.
 */
export type PersistentStore<T> = {
  subscribe: (listener: () => void) => () => void;
  get: () => T;
  getServer: () => T;
  set: (updater: T | ((previous: T) => T)) => void;
};

export function createPersistentStore<T>(
  key: string,
  initial: T,
  revive: (raw: unknown) => T | null,
): PersistentStore<T> {
  let snapshot = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) listener();
  };

  const readStorage = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return initial;
      return revive(JSON.parse(raw)) ?? initial;
    } catch {
      return initial;
    }
  };

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    snapshot = readStorage();
  };

  return {
    subscribe(listener) {
      listeners.add(listener);

      const onStorage = (event: StorageEvent) => {
        if (event.key !== null && event.key !== key) return;
        snapshot = readStorage();
        emit();
      };

      window.addEventListener("storage", onStorage);

      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },

    get() {
      load();
      return snapshot;
    },

    getServer() {
      return initial;
    },

    set(updater) {
      load();
      const next =
        typeof updater === "function"
          ? (updater as (previous: T) => T)(snapshot)
          : updater;

      if (Object.is(next, snapshot)) return;
      snapshot = next;

      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage full or blocked (private mode). State still works for this
        // session; there is nothing useful to tell the customer here.
      }

      emit();
    },
  };
}
