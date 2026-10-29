import { findPortalUserByEmail } from "../src/lib/data/store.js";
import { hashPassword } from "../src/lib/auth.js";

async function test() {
  console.log("Looking up user...");
  try {
    const user = await findPortalUserByEmail("ragsaroj911@gmail.com");
    console.log("Found user:", user);

    const inputHash = hashPassword("Vikram@3000");
    console.log("Input hash:", inputHash);
    console.log("User hash: ", user?.password_hash);
    console.log("Match: ", inputHash === user?.password_hash);
  } catch (err) {
    console.error("Error in test:", err);
  }
}

test();

