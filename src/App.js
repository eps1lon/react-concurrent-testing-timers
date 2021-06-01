import React from "react";
import "./styles.css";

export default function App() {
  const [data, setData] = React.useState(undefined);
  React.useEffect(() => {
    let cancelled = false;

    fetch("https://github.com/octocat").then(
      async (response) => {
        const json = await response.json();

        if (!cancelled) {
          setData(json);
        }
      },
      (error) => {
        console.error(error);
        if (!cancelled) {
          setData(null);
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main aria-busy={data === undefined}>
      <h1>data</h1>
      {data !== null && (
        <pre data-testid="data">{JSON.stringify(data, null, 2)}</pre>
      )}
    </main>
  );
}
