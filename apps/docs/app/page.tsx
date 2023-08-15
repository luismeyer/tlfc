import { AppstoreOutlined, GithubOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { Facts } from "./facts";
import { Started } from "./started";

export default async function Home() {
  return (
    <main className="grid gap-10 pb-10">
      <header className="bg-gradient-to-br from-[#289EDD] to-[#12BDD5] flex flex-col items-center justify-center py-20 px-10 gap-5">
        <h1 className="text-5xl text-white font-bold mb-5">TLFC</h1>

        <p className="text-white w-1/2 text-center max-w-3xl">
          provides all the tools you need to write end to end typesafe AWS
          lambda functions. It comes with schema validation at runtime on the
          client and the lambda, a local dev environment and a simple CLI to
          build and deploy your functions into AWS.
        </p>

        <div className="flex gap-5">
          <a href="https://github.com/luismeyer/tlfc" target="_blank">
            <Button type="primary" icon={<GithubOutlined />}>
              Github
            </Button>
          </a>

          <a
            href="https://www.npmjs.com/settings/tlfc/packages"
            target="_blank"
          >
            <Button type="default" icon={<AppstoreOutlined />}>
              npm
            </Button>
          </a>
        </div>

        <div className="rounded-lg m-auto p-5 bg-[#24282E] max-w-7xl">
          <video autoPlay loop muted playsInline className="w-full">
            <source src="/usage.mp4" type="video/mp4" />
          </video>
        </div>
      </header>

      <Facts />

      <Started />
    </main>
  );
}
