import * as yup from "yup"

export const loginSchema = yup
	.object({
		email: yup.string().required().email(),
		password: yup.string().min(5)
	})
