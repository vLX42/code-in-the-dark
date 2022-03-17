import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { eventId } from "../../config/event";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const feed = await prisma.entry.findMany({
    where: { eventId: eventId },
    orderBy: { score: "desc" },
  });

  prisma.$disconnect();

  res.status(200).json(feed);
};

export default handler;
