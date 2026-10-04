import { renderToString } from "react-dom/server";
import { PublicApp, publicPaths } from "./public-app";

export { publicPaths };

export function render(path: string) {
  const context: any = {};
  const body = renderToString(<PublicApp path={path} helmetContext={context} />);
  const helmet = context.helmet;
  const head = [helmet.title, helmet.meta, helmet.link, helmet.script].map(tag => tag.toString()).join("\n");
  return { body, head };
}