import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import prisma from "../../lib/prisma";
import { Entry, Timelap } from ".prisma/client";
import { injectCode } from "../../config/event";

export type PageProps = {
  entry: Entry | null;
};

export default function PageComponent(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
): JSX.Element {
  const { entry } = data;
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [timeLeft, setTimeLeft] = useState(
    (entry as Entry & { timelaps: Timelap[] })?.timelaps.length + 1
  );

  useEffect(() => {
    if (timeLeft < 0) return;

    const intervalId = setInterval(() => {
      const doc = iframeRef?.current?.contentDocument;
      doc?.open();

      if (timeLeft === 1) {
        doc?.write(injectCode + (entry?.html || ""));
      } else if (timeLeft > 1) {
        doc?.write(
          injectCode +
            (entry as Entry & { timelaps: Timelap[] })?.timelaps[timeLeft - 2]
              ?.html || ""
        );
      } else {
        setTimeLeft(
          (entry as Entry & { timelaps: Timelap[] })?.timelaps.length + 1
        );
      }

      doc?.close();
      setTimeLeft(timeLeft - 1);
    }, 100);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{entry?.handle}</h1>
      <h3>{entry?.fullName}</h3>
      <h4>Score: {entry?.score}</h4>
      <iframe ref={iframeRef} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
}) => {
  const entry = await prisma.entry.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      timelaps: {
        orderBy: { id: "desc" },
        select: { id: true, html: true },
      },
    },
  });
  return {
    props: {
      entry,
    },
  };
};
