import { rpc, DB } from '../api/odoo';

export interface OdooUser {
  uid: number;
  name: string;
  username: string; // email
  partner_id: number;
  company_id: number;
}

export interface SessionResult {
  uid: number | false;
  name: string;
  username: string;
  partner_id: number;
  company_id: number;
  is_admin: boolean;
  is_system: boolean;
}

export const authService = {
  async login(email: string, password: string): Promise<OdooUser> {
    const result = await rpc<SessionResult>('/web/session/authenticate', {
      db: DB,
      login: email,
      password,
    });

    if (!result.uid) throw new Error('Sai email hoặc mật khẩu');

    return {
      uid: result.uid,
      name: result.name,
      username: result.username,
      partner_id: result.partner_id,
      company_id: result.company_id,
    };
  },

  async logout(): Promise<void> {
    await rpc('/web/session/destroy', {});
  },

  async getSession(): Promise<OdooUser | null> {
    try {
      const result = await rpc<SessionResult>('/web/session/get_session_info', {});
      if (!result.uid) return null;
      return {
        uid: result.uid,
        name: result.name,
        username: result.username,
        partner_id: result.partner_id,
        company_id: result.company_id,
      };
    } catch {
      return null;
    }
  },

  async updateProfile(partnerId: number, data: { name?: string; phone?: string }): Promise<void> {
    const { callKw } = await import('../api/odoo');
    await callKw('res.partner', 'write', [[partnerId], data]);
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await rpc('/web/dataset/call_kw', {
      model: 'res.users',
      method: 'change_password',
      args: [oldPassword, newPassword],
      kwargs: {},
    });
  },
};