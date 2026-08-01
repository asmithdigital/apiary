function GetStartedPage({ pageKey, pageLabel }) {
  const [doc, setDoc] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setDoc(null);
    fetchMarkdown(`./content/get-started/${pageKey}.md`).then((d) => { if (!cancelled) setDoc(d); });
    return () => { cancelled = true; };
  }, [pageKey]);
  if (!doc) return <div style={{ padding: 40 }}><LoadingRow /></div>;
  const isPending = doc.meta.status === "pending";
  return (
    <div>
      <GrayBand title={pageLabel} description={isPending ? "Structure is here, real content isn't yet." : undefined} />
      <div style={{ padding: "28px 40px", maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <MarkdownBody html={doc.html} />
      </div>
    </div>
  );
}
