import { useReducer } from "react";
import { Stack, Button } from "@mui/material";

const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overWrite: false,
        };
      }
      return {
        ...state,
        currentOperand:
          (payload.digit === "0" && state.currentOperand === "0") ||
          (payload.digit === "." && state.currentOperand.includes("."))
            ? state.currentOperand
            : `${state.currentOperand || ""}${payload.digit}`,
      };
    default:
      return state;
    case ACTIONS.CLEAR:
      return {
        operation: null,
        previousOperand: null,
        currentOperand: null,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === null && state.previousOperand === null) {
        return state;
      }
      if (state.previousOperand === null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      if (state.currentOperand === null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand !== null ||
        state.previousOperand !== null ||
        state.operation !== null
      ) {
        return {
          ...state,
          overWrite: true,
          operation: null,
          previousOperand: null,
          currentOperand: evaluate(state),
        };
      } else {
        return state;
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.onerwrite) {
        return {
          ...state,
          overWrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
  }
  return computation.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
const formatOperand = (operand) => {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

export default function Calculator() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {
      currentOperand: null,
      previousOperand: null,
    },
  );
  return (
    <Stack
      sx={{
        width: "385px",
        height: "auto",
        margin: "auto",
      }}
    >
      <Stack
        sx={{
          borderRadius: "7px",
          backgroundColor: "#3B3B3B",
          display: "grid",
          gridTemplateColumns: "repeat(4, 6rem)",
          gridTemplateRows: "minmax(7rem, auto) repeat(5, 6rem) ",
        }}
      >
        <Stack
          sx={{
            borderRadius: "7px",
            backgroundColor: "#3B3B3B",
            gridColumn: "1 / -1",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-around",
            padding: ".75rem",
            wordWrap: "break-word",
            wordBreak: "break-all",
          }}
        >
          <Stack sx={{ color: "white", fontSize: "1.5rem" }}>
            {formatOperand(previousOperand)}
            {operation}
          </Stack>
          <Stack sx={{ color: "white", fontSize: "2.5rem" }}>
            {formatOperand(currentOperand)}
          </Stack>
        </Stack>
        <Button
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
          sx={{ gridColumn: "span 2", backgroundColor: "#696969", opacity: "0.7", margin: "5px"}}
          variant="contained"
        >
          AC
        </Button>
        <Button
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          DEL
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "/" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          /
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "1" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          1
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "2" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          2
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "3" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          3
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: ACTIONS.CHOOSE_OPERATION,
              payload: { operation: "*" },
            })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          *
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "4" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          4
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "5" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          5
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "6" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          6
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: ACTIONS.CHOOSE_OPERATION,
              payload: { operation: "+" },
            })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          +
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "7" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          7
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "8" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          8
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "9" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          9
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: ACTIONS.CHOOSE_OPERATION,
              payload: { operation: "-" },
            })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          -
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "." } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          .
        </Button>
        <Button
          onClick={() =>
            dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "0" } })
          }
          variant="contained"
          sx={{ backgroundColor: "#696969", opacity: "0.7", margin: "5px" }}
        >
          0
        </Button>
        <Button
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
          sx={{ gridColumn: "span 2", margin: "5px" }}
          variant="contained"
        >
          =
        </Button>
      </Stack>
    </Stack>
  );
}
