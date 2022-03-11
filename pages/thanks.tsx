import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { useEntryStore } from "../hooks/useEntryStore";

const Home: NextPage = () => {
  const router = useRouter();
  const { entry, updateSubmitted } = useEntryStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const doc = iframeRef?.current?.contentDocument;
    doc?.open();
    doc?.write(entry?.html || "");
    doc?.close();
  }, []);

  return (
    <div style={{ textAlign: 'center'}}>
      <h1>Thanks!</h1>
      <h3>Your entry has been submitted</h3>
      <iframe ref={iframeRef} />
      <div
        onClick={() => {
          updateSubmitted(false);
          router.push("/editor");
        }}
      >
        Secret back button
      </div>
    </div>
  );
};

export default Home;
