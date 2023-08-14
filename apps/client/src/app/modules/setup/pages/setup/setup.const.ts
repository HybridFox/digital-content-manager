import * as yup from "yup"

export const setupSchema = yup
	.object({
		email: yup.string().required().email(),
		name: yup.string().required().min(5),
		password: yup.string().required().min(5)
	})
