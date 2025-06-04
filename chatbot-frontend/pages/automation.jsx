// File: pages/automation.jsx

import { ReactFlowProvider } from "reactflow";
import AutomationFlow from "@/components/AutomationContent";

export default function AutomationPage() {
  return (
    <ReactFlowProvider>
      <AutomationFlow />
    </ReactFlowProvider>
  );
}
