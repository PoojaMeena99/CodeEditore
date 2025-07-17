import "./InputOutputBox.css";

const InputBox = ({ content }) => {
  return (
    <div className="input-output-box">
      <h2>Input</h2>
      <pre className="io-pre">{content}</pre>
    </div>
  );
};

export default InputBox;

