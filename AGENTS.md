<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Shared client store (src/lib/store.ts) returns shallow-equal cached selector results; keeps useSyncExternalStore from looping when selectors build new arrays.
- Demo uses mock data persisted in localStorage, no backend; keeps the demo self-contained.
- Uploaded media blobs live in browser IndexedDB and posts store stable media keys; preserves photos and videos across reloads without filling localStorage.
