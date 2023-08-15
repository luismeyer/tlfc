"use client";

import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeProps = {
  code: string;
};

export function Code({ code }: CodeProps) {
  function copy() {
    void navigator.clipboard.writeText(code);
  }

  return (
    <div className="rounded-lg p-1 relative bg-[#282c34]">
      <SyntaxHighlighter
        language="typescript"
        style={atomOneDark}
        customStyle={{ fontSize: "1rem" }}
      >
        {code}
      </SyntaxHighlighter>

      <Tooltip placement="top" title="copied to clipboard" trigger="click">
        <CopyOutlined
          onClick={copy}
          style={{ color: "#fff" }}
          className="absolute top-5 right-5 cursor-pointer"
        />
      </Tooltip>
    </div>
  );
}
