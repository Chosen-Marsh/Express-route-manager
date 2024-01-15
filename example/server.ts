import Express, { Request, Response } from 'express'
import RouteManager from './routes/routes'
const app = Express()
const PORT = 3000

async function main() {
	const routeManager = new RouteManager('/', app)
	await routeManager.initRoutes()
	app.get('/', (req: Request, res: Response) => {
		res.send('This is an example server for my custom dynamic route manger')
	})

	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT} | http://localhost:${PORT}`)
	})
}

main()
