import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import prisma from "../../lib/prisma";
import { Entry, Timelap } from ".prisma/client";

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
    (entry as Entry & { timelaps: Timelap[] })?.timelaps.length
  );

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      const doc = iframeRef?.current?.contentDocument;
      doc?.open();
      doc?.write(
        (timeLeft == 1
          ? entry?.html
          : (entry as Entry & { timelaps: Timelap[] })?.timelaps[timeLeft]
              ?.html) || ""
      );
      doc?.close();
      setTimeLeft(timeLeft - 1);
    }, 100);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
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
        select: { html: true, id: true },
      },
    },
  });
  return {
    props: {
      entry,
    },
  };
};
