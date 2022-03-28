import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { useEntryStore } from "../hooks/useEntryStore";
import { injectCode, showPreview } from "../config/event";

const Home: NextPage = () => {
  const router = useRouter();
  const { entry, updateIsSubmitted } = useEntryStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (showPreview) {
      const doc = iframeRef?.current?.contentDocument;
      doc?.open();
      doc?.write(injectCode + entry?.html || "");
      doc?.close();
    }
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Thanks!</h1>
      <h3>Your entry has been submitted</h3>
      {showPreview&&<iframe ref={iframeRef} />}
      <div
        onClick={() => {
          updateIsSubmitted(false);
          router.push("/editor");
        }}
      >
        &nbsp;
      </div>
    </div>
  );
};

export default Home;
