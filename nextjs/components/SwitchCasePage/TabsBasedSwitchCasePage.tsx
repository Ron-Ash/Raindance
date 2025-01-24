"use client";

import { ReactNode, useState } from "react";
import { Tab, Tabs } from "@nextui-org/tabs";

interface pageOptions {
  [key: string]: ReactNode;
}

export default function TabsBasedSwitchCasePage({
  options,
}: {
  options: pageOptions;
}) {
  const [key, setKey] = useState<string>(Object.keys(options)[0]);

  return (
    <>
      <div className="relative z-10 pb-2">
        <Tabs
          selectedKey={key}
          onSelectionChange={(key) => setKey(String(key))}
        >
          {Object.keys(options).map((key) => (
            <Tab key={key} title={key} />
          ))}
        </Tabs>
      </div>
      <div>
        {Object.entries(options)
          .filter(([name, node]) => name === key && node != undefined)
          .map((option) => option[1]) ?? <div />}
      </div>
    </>
  );
}
