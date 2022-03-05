import { __awaiter, __generator } from "tslib";
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { orderBy, limit } from 'firebase/firestore';
import { CollectionReference, DocumentReference } from 'firebase/firestore';
import { Query } from 'firebase/firestore';
/**
 * check type
 */
var isUseType = function (r) {
    if (r instanceof CollectionReference)
        return true;
    if (r instanceof Query)
        return true;
    return false;
};
/**
 * get Doc or getDocs
 */
export function easyGetData(path, option) {
    if (option === void 0) { option = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var collectionArray, reference, db, dataNum, res, arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collectionArray = path.split('/').filter(function (d) { return d; });
                    if (!collectionArray.length)
                        return [2 /*return*/, new Error()];
                    reference = null;
                    db = getFirestore();
                    dataNum = collectionArray.length;
                    if (dataNum === 1 || dataNum % 2 === 1) {
                        // collection
                        reference = collection(db, path);
                    }
                    else if (dataNum % 2 === 0) {
                        // document
                        reference = doc(db, path);
                    }
                    /**
                     * DocumentReferenceの場合
                     */
                    if (reference instanceof DocumentReference) {
                        return [2 /*return*/, new Promise(function (resolve, rejects) {
                                if (!(reference instanceof DocumentReference))
                                    return rejects();
                                getDoc(reference)
                                    .then(function (doc) {
                                    if (!doc.exists)
                                        return resolve(undefined);
                                    resolve(doc.data());
                                })
                                    .catch(function () { return rejects(); });
                            })];
                    }
                    /**
                     * document
                     * https://firebase.google.com/docs/firestore/query-data/queries?hl=ja#simple_queries
                     */
                    if (option.where) {
                        option.where.map(function (w) {
                            if (!isUseType(reference))
                                return w;
                            reference = query(reference, where(w[0], w[1], w[2]));
                            return w;
                        });
                    }
                    /**
                     * document
                     * https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja#order_and_limit_data
                     */
                    if (option.orderBy) {
                        option.orderBy.map(function (w) {
                            if (!isUseType(reference) || !w)
                                return w;
                            reference = query(reference, orderBy(w));
                            return w;
                        });
                    }
                    /**
                     * document
                     * https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja#order_and_limit_data
                     */
                    if (option.limit) {
                        if (!isUseType(reference))
                            return [2 /*return*/, new Error()];
                        reference = query(reference, limit(option.limit));
                    }
                    if (!isUseType(reference))
                        return [2 /*return*/, new Error()];
                    return [4 /*yield*/, getDocs(reference)
                        /**
                         * document data in Array
                         */
                    ];
                case 1:
                    res = _a.sent();
                    arr = [];
                    res.forEach(function (el) {
                        if (!el.exists)
                            return;
                        arr.push(el.data());
                    });
                    return [2 /*return*/, arr];
            }
        });
    });
}
//# sourceMappingURL=easyGetData.js.map