import Express, { Request, Response } from 'express'

const router = Express.Router()

router.post('/', (req: Request, res: Response) => {
	res.json({ message: 'I am a POST method' })
})

export default router
