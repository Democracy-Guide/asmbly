import React, { useState, useEffect } from 'react'
import firebase from '../../external/firebase'
import v from './versioning'
export default (pnyx, callback) => {
	console.log(pnyx)
	return firebase
		.firestore()
		.collection(v.appCollection)
		.doc(v.appVersion)
		.collection(v.pnyxManaged)
		.doc(pnyx)
		.collection('reports')
		.where('closed', '==', false)
		.onSnapshot(callback)
}
//DG-ASMBLY/0.1/pnyx-managed/pnyx-prime/reports/
