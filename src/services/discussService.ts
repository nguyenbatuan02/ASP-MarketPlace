import { callKw, rpc } from '../api/odoo';

let cachedChannelId: number | null = null;

export interface OdooMessage {
  id: number;
  body: string;
  author_id: [number, string];
  date: string;
}

export const discussService = {
  async getChannelId(): Promise<number | null> {
    if (cachedChannelId) return cachedChannelId;
    try {
      const result = await rpc<[string, number]>('/web/dataset/call_kw', {
        model: 'ir.model.data',
        method: 'check_object_reference',
        args: ['is_chatgpt_integration', 'channel_chatgpt'],
        kwargs: {},
      });
      cachedChannelId = result?.[1] ?? null;
      return cachedChannelId;
    } catch {
      try {
        const channels = await callKw<{ id: number }[]>(
          'discuss.channel', 'search_read',
          [[['name', 'ilike', 'ChatGPT']]],
          { fields: ['id', 'name'], limit: 1 }
        );
        cachedChannelId = channels[0]?.id ?? null;
        return cachedChannelId;
      } catch {
        return null;
      }
    }
  },

  async sendMessage(channelId: number, text: string): Promise<void> {
    await callKw(
      'discuss.channel',
      'message_post',
      [[channelId]],
      {
        body: text,
        message_type: 'comment',
        subtype_xmlid: 'mail.mt_comment',
      }
    );
  },

  async getLatestMessageId(channelId: number): Promise<number> {
    const msgs = await callKw<{ id: number }[]>(
      'mail.message', 'search_read',
      [[
        ['res_id', '=', channelId],
        ['model', '=', 'discuss.channel'],
        ['message_type', 'in', ['comment', 'email']],
      ]],
      { fields: ['id'], order: 'id desc', limit: 1 }
    );
    return msgs[0]?.id ?? 0;
  },

  async getMessages(channelId: number, lastId = 0): Promise<OdooMessage[]> {
    const domain: unknown[] = [
      ['res_id', '=', channelId],
      ['model', '=', 'discuss.channel'],
      ['message_type', 'in', ['comment', 'email']],
    ];
    if (lastId > 0) domain.push(['id', '>', lastId]);

    return callKw<OdooMessage[]>(
      'mail.message', 'search_read',
      [domain],
      {
        fields: ['id', 'body', 'author_id', 'date'],
        order: 'id asc',
        limit: 10,
      }
    );
  },

  async getBotPartnerId(): Promise<number | null> {
    try {
      const result = await rpc<[string, number]>('/web/dataset/call_kw', {
        model: 'ir.model.data',
        method: 'check_object_reference',
        args: ['is_chatgpt_integration', 'partner_chatgpt'],
        kwargs: {},
      });
      return result?.[1] ?? null;
    } catch {
      return null;
    }
  },
};