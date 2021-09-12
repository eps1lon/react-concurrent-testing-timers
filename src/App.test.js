describe.each([
  ["legacy root", createLegacyRoot],
  ["concurrent root", createRoot],
])("<App /> with %s", (label, createRootImpl) => {
  let ReactDOM;
  let App;

  let act;
  let render;
  let unmount;

  beforeEach(() => {
    jest.resetModules();

    ReactDOM = require("react-dom");
    const React = require("react");
    const ReactDOMTestUtils = require("react-dom/test-utils");
    act = React.unstable_act || ReactDOMTestUtils.act;
    App = require("./App").default;
    ({ render, unmount } = createRootImpl(ReactDOM));
  });

  afterEach(() => {
    // make sure we don't leak a possible `useFakeTimers` from a failed test
    jest.useRealTimers();

    act(() => {
      unmount();
    });
  });

  it("loads data with real timers", async () => {
    act(() => {
      render(<App />);
    });

    expect(document.querySelector("main").getAttribute("aria-busy")).toEqual(
      "true"
    );

    // polling for data being fetched
    // This approach worked in React 17 but times out in concurrent React
    await act(async () => {
      await new Promise((resolve) => {
        setInterval(() => {
          if (
            document.querySelector("main").getAttribute("aria-busy") !== "true"
          ) {
            resolve();
          }
        }, 50);
      });
    });

    expect(document.querySelector("main pre").textContent).toEqual(
      '{"react":"18"}'
    );
  }, 500);

  it("loads data with fake timers", async () => {
    jest.useFakeTimers("modern");

    act(() => {
      render(<App />);
    });

    expect(document.querySelector("main").getAttribute("aria-busy")).toEqual(
      "true"
    );

    act(() => {
      // hardcode the time it take to resolve the mocke fetch
      jest.advanceTimersByTime(100);
    });

    expect(document.querySelector("main").getAttribute("aria-busy")).toEqual(
      "false"
    );
    expect(document.querySelector("main pre").textContent).toEqual(
      '{"react":"18"}'
    );
  }, 500);
});

function createRoot(ReactDOM) {
  const container = document.createElement("container");
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);

  return {
    render(element) {
      root.render(element);
    },
    unmount() {
      root.unmount();

      container.parentElement.removeChild(container);
    },
  };
}

function createLegacyRoot(ReactDOM) {
  const container = document.createElement("container");
  document.body.appendChild(container);

  return {
    render(element) {
      const originalConsoleError = console.error;
      console.error = function mockedConsoleError(format, ...args) {
        if (format.includes("Use createRoot instead.")) {
          return;
        }

        originalConsoleError.apply(console, [format, ...args]);
      };

      try {
        ReactDOM.render(element, container);
      } finally {
        console.error = originalConsoleError;
      }
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}
