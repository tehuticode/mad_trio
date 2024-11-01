import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";

const EnterPromptForm = ({ setTrainingPhrases, setInputPrompts, setLoading, shouldResetForm, setIntent }) => {
  // Initialise form using react-hook-form with default values
  const form = useForm({
    defaultValues: {
      prompt1: "",
      prompt2: ""
    }
  });
  const { reset } = form;

  // reset form when the shouldResetForm prop changes
  useEffect(() => {
    if (shouldResetForm) reset();
  }, [shouldResetForm, reset]);

  // Handle form submission..
  const onSubmit = async (data) => {
    const inputPhrases = [data.prompt1, data.prompt2]; // sollect input prompts
    const combinedPrompts = `${data.prompt1} ${data.prompt2}`; // combine prompts for the API

    // set input prompts and loading state
    setInputPrompts(inputPhrases);
    setLoading(true);

    try {
      // Make a POST request to the backend API
      const response = await fetch('http://127.0.0.1:8000/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: combinedPrompts }),
      });

      // Parse the JSON response
      const responseData = await response.json();
      if (!responseData || !responseData.response) throw new Error("Invalid JSON response");

      const parsedResponse = JSON.parse(responseData.response);
      
      // Set the intent extracted from the API response
      setIntent(parsedResponse.intent); 

      // Map training phrases into a suitable format
      const trainingPhrases = parsedResponse.training_phrases.map((item, index) => {
          const phraseKey = Object.keys(item)[0]; // Get the key of the training phrase
          return { id: index + 1, prompt: item[phraseKey], selected: false };  
      });
      setTrainingPhrases(trainingPhrases); // Update training phrases state
    } catch (error) {
      console.error('Error:', error);
      setTrainingPhrases([]); // Clear training phrases on error
    } finally {
      setLoading(false); // Set loading to false after completion
    }
  };

  return (
    <Fragment>
      <Form {...form}>
        <h2 className="font-bold">Enter Prompts</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 p-4 rounded-md shadow-sm bg-gray-700">
            {/* Input field for Prompt 1 */}
            <FormField
              control={form.control}
              name="prompt1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Prompt 1</FormLabel>
                  <FormControl><Input placeholder="Prompt 1" {...field} /></FormControl>
                  <FormDescription>Enter the first example prompt</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Input field for Prompt 2 */}
            <FormField
              control={form.control}
              name="prompt2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Prompt 2</FormLabel>
                  <FormControl><Input placeholder="Prompt 2" {...field} /></FormControl>
                  <FormDescription>Enter a second example prompt</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit button for the form */}
            <Button type="submit">Submit Prompts</Button>
          </div>
        </form>
      </Form>
    </Fragment>
  );
};

// Prop types validation for the component
EnterPromptForm.propTypes = {
  setTrainingPhrases: PropTypes.func.isRequired, // Function to set training phrases
  setInputPrompts: PropTypes.func.isRequired, // Function to set input prompts
  setLoading: PropTypes.func.isRequired, // Function to set loading state
  shouldResetForm: PropTypes.bool.isRequired, // Boolean to determine if the form should reset
  setIntent: PropTypes.func.isRequired, // Function to set the intent from API response
};

export default EnterPromptForm;
