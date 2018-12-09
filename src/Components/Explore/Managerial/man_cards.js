import React from 'react';
import {Link} from 'react-router-dom'
import events from '../../../assets/events.json';
import Extab from '../Extab/Extab'

export const Man_Cards = () => {
	return(
		<div>
			{Object.entries(events.managerial).map(([key, value]) =>
			    <div key={value.eid} className="man_el">
			      <div className="man_el__overflow">
			        <div className="man_el__inner">
			          <div className="man_el__bg"></div>
			          <div className="man_el__preview-cont">
			            <h2 className="man_el__heading">{value.EventName}</h2>
			          </div>
			          <div className="man_el__content">
			            <div className="man_el__text">{value.EventName}</div>
			            <div className="man_el__close-btn"></div>
			            <div class="event_data">
			            	<Extab key={value.eid} eventDetails={value} />
		            	</div>
			          </div>
			        </div>
			      </div>
			      <div className="man_el__index">
			        <div className="man_el__index-back">{parseInt(key)+1}</div>
			        <div className="man_el__index-front">
			          <div className="man_el__index-overlay" data-index={parseInt(key)+1}>{parseInt(key)+1}</div>
			        </div>
			      </div>
			    </div>
			)};
		</div>
	);
}