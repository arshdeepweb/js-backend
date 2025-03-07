import { desc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { UserPreferences, usersTable } from "../db/schema.js";

export const createUser = async (req, res) => {
  const { name, age, email } = req.body;

  // Validate input to avoid empty values
  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Name and email are required" });
  }

  try {
    // Correct the usage of values()
    const user = await db
      .insert(usersTable)
      .values({ name, age, email })
      .$returningId();

    console.log(user);

    return res
      .status(200)
      .json({ success: true, message: "User Created", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error", error });
  }
};

// get All USERS with All Fields and specific fields and limit queries
export const getAllUsers = async (req, res) => {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.id))
      .limit(5);

    return res
      .status(200)
      .json({ success: true, message: "User Created", data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export const getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return res
      .status(200)
      .json({ success: true, message: "User Created", data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export const updateUser = async (req, res) => {
  const user = req.body;

  
  try {
    const updateUser = await db
      .update(usersTable)
      .set(user)
      .where(eq(usersTable.id, user.id));

    return res
      .status(200)
      .json({ success: true, message: "User Updated", data: updateUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export const UserQueries = async (req, res) => {
  try {

    // await db.insert(UserPreferences).values({
    //   email: true,
    //   userId: 2
    // })

    const users = await db.query.usersTable.findMany({
      columns: {email: false},
      extras: { lowerCasename: sql`upper(${usersTable.name})`.as("lowerCaseName") },
      where: (teble, func) => func.ilike(usersTable.name, '%arsh%')
      // orderBy: desc(usersTable.id)
      // limit: 1,
      // offset:1,
      // with : {
      //   preferences: true
      // }
    })

    return res.status(200).json({ success: true, message: "Fetch users", data:users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
}