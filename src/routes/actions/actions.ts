import { Router } from 'express';

const actions = Router();

enum Action {
    INVITE = 'Invite',
    SEND_MESSAGE = 'Send Message',
    VISIT = 'Visit',
}

actions.get('/', (_, res) => {
    const actions = Object.values(Action);
    res.json(actions);
});

export { actions };