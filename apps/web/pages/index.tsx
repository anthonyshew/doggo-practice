import { Button } from "ui";
import { useEffect, useState } from "react";

export default function Web() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  const createBucket = () => {
    fetch("http://localhost:5000/create-bucket", { method: "POST" })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  const getSignedUrl = () => {
    fetch("http://localhost:5000/s3-url")
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Web</h1>
      <p>{process.env.TEST_ME}</p>
      <p>{process.env.NEXT_PUBLIC_TEST_ME}</p>
      {JSON.stringify(data)}
      <Button onClick={() => createBucket()} text="Create Bucket" />
      <Button onClick={() => getSignedUrl()} text="Get signed url" />
    </div>
  );
}
