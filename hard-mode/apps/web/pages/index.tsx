import { Button } from "ui";
import { ChangeEvent, useState } from "react";

export default function Web() {
  const [bucketName, setBucketName] = useState("");
  const [signedUrl, setSignedUrl] = useState("");

  const listBuckets = () => {
    fetch("http://localhost:5000/list-buckets")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  };

  const createBucket = () => {
    fetch("http://localhost:5000/create-bucket", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        if (res["$fault"]) return;
        setBucketName(res);
      })
      .catch((err) => console.error(err));
  };

  const deleteBucket = () => {
    fetch("http://localhost:5000/delete-bucket", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        if (res["$fault"]) return;
        setBucketName("");
      })
      .catch((err) => console.error(err));
  };

  const getSignedUrl = () => {
    fetch("http://localhost:5000/s3-url")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setSignedUrl(res.url);
      })
      .catch((err) => console.error(err));
  };

  const uploadPic = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const data = new FormData();

    if (files) {
      data.append("file", files[0]);
      fetch(signedUrl, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <h1>Web</h1>
      <p>{process.env.TEST_ME}</p>
      <p>{process.env.NEXT_PUBLIC_TEST_ME}</p>
      <p>{bucketName}</p>
      <Button onClick={listBuckets} text="List Buckets" />
      <Button onClick={createBucket} text="Create Bucket" />
      <Button onClick={deleteBucket} text="Delete Bucket" />
      <Button onClick={() => getSignedUrl()} text="Get signed url" />
      <input type="file" onChange={uploadPic} />
      <Button onClick={() => console.log("")} text="Present pic" />
    </div>
  );
}
