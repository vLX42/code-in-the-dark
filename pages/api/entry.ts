import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { eventId } from "../../config/event";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.DEMO_MODE) {
    res.send({ id: -42 });
    return;
  }
  const { handle, fullName } = req.body;

  const missingParams = Object.entries({
    handle,
    fullName,
    eventId,
  })
    .filter(([_, value]) => !value)
    .map(([key]) => `'${key}'`);

  if (missingParams.length) {
    res.send({
      status: 400,
      error: `${missingParams.join(", ")} must be provided`,
    });
  }

  const newEntry = await prisma.entry.create({
    data: {
      handle,
      fullName,
      eventId,
    },
  });

  prisma.$disconnect();

  res.send(newEntry);
};

export default handler;
