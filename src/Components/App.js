import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButtton from "./NextButtton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";

const SECS_NUM_QUEST = 15;

function App() {
  const initialState = {
    questions: [],
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondRemaining: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
        return { ...state, status: "error" };

      case "active":
        return {
          ...state,
          status: "start",
          secondRemaining: state.questions.length * SECS_NUM_QUEST,
        };
      case "newAnswer":
        const question = state.questions.at(state.index);
        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === question.correctOption
              ? state.points + question.points
              : state.points,
        };

      case "nextQuestion":
        return { ...state, index: state.index + 1, answer: null };

      case "finish":
        return {
          ...state,
          status: "finished",
          highscore:
            state.points > state.highscore ? state.points : state.highscore,
        };

      case "restart":
        return {
          ...initialState,
          questions: state.questions,
          status: "ready",
        };

      case "tick":
        return {
          ...state,
          secondRemaining: state.secondRemaining - 1,
          status: state.secondRemaining === 0 ? "finish" : state.status,
        };

      default:
        throw new Error("Action Unknown");
    }
  }

  const [
    { questions, status, index, answer, points, highscore, secondRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  const numQuestion = questions.length;

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen dispatch={dispatch} numQuestion={numQuestion} />
        )}
        {status === "start" && (
          <>
            <Progress
              index={index}
              numQuestion={numQuestion}
              points={points}
              answer={answer}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
              <NextButtton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestion={numQuestion}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <>
            <FinishScreen
              dispatch={dispatch}
              highscore={highscore}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
            />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
