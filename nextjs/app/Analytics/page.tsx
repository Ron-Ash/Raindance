import TabsBasedSwitchCasePage from "@/components/SwitchCasePage/TabsBasedSwitchCasePage";
import Advanced from "./Advanced";

export default function Page() {
  return (
    <div className="p-4 gap-4">
      <TabsBasedSwitchCasePage
        options={{
          Advanced: <Advanced />,
          Live: <div>A</div>,
          Statistics: <div>B</div>,
        }}
      />
    </div>
  );
}
