import Elysia from 'elysia';
import { ip } from 'elysia-ip';

const hasher = new Bun.CryptoHasher('sha256');

export const identify = new Elysia({ name: 'identify' })
    .use(ip())
    .state('networkId', '')
    .onBeforeHandle({ as: 'global' }, ({ request, ip, store }) => {
        // Only process network id for actions
        if (!['PUT', 'POST'].includes(request.method)) return;

        store.networkId = hasher.update(ip).digest('hex');
    });