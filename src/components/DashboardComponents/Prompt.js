import { MdDelete, MdEdit } from "react-icons/md";
import styles from "../../styles/DashboardPage/Prompt.module.css";

const Prompt = ({ prompt, onClick, onDelete }) => {
  return (
    <div className={styles.prompt} onClick={() => onClick(prompt.id)}>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.iconButton} ${styles.editButton}`}
          onClick={(e) => {
            e.stopPropagation();
            // Edit functionality will be added later
          }}
        >
          <MdEdit />
        </button>
        <button
          className={`${styles.iconButton} ${styles.deleteButton}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(prompt.id);
          }}
        >
          <MdDelete />
        </button>
      </div>
      <h3 className={styles.promptTitle}>{prompt.title}</h3>
      <p className={styles.promptDescription}>{prompt.description}</p>
    </div>
  );
};

export default Prompt;

