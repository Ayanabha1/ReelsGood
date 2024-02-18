import prismaDB from "@/lib/prismaDb";

export async function POST(request: Request) {
  const payload = await request.json();
  const email = payload?.data?.email_addresses[0]?.email_address;
  const first__name = payload?.data?.first_name;
  const last__name = payload?.data?.last_name;
  const user__id = payload?.data?.id;

  try {
    await prismaDB.customer.create({
      data: {
        user_id: user__id,
        first_name: first__name,
        last_name: last__name,
        email: email,
      },
    });
  } catch (error) {
    console.log(error);
  }

  return Response.json({ message: "Received" });
}
