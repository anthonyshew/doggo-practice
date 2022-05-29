import { Button } from "ui";
import { useEffect, useState } from "react";

export default function Web() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  const doThing = () => {};

  return (
    <div>
      <h1>Web</h1>
      <p>{process.env.TEST_ME}</p>
      <p>{process.env.NEXT_PUBLIC_TEST_ME}</p>
      {JSON.stringify(data)}
      <Button onClick={() => doThing()} text="Get signed url" />
    </div>
  );
}
