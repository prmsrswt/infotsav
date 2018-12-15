
const handleEventRegCancel = (req, res, db, xss) =>{
	const xssOptions = {
		whiteList: [],
		stripIgnoreTag: [],
		stripIgnoreTagBody: ['script']
	};

	const {ifid, eid} = req.body;
	const email = req.email;

	db.select('*').from('users').where({email})
	.then(authUser => {
		if(!authUser.length)
			throw(authUser);
		ifidUser = authUser[0].ifid;
	})
	.catch(() => res.status(400).json('What the fuck?'));

	if(!ifid || !eid){
		return res.status(400).json('Incomplete request!');
	}
	
	db.transaction(trx =>{
	 	trx.select('*').from('event_reg').where({ifid, eid})
		.then(regs => {
			if(!regs.length){
				return res.status(400).json('Never registered!');
			}
			else {
				const tid = regs[0].teamid;
				return trx('event_reg').where({ifid, eid}).del()
					.then(() =>{
						return trx('event_reg').select('*')
						.where({teamid: tid})
						.then((entries) => {
							console.log('Haha', entries, entries.length);
							if(entries.length){
								trx('event_reg')
								.join('payment', 'event_reg.teamid', '=', 'payment.teamid')
								.join('events', 'events.eid', '=', 'event_reg.eid')
								.select('event_reg.eid', 'events.ename', 'events.category', 'payment.teamid', 'events.fee', 'payment.status')
								.where('event_reg.ifid', '=', ifidUser)
								.then(registrations =>{
									res.status(200).json(registrations);
								})
								.then(trx.commit)
							}
							else {
								trx('payment')
								.where({teamid: tid})
								.del()
								.then(() => {
									trx('event_reg')
									.join('payment', 'event_reg.teamid', '=', 'payment.teamid')
									.join('events', 'events.eid', '=', 'event_reg.eid')
									.select('event_reg.eid', 'events.ename', 'events.category', 'payment.teamid', 'events.fee', 'payment.status')
									.where('event_reg.ifid', '=', ifidUser)
									.then(registrations =>{
										res.status(200).json(registrations);
									})
									.then(trx.commit)
								})
							}
						})
						.catch(trx.rollback)
					})
					.catch(trx.rollback)
			}
		})
		.catch(trx.rollback)
	})
	.catch(err => {console.log(err); res.status(400).json('Something is wrong')});
}

module.exports = {
	handleEventRegCancel: handleEventRegCancel
};