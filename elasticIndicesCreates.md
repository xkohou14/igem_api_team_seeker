## Team index create
PUT /team
```json
{
	"mappings": {
		"properties": {
			"abstract": {
				"type": "text",
				"analyzer": "english"
			},
			"title": {
				"type": "text",
				"analyzer": "english"
			}
		}
	}
}
```

## Biobricks index create
PUT /biobricks
```json
{
	"mappings": {
		"properties": {
			"content": {
				"type": "text",
				"analyzer": "english"
			}
		}
	}
}
```