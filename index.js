import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
	scheme: 'http',
	host: 'localhost:8080',
});

const schemaRes = await client.schema.getter().do();

console.log(schemaRes)

const schemaConfig = {
	'class': 'bb',
	'vectorizer': 'img2vec-neural',
	'vectorIndexType': 'hnsw',
	'moduleConfig': {
		'img2vec-neural': {
			'imageFields': [
				'image'
			]
		}
	},
	'properties': [
		{
			'name': 'image',
			'dataType': ['blob']
		},
		{
			'name': 'text',
			'dataType': ['string']
		}
	]
}

await client.schema
	.classCreator()
	.withClass(schemaConfig)
	.do();

const img = readFileSync('./img/hi-mom.jpg');

const b64 = Buffer.from(img).toString('base64');

await client.data.creator()
	.withClassName('bb')
	.withProperties({
		image: b64,
		text: 'matrix meme'
	})
	.do();

const test = Buffer.from(readFileSync('./test.jpg')).toString('base64');

const resImage = await client.graphql.get()
	.withClassName('bb')
	.withFields(['image'])
	.withNearImage({ image: test })
	.withLimit(1)
	.do();

// Write result to filesystem
const result = resImage.data.Get.Meme[0].image;
writeFileSync('./result.jpg', result, 'base64');
