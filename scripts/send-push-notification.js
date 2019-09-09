const { Expo } = require("expo-server-sdk");
const expo = new Expo();

const pushTokens = [process.env.PUSH_TOKEN];

const messageList = pushTokens.map(t => {
  if (!Expo.isExpoPushToken(t)) {
    console.error(`Push token ${t} is not a valid Expo push token`);
  }
  return {
    to: t,
    sound: "default",
    title: "A test notification",
    body: "Would you like A or B?",
    priority: "high",
    data: { id: 1 },
    _displayInForeground: true,
    _category: "@jcartw89/expo-interactive-push-notification:A_OR_B"
  };
});

// group multiple notifications into chunks (less requests needed)
const sendNotifications = async messageList => {
  const chunks = expo.chunkPushNotifications(messageList);
  for (let chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
  return "sent";
};

sendNotifications(messageList);
