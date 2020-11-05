# soul

[![NPM version](https://img.shields.io/npm/v/@zcorky/soul.svg?style=flat)](https://www.npmjs.com/package/@zcorky/soul)
[![Coverage Status](https://img.shields.io/coveralls/zcorky/soul.svg?style=flat)](https://coveralls.io/r/zcorky/soul)
[![Dependencies](https://david-dm.org/@zcorky/soul/status.svg)](https://david-dm.org/@zcorky/soul)
[![Build Status](https://travis-ci.com/zcorky/soul.svg?branch=master)](https://travis-ci.com/zcorky/soul)
![license](https://img.shields.io/github/license/zcorky/soul.svg)
[![issues](https://img.shields.io/github/issues/zcorky/soul.svg)](https://github.com/zcorky/soul/issues)

> Give a soul for your app.

### Install

```
$ npm install @zcorky/soul
```

### Usage

```javascript
import soul from '@zcorky/soul';

const app = new Soul();

app.model({
	namespace: 'user',
	state: {
		total: 1,
		current: 12138,
		list: [{
			id: 12138,
			name: 'zero',
		}],
	},
	reducers: {
		save(state, { payload }) {
			const { total, list } = payload;
			return {
				...state,
				total,
				list,
			};
		},
	},
	effects: {
		async 'sync'(action, { put }) {
			const { total, user } = await syncUserService();
			await put({ type: 'user/save', payload: { total, user } });
		},
	},
});

app.start();
```
