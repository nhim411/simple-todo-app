import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { AiOutlineCheckCircle, AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import { IconContext } from "react-icons";

import { useToggle } from "../hooks";
import "./TodoApp.scss";

export default function TodoApp() {
  const [todoInput, setTodoInput] = useState();
  const [countItem, setCountItem] = useState(0);

  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem("todos")) || {});
  const inputRef = useRef();
  // Button control
  const [toggleAll, setToggleAll] = useToggle(false);
  const [clearCompleted, setClearCompleted] = useToggle(false);
  const [showAll, setShowAll] = useToggle(false);
  const [showActive, setShowActive] = useToggle(false);
  const [showCompleted, setShowCompleted] = useToggle(false);

  useEffect(() => {
    if (localStorage.getItem(todos)) {
      setTodos(JSON.parse(localStorage.getItem(todos)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (todos.length) {
      if (!toggleAll) {
        const newTodos = [...todos];
        newTodos.map((todo) => {
          todo.isComplete = false;
          return todo;
        });
        setTodos(newTodos);
      } else {
        const newTodos = [...todos];
        newTodos.map((todo) => {
          todo.isComplete = true;
          return todo;
        });
        setTodos(newTodos);
      }
    }
  }, [toggleAll]);
  // Handle count item not completed
  useEffect(() => {
    if (todos.length) {
      const todoNotCompleted = todos.filter((todo) => todo.isComplete !== true);
      setCountItem(todoNotCompleted.length);
    }
  }, [todos]);
  // Handle toggle clear completed button
  useEffect(() => {
    if (todos.length) {
      if (setClearCompleted) {
        const todoNotCompleted = todos.filter((todo) => todo.isComplete !== true);
        setTodos(todoNotCompleted);
      }
    }
  }, [clearCompleted]);

  const handleInput = (e) => {
    setTodoInput(e);
  };

  // Handle Enter todoInput
  const handleEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (todoInput.trim() !== "") {
        let newTodos = [];
        if (todos.length) {
          newTodos = [...todos];
        }
        newTodos.push({
          value: todoInput,
          isComplete: false,
          isEdit: false,
        });
        setTodos(newTodos);
      }

      setTodoInput("");
      inputRef.current.focus();
    }
  };

  // Handle double click input item
  const handleEdit = (i) => {
    const newTodos = [...todos];
    const selectTodo = newTodos[i];
    if (selectTodo.isEdit === true) {
      selectTodo.isEdit = false;
      setTodos(newTodos);
    } else {
      selectTodo.isEdit = true;
      setTodos(newTodos);
    }
  };
  // Handle Blur input item
  const handleBlur = (index, payload) => {
    const newTodos = [...todos];
    const selectTodo = newTodos[index];
    if (payload.trim() !== "") selectTodo.value = payload;
    selectTodo.isEdit = false;
    setTodos(newTodos);
  };
  // Handle click btn__check todo item
  const handleCheckItem = (i) => {
    const newTodos = [...todos];
    const selectTodo = newTodos[i];
    if (selectTodo.isComplete === true) {
      selectTodo.isComplete = false;
      setTodos(newTodos);
    } else {
      selectTodo.isComplete = true;
      setTodos(newTodos);
    }
  };
  // Handle click Delete button
  const handleDelete = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };
  console.log("re-render");
  const checkHiden = (todo) => {
    if (showAll) {
      return false;
    }
    if (showActive) {
      if (todo.isComplete) {
        return true;
      }
    }
    if (showCompleted) {
      if (!todo.isComplete) return true;
    }
  };

  // Render UI
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__wrapper">
        <div className="todoapp__header">
          <button className="btn btn__check" onClick={setToggleAll}>
            <IconContext.Provider
              value={{
                className: "todoapp__header-icon-check",
                color: toggleAll ? "#CC9A9A" : "#DDD",
              }}
            >
              <div>
                <AiOutlineDown />
              </div>
            </IconContext.Provider>
          </button>
          <input
            type="text"
            ref={inputRef}
            className="todoapp__header-input"
            placeholder="What needs to be done?"
            value={todoInput}
            onChange={(e) => {
              handleInput(e.target.value);
            }}
            onKeyUp={(e) => {
              handleEnter(e);
            }}
          ></input>
        </div>
        <div className="todoapp__main">
          <ul className="todoapp__main-list">
            {todos.length &&
              todos.map((todo, index) => {
                return (
                  <li
                    onDoubleClick={() => {
                      handleEdit(index);
                    }}
                    className={clsx(
                      "todoapp__main-item",
                      { "todoapp__main-item--completed": todo.isComplete },
                      { "todoapp__main-item--edit": todo.isEdit },
                      {
                        "todoapp__main-item--hidden": checkHiden(todo),
                      }
                    )}
                    key={index}
                  >
                    <button className="btn btn__check" onClick={() => handleCheckItem(index)}>
                      <IconContext.Provider
                        value={{
                          className: "todoapp__main-item-view-check",
                          color: todo.isComplete ? "#CC9A9A" : "eee",
                        }}
                      >
                        <div>
                          <AiOutlineCheckCircle />
                        </div>
                      </IconContext.Provider>
                    </button>
                    <span className="todoapp__main-item-view-label">{todo.value}</span>
                    <button
                      className="btn btn__destroy"
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      <IconContext.Provider
                        value={{
                          className: "todoapp__icon-destroy",
                          color: "#CC9A9A",
                        }}
                      >
                        <div>
                          <AiOutlineClose />
                        </div>
                      </IconContext.Provider>
                    </button>

                    <input
                      type="text"
                      className="todoapp__main-item-edit"
                      onBlur={(e) => {
                        handleBlur(index, e.target.value);
                      }}
                    />
                  </li>
                );
              })}
          </ul>
        </div>
        {todos.length > 0 && (
          <div className="todoapp__footer">
            <span className="todoapp__footer-count">{countItem} items left</span>
            <div className="todoapp__footer-control">
              <button
                className={clsx("btn btn__control", {
                  "btn__control--active": showAll,
                })}
                onClick={setShowAll}
              >
                All
              </button>
              <button
                className={clsx("btn btn__control", {
                  "btn__control--active": showActive,
                })}
                onClick={setShowActive}
              >
                Active
              </button>
              <button
                className={clsx("btn btn__control", {
                  "btn__control--active": showCompleted,
                })}
                onClick={setShowCompleted}
              >
                Completed
              </button>
            </div>
            <button className="btn btn__control btn__control--clear" onClick={setClearCompleted}>
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
