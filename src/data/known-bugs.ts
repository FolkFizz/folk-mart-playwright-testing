export type KnownBug = Readonly<{
  id: string;
  title: string;
  trackerUrl: string;
}>;

export const KNOWN_BUGS = Object.freeze({
  authSessionLostOnWebkit: Object.freeze({
    id: "FM-BUG-001",
    title: "Authenticated session is not persisted after login on WebKit-based browsers",
    trackerUrl: "https://tracker.example.com/browse/FM-BUG-001"
  }) as KnownBug
});
