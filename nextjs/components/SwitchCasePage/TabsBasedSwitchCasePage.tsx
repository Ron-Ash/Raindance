"use client";

import { ReactNode, useState } from "react";
import SwitchCasePage from "./SwitchCasePage";
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
      <div className="relative z-10">
        <Tabs
          selectedKey={key}
          onSelectionChange={(key) => setKey(String(key))}
        >
          {Object.keys(options).map((key) => (
            <Tab key={key} title={key} />
          ))}
        </Tabs>
      </div>
      <SwitchCasePage options={options} chosenOption={key} />
    </>
  );
}
