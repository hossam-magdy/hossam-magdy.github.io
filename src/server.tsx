import { http_serve, PORT, React, ReactDOMServer } from "../deps_server.ts";
import { App } from "./components/App/App.tsx";
import { getServerData } from "./utils/getServerData.ts";
import { getSkeleton } from "./utils/getSkeleton.ts";
import { serveStaticFile } from "./utils/serveStaticFile.ts";
import { isStaticFileRequest } from "./utils/isStaticFileRequest.ts";

const server = http_serve({ port: PORT });

console.log(`Start listening on port: ${PORT}`);

for await (const req of server) {
  if (isStaticFileRequest(req)) {
    const resp = await serveStaticFile(req);
    req.respond(resp || { status: 500 });
  } else {
    // see: https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup
    const body = getSkeleton(
      `${ReactDOMServer.renderToString(<App />)}\n<!-- ${
        getServerData(req)
      } -->`,
    );
    const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });

    req.respond({ headers, body });
  }
}
