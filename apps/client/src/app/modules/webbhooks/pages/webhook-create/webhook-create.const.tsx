import * as yup from 'yup';

import { WebhookEvents } from '~shared';

export const createWebhookSchema = yup.object({
	url: yup.string().required(),
	event: yup.string().required().oneOf([WebhookEvents.CONTENT_PUBLISH]),
	request_configuration: yup.object().optional(),
	active: yup.bool().required(),
});
