// src/sample.ts
export function sample() {
	console.log('---sample from sample.ts---');
}

// 別の関数やクラスをexportすることも可能
export const myConstant = 123;

export class MyClass {
	greet(name: string) {
		console.log(`Hello, ${name}!`);
	}
}
