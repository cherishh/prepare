import react, { useState, useEffect, useCallback } from "react";
import "./styles.css";
import { removeDup } from "./algorithm";

function a() {
  return 66;
}

export default function App() {
  const [count, setCount] = useState({ count: 0 });

  useEffect(() => {
    // const node = document.getElementById("rect");
    // console.log(node);
    console.log(removeDup([0, 1, 2, 2, 3]));
  }, []);

  const handleUpdate = useCallback(() => {
    setCount({
      count: 0
    });
  }, []);

  return (
    <div className="App">
      <h1>{count.count}</h1>
      <button onClick={handleUpdate}>button</button>
      <hr />

      <div className="test"></div>
      <div id="rect" className="rect"></div>
      <div className="semi-circle"></div>
    </div>
  );
}
