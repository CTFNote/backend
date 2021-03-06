# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.0](https://github.com/CTFNote/backend/compare/v0.1.0-alpha.3...v0.1.0) (2021-02-16)


### Features

* add config option for if the user is optional or not ([814194c](https://github.com/CTFNote/backend/commit/814194ce9d6ce03dac472a5b40db3805dcc5e018))
* add initial user middleware ([f84b705](https://github.com/CTFNote/backend/commit/f84b7051d10909356c2a3491538d3045b2d55034))
* add user middleware to all routes that need it ([69600d2](https://github.com/CTFNote/backend/commit/69600d245c079d9fc8b8a61ee5e801618306ef95))
* create and add team middleware ([a827bd9](https://github.com/CTFNote/backend/commit/a827bd95988fdedec1ab5eb38c3221d372400c7f))
* **api:** add CTF API router ([f1866c6](https://github.com/CTFNote/backend/commit/f1866c6b267430e1b03d1c49fd0fdd88541c24a0))
* **ctf:** ability to list CTFs in team ([df1bfb1](https://github.com/CTFNote/backend/commit/df1bfb197c106ed89a9b9dd0d8bfae549174f1e2))
* **ctf:** add ability to archive and unarchive CTFs ([be47738](https://github.com/CTFNote/backend/commit/be477388c10e329539f75bb8b7e7b8e4f13ba2e6))
* **ctf:** get specific CTF ([0d54a67](https://github.com/CTFNote/backend/commit/0d54a6753d78c285a14aaee37949eb2f513ffafa))
* ability to delete users ([eecee6c](https://github.com/CTFNote/backend/commit/eecee6c1fddcd19ced7ba0d3865b9a2b42aadb1e)), closes [#36](https://github.com/CTFNote/backend/issues/36)
* config for hedgeDoc API ([e039408](https://github.com/CTFNote/backend/commit/e039408ea54a620e9f49ffed97f5416f06ee3352))
* createCTF method in CTFService class ([e07b874](https://github.com/CTFNote/backend/commit/e07b874f010914f426ef03168e266cf6bd99f1e9))
* initial CTF service ([30d2057](https://github.com/CTFNote/backend/commit/30d205744e62a10708e06678490d086a1ce2f9b2))


### Bug Fixes

* accept requests in the 200-399 range ([d75172a](https://github.com/CTFNote/backend/commit/d75172aa5e46572f74ef8217e48fcac089c45b41))
* fix broken import ([03e0ce6](https://github.com/CTFNote/backend/commit/03e0ce616770860bdeb8ca59097b1f335b1358fe))
* fix dev script to run with new types ([adc90d2](https://github.com/CTFNote/backend/commit/adc90d2291dc750ff9e4edcdba06811a9ee26c98))
* fix unused import error (lgtm issue) ([be9175a](https://github.com/CTFNote/backend/commit/be9175a2436d4f59e1d40537d09895105682cb7b))
* **config:** fix broken config format ([094ac66](https://github.com/CTFNote/backend/commit/094ac66a4d4e48a9ac5f78bba7c62e0b5d9002f8))
* **deps:** update dependency mongoose to v5.11.15 ([f80c445](https://github.com/CTFNote/backend/commit/f80c445cd74fd3862fa210a8ad5b59f8f741dc9e))
* **tsconfig:** remove baseUrl due to issues with compilation ([b8b4fee](https://github.com/CTFNote/backend/commit/b8b4feea0f01ec2d4ae2c5158f77bbca12b6999f))


### Docs

* write JSDocs for methods ([2b8351b](https://github.com/CTFNote/backend/commit/2b8351b888a0c05c9a8ca1927509eb60d8b7b8f5))


### Style

* formatting ([ac536d7](https://github.com/CTFNote/backend/commit/ac536d73711eca16a466e454c72be1c666bab0b8))
* formatting ([291631e](https://github.com/CTFNote/backend/commit/291631ea15a9284836f02c575e3c12f333cc7d8f))


### Chore

* add .idea to gitignore ([376bc61](https://github.com/CTFNote/backend/commit/376bc615f67f721f9358a4d25cd3513f9d00bf31))
* **ci:** create release script ([23a1fef](https://github.com/CTFNote/backend/commit/23a1fefe8f6017b1263e63ac90bf5d87da4c5230))
* **config:** add sample config file ([015e7d2](https://github.com/CTFNote/backend/commit/015e7d28cc7841c04f032d38ef6ce9331d8d4a88))
* **deps:** add axios to deps ([2ff3047](https://github.com/CTFNote/backend/commit/2ff3047ff3480879f9e97b6447897b8948a69613))
* **deps:** pin axios to v0.21.1 ([56a09a4](https://github.com/CTFNote/backend/commit/56a09a4052f4f219b6db507c9c307a0e73583484))
* **deps:** update @types/express to v4.17.11 ([f398b6d](https://github.com/CTFNote/backend/commit/f398b6d8532c761795fd2026e2e4e25cc7cdb3d0))
* **deps:** update dependency eslint to v7.19.0 ([14470b1](https://github.com/CTFNote/backend/commit/14470b106e7ad3a0150f467e22be7969b8b2a9f6))
* **deps:** update typescript-eslint monorepo to v4.15.0 ([63ba010](https://github.com/CTFNote/backend/commit/63ba010728a6edae7a579d5c4f40d9fcddfd268f))
* **release:** 0.1.0-alpha.4 ([ce51c40](https://github.com/CTFNote/backend/commit/ce51c4043764ca8078ddac37f267567422e401a2))
* **release:** update to correct release version ([5198223](https://github.com/CTFNote/backend/commit/51982230f3c1e7741209da971de18159d397e671))
* **types:** add type and docs for CTF creation ([5176689](https://github.com/CTFNote/backend/commit/517668986557d06b1eab7e7aa93c60b66fb551b4))


### Refactor

* remove useless check ([9d62796](https://github.com/CTFNote/backend/commit/9d6279651120ba30ce4e74a420b2dcd3cfe24c78))
* **logging:** add a better logging message ([f47b17c](https://github.com/CTFNote/backend/commit/f47b17c47b5fccc50910935628e487800a4151d4))
* add team to CTF model and remove participants ([7e5fcde](https://github.com/CTFNote/backend/commit/7e5fcdeb246e01984102376a52fad5589013d619))

## [0.1.0-alpha.4](https://github.com/CTFNote/backend/compare/v0.1.0-alpha.3...v0.1.0-alpha.4) (2021-01-25)


### ⚠ BREAKING CHANGES

* This probably breaks a lot of stuff, sorry :(

### Features

* **api:** add CTF API router ([f1866c6](https://github.com/CTFNote/backend/commit/f1866c6b267430e1b03d1c49fd0fdd88541c24a0))
* **ctf:** ability to list CTFs in team ([df1bfb1](https://github.com/CTFNote/backend/commit/df1bfb197c106ed89a9b9dd0d8bfae549174f1e2))
* **ctf:** add ability to archive and unarchive CTFs ([be47738](https://github.com/CTFNote/backend/commit/be477388c10e329539f75bb8b7e7b8e4f13ba2e6))
* **ctf:** get specific CTF ([0d54a67](https://github.com/CTFNote/backend/commit/0d54a6753d78c285a14aaee37949eb2f513ffafa))
* ability to delete users ([eecee6c](https://github.com/CTFNote/backend/commit/eecee6c1fddcd19ced7ba0d3865b9a2b42aadb1e)), closes [#36](https://github.com/CTFNote/backend/issues/36)
* check for missing SSL certs ([11058b5](https://github.com/CTFNote/backend/commit/11058b587af5103d92b7ccfff4cc78bbe8c0dc68))
* config for hedgeDoc API ([e039408](https://github.com/CTFNote/backend/commit/e039408ea54a620e9f49ffed97f5416f06ee3352))
* createCTF method in CTFService class ([e07b874](https://github.com/CTFNote/backend/commit/e07b874f010914f426ef03168e266cf6bd99f1e9))
* initial CTF service ([30d2057](https://github.com/CTFNote/backend/commit/30d205744e62a10708e06678490d086a1ce2f9b2))


### Bug Fixes

* accept requests in the 200-399 range ([d75172a](https://github.com/CTFNote/backend/commit/d75172aa5e46572f74ef8217e48fcac089c45b41))
* fix broken import ([03e0ce6](https://github.com/CTFNote/backend/commit/03e0ce616770860bdeb8ca59097b1f335b1358fe))
* **config:** fix broken config format ([094ac66](https://github.com/CTFNote/backend/commit/094ac66a4d4e48a9ac5f78bba7c62e0b5d9002f8))
* **deps:** update dependency mongoose to v5.11.13 ([5eb1758](https://github.com/CTFNote/backend/commit/5eb1758775903ddba9b2d6b87ba5f862b418f2d9))
* **tsconfig:** remove baseUrl due to issues with compilation ([b8b4fee](https://github.com/CTFNote/backend/commit/b8b4feea0f01ec2d4ae2c5158f77bbca12b6999f))
* disable automatic commit tagging ([50257dd](https://github.com/CTFNote/backend/commit/50257ddbbc02047e19d97fa6dc27f3dba6d37f50))
* disable LGTM issue ([85faacb](https://github.com/CTFNote/backend/commit/85faacba52c9a30693918c2e4581886067c43488))
* fix codeql scanning ([c6f877c](https://github.com/CTFNote/backend/commit/c6f877cd95d5a18d331b8bbe5643066d87a849b2)), closes [#31](https://github.com/CTFNote/backend/issues/31)
* fix renovate schedule ([e5a015e](https://github.com/CTFNote/backend/commit/e5a015e911183e2d0d35262b80353e6d7d50a749)), closes [#35](https://github.com/CTFNote/backend/issues/35)
* fix typing issues ([dca4ecb](https://github.com/CTFNote/backend/commit/dca4ecb67de05777c8b824755fbeba00b4871cc0))
* update typing to be correct ([7903d6d](https://github.com/CTFNote/backend/commit/7903d6dd24e2051ed20e52987102c58006e9ccbe))
* use Promise.all where possible ([81a1019](https://github.com/CTFNote/backend/commit/81a1019cf878e2b9236109fd857c543415c3987c))


### Style

* formatting ([291631e](https://github.com/CTFNote/backend/commit/291631ea15a9284836f02c575e3c12f333cc7d8f))


### Refactor

* **logging:** add a better logging message ([f47b17c](https://github.com/CTFNote/backend/commit/f47b17c47b5fccc50910935628e487800a4151d4))
* add team to CTF model and remove participants ([7e5fcde](https://github.com/CTFNote/backend/commit/7e5fcdeb246e01984102376a52fad5589013d619))
* make some methods private ([43629e2](https://github.com/CTFNote/backend/commit/43629e29a5f8368c06200061d6f58dae6532716a))


### Docs

* write JSDocs for methods ([2b8351b](https://github.com/CTFNote/backend/commit/2b8351b888a0c05c9a8ca1927509eb60d8b7b8f5))


### Chore

* **ci:** create release script ([23a1fef](https://github.com/CTFNote/backend/commit/23a1fefe8f6017b1263e63ac90bf5d87da4c5230))
* **config:** add sample config file ([015e7d2](https://github.com/CTFNote/backend/commit/015e7d28cc7841c04f032d38ef6ce9331d8d4a88))
* **deps:** add axios to deps ([2ff3047](https://github.com/CTFNote/backend/commit/2ff3047ff3480879f9e97b6447897b8948a69613))
* **deps:** pin axios to v0.21.1 ([56a09a4](https://github.com/CTFNote/backend/commit/56a09a4052f4f219b6db507c9c307a0e73583484))
* **deps:** pin dependencies ([f1e97ca](https://github.com/CTFNote/backend/commit/f1e97ca839a3843bd545a51682335ee37ed6c22d))
* **deps:** update @types/express to v4.17.11 ([f398b6d](https://github.com/CTFNote/backend/commit/f398b6d8532c761795fd2026e2e4e25cc7cdb3d0))
* **release:** 0.1.0 ([f3c2999](https://github.com/CTFNote/backend/commit/f3c29990fc9afa37507f46eb0bca4ca55126aa1d))
* **release:** 0.1.0-alpha.2 ([8daa990](https://github.com/CTFNote/backend/commit/8daa990782ad617cf19a964b682f625b8e231241))
* **release:** update to correct release version ([5198223](https://github.com/CTFNote/backend/commit/51982230f3c1e7741209da971de18159d397e671))
* **types:** add type and docs for CTF creation ([5176689](https://github.com/CTFNote/backend/commit/517668986557d06b1eab7e7aa93c60b66fb551b4))
* update renovate config ([87f9db8](https://github.com/CTFNote/backend/commit/87f9db8b2b16ea0e8003423ceca27a294173678e))
* update renovate config ([7908137](https://github.com/CTFNote/backend/commit/790813791adfe27bf93dab26a3c591542e02ce78))

## [0.1.0-alpha.3](https://github.com/CTFNote/backend/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2021-01-22)


### ⚠ BREAKING CHANGES

* This probably breaks a lot of stuff, sorry :(

### Features

* check for missing SSL certs ([11058b5](https://github.com/CTFNote/backend/commit/11058b587af5103d92b7ccfff4cc78bbe8c0dc68))


### Bug Fixes

* disable automatic commit tagging ([50257dd](https://github.com/CTFNote/backend/commit/50257ddbbc02047e19d97fa6dc27f3dba6d37f50))
* disable LGTM issue ([85faacb](https://github.com/CTFNote/backend/commit/85faacba52c9a30693918c2e4581886067c43488))
* fix codeql scanning ([c6f877c](https://github.com/CTFNote/backend/commit/c6f877cd95d5a18d331b8bbe5643066d87a849b2)), closes [#31](https://github.com/CTFNote/backend/issues/31)
* fix renovate schedule ([e5a015e](https://github.com/CTFNote/backend/commit/e5a015e911183e2d0d35262b80353e6d7d50a749)), closes [#35](https://github.com/CTFNote/backend/issues/35)
* fix typing issues ([dca4ecb](https://github.com/CTFNote/backend/commit/dca4ecb67de05777c8b824755fbeba00b4871cc0))
* **deps:** update dependency mongoose to v5.11.13 ([5eb1758](https://github.com/CTFNote/backend/commit/5eb1758775903ddba9b2d6b87ba5f862b418f2d9))
* update typing to be correct ([7903d6d](https://github.com/CTFNote/backend/commit/7903d6dd24e2051ed20e52987102c58006e9ccbe))
* use Promise.all where possible ([81a1019](https://github.com/CTFNote/backend/commit/81a1019cf878e2b9236109fd857c543415c3987c))


### Refactor

* make some methods private ([43629e2](https://github.com/CTFNote/backend/commit/43629e29a5f8368c06200061d6f58dae6532716a))


### Chore

* **release:** 0.1.0-alpha.2 ([8daa990](https://github.com/CTFNote/backend/commit/8daa990782ad617cf19a964b682f625b8e231241))
* update renovate config ([87f9db8](https://github.com/CTFNote/backend/commit/87f9db8b2b16ea0e8003423ceca27a294173678e))
* **deps:** pin dependencies ([f1e97ca](https://github.com/CTFNote/backend/commit/f1e97ca839a3843bd545a51682335ee37ed6c22d))
* update renovate config ([7908137](https://github.com/CTFNote/backend/commit/790813791adfe27bf93dab26a3c591542e02ce78))

## [0.1.0-alpha.2](https://github.com/CTFNote/backend/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2021-01-20)


### Bug Fixes

* **deps:** update dependency mongoose to v5.11.13 ([5eb1758](https://github.com/CTFNote/backend/commit/5eb1758775903ddba9b2d6b87ba5f862b418f2d9))
* disable LGTM issue ([85faacb](https://github.com/CTFNote/backend/commit/85faacba52c9a30693918c2e4581886067c43488))
* fix codeql scanning ([c6f877c](https://github.com/CTFNote/backend/commit/c6f877cd95d5a18d331b8bbe5643066d87a849b2)), closes [#31](https://github.com/CTFNote/backend/issues/31)
* update typing to be correct ([7903d6d](https://github.com/CTFNote/backend/commit/7903d6dd24e2051ed20e52987102c58006e9ccbe))
* use Promise.all where possible ([81a1019](https://github.com/CTFNote/backend/commit/81a1019cf878e2b9236109fd857c543415c3987c))


### Refactor

* make some methods private ([43629e2](https://github.com/CTFNote/backend/commit/43629e29a5f8368c06200061d6f58dae6532716a))


### Chore

* update renovate config ([87f9db8](https://github.com/CTFNote/backend/commit/87f9db8b2b16ea0e8003423ceca27a294173678e))
* **deps:** pin dependencies ([f1e97ca](https://github.com/CTFNote/backend/commit/f1e97ca839a3843bd545a51682335ee37ed6c22d))
* update renovate config ([7908137](https://github.com/CTFNote/backend/commit/790813791adfe27bf93dab26a3c591542e02ce78))

## [0.1.0-alpha.1](https://github.com/CTFNote/backend/compare/v0.1.0-alpha.0...v0.1.0-alpha.1) (2021-01-20)


### Features

* add more checks ([4d82dcd](https://github.com/CTFNote/backend/commit/4d82dcd72f136407031ffc09d6c3b2b5da3ff043))
* add ratelimiting for auth paths ([fddb7ea](https://github.com/CTFNote/backend/commit/fddb7ea3bff013383e08bb5e7e595a8c670b29c6))


### Bug Fixes

* **deps:** update dependency mongoose to v5.11.12 ([c502302](https://github.com/CTFNote/backend/commit/c502302d8d3f19119b93cec16cb4efa4cbbe4000))


### Chore

* **deps:** update dependency eslint to v7.18.0 ([2abfc9d](https://github.com/CTFNote/backend/commit/2abfc9db3a87e3e14f623902889ba1bbb7538ba1))
* **deps:** update dependency husky to v4.3.8 ([be0931f](https://github.com/CTFNote/backend/commit/be0931f7b9d08abe0b48512d2b34d0e40fc7a9fd))
* **deps:** update typescript-eslint monorepo to v4.14.0 ([d847f98](https://github.com/CTFNote/backend/commit/d847f98868451e642fc746df7f055769f0843cd5))

## [0.1.0-alpha.0](https://github.com/CTFNote/backend/compare/v0.1.0-alpha...v0.1.0-alpha.0) (2021-01-15)


### Bug Fixes

* fix username regex ([457dce2](https://github.com/CTFNote/backend/commit/457dce2f4e98adf4dac495a6aba4133b9a861c5a))


### Chore

* **deps:** pin dependencies ([6453ec1](https://github.com/CTFNote/backend/commit/6453ec1f76caf3752d403f248ae3e98329cbf491))
* **deps:** update dependency @types/convict to v5.2.2 ([b654714](https://github.com/CTFNote/backend/commit/b6547145fb19e733bdaa0bf25852c842fff8a9f7))
* **deps:** update dependency @types/express to v4.17.11 ([1b02fb9](https://github.com/CTFNote/backend/commit/1b02fb93b89c0e5db671a334630f65ced9df9d3d))
* **deps:** update dependency eslint to v7.17.0 ([2649c77](https://github.com/CTFNote/backend/commit/2649c7735f9be416e2b1f172cad0d5edac9199e8))
* **deps:** update dependency husky to v4.3.7 ([d9aca07](https://github.com/CTFNote/backend/commit/d9aca076b72f461129183f1147e5d4bbac674a7e))
* **deps:** update dependency nodemon to v2.0.7 ([306f9cf](https://github.com/CTFNote/backend/commit/306f9cf88765199f346678b5a9c8334d1011a63b))
* **deps:** update node docker tag to v14.15 ([e2f1740](https://github.com/CTFNote/backend/commit/e2f1740079f64cb4f29ffb9e1ff66cc85f399617))
* **deps:** update typescript-eslint monorepo to v4.13.0 ([250b982](https://github.com/CTFNote/backend/commit/250b9826ec4bb98954d60c909572173bf249fd90))


### Style

* implement EOL rules ([4b10595](https://github.com/CTFNote/backend/commit/4b105958c0ff56234d2c1f61739d60f1f346c02b))


### Refactor

* move exports to below const declaration ([876c573](https://github.com/CTFNote/backend/commit/876c573b77876d82b9e02fda929e15085f2776de))

## 0.1.0-alpha (2021-01-12)


### ⚠ BREAKING CHANGES

* This will make CORS config have no effect.

Unknown why this happens, will have to do more research
* No longer follows the gitmoji standard, all new commits should use the
Conventional Commits format.

Along with above, messages follow the `@commitlint/conventional-config` convention.

### Features

* ability to delete teams ([9f2fba5](https://github.com/CTFNote/backend/commit/9f2fba5949942c13dd3c61e6a0950dc48b67cb9c))
* ability to get team details ([bd552be](https://github.com/CTFNote/backend/commit/bd552beea4231b51c7737d0c1ad58624e7e6c54f))
* ability to leave team ([6fc7ac5](https://github.com/CTFNote/backend/commit/6fc7ac59410a8742dbee64c91ebc356669f04a3e))
* add ability to capitalize usernames as you want ([931c48c](https://github.com/CTFNote/backend/commit/931c48ce9b02cb823d45e728e14b714346d1ff79))
* add extreme amounts of logging (BACK-31) ([cf73eee](https://github.com/CTFNote/backend/commit/cf73eee1d8e9fbe77ecad402a755d6647af789c4))
* add isAdmin param ([c080ad1](https://github.com/CTFNote/backend/commit/c080ad1cc6c894217ea7719d02aefb490d8d0f07))
* add JSDoc params and stuff ([4c411c0](https://github.com/CTFNote/backend/commit/4c411c05108a1104afd604c6568b5e748880b55f))
* add standard-version versioning ([61f08f5](https://github.com/CTFNote/backend/commit/61f08f5af315e0dd2c25eddc926828d73d27db11))
* add team reference to user ([9f49fb7](https://github.com/CTFNote/backend/commit/9f49fb78bfc64da59382a9b7a7804204f93dfe3b))
* add unique error codes and messages ([7c01bc1](https://github.com/CTFNote/backend/commit/7c01bc187e24b47230cdeae2866352055fd1cf54))
* allow updating of team details ([b1da50c](https://github.com/CTFNote/backend/commit/b1da50c581f6e893bc7e2e7ba395c7da7322ddb3))
* api param validation using celebrate ([40e5f3f](https://github.com/CTFNote/backend/commit/40e5f3f77ab8a32b38de9ba1738afee35858a76a))
* base team creation ([10213fd](https://github.com/CTFNote/backend/commit/10213fd5683b5ce224992325b96f958372f2105e))
* bearer token verification ([085a102](https://github.com/CTFNote/backend/commit/085a1023cd98842dd8e29ab655aba644d5aa4168))
* change owner feature ([7369ae1](https://github.com/CTFNote/backend/commit/7369ae16bc078c9c2e19cd17232b97531579c5a4))
* config option for JWT duration ([fc3054e](https://github.com/CTFNote/backend/commit/fc3054eceb2595e37a4523bd160ee1c39a9b778b))
* create logoutUser method ([fc26bcf](https://github.com/CTFNote/backend/commit/fc26bcfc4751d5b1d913698fbcce72567b4e1f46))
* creation of team invites ([b2de500](https://github.com/CTFNote/backend/commit/b2de5008209947ae56514c3de8b1de4a652b7283))
* deleting of invites ([831dfff](https://github.com/CTFNote/backend/commit/831dfffb6b10ad9d79c23166284226f9e7e3c05a))
* fetching user data ([87e1270](https://github.com/CTFNote/backend/commit/87e12704dc0d2d4e2f2c08c1582aabb55bc1ed0f))
* get invite ([2b1e9f1](https://github.com/CTFNote/backend/commit/2b1e9f12dbcae2febd392482a6bf9b0718a03368))
* initial user updating ([1e06495](https://github.com/CTFNote/backend/commit/1e06495110e9443897c31579941e3ace98c49a9d))
* make https optional ([40cf713](https://github.com/CTFNote/backend/commit/40cf71326b5b757b5d8f97a37018ee3cdb4dfeca))
* make sure credentials (secure cookies) work over CORS requests ([05a936c](https://github.com/CTFNote/backend/commit/05a936c012a019896027bf5bf3a506cd19ca1dc2))
* method on team document to check if user is owner ([dddc6b7](https://github.com/CTFNote/backend/commit/dddc6b7b2b9fb403c092fd78fa2ce8db9a0978d5))
* samesite and proper cookie removal ([ce2f14b](https://github.com/CTFNote/backend/commit/ce2f14b9f02cad4402df24b456eedbf1d4a8174c))
* throw 404 if team not found ([36045cf](https://github.com/CTFNote/backend/commit/36045cf2f08af54681f26208c6e1d80910872d9e))
* use cookie parser for cookie parsing ([8836a8c](https://github.com/CTFNote/backend/commit/8836a8c8b7ee1f327a527f691cf10cb67e8b93e6))
* use model method for checking if user in team ([68c2201](https://github.com/CTFNote/backend/commit/68c22012039bee274b4bcdbba5c3cff2e8991d4a))
* using invites to join teams ([6258cee](https://github.com/CTFNote/backend/commit/6258cee75fdcb49d68a6f7068707231f714e56b1))
* wow an actual login and auth system ([901bd09](https://github.com/CTFNote/backend/commit/901bd095af158b040ef5d4f6ef293d003817ca2b))
* **docker:** dockerize project ([c00452a](https://github.com/CTFNote/backend/commit/c00452a7fd7cc582fd49603a613add47955093c7))
* **errors:** add error code and details for errors ([e3a0934](https://github.com/CTFNote/backend/commit/e3a0934824b5f303aac5d9c20a63cdfa7a35e874))


### Bug Fixes

* add execPopulate() and fix populates ([cec3574](https://github.com/CTFNote/backend/commit/cec35745fea36850f2fa101dee02d06561457922))
* fix CORS headers not being attached ([3e7f41a](https://github.com/CTFNote/backend/commit/3e7f41ae216655e7a1ac6209b4d9a90e713101fa))
* fix error messages always returning "Internal Server Error" ([7bd4db6](https://github.com/CTFNote/backend/commit/7bd4db6dcd1ac4312f2f6453fb253aade01acc89))
* fix typing in model ([86c4f69](https://github.com/CTFNote/backend/commit/86c4f6910997e77c55694ed5a20c03403a8adbe0))
* **types:** fix broken typing due to dependency update ([ee9b86b](https://github.com/CTFNote/backend/commit/ee9b86b2de22f42a79297a5e739cc262082a0fc6))
* fix wrong return data format ([47e4503](https://github.com/CTFNote/backend/commit/47e4503d01be54bcc0fd240d6a4410e0cab4f103))


### Chore

* **deps:** add cookie-parser and types to deps ([d69a5a3](https://github.com/CTFNote/backend/commit/d69a5a3c7d2ed681a52448f774e056972bb3c90c))
* **deps:** bump ini from 1.3.5 to 1.3.8 ([469957c](https://github.com/CTFNote/backend/commit/469957c80288a519e03e04f00ecf127bb588393e))
* **deps:** update deps ([9de601e](https://github.com/CTFNote/backend/commit/9de601ec67d8cfbe7489f0788ba28dda0ba914ce))
* **types:** update and add typing ([2992fe7](https://github.com/CTFNote/backend/commit/2992fe7e9afb3d7a41d87808a96f940789a5b49d))
* add bcrypt and @types/bcrypt to deps ([668bb9b](https://github.com/CTFNote/backend/commit/668bb9bd6908d45a62367464bf4f4a251528f502))
* add jsonwebtoken and @types/jsonwebtoken to deps ([8bdcaa2](https://github.com/CTFNote/backend/commit/8bdcaa2d0048184386482cb63636104c51721c74))


### Style

* formatting ([c30efd7](https://github.com/CTFNote/backend/commit/c30efd791c35fcf98c93bf48f1f1db11ae710524))
* formatting ([090ba1d](https://github.com/CTFNote/backend/commit/090ba1d2a8bca26142f88be9c1e1c277166f0cc5))
* **spelling:** fix spelling mistake in X-Powered-By ([112a6f8](https://github.com/CTFNote/backend/commit/112a6f8f478731727327952a83d7a093e8bd716f))


### Docs

* add JSDoc comments ([cc40bd3](https://github.com/CTFNote/backend/commit/cc40bd33f7461646aed3244cd053bb6f31098691))
* Add link to support server ([cb7ba89](https://github.com/CTFNote/backend/commit/cb7ba897796aa7747351105d9a10236b2bb6e5ed))
* move to Conventional Commits for commit messages ([7fbf50d](https://github.com/CTFNote/backend/commit/7fbf50dcc90b23fe8123cd00778d09386191f200))
* update and add missing docs ([0838dad](https://github.com/CTFNote/backend/commit/0838dad0fb8a30dc5b911157ad51a7227431231c))


### Refactor

* change login data format to be easier to use for frontend ([9f56f7f](https://github.com/CTFNote/backend/commit/9f56f7ff007659ea57381c2718dca0cb58e45ba3))
* fix spelling error ([2082c95](https://github.com/CTFNote/backend/commit/2082c955457f003a50be296690aae9df6a32193c))
* move all verification with celebrate into own file ([75710aa](https://github.com/CTFNote/backend/commit/75710aa04b046ad797f24421a446e8053f3400be))
* move basicUserDetails to its own file ([875e913](https://github.com/CTFNote/backend/commit/875e913c17f06619cb718ad14ad46f656abacec4))
* move refreshToken format to its own file for verification ([43e3768](https://github.com/CTFNote/backend/commit/43e3768e8df736f0800ae3596ef3fe045cb55ffb))
* move repeated code to functions ([3a92d12](https://github.com/CTFNote/backend/commit/3a92d12d86b387c854995216eb8b18de0dfed74d))
* remove code smell ([6179dbb](https://github.com/CTFNote/backend/commit/6179dbbe2bb93369b5cb8c52cff29d0f22b1937a))
* remove unnecessary logging ([9c01bcb](https://github.com/CTFNote/backend/commit/9c01bcb9b52f11a45e4f7ba6bc52d4fdb5cc9ce2))
* remove unused ([9b35ef0](https://github.com/CTFNote/backend/commit/9b35ef05f03c473c3b698e03c0ed8ec5c7429708))
* remove unused config var ([aa9727c](https://github.com/CTFNote/backend/commit/aa9727ca3d8e3ea36425b93c7868044f0227e15f))
* rename JWT_ROUNDS ([95da106](https://github.com/CTFNote/backend/commit/95da106241a384d49926bffa53930f1072620a7d))
* rename message to errorMessage to prevent leakage of errors ([0d5eacb](https://github.com/CTFNote/backend/commit/0d5eacb3a79c962a65e96cd2275ad04ca150c9e1))
* rename refreshRefreshToken ([d6b223d](https://github.com/CTFNote/backend/commit/d6b223d55bee9631c95ed87f78a4c1ad7a403e74))
* rename team creator to owner ([0fe060d](https://github.com/CTFNote/backend/commit/0fe060da6fbca52e9eaacb9ef1a925b5b916f5f9))
* rename UserService to AuthService ([58ca1c9](https://github.com/CTFNote/backend/commit/58ca1c9b21038bb3bb834f4d8f1e62ed69456f1c))
* split verification of creds into login and registration ([d9483e3](https://github.com/CTFNote/backend/commit/d9483e3f6ecdb0ca84a9b1a17299d283d30b0637))
* use Promise.all() instead of chaining await ([0bc8dc8](https://github.com/CTFNote/backend/commit/0bc8dc86683b216a7b8bb09a4d3391c2472f7f4f))
* use router.route for routes (BACK-42) ([b7beed9](https://github.com/CTFNote/backend/commit/b7beed988c148c6912691fcbc291064686e03228))
* use router.use when all routes use a middleware ([81629b0](https://github.com/CTFNote/backend/commit/81629b0f4cc3321a0a0535d36082c0c0ed695596))
