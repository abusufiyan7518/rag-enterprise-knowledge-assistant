import "../styles/loading.css";

function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="loading-wrapper">
      <div className="loading-spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default LoadingSpinner;