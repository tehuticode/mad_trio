import EnterPromptForm from "../Forms/EnterPromptForm";
import DataTable from "../DataTable/Datatable";
import SavedResponseDashboard from "../SavedPrompts/SavedPromptsDashboard";
import { useState } from "react";
import { saveData } from "../../indexedDB";

export default function Dashboard() {
  const [view, setView] = useState('create'); // 'create' or 'saved'
  const [trainingPhrases, setTrainingPhrases] = useState([]);
  const [inputPrompts, setInputPrompts] = useState([]);  // track input prompts

  const handleSaveData = () => {
    const id = new Date().getTime(); // generate a unique ID based on the current timestamp
    const selectedResponses = trainingPhrases.filter(phrase => phrase.selected).map(phrase => phrase.prompt);
    saveData(id, { prompts: inputPrompts, savedResponses: selectedResponses, allResponses: trainingPhrases.map(phrase => phrase.prompt) });
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "prompt", header: "Prompt" },
    { 
      accessorKey: "selected", 
      header: "Save", 
      cell: ({ row }) => (
        <input 
          type="checkbox" 
          className="h-4 w-4" 
          checked={row.original.selected} 
          onChange={() => {
            setTrainingPhrases(prev => prev.map(item => 
              item.id === row.original.id ? { ...item, selected: !item.selected } : item
            ));
          }}
        />
      ) 
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 text-white p-4">
      <div className="w-full max-w-screen-lg border p-4 rounded bg-gray-800 text-white flex flex-col h-full">
        <div className="flex justify-between items-center border-b-2 border-gray-600 mb-4 pb-2">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 text-white rounded-t-md ${view === 'create' ? 'bg-gray-800' : 'bg-gray-600'}`}
              onClick={() => setView('create')}
            >
              Create Prompt
            </button>
            <button
              className={`px-4 py-2 text-white rounded-t-md ${view === 'saved' ? 'bg-gray-800' : 'bg-gray-600'}`}
              onClick={() => setView('saved')}
            >
              Saved Prompts
            </button>
          </div>
          {view === 'create' && (
            <button className="px-4 py-2 bg-gray-600 text-white rounded-t-md" onClick={handleSaveData}>
              Save
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          {view === 'create' ? (
            <>
              <div className="bg-gray-700 shadow-md p-4 rounded-lg flex-1 flex flex-col h-full">
                <div className="flex-grow pb-4 overflow-y-auto">
                  <EnterPromptForm setTrainingPhrases={setTrainingPhrases} setInputPrompts={setInputPrompts} />
                </div>
              </div>
              <div className="bg-gray-700 shadow-md p-4 rounded-lg flex-1 flex flex-col h-full">
                <h2 className="font-bold mb-4">Prompt Output List</h2>
                <div className="flex-grow overflow-y-auto">
                  <DataTable columns={columns} data={trainingPhrases} />
                </div>
              </div>
            </>
          ) : (
            <SavedResponseDashboard />
          )}
        </div>
      </div>
    </div>
  );
}
