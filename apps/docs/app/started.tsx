import { promises } from "fs";
import { resolve } from "path";

import { Example } from "./example";

export async function Started() {
  const CreateExample = await promises.readFile(
    resolve(process.cwd(), "./public/greeting-lambda.ts"),
    "utf-8"
  );

  const CallExample = await promises.readFile(
    resolve(process.cwd(), "./public/call.ts"),
    "utf-8"
  );

  return (
    <>
      <h2 className="text-center text-4xl font-bold">Get started</h2>

      <div className="flex flex-col gap-14">
        <Example
          code={CreateExample}
          title="🏗️ Create a simple lambda function:"
          description={
            <>
              <p>
                In order to ship your first lambda you need to make use of the{" "}
                <i>createLambda</i> utility from the <b>@tlfc/server</b>{" "}
                package. The object that is created by this function call needs
                to be the default export of the file, so the dev server and
                deployment can pick up the lambda definition.
              </p>

              <p>
                Use{" "}
                <a
                  className="text-blue-500 no-underline"
                  href="https://zod.dev"
                >
                  zod
                </a>{" "}
                to define the schemas of your lambda's request and response
                format. The schemas are used to validate the requests that the
                lambda should process and the response that the client receives.
              </p>

              <p>
                You also need to define a <i>functionName</i> for your lambda.
                This will be used to identify the endpoint where the lambda can
                be reached.
              </p>
            </>
          }
        />

        <Example
          code={CallExample}
          title="📞 Call the Lambda from you client:"
          description={
            <p>
              To call the lambda function just import the function export from
              your lambda file and use the <i>call</i> utility.
            </p>
          }
        />
      </div>
    </>
  );
}
