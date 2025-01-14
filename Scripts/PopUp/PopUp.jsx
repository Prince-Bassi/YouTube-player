import React, {forwardRef} from "react";
import * as style from "./PopUp.module.scss";

const PopUp = forwardRef(({Tag, title, onClose, confirmInfo, children}, ref) => {
	return (
		<Tag className={style.popUp} ref={ref} onSubmit={Tag === "form" && confirmInfo.onConfirm || undefined}>
			<div className={style.title}>{title}</div>
			{children}
			<div className={style.buttonCont}>
				{confirmInfo && <button className={style.confirm} ref={confirmInfo.buttonRef} type={Tag === "form" ? "submit" : "button"} onClick={Tag !== "form" ? confirmInfo.onConfirm : undefined}>{confirmInfo.confirmText}</button>}
				<button className={style.close} onClick={onClose}>Close</button>
			</div>
		</Tag>
	);
});

export default PopUp;