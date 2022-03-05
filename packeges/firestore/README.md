# firebaseasy | インストール

Nakashima Package Manager
略して【npm】で入れます。

```bash
npm i @firebaseasy/firestore
```

# 使い方

```js
import { easySetDoc, easyGetData, easyDelete } from '@firebaseasy/firestore'

// Type
import { EasySetDoc, QueryOption, WhereOption } from '@firebaseasy/firestore'
```

# 機能

作成したドキュメント(フィールド)に自動追加されます。

```js
// set
{
  id: string // document id
  created_at: Date
  updated_at?: Date // If it was an update
}

// get(Not prepared)
{
  id: string // document id
  created_at: Timestamp
  updated_at?: Timestamp
}
```

登録と更新ができます。 doc に `id` を追加すると、ドキュメント ID の指定・id が一致したドキュメントの更新を行えます。

```js
// create
easySetDoc('anime', {
  title: 'NARUTO',
  character: ['Naruto', 'Sasuke', 'Sakura']
})

// update or create(add)
easySetDoc('anime/abcde/animeDetail', {
  title: 'NARUTO',
  character: ['Naruto', 'Sasuke', 'Sakura'],
  id: 'fghijklmno'
})
// ↑ same ↓
easySetDoc('anime/abcde/animeDetail/fghijklmno', {
  title: 'NARUTO',
  character: ['Naruto', 'Sasuke', 'Sakura'],
})

/**
 * update or create(add)
 * pathとidが一致しなかった場合エラーを返します
 * @return {Error}
 */
easySetDoc('anime/abcdefghijklmnopqrstuvwxyz', {
  id: 'zyxwvutsrqponmlkjihgfedcba'
  title: 'NARUTO',
  character: ['Naruto', 'Sasuke', 'Sakura']
})
```

情報の取得ができます。

```js
// get Collection data as an Array
/** @return {array<T>} */
easyGetData('anime', {
  where: [['title', '==', 'NARUTO'], ['character', 'array-contains', 'Sasuke']],
  orderBy: ['created_at']
  limit: 99,
})

// get document data as an Object
/** @return {Objrct | undefined} */
easyGetData('anime/abcdefghijklmnopqrstuvwxyz')
```

情報の削除

```js
// delete document
easyDelete('anime/abcdefghijklmnopqrstuvwxyz')
```
