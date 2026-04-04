'use strict';

const express = require('express');
const catalyst = require('zcatalyst-sdk-node');

const app = express();
app.use(express.json());

/**
 * Fetch ALL objects with pagination
 */
async function getAllObjects(bucket, prefix = null) {
	let allObjects = [];
	let nextToken = null;

	do {
		const options = {
			maxKeys: 50, // batch size
			continuationToken: nextToken,
			prefix
		};

		const response = await bucket.listPagedObjects(options);

		if (response && response.contents) {
			allObjects = allObjects.concat(response.contents);
		}

		nextToken = response.next_continuation_token;
	} while (nextToken);

	return allObjects;
}


/**
 * GET all videos
 */
app.get('/videos', async (req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const bucket = catalystApp.stratus().bucket("biblevideos");

		// Fetch all files
		const objects = await getAllObjects(bucket);

		res.json({
			status: "success",
			data: objects.data
		});

	} catch (error) {
		console.error("Stratus Error:", error);
		res.status(500).json({
			error: 'Failed to list videos',
			details: error.message || String(error)
		});
	}
});




app.all('/', (req, res) => {
	res.status(200).send("The server is online");
});

module.exports = app;