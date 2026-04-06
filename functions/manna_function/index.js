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

		// get bucket details
		const bucketDetail = await bucket.getDetails();

		const options = {}; // Empty options to fetch all objects
		const listobj = bucket.listIterableObjects(options);

		const allObjects = [];
		for await (const file of listobj) {
			allObjects.push(file);
		}

		// console.log(allObjects);
		res.json({
			message: "Videos fetched successfully",
			bucketUrl: bucketDetail.bucket_url,
			videos: allObjects.map(obj => ({
				key: obj.keyDetails.key,
				size: obj.keyDetails.size
			}))
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