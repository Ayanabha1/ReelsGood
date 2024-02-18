async function reserveSeat(body) {
  const baseURL = "http://localhost:3000/api";
  const res = await fetch(`${baseURL}/bookTicket`, {
    method: "POST",
    body: body,
  });

  return res.status === 200 ? true : false;
}
const seatIdCases = [
  {
    seatIds: [-1, -2, -3],
    seats: ["A1", "A2", "A3"],
    streamingId: 12,
    customerId: "test",
  },
  // {
  //   seatIds: [-2, -1, -3],
  //   streamingId: 0,
  //   customerId: "test1",
  // },
  // {
  //   seatIds: [-3, -1, -2],
  //   streamingId: 0,
  //   customerId: "test2",
  // },
  // {
  //   seatIds: [-1, -3, -2],
  //   streamingId: 0,
  //   customerId: "test",
  // },
  // {
  //   seatIds: [-2, -3, -1],
  //   streamingId: 0,
  //   customerId: "test1",
  // },
  // {
  //   seatIds: [-3, -2, -1],
  //   streamingId: 0,
  //   customerId: "test2",
  // },
  // {
  //   seatIds: [-1, -4],
  //   streamingId: 0,
  //   customerId: "test",
  // },
  // {
  //   seatIds: [-2, -4],
  //   streamingId: 0,
  //   customerId: "test1",
  // },
  // {
  //   seatIds: [-4, -3, -1],
  //   streamingId: 0,
  //   customerId: "test2",
  // },
];

async function test() {
  let promises = seatIdCases.map((body) => {
    const res = reserveSeat(JSON.stringify(body));
    return res;
  });

  try {
    const responses = await Promise.all(promises);
    console.log(responses);
  } catch (error) {
    console.log(error);
  }
}

test();
