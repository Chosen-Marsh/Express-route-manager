import fs from 'fs/promises'
import path from 'path'
import { Router } from 'express'

class RouteLoader {
	/**
	 * Retrieves all files in a directory and its subdirectories.
	 * @param {string} dirPath - The path to the directory.
	 * @returns {Promise<string[]>} - A promise that resolves to an array of file paths.
	 */
	static async getAllFiles(dirPath: string): Promise<string[]> {
		let relativePath: string[] = []

		const entries = await fs.readdir(dirPath, { withFileTypes: true })

		for (const entry of entries) {
			if (entry.name !== 'routes.ts' && entry.name !== 'routes') {
				const absolutePath = path.join(dirPath, entry.name)

				if (entry.isDirectory()) {
					relativePath = relativePath.concat(
						await this.getAllFiles(absolutePath)
					)
				} else {
					relativePath.push(absolutePath)
				}
			}
		}

		return relativePath
	}
}

class RouteManager {
	path: string
	router: Router

	/**
	 * Represents a constructor for a route.
	 * @constructor
	 * @param {string} path - The path of the route.
	 * @param {Router} router - The router object.
	 */
	constructor(path: string, router: Router) {
		this.path = path
		this.router = router
	}

	/**
	 * Initializes the routes by dynamically loading and adding them to the router.
	 * @returns {Promise<void>} A promise that resolves when the routes are initialized.
	 */
	async initRoutes(): Promise<void> {
		try {
			const files = await RouteLoader.getAllFiles(__dirname)

			for (const file of files) {
				if (typeof file === 'string' && file.endsWith('.ts')) {
					const relativePath = file
						.replace(__dirname, '')
						.replace(/\\/g, '/')
						.replace('.ts', '')

					try {
						const importedModule = await import(`.${relativePath}`)

						if (
							importedModule.default &&
							importedModule.default.stack &&
							Array.isArray(importedModule.default.stack)
						) {
							const route = importedModule.default as Router

							this.router.use(relativePath, route)
							const httpMethod =
								route.stack[0].route.stack[0].method.toUpperCase()
							console.log(
								`[ROUTE] '${relativePath}' loaded with the method '${httpMethod}'`
							)
						} else {
							console.error(
								`[ROUTE] '${relativePath}' is not a valid route`
							)
						}
					} catch (error) {
						console.error(
							`[ROUTE] Error loading '${relativePath}': ${error}`
						)
					}
				}
			}
		} catch (error) {
			console.error(error)
		}
	}
}

export default RouteManager
