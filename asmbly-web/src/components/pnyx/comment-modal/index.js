import React, { useState } from 'react'

import Bema from '../../entry/bema'
import ModalContent from '../../layout/modal-content'

const CommentModal = props => {
	return (
		<ModalContent
			text={`Comment on ${
				props.parent ? props.parent.contention : false
			}`}
			onClose={props.onClose}
		>
			<Bema
				refreshPnyx={props.refresher}
				parent={props.parent.UID}
				ancestor={props.ancestor}
				pnyx={props.parent.pnyx}
			/>
		</ModalContent>
	)
}

export default CommentModal
