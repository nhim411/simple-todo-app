import TodoApp from "./components/TodoApp";
import GlobalStyles from "./components/GlobalStyles";

function App() {
  return (
    <GlobalStyles>
      <div className="App">
        <TodoApp />
      </div>
    </GlobalStyles>
  );
}

export default App;
