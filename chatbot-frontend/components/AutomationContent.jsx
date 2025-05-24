import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

export default function AutomationContent() {
  const elements = [
    { id: '1', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 5 } },
  ];

  return (
    <div className="w-1/3 border-l h-full">
      <ReactFlow nodes={elements} />
    </div>
  );
}
