import * as ReactDOM from "react-dom";
import * as ReactDOMTestUtils from "react-dom/test-utils";
import { rest, setupWorker } from "msw";

describe("<App />", () => {
  let container = null;
  let root = null;
  let worker = setupWorker(
    rest.get("https://github.com/octocat", (req, res, ctx) => {
      return res(
        ctx.delay(1500),
        ctx.status(202, "Mocked status"),
        ctx.json({
          message: "Mocked response JSON body"
        })
      );
    })
  );

  beforeEach(() => {
    container = document.createElement("container");
    document.body.appendChild(container);

    root = ReactDOM.createRoot(container);

    worker.start()
  });

  afterEach(() => {
    if (root !== null) {
      ReactDOMTestUtils.act(() => {
        root.unmount();
      });
      root = null;
    }

    if (container !== null) {
      container.parentElement.removeChild(container);
      container = null;
    }

    worker.stop()
  });

  it("loads data with real timers", () => {});
});
