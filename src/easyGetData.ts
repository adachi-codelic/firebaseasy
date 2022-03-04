import { getFirestore } from 'firebase/firestore'
import { doc, getDoc } from 'firebase/firestore'
import { query, where, collection, getDocs } from 'firebase/firestore'
import { orderBy, limit } from 'firebase/firestore'

import { CollectionReference, DocumentReference } from 'firebase/firestore'
import { Query } from 'firebase/firestore'
import { QueryOption, WhereOption } from '../type/easyGetData'

/**
 * check type
 */
const isUseType = (r: any): r is CollectionReference | Query => {
  if (r instanceof CollectionReference) return true
  if (r instanceof Query) return true
  return false
}

/**
 * get Doc or getDocs
 */
export async function easyGetData<T> (
  path: string,
  option: QueryOption = {}
): Promise<T[] | T | undefined | Error> {
  const collectionArray = path.split('/').filter(d => d)
  if (!collectionArray.length) return new Error()

  let reference: Query | CollectionReference | DocumentReference | null = null
  const db = getFirestore()
  const dataNum = collectionArray.length

  if (dataNum === 1 || dataNum % 2 === 1) {
    // collection
    reference = collection(db, path)
  } else if (dataNum % 2 === 0) {
    // document
    reference = doc(db, path)
  }

  /**
   * DocumentReferenceの場合
   */
  if (reference instanceof DocumentReference) {
    return new Promise((resolve, rejects) => {
      if (!(reference instanceof DocumentReference)) return rejects()

      getDoc(reference)
        .then(doc => {
          if (!doc.exists) return resolve(undefined)
          resolve(doc.data() as T)
        })
        .catch(() => rejects())
    })
  }

  /**
   * document
   * https://firebase.google.com/docs/firestore/query-data/queries?hl=ja#simple_queries
   */
  if (option.where) {
    option.where.map((w: WhereOption) => {
      if (!isUseType(reference)) return w
      reference = query(reference, where(w[0], w[1], w[2]))
      return w
    })
  }

  /**
   * document
   * https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja#order_and_limit_data
   */
  if (option.orderBy) {
    option.orderBy.map((w: string) => {
      if (!isUseType(reference) || !w) return w
      reference = query(reference, orderBy(w))
      return w
    })
  }

  /**
   * document
   * https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja#order_and_limit_data
   */
  if (option.limit) {
    if (!isUseType(reference)) return new Error()
    reference = query(reference, limit(option.limit))
  }

  if (!isUseType(reference)) return new Error()
  const res = await getDocs(reference)

  /**
   * document data in Array
   */
  const arr: Array<T> = []
  res.forEach(el => {
    if (!el.exists) return
    arr.push(el.data() as T)
  })

  return arr
}
