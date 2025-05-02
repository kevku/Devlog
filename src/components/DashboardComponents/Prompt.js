import { MdDelete, MdEdit } from "react-icons/md";
import styles from "../../styles/DashboardPage/Prompt.module.css";
import { useNavigate } from "react-router-dom";

const Prompt = ({ prompt, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/prompt/${prompt.id}`);
  };

  return (
    <div className={styles.prompt} onClick={handleClick}>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.iconButton} ${styles.editButton}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
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

