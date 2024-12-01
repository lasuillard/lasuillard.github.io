---
title: 남이 만든 OpenAPI 스키마 테스트하기
publicationDate: 2024-07-09T21:41:00.000+09:00
preview: /posts/남이-만든-OpenAPI-스키마-테스트하기/preview.png
summary: >
    API 클라이언트 코드 자동 생성을 위해 남이 만든 API 서버에 OpenAPI 스키마 붙여보기

tags: [TypeScript, Vitest, OpenAPI, OpenAPI Generator]
---

<img src="/static/posts/남이-만든-OpenAPI-스키마-테스트하기/preview.png" alt="Preview" width="50%" />

평소 북마크와 하이라이트를 관리하기 위해 [Raindrop](https://raindrop.io/)을 이용하고 있습니다. 하지만 Chrome 북마크 동기화를 지원하지 않아 항상 아쉽다고 생각하고 있었습니다. Chrome 북마크를 이용하면 북마크 바에서 자주 사용하는 북마크를 바로 이용할 수 있고 검색 또한 훨씬 빠르기 때문입니다.

목마른 자가 우물을 파는 법이라고, 결국 Chrome 확장 프로그램을 직접 만들게 되었습니다. 하지만 Raindrop API를 이용하던 중 공식 API 문서에 많은 문제점을 발견하게 되었는데, API 명세 자체가 설명이 미흡하거나 실제 API 호출 결과와 다르기까지 했습니다. 차라리 직접 OpenAPI 스키마를 정의하는 편이 낫겠다는 생각이 들 정도였습니다.

조금 생각해보니 직접 스키마를 정의해서 쓰는 것이 의외로 나쁘지 않은 생각인 듯 했습니다. 스키마를 한 번 만들어두면 언어를 막론하고 코드 생성기를 이용해 코드를 자동 생성할 수 있을 것이고, 다른 프로젝트에서도 쉽게 재사용할 수 있으니까요. 그렇게 만든 것이 [lasuillard/raindrop-client](https://github.com/lasuillard/raindrop-client)입니다.

## ❓ OpenAPI란?

[OpenAPI](https://www.openapis.org/)는 HTTP API를 표현에 대한 사양(Specification)입니다. 보통 REST API를 이용해 본 적이 있다면 Swagger를 이용해 본 경험이 있으실겁니다.

![Swagger](/static/posts/남이-만든-OpenAPI-스키마-테스트하기/swagger.png)

Swagger는 OpenAPI 문서를 기반으로 자동 생성된 웹 기반 API 클라이언트의 대표적인 예시입니다. OpenAPI를 사용하면 여러 장점이 있습니다.

1. 이해관계자간에 서로 소통하기 위한 정형화된 방법을 제공

    API를 정의하고 협의하는 표준화된 방법을 제공하여 API를 유지보수 및 관리하기 위한 효율적이고 체계적인 방법을 제시합니다.

2. 자동화를 통해 작업 효율 증대

    Swagger, Redoc, OpenAPI Generator와 같은 도구를 통해 API 문서, 클라이언트 및 서버 코드(의 골조) 등을 자동 생성하여 반복적이고 정형화된 작업을 자동화할 수 있습니다.

3. 개발자 경험(DX) 개선

    개발자는 반복적이고 정형화된 작업에 쉽게 질리기 마련입니다. 제가 보아온 개발자는 보통 기능 개발을 선호하지 문서 관리를 하고 싶어하는 경우는 거의 없었습니다.

OpenAPI를 활용하는 대표적인 Python 프레임워크는 [FastAPI](https://fastapi.tiangolo.com/)를 예로 들 수 있습니다. API 엔드포인트 구현(주석, 타입 어노테이션 등)으로부터 OpenAPI 스키마를 자동 생성하며 데이터 모델을 관리하는 것으로 API 문서 관리 대부분을 자동화할 수 있으며 구현과 문서 사이의 괴리를 최소화합니다.

### 🪛 OpenAPI Generator

[OpenAPI Generator](https://openapi-generator.tech/)는 OpenAPI 스키마로부터 API 클라이언트 및 서버 코드를 생성하는 도구입니다. Mustache 템플릿 언어를 통해 [다양한 언어와 프레임워크를 지원](https://openapi-generator.tech/docs/generators)하며 사용자 정의 템플릿을 이용할 수도 있습니다. OpenAPI Generator로 생성된 코드 예시는 다음과 같습니다.

```typescript
/**
 * AuthenticationApi - functional programming interface
 * @export
 */
export const AuthenticationApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AuthenticationApiAxiosParamCreator(configuration)
    return {
        /**
         *
         * @param {string} redirectUri
         * @param {string} clientId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async authorize(redirectUri: string, clientId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authorize(redirectUri, clientId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationApi.authorize']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
```

이렇게 생성된 코드는 다음과 같이 이용할 수 있습니다.

```typescript
// Create Axios instance
const instance = axios.create();
const rateLimited = rateLimit(instance, { maxRPS: 5 });

// Create API client
const accessToken = process.env.RAINDROP_API_TOKEN;
const client = new Raindrop(new Configuration({ accessToken }), rateLimited);

// Make some call
const response = await client.collection.searchCovers('strawberry');
console.log(response.data);
```

현재 raindrop-client는 typescript-axios 템플릿을 이용하여 클라이언트 코드를 자동 생성하고 [npm 패키지 레지스트리](https://www.npmjs.com/package/@lasuillard/raindrop-client)로 배포하게끔 CI가 구성되어 있습니다.

## 🧪 스키마 테스트하기

OpenAPI 스키마를 가져다 쓰는 경우라면 스키마를 굳이 까다롭게 테스트할 필요가 없습니다. 보통 서버를 구현하는 측에서 테스트하기 때문입니다. 하지만 이번엔 조금 상황이 특별합니다. Raindrop에서 제공하는 OpenAPI 스키마가 없고 스키마를 직접 제3자인 제가 작성하기 때문입니다. 그래서 실제로 작성한 스키마의 요청과 응답이 예상대로인지 확인할 필요가 있습니다.

-   동작(데이터) 테스트

    요청에 대해 응답이 정상적으로 돌아오는지, 기본적인 API 호출에 대한 테스트가 필요합니다.

-   스키마(타입) 테스트

    스키마를 테스트하기 위해 타입 체커(TypeScript)를 이용하고자 했지만 런타임 수준에서 응답 스냅샷(JSON 문자열)에 대한 동적인 타입 체크를 구성할 수 있는 방법을 찾을 수 없었습니다.

그래서 우선 스키마를 테스트할 수 있는 다른 도구들을 찾아보았고, [Schemathesis](https://schemathesis.io/)를 알게 되었습니다.

### 😎 Schemathesis

[Schemathesis](https://schemathesis.io/)는 API 스키마를 테스트하기 위한 도구입니다. API 안정성, 성능, 보안 등 여러 부분을 테스트할 수 있으며 CI 통합, 리포트 등 다양한 추가 기능을 제공합니다. OpenAPI 뿐만 아니라 GraphQL 스키마도 지원하는 것으로 보입니다.

![Schemathesis](/static/posts/남이-만든-OpenAPI-스키마-테스트하기/schemathesis.png)

Schemathesis는 꽤나 매력적이었지만 최종적으로 이용할 수는 없었습니다.

1. API Fuzzing을 이용하여 테스트 중 많은 API 호출을 보내게 됩니다. 직접 구축하고 관리하는 서버라면 괜찮겠지만 실 서비스에 대해 많은 API 호출을 보내는 것은 IP 또는 계정 차단, 레이트 제한 가능성이 있습니다.

2. 실 서비스 대신 모의 서버(e.g. Mockoon)를 구성해서 테스트 데이터셋을 관리하고자 하였으나 너무 구성이 복잡해졌고 UI를 통한 데이터의 변경 및 갱신이 불편했습니다.

3. Schemathesis를 커스터마이징하기 위해서는 Python을 이용해야 하는데 현재 프로젝트는 TypeScript를 이용하므로 언어를 추가하는 것은 구성을 필요 이상으로 복잡하게 만든다고 판단했습니다.

분명 흥미로운 도구였지만 이번엔 용도와 목적에 맞지 않아 다음을 기약하기로 했습니다. 언젠가 직접 API 서버를 구축한다면 써봄직할 것 같습니다.

### 🐦 Polly.js

결국 API 호출, 호출 내역을 캐싱하고 스냅샷을 이용해 기본 API 동작을 테스트하기로 했습니다. Python에서는 [pytest-recording](https://github.com/kiwicom/pytest-recording)을 이용하지만 Node에서도 비슷한 기능을 제공하는 [Polly.js](https://github.com/Netflix/pollyjs)를 찾을 수 있었습니다.

Polly.js는 Netflix에서 공개한 오픈 소스로, HTTP 트래픽을 녹화, 재생 및 스텁(Stub)하는 기능을 제공합니다. JavaScript로 작성되어 있으며 특정 프레임워크에 의존하지 않는 독립적인 라이브러리입니다.

그리고 Vitest의 Fixture 기능을 이용해서 pytest와 거의 동일한 방식으로 여러 테스트 의존성 주입을 비교적 편하게 관리할 수 있습니다.

```typescript
import NodeHTTPAdapter from '@pollyjs/adapter-node-http';
import { Polly } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';
import type { Use } from '@vitest/runner';
import type { Task } from 'vitest';
import { taskId } from './common';

Polly.register(NodeHTTPAdapter);
Polly.register(FSPersister);

export async function polly({ task }: { task: Task }, use: Use<Polly>) {
	const _polly = new Polly(taskId(task), {
		adapters: ['node-http'],
		persister: 'fs',
		persisterOptions: {
			fs: {
				recordingsDir: 'tests/__recordings__'
			}
		},
		recordFailedRequests: true,
		matchRequestsBy: {
			headers: {
				exclude: ['authorization']
			}
		}
	});
	_polly.server.any().on('beforePersist', (_, recording) => {
		recording.request.headers = recording.request.headers.map(
			// @ts-expect-error Don't care
			(header: Header) => {
				if (header.name === 'authorization') {
					header.value = '<REDACTED>';
				}
				return header;
			}
		);
	});
	await use(_polly);
	await _polly.stop();
}
```

Polly.js가 요청을 분석해서 그 요청이 기존에 이미 녹화되어 있으면 저장된 응답을 반환하고, 그렇지 않으면 실제 요청을 보냅니다(설정을 통해 이 동작 또한 변경할 수 있음). 테스트 코드를 갱신하고 싶으면 모든 녹화 데이터를 삭제하면 됩니다.

### 👻 스냅샷과 타입 체크

가능한 테스트 데이터 관리를 편하게 하기 위해 스냅샷으로부터 스키마 테스트가 가능하게 하고자 했습니다. 또한 임의의 JSON 문자열에 대해 타입 체크를 할 수 있는 방법을 찾지 못했기에 대안을 모색해야 했습니다.

1. 스냅샷 생성 시 문자열이 아니라 객체를 그대로 삽입할 수 있도록 커스텀 스냅샷 구현을 작성

    스냅샷 구현의 소스 코드를 뜯어보니 스냅샷을 삽입할 때 테스트 파일을 수정하게끔 구현되어 있었습니다. 조금 손보면 문자열이 아닌 객체를 그대로 저장하는 것 또한 가능해 보였습니다.

2. 스냅샷 생성 중 타입 체크를 위한 테스트 파일을 동적으로 생성

    테스트 라이브러리를 커스터마이징하기엔 너무 버거워질 것 같아 테스트를 생성하는 것이 훨씬 간단할 듯 했습니다.

구현과 관리를 단순히 하기 위에 후자를 택했습니다. 그리고 지금 사용중인 Vitest 테스트 프레임워크에서 스냅샷이 갱신될 때 동작을 주입하기 위해 Snapshot Serializer를 이용해야 했습니다.

```typescript
export async function generateTypeTest(
	{ task, expect }: { task: Task; expect: ExpectStatic },
	use: Use<RegisterHook>
) {
	const hookFn: RegisterHook = (args: RegisterHookArgs) => {
		// Check test file generation registered only once
		let ack = false;

		// Add snapshot serializer as an workaround for hook to generate type tests
		expect.addSnapshotSerializer({
			serialize(val, config, indentation, depth, refs, printer) {
				addTest({
					testId: taskId(task),
					type: args.type,
					value: JSON.stringify(val)
				});
				ack = true;
				return printer(val, config, indentation, depth, refs);
			},
			test() {
				return !ack;
			}
		});
	};
	await use(hookFn);
}
```

여기에 테스트를 생성하는 코드를 삽입하여 타입 테스트를 동적으로 생성합니다.

```typescript
function generateTest(dir: string, item: CreateTest): string {
	const filepath = path.join(dir, `${item.testId}.test-d.ts`);
	const content = `\
import { assertType, it } from 'vitest';
import type { ${item.type} } from '~/generated/api'

it('${item.testId}', () => {
  assertType<${item.type}>(
    ${item.value}
  )
})
`;
	console.debug(`Will generate file ${filepath} with content: \n\n ${content}`);
	fs.writeFileSync(filepath, content);

	return filepath;
}`
```

테스트가 실행되고 나면 아래와 같은 테스트 파일이 생성되며 커밋하여 소스 코드의 일부로 관리됩니다.

```typescript
it('parseURL', async ({ client, expect, generateTypeTest }) => {
	const response = await client.import.parseURL('https://example.com');

	generateTypeTest({ type: 'ParseURLResponse' });
	expect(response.data).toMatchInlineSnapshot(`
		{
		  "item": {
		    "cover": "<screenshot>",
		    "excerpt": "",
		    "media": [],
		    "meta": {
		      "tags": [],
		    },
		    "title": "Example Domain",
		    "type": "link",
		  },
		  "result": true,
		}
	`);
});
```

먼저 단위 테스트 코드가 실행되어야 타입 테스트 코드가 생성되므로 두 테스트를 별도 과정으로 나누어 실행하게 됩니다.

## 📡 정리하며

OpenAPI 스키마의 관리 주체가 이번 경우처럼 서비스 제공자가 아닌 제3자인 이번 경우에는 고려해야 할 사항이 많았습니다. 스키마를 만들면 끝인 것이 아니라 지속적으로 변경 사항을 추적하기 위한 자동화도 고안해야 할 필요가 있구요.

raindrop-client는 Raindrop Sync for Chrome 프로젝트를 위해 만들어졌습니다. 이직 전 잠시 쉬던 중 시작했고 이직 후 짬을 내지 못해 프로젝트가 시작한 지 너무 오랜 기간 진전되지 못했지만 이제 기본적으로 동작하는 프로토타입을 만들기 위해 좀 더 많은 노력을 기울이고 있습니다. 일과 다른 공부로 바쁘지만 틈틈이 짬을 내려고 합니다.

관련된 프로젝트는 모두 공개된 오픈 소스이니 관심이 있다면 둘러보시길 바랍니다.

-   https://github.com/lasuillard/raindrop-sync-chrome
-   https://github.com/lasuillard/raindrop-client
