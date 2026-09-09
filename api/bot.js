// api/bot.js
import { Telegraf } from 'telegraf';

// ---------- Slug generation logic (same as Mini App https://celebrated-sorbet-2aa894.netlify.app/) ----------
function generateSlug(raw) {
  let slug = raw.toLowerCase();
  slug = slug.trim();
  slug = slug.replace(/[\s_]+/g, '-');
  slug = slug.replace(/[^a-z0-9-]/g, '');
  slug = slug.replace(/-+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');
  return slug;
}

// ---------- Bot initialization ----------
const bot = new Telegraf(process.env.BOT_TOKEN);

// ---------- Commands ----------
bot.command('slug', (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const input = args.join(' ').trim();

  if (!input) {
    return ctx.reply(
      '✏️ Please provide some text.\nExample: `/slug My awesome blog post`',
      { parse_mode: 'Markdown' }
    );
  }

  const slug = generateSlug(input);
  if (!slug) {
    return ctx.reply('😕 No valid characters to generate a slug from that text.');
  }
  ctx.reply(
    `✅ *Slug:*\n\`${slug}\``,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Open Slug Generator', url: MINI_APP_URL }]
 
    }
  });
});

// ---------- Vercel serverless handler ----------
export default async function handler(req, res) {
  try {
    await bot.handleUpdate(req.body, res);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).send('Internal Server Error');
  }
}
