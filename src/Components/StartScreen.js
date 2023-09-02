function StartScreen({ numQuestion, dispatch }) {
  return (
    <div>
      <div className="start">
        <h2>Welcome to The React Quize!</h2>
        <h3>{numQuestion} questions to test your React mastery</h3>
        <button
          onClick={() => dispatch({ type: "active" })}
          className="btn btn-ui"
        >
          Let's start
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
