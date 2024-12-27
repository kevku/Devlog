import { useState } from "react";
import PromptControls from "../components/DashboardComponents/PromptControls";
import Prompt from "../components/DashboardComponents/Prompt";
import styles from "../styles/DashboardPage/DashboardPage.module.css";

const DashboardPage = () => {
  const [prompts, setPrompts] = useState([]);

  // Simulate loading prompts (you can replace this with actual data fetching logic)
  const handleCreatePrompt = () => {
    const newPrompt = {
      id: Date.now(),
      title: "Untitled Prompt",
      description: "No description yet.",
    };
    setPrompts((prevPrompts) => [...prevPrompts, newPrompt]);
  };

  const handlePromptClick = (id) => {
    console.log("Clicked prompt with ID:", id);
  };

  const handleDeletePrompt = (id) => {
    setPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt.id !== id));
  };

  return (
    <div>
      <button onClick={handleCreatePrompt}>New Prompt</button>
      <div className={prompts.length === 0 ? styles.noPrompt : styles.promptGrid}>
        {prompts.length === 0 ? (
          <h2>Create Some Logs!</h2>
        ) : (
          prompts.map((prompt) => (
            <Prompt
              key={prompt.id}
              prompt={prompt}
              onClick={handlePromptClick}
              onDelete={handleDeletePrompt}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;