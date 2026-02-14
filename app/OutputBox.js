import "./InputOutputBox.css"

const OutputBox = ({ content }) => {
  return (
    <div className="input-output-box">
      <h2>Output</h2>
      <pre  className="io-pre">
        {content}
      </pre>
    </div>
  );
};

export default OutputBox;





