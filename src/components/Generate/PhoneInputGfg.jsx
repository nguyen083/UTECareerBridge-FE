// Filename - App.js

import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./PhoneInputGfg.scss";

const PhoneInputGfg =(props)=> {
	const {phone, setPhone} = props;
		return (
			<div className="phone-number">
				<PhoneInput
					className="number   -control"
					country={"vn"}
					value={phone}
					onChange={(phone) =>
						setPhone(phone)
					}
				/>
			</div>
		);
}
export default PhoneInputGfg;