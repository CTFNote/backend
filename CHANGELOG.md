# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
