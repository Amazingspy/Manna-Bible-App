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

/**
 * POST /auth/generate-token
 * Generates a custom JWT token for native authentication
 */
app.post('/auth/generate-token', async (req, res) => {
	try {
		const { email, first_name, last_name } = req.body;
		
		if (!email) {
			return res.status(400).json({ error: "Email is required" });
		}

		const catalystApp = catalyst.initialize(req);
		const userManagement = catalystApp.userManagement();

		// In a real app, you would verify the password here
		// For now, we generate a token for the provided user details
		const tokenConfig = {
			type: 'web', 
			user_details: {
				email_id: email,
				first_name: first_name || "Manna",
				last_name: last_name || "User"
			}
		};

		const customToken = await userManagement.generateCustomToken(tokenConfig);

		res.json({
			message: "Token generated successfully",
			token: customToken
		});

	} catch (error) {
		console.error("Auth Error:", error);
		res.status(500).json({
			error: 'Failed to generate custom token',
			details: error.message || String(error)
		});
	}
});


app.all('/', (req, res) => {
	res.status(200).send("The server is online");
});

module.exports = app;