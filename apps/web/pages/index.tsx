import { Button } from "ui";
import { useEffect, useState } from "react";

export default function Web() {
  const [data, setData] = useState({})

  useEffect(() => {
    fetch("http://localhost:5000").then(res => res.json()).then(res => setData(res))
  }, [])

  return (
    <div>
      <h1>Web</h1>
      {JSON.stringify( data )}
      <Button />
    </div>
  );
}
