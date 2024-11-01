import { useState, useEffect } from "react";
import DataTable from "../DataTable/Datatable";
import { getSavedPrompts, saveData } from "../../indexedDB";

export default function SavedResponseDashboard() {
  // State variables for managing saved prompts, selected prompt, responses, etc.
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [responses, setResponses] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  const [editing, setEditing] = useState(false);

  // Fetch saved prompts when the component mounts
  useEffect(() => {
    fetchSavedPrompts();
  }, []);

  // Function to fetch saved prompts from IndexedDB
  const fetchSavedPrompts = async () => {
    try {
      const prompts = await getSavedPrompts(); // Get prompts from IndexedDB
      setSavedPrompts(prompts); // Update state with fetched prompts
    } catch (error) {
      console.error("Error fetching saved prompts:", error);
    }
  };

  // Handle clicking on a prompt from the list
  const handlePromptClick = (prompt) => {
    setSelectedPrompt(prompt); // Set selected prompt
    const formattedResponses = prompt.savedResponses.map((response, index) => ({
      id: index + 1,
      response: response,
    }));
    setResponses(formattedResponses); // Update responses based on selected prompt
    const originalResponses = prompt.allResponses || [];
    setAllResponses(
      originalResponses.map((item, index) => ({
        id: index + 1,
        response: item,
        selected: prompt.savedResponses.includes(item), // Check if each response is selected
      }))
    );
  };

  // Function to save edited responses
  const handleSaveEdits = async () => {
    const updatedResponses = allResponses.filter((item) => item.selected).map((item) => item.response);

    // Save the updated responses to the state
    const formattedUpdatedResponses = updatedResponses.map((response, index) => ({
      id: index + 1,
      response: response,
    }));

    setResponses(formattedUpdatedResponses); // update the responses state with the new data
    setEditing(false); // exit editing mode

    // create updatedPrompt with updated responses..
    const updatedPrompt = {
      ...selectedPrompt,
      savedResponses: updatedResponses, // Update saved responses..
      intent: selectedPrompt.intent, // Keep the same intent..
    };

    try {
      // se updatedPrompt directly when saving to IndexedDB
      await saveData(selectedPrompt.id, updatedPrompt);
      fetchSavedPrompts(); // Refetch saved prompts to make sure the UI is updated
    } catch (error) {
      console.error("Error saving edits:", error);
    }
  };

  // columns for editing mode
  const editColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "response", header: "Response" },
    {
      accessorKey: "selected",
      header: "Select",
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={row.original.selected}
          onChange={() => {
            setAllResponses((prev) =>
              prev.map((item) =>
                item.id === row.original.id ? { ...item, selected: !item.selected } : item
              )
            );
          }}
        />
      ),
    },
  ];

  // columns for viewing mode
  const viewColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "response", header: "Response" },
  ];

  return (
    <div className="flex flex-col p-10 rounded bg-gray-800 text-white h-full w-full">
      <div className="flex gap-4 flex-grow">
        {/* Saved prompts list */}
        <div className="bg-gray-700 shadow-md p-4 rounded-lg flex-1 flex flex-col">
          <div className="min-h-full pb-4 flex-grow overflow-y-auto">
            <ul>
              {savedPrompts.map((prompt) => (
                <li
                  key={prompt.id}
                  onClick={() => handlePromptClick(prompt)} // Handle prompt click
                  className="cursor-pointer hover:bg-gray-600 p-2 rounded"
                >
                  {prompt.prompts.join(" and ")} 
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Responses and editing section */}
        <div className="bg-gray-700 shadow-md p-4 rounded-lg flex-1 flex flex-col">
          <h4 className="font-bold mb-4 bg-green-200 rounded w-fit text-gray-600 p-3">
            Intent: {selectedPrompt ? selectedPrompt.intent : "No intent selected"}
          </h4>
          <h3 className="font-bold mb-4 ">
            Responses for: {selectedPrompt ? <div className="bg-green-200 text-gray-600 w-fit p-3 rounded">{selectedPrompt.prompts.join(", ")}</div> : <div>Select a prompt</div>}
          </h3>
          
          <div className="min-h-full flex-grow overflow-y-auto">
            {selectedPrompt ? (
              editing ? (
                <>
                  <DataTable columns={editColumns} data={allResponses} />
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded self-start"
                    onClick={handleSaveEdits} // Save edits on button click
                  >
                    Save Edits
                  </button>
                </>
              ) : (
                <>
                  <DataTable columns={viewColumns} data={responses} />
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded self-start"
                    onClick={() => setEditing(true)} // Enable editing mode
                  >
                    Edit
                  </button>
                </>
              )
            ) : (
              <p className="text-gray-400">Select a prompt to view responses.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
