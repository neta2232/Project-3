import "./Errors.css";

type ErrorModalProps = {
  message: string;
  onClose: () => void;
};

 function Errors({ message, onClose }: ErrorModalProps) {
  if (!message) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content error-modal">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose} className="close-btn">ok</button>
      </div>
    </div>
  );
}
export default Errors;