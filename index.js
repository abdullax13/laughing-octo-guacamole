import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = process.env.PREFIX || "-";

let activeEvent = false;
let wrongCounts = {};

const flags = [
  { name: "قطر", emoji: "🇶🇦" },
  { name: "الكويت", emoji: "🇰🇼" },
  { name: "السعودية", emoji: "🇸🇦" },
  { name: "البانيا", emoji: "🇦🇱" },
  { name: "تركيا", emoji: "🇹🇷" },
  { name: "فرنسا", emoji: "🇫🇷" }
];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === PREFIX + "ايفنت") {
    if (activeEvent) return message.reply("في ايفنت شغال.");
    activeEvent = true;
    wrongCounts = {};
    message.channel.send("بدأ ايفنت أعلام 🎌");
    startRound(message.channel);
  }

  if (!activeEvent) return;
  if (!message.content.startsWith(PREFIX)) return;

  const guess = message.content.slice(PREFIX.length).trim();
  if (!currentAnswer) return;

  if (guess === currentAnswer) {
    activeEvent = false;
    const seconds = ((Date.now() - startTime) / 1000).toFixed(2);
    message.channel.send(`إجابة صحيحة خلال ${seconds} ثانية 🎉`);
  } else {
    wrongCounts[message.author.id] = (wrongCounts[message.author.id] || 0) + 1;
    if (wrongCounts[message.author.id] >= 2) {
      activeEvent = false;
      message.channel.send("تم إيقاف الايفنت بسبب خطأ مرتين.");
    }
  }
});

let currentAnswer = null;
let startTime = null;

function startRound(channel) {
  const random = flags[Math.floor(Math.random() * flags.length)];
  currentAnswer = random.name;
  startTime = Date.now();

  channel.send(`ما اسم هذه الدولة؟ ${random.emoji}`);

  setTimeout(() => {
    if (activeEvent) {
      activeEvent = false;
      channel.send("انتهى الوقت 15 ثانية ⏳");
    }
  }, 15000);
}

client.login(process.env.DISCORD_TOKEN);
