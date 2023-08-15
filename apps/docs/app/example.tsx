import { Code } from "./code";

type ExampleProps = {
  code: string;
  title: string;
  description: JSX.Element;
};

export function Example({ code, description, title }: ExampleProps) {
  return (
    <div className="px-20 xl:px-56 grid grid-cols-2 gap-14">
      <Code code={code}></Code>

      <div className="flex flex-col gap-5">
        <h3 className="text-2xl">{title}</h3>

        {description}
      </div>
    </div>
  );
}
