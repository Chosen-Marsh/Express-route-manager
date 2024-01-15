import Express, { Request, Response } from 'express'

const router = Express.Router()

router.delete('/', (req: Request, res: Response) => {
	res.json({ message: 'I am a DELETE method' })
})

export default router
