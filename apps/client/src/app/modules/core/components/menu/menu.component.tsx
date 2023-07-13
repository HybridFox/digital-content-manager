import { Link } from "react-router-dom"

export const Menu = () => {
	return <div className="o-menu">
		<ul>
			<li>
				<Link to="/auth">Auth</Link>
			</li>
		</ul>
	</div>
}
