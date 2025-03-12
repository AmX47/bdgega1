const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1348080694727020624/4I8-K1uLyA-C4WU_M6ZrXAMsZgMUL8kzvgdZdP3UQ68BSEuTXX4FkTUoVN_tksYt-FrZ';

export const sendDiscordNotification = async (
  title: string,
  description: string,
  color: number = 0x800020, // Burgundy color
  fields?: { name: string; value: string }[]
) => {
  try {
    const embed = {
      title,
      description,
      color,
      timestamp: new Date().toISOString(),
      fields
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
};
