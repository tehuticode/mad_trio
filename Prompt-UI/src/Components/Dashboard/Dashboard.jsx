import EnterPromptForm from "../Forms/EnterPromptForm";
import DataTable from "../DataTable/Datatable";
import SavedResponseDashboard from "../SavedPrompts/SavedPromptsDashboard";
import { useState } from "react";
import { saveData } from "../../indexedDB";

export default function Dashboard() {
  // state variables for managing the dashboard view, training phrases, prompts, loading status, form reset, and intent.
  const [view, setView] = useState('create'); 
  const [trainingPhrases, setTrainingPhrases] = useState([]);
  const [inputPrompts, setInputPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [intent, setIntent] = useState(null); 

  // function to save data to IndexedDB..
  const handleSaveData = () => {
    const id = new Date().getTime(); // create a unique ID based on the current timestamp
    const selectedResponses = trainingPhrases.filter(phrase => phrase.selected).map(phrase => phrase.prompt);
    
    // save the data including prompts, selected responses, all responses, and the intent
    saveData(id, { 
      prompts: inputPrompts, 
      savedResponses: selectedResponses, 
      allResponses: trainingPhrases.map(phrase => phrase.prompt),
      intent: intent 
    });
  };

  // function to select all training phrases
  const handleSelectAll = () => {
    setTrainingPhrases(prev => prev.map(item => ({ ...item, selected: true })));
  };

  // function to clear all selections from training phrases
  const handleClearAll = () => {
    setTrainingPhrases(prev => prev.map(item => ({ ...item, selected: false })));
  };

  // function to clear the current page state, including training phrases, input prompts, and intent
  const handleClearPage = () => {
    setTrainingPhrases([]); // Clear training phrases
    setInputPrompts([]); // Clear input prompts
    setView('create'); // Reset view to create
    setShouldResetForm(prev => !prev); // toggle reset state for the form
    setIntent(null); // clear the intent
  };

  // Define columns for the DataTable displaying training phrases
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
            // toggle the selected state of a training phrase
            setTrainingPhrases(prev => prev.map(item => 
              item.id === row.original.id ? { ...item, selected: !item.selected } : item
            ));
          }}
        />
      ) 
    },
  ];

  return (
    <div className="flex flex-col justify-center border p-10 bg-gray-800 text-white h-screen w-screen">
      <div className="flex justify-between items-center border-b-2 border-gray-600 pb-2">
        <div className="flex space-x-4">
          {/* Buttons to toggle between creating prompts and viewing saved prompts */}
          <button className={`px-4 py-2 bg-gray-600 text-white rounded-t-md ${view === 'create' ? 'bg-gray-800' : ''}`} onClick={() => setView('create')}>Create Prompt</button>
          <button className={`px-4 py-2 bg-gray-600 text-white rounded-t-md ${view === 'saved' ? 'bg-gray-800' : ''}`} onClick={() => setView('saved')}>Saved Prompts</button>
        </div>
        {view === 'create' && (
          <div className="flex space-x-4">
            {/* Action buttons available in 'create' view */}
            <button className="px-4 py-2 bg-gray-600 text-white rounded-t-md" onClick={handleSaveData}>Save</button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-t-md" onClick={handleSelectAll}>Select All</button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-t-md" onClick={handleClearAll}>Clear All Selections</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-t-md" onClick={handleClearPage}>Clear Page</button> 
          </div>
        )}
      </div>
      {view === 'create' ? (
        <div className="flex gap-4 h-full flex-grow p-10">
          {/* EnterPromptForm for inputting prompts */}
          <div className="bg-gray-700 shadow-md p-4 rounded-lg flex-1">
            <div className="min-h-full pb-20">
              <EnterPromptForm 
                setTrainingPhrases={setTrainingPhrases} 
                setInputPrompts={setInputPrompts} 
                setLoading={setLoading} 
                shouldResetForm={shouldResetForm} 
                setIntent={setIntent} // Pass setIntent to the form for intent management..
              /> 
            </div>
          </div>
          {/* DataTable for displaying training phrases */}
          <div className="bg-gray-700 shadow-md p-4 rounded-lg flex-1">
            <h2 className="font-bold bg-green-200 w-fit rounded p-3 text-gray-600">Intent: {intent}</h2> {/* display the current intent */}
            <h2 className="font-bold mb-4">Prompt Output List</h2>
            <div className="min-h-full">
              <DataTable columns={columns} data={trainingPhrases} isLoading={loading} /> {/* display data table with training phrases */}
            </div>
          </div>
        </div>
      ) : (
        // render the SavedResponseDashboard when in 'saved' view
        <SavedResponseDashboard intent={intent} /> 
      )}
    </div>
  );
}
