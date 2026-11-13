import BizError from '../error/biz-error';

const fields = { name: 120, title: 120, phone: 80, address: 500 };
const signatureService = {
    async get(c, userId, email) {
        const saved = await c.env.kv.get('mail-signature:' + userId, { type: 'json' });
        if (saved) return saved;
        const isRay = email.toLowerCase() === 'ray.jiangchenxi@infotrekx.com';
        return {
            enabled: isRay,
            name: isRay ? 'Ray Jiang' : '',
            title: isRay ? 'Marketing Development' : '',
            phone: isRay ? '+52 5621849869' : '',
            address: 'Simón Bolívar 232, Local B, Colonia Obrera, C.P. 06800, Alcaldía Cuauhtémoc, Ciudad de México, CDMX',
        };
    },
    async save(c, userId, input) {
        if (!input || typeof input.enabled !== 'boolean') throw new BizError('Invalid signature');
        const value = { enabled: input.enabled };
        for (const [field, limit] of Object.entries(fields)) {
            if (typeof input[field] !== 'string' || input[field].length > limit) {
                throw new BizError('Invalid signature: ' + field);
            }
            value[field] = input[field].trim();
        }
        await c.env.kv.put('mail-signature:' + userId, JSON.stringify(value));
        return value;
    },
};
export default signatureService;
