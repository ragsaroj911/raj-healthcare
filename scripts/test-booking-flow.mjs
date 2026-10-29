async function testBooking() {
  console.log("Testing POST /api/appointments...");
  try {
    const res = await fetch("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: "srv-1",
        appointmentDate: "2026-10-30",
        startTime: "10:30",
        endTime: "11:00",
        customerName: "Vikram Sharma",
        customerEmail: "delivered@resend.dev",
        customerPhone: "+91 98765 43210",
        notes: "Routine health checkup via live test",
      }),
    });

    const data = await res.json();
    console.log("Booking response status:", res.status);
    console.log("Created appointment:", data);
  } catch (err) {
    console.error("Booking test failed:", err);
  }
}

testBooking();

