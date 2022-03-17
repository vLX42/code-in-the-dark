import type { NextPage } from "next";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { useRouter } from "next/router";
import styles from "../../styles/score.module.scss";

interface entry {
  eventId: number;
  fullName: string;
  handle: string;
  html: string;
  id: number;
  powerMode: boolean;
  score: number;
}

const Score: NextPage = () => {
  const router = useRouter();
  const { data, error } = useSWR<entry[]>("/api/getScore", fetcher, {
    refreshInterval: 10000,
  });

  return (
    <div style={{ textAlign: "center" }}>
      <h1>High score!</h1>
      <h3>Who is in the lead</h3>
      {!data && !error && <div>Loading...</div>}
      {data?.map((entry) => (
        <div
          onClick={() => {
            router.push("/score/" + entry.id);
          }}
          className={`${styles.entry} ${
            entry.powerMode ? styles.powerMode : null
          }`}
          key={entry.id}
        >
          <div>{entry.handle}</div>
          <div>{entry.fullName}</div>
          <div>{entry.score}</div>
        </div>
      ))}
    </div>
  );
};

export default Score;
