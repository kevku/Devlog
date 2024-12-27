import styles from "../../styles/DashboardPage/Prompt.module.css";

const Prompt = ({ prompt, onClick, onDelete }) => {
  return (
    <div className={styles.prompt} onClick={() => onClick(prompt.id)}>
      <h3 className={styles.promptTitle}>{prompt.title}</h3>
      <p className={styles.promptDescription}>{prompt.description}</p>
      <button
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation(); // Prevent the click event from triggering onClick on parent div
          onDelete(prompt.id);
        }}
      >
        X
      </button>
    </div>
  );
};

export default Prompt;

