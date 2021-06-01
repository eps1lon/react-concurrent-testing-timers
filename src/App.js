import React from "react";
import "./styles.css";

export default function App() {
  const [data, setData] = React.useState(undefined);
  React.useEffect(() => {
    let cancelled = false;

    // could be a fetch()
    setTimeout(() => {
      if (!cancelled) {
        setData({ react: "18" });
      }
    }, 100);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main aria-busy={data === undefined}>
      <h1>data</h1>
      {data !== null && <pre data-testid="data">{JSON.stringify(data)}</pre>}
    </main>
  );
}
