const Logo = ({ ...props }) => {
	if (props.email) {
		const divStyles = {
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			gap: "0.5rem",
		};
		return (
			<div style={divStyles}>
				<img src="/vocaldesk.svg" alt="VocalDesk" className="w-7 h-7" />
				<h2 className="text-xl font-semibold">VocalDesk</h2>
			</div>
		);
	}
	return (
		<div className="flex items-center gap-2">
			<img src="/vocaldesk.svg" alt="VocalDesk" className="w-7 h-7" />
			<h2 className="text-xl font-semibold">VocalDesk</h2>
		</div>
	);
};

export default Logo;
