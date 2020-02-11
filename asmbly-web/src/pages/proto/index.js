import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PostListItem from '../../components/pnyx/post-list-item'
import * as error from '../../common/error'
import { openLenny, closeLenny } from '../../components/layout/modal-lenny'

import firebase from '../../external/firebase'

const Proto = () => {
	useEffect(() => {
		//openLenny()
	}, [])
	return (
		<div className="content">
			<div className="centered">==============================</div>
			<div className="centered pointed">Proto</div>
			<div className="centered">==============================</div>
		</div>
	)
}

export default Proto
