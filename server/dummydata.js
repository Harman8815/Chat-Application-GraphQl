import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Room from "./models/Room.js";
import Message from "./models/Message.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/chat-app";

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);

    await User.deleteMany({});
    await Room.deleteMany({});
    await Message.deleteMany({});

    const passwordHash = await bcrypt.hash("password123", 10);
    const userNames = [
      "alice", "bob", "charlie", "david", "emma",
      "frank", "grace", "henry", "isla", "jack",
      "karen", "liam", "mia", "noah", "olivia"
    ];

    const users = await User.insertMany(
      userNames.map((name) => ({
        username: name,
        email: `${name}@example.com`,
        passwordHash,
        bio: `Hi, I'm ${name}`,
        isOnline: false
      }))
    );

    const rooms = [];
    for (let i = 0; i < 10; i++) {
      const isGroup = i % 2 === 0;
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const memberCount = isGroup ? Math.floor(Math.random() * 4) + 3 : 2;
      const members = shuffledUsers.slice(0, memberCount).map((u) => u._id);

      const room = await Room.create({
        name: isGroup ? `Group Room ${i + 1}` : `Private Room ${i + 1}`,
        isGroup,
        members,
        createdBy: members[0]
      });
      rooms.push(room);
    }

    const sampleMessages = [
      "Hello there!",
      "What's up?",
      "Good morning!",
      "How are you doing?",
      "Let's catch up soon.",
      "Interesting topic!",
      "Nice to meet you!",
      "I'm doing great, thanks!",
      "See you later.",
      "That sounds fun!"
    ];

    for (const room of rooms) {
      const roomMembers = room.members;
      const messageCount = Math.floor(Math.random() * 10) + 5;
      for (let i = 0; i < messageCount; i++) {
        const randomUser = roomMembers[Math.floor(Math.random() * roomMembers.length)];
        const randomContent = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        await Message.create({
          content: randomContent,
          sender: randomUser,
          roomId: room._id,
          status: "sent"
        });
      }
    }

    console.log("Dummy data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
