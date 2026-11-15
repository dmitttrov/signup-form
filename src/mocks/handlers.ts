import { HttpResponse, http } from 'msw/http';
import { delay } from 'msw/utils/delay';

import { SignupData } from '../app/features/signup/data/signup.model';

export const handlers = [
  http.post('/api/signup', async ({ request }) => {
    const body = (await request.json()) as SignupData;

    await delay(400);

    return HttpResponse.json({ ok: true, received: body }, { status: 200 });
  }),
];
