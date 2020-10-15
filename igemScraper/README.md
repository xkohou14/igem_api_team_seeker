# iGEM scraper script
Parses iGEM teams and biobricks.

Example usage:
```shell script
$ gradle run --args='test@test.cz tester http://localhost:3001'
```

If you want to create <i>data.json</i> file for react-app deployment at git 
https://github.com/xkohou14/igem_team_seeker_client

run:
```shell script
$ gradle run --args='test@test.cz tester http://localhost:3001 file'
```

than copy <i>data.json</i> to <i>igem_team_seeker_client/src/</i> and in <i>igem_team_seeker_client/</i>

run

```shell script
$ npm run deploy
``` 