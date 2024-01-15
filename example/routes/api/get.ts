import Express, { Request, Response } from 'express'

const router = Express.Router()

router.get('/', (req: Request, res: Response) => {
	res.json({ message: "I am a GET method" })
})

export default router
