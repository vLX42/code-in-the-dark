import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEntryStore } from "../hooks/useEntryStore";

const Home: NextPage = () => {
  const router = useRouter();
  const { entry, updateSubmitted } = useEntryStore();


  return (
    <>


      <h1>Thanks!</h1>
      <h3>Your entry has been submitted</h3>
      <div onClick={() => updateSubmitted(false)}>Secret back button</div>
    </>
  );
};

export default Home;
